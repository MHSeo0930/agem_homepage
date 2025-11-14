const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// 다운로드 폴더 경로 (macOS)
const downloadsFolder = path.join(require('os').homedir(), 'Downloads', 'gallery-images');

// 다운로드 폴더 생성
if (!fs.existsSync(downloadsFolder)) {
  fs.mkdirSync(downloadsFolder, { recursive: true });
}

// 이미지 다운로드 함수
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filepath);
        return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    });
    
    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

// 파일명 정리 함수
function sanitizeFilename(filename) {
  return filename
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-가-힣.]/g, '')
    .substring(0, 200);
}

async function downloadGalleryImages() {
  const browser = await puppeteer.launch({ 
    headless: false, // 브라우저를 보이게 해서 디버깅
    defaultViewport: { width: 1920, height: 1080 }
  });
  const page = await browser.newPage();
  
  // User-Agent 설정
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  const urls = [
    'https://icms.pknu.ac.kr/agem/3470?pageIndex=1&bbsId=2401508&searchCondition=title&searchKeyword=',
    'https://icms.pknu.ac.kr/agem/3470?pageIndex=2&bbsId=2401508&searchCondition=title&searchKeyword=',
    'https://icms.pknu.ac.kr/agem/3470?pageIndex=3&bbsId=2401508&searchCondition=title&searchKeyword='
  ];
  
  const allImages = [];
  
  for (let i = 0; i < urls.length; i++) {
    console.log(`\n페이지 ${i + 1} 처리 중: ${urls[i]}`);
    await page.goto(urls[i], { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 갤러리 항목 링크 추출
    const galleryLinks = await page.evaluate(() => {
      const links = [];
      // 테이블 행에서 링크 찾기
      const rows = document.querySelectorAll('table tr, .board-list tr, tbody tr');
      rows.forEach((row) => {
        const link = row.querySelector('a[href*="3470"], a[href*="view"], a[href*="detail"]');
        if (link) {
          const href = link.getAttribute('href');
          const title = link.textContent.trim() || row.textContent.trim();
          if (title && title.length > 0 && !title.includes('submit') && !title.includes('total') && !title.match(/^[\d\s]+$/)) {
            let fullHref = href;
            if (href.startsWith('/')) {
              fullHref = 'https://icms.pknu.ac.kr' + href;
            } else if (!href.startsWith('http')) {
              fullHref = 'https://icms.pknu.ac.kr/' + href;
            }
            
            if (!links.find(l => l.href === fullHref)) {
              links.push({
                href: fullHref,
                title: title.replace(/\s+/g, ' ').substring(0, 100)
              });
            }
          }
        }
      });
      
      // 직접 링크도 확인
      document.querySelectorAll('a[href*="3470"]').forEach((link) => {
        const href = link.getAttribute('href');
        const title = link.textContent.trim();
        if (title && title.length > 0 && !title.includes('submit') && !title.includes('total') && !title.match(/^[\d\s]+$/)) {
          let fullHref = href;
          if (href.startsWith('/')) {
            fullHref = 'https://icms.pknu.ac.kr' + href;
          } else if (!href.startsWith('http')) {
            fullHref = 'https://icms.pknu.ac.kr/' + href;
          }
          
          if (!links.find(l => l.href === fullHref)) {
            links.push({
              href: fullHref,
              title: title.replace(/\s+/g, ' ').substring(0, 100)
            });
          }
        }
      });
      
      return links;
    });
    
    console.log(`  갤러리 항목 ${galleryLinks.length}개 발견`);
    
    // 각 갤러리 항목의 상세 페이지에서 이미지 다운로드
    for (let j = 0; j < galleryLinks.length; j++) {
      const item = galleryLinks[j];
      try {
        console.log(`  [${j + 1}/${galleryLinks.length}] 상세 페이지 접속: ${item.title}`);
        await page.goto(item.href, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 이미지 찾기
        const images = await page.evaluate(() => {
          const imgs = [];
          // 모든 이미지 확인
          document.querySelectorAll('img').forEach((img) => {
            let src = img.src || img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('srcset')?.split(' ')[0];
            if (src) {
              // 로고, 아이콘, 배너 제외
              if (src.includes('logo') || src.includes('icon') || src.includes('button') || src.includes('banner') || src.includes('header') || src.includes('footer')) {
                return;
              }
              
              // 이미지 파일 확장자 확인
              if (!src.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i) && !src.includes('upload') && !src.includes('file') && !src.includes('3470')) {
                return;
              }
              
              let fullUrl = src;
              if (src.startsWith('//')) {
                fullUrl = 'https:' + src;
              } else if (src.startsWith('/')) {
                fullUrl = 'https://icms.pknu.ac.kr' + src;
              } else if (!src.startsWith('http')) {
                fullUrl = 'https://icms.pknu.ac.kr/' + src;
              }
              
              if (fullUrl && !imgs.find(img => img.url === fullUrl)) {
                imgs.push({ url: fullUrl });
              }
            }
          });
          
          // 배경 이미지도 확인
          document.querySelectorAll('[style*="background-image"], [style*="background:"]').forEach((el) => {
            const style = el.getAttribute('style') || '';
            const match = style.match(/url\(['"]?([^'")]+)['"]?\)/);
            if (match) {
              let src = match[1];
              if (src && !src.includes('logo') && !src.includes('icon')) {
                let fullUrl = src;
                if (src.startsWith('//')) {
                  fullUrl = 'https:' + src;
                } else if (src.startsWith('/')) {
                  fullUrl = 'https://icms.pknu.ac.kr' + src;
                } else if (!src.startsWith('http')) {
                  fullUrl = 'https://icms.pknu.ac.kr/' + src;
                }
                
                if (fullUrl && !imgs.find(img => img.url === fullUrl)) {
                  imgs.push({ url: fullUrl });
                }
              }
            }
          });
          
          return imgs;
        });
        
        console.log(`    이미지 ${images.length}개 발견`);
        
        images.forEach((img, imgIndex) => {
          allImages.push({
            url: img.url,
            title: item.title,
            index: allImages.length + 1,
            pageIndex: i + 1,
            itemIndex: j + 1,
            imgIndex: imgIndex + 1
          });
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`  ✗ 오류: ${item.title} - ${error.message}`);
      }
    }
  }
  
  await browser.close();
  
  console.log(`\n총 ${allImages.length}개 이미지 발견`);
  
  // 중복 제거
  const uniqueImages = [];
  const seenUrls = new Set();
  for (const img of allImages) {
    if (!seenUrls.has(img.url)) {
      seenUrls.add(img.url);
      uniqueImages.push(img);
    }
  }
  
  console.log(`중복 제거 후 ${uniqueImages.length}개 이미지`);
  
  // 이미지 다운로드
  console.log(`\n다운로드 시작: ${downloadsFolder}`);
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < uniqueImages.length; i++) {
    const img = uniqueImages[i];
    try {
      // 파일 확장자 추출
      const urlPath = new URL(img.url).pathname;
      let ext = path.extname(urlPath);
      if (!ext || !ext.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i)) {
        ext = '.jpg'; // 기본값
      }
      
      const filename = `${String(i + 1).padStart(3, '0')}-${sanitizeFilename(img.title)}${ext}`;
      const filepath = path.join(downloadsFolder, filename);
      
      console.log(`[${i + 1}/${uniqueImages.length}] 다운로드 중: ${filename}`);
      await downloadImage(img.url, filepath);
      successCount++;
      console.log(`  ✓ 성공: ${filename}`);
      
      // 요청 간 대기
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      failCount++;
      console.error(`  ✗ 실패: ${img.title} - ${error.message}`);
    }
  }
  
  console.log(`\n완료!`);
  console.log(`성공: ${successCount}개`);
  console.log(`실패: ${failCount}개`);
  console.log(`다운로드 위치: ${downloadsFolder}`);
}

downloadGalleryImages().catch(console.error);

