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
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // 리다이렉트 처리
        return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
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
    .substring(0, 200);
}

async function downloadGalleryImages() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const urls = [
    'https://icms.pknu.ac.kr/agem/3470',
    'https://icms.pknu.ac.kr/agem/3470?pageIndex=2&bbsId=2401508&searchCondition=title&searchKeyword=',
    'https://icms.pknu.ac.kr/agem/3470?pageIndex=3&bbsId=2401508&searchCondition=title&searchKeyword='
  ];
  
  const allImages = [];
  
  for (let i = 0; i < urls.length; i++) {
    console.log(`\n페이지 ${i + 1} 처리 중: ${urls[i]}`);
    await page.goto(urls[i], { waitUntil: 'networkidle2', timeout: 30000 });
    
    // 페이지 로딩 대기
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 디버깅: 페이지 HTML 일부 확인
    const pageHtml = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.innerText.substring(0, 500),
        imgCount: document.querySelectorAll('img').length,
        linkCount: document.querySelectorAll('a').length,
        allImgSrcs: Array.from(document.querySelectorAll('img')).map(img => img.src).slice(0, 10)
      };
    });
    console.log(`  페이지 정보: 제목="${pageHtml.title}", 이미지=${pageHtml.imgCount}개, 링크=${pageHtml.linkCount}개`);
    if (pageHtml.allImgSrcs.length > 0) {
      console.log(`  이미지 URL 샘플:`, pageHtml.allImgSrcs);
    }
    
    // 갤러리 항목 링크와 제목 추출
    const galleryItems = await page.evaluate(() => {
      const items = [];
      
      // 테이블이나 리스트에서 갤러리 항목 찾기
      const rows = document.querySelectorAll('tr, li, .board-item, [class*="list"], [class*="item"]');
      rows.forEach((row) => {
        const link = row.querySelector('a[href*="3470"], a[href*="view"], a[href*="detail"]');
        if (link) {
          const href = link.getAttribute('href');
          const title = link.textContent.trim() || row.textContent.trim();
          if (title && title.length > 0 && !title.includes('submit') && !title.includes('total')) {
            let fullHref = href;
            if (href.startsWith('/')) {
              fullHref = 'https://icms.pknu.ac.kr' + href;
            } else if (!href.startsWith('http')) {
              fullHref = 'https://icms.pknu.ac.kr/' + href;
            }
            
            if (!items.find(item => item.href === fullHref)) {
              items.push({
                href: fullHref,
                title: title.substring(0, 100)
              });
            }
          }
        }
      });
      
      // 직접 링크도 확인
      document.querySelectorAll('a[href*="3470"]').forEach((link) => {
        const href = link.getAttribute('href');
        const title = link.textContent.trim();
        if (title && title.length > 0 && !title.includes('submit') && !title.includes('total') && !title.match(/^\d+$/)) {
          let fullHref = href;
          if (href.startsWith('/')) {
            fullHref = 'https://icms.pknu.ac.kr' + href;
          } else if (!href.startsWith('http')) {
            fullHref = 'https://icms.pknu.ac.kr/' + href;
          }
          
          if (!items.find(item => item.href === fullHref)) {
            items.push({
              href: fullHref,
              title: title.substring(0, 100)
            });
          }
        }
      });
      
      return items;
    });
    
    console.log(`  갤러리 항목 ${galleryItems.length}개 발견`);
    
    // 각 갤러리 항목의 상세 페이지에서 이미지 다운로드
    const pageImages = [];
    for (let j = 0; j < galleryItems.length; j++) {
      const item = galleryItems[j];
      try {
        console.log(`  [${j + 1}/${galleryItems.length}] 상세 페이지 접속: ${item.title}`);
        await page.goto(item.href, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const images = await page.evaluate(() => {
          const imgs = [];
          document.querySelectorAll('img').forEach((img) => {
            let src = img.src || img.getAttribute('data-src') || img.getAttribute('data-original');
            if (src && !src.includes('logo') && !src.includes('icon') && !src.includes('button') && !src.includes('banner')) {
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
          return imgs;
        });
        
        images.forEach(img => {
          pageImages.push({
            url: img.url,
            title: item.title,
            index: pageImages.length + 1
          });
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`  오류: ${item.title} - ${error.message}`);
      }
    }
    
    console.log(`페이지 ${i + 1}에서 ${pageImages.length}개 이미지 발견`);
    allImages.push(...pageImages);
    
    // 페이지 간 대기
    await new Promise(resolve => setTimeout(resolve, 1000));
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
      const ext = path.extname(urlPath) || '.jpg';
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

