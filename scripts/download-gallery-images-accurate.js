const puppeteer = require('puppeteer');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 갤러리 이미지 다운로드 함수
function downloadImage(imageUrl, filepath) {
  return new Promise((resolve, reject) => {
    // URL이 상대 경로인 경우 절대 경로로 변환
    if (imageUrl.startsWith('//')) {
      imageUrl = 'https:' + imageUrl;
    } else if (imageUrl.startsWith('/')) {
      imageUrl = 'https://icms.pknu.ac.kr' + imageUrl;
    }
    
    const protocol = imageUrl.startsWith('https') ? https : http;
    
    const request = protocol.get(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${imageUrl}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Downloaded: ${path.basename(filepath)}`);
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    });
    
    request.on('error', (err) => {
      reject(err);
    });
    
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// 갤러리 폴더 생성
const galleryDir = path.join(process.cwd(), 'public', 'images', 'gallery');
if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir, { recursive: true });
  console.log(`Created directory: ${galleryDir}`);
}

// 갤러리 항목과 파일명 매핑 (웹사이트 순서대로)
const galleryItems = [
  // Page 1
  { filename: '250930-happy-birthday.jpg', title: '250930 happy birthday' },
  { filename: '250824-25-workshop-kims.jpg', title: '250824-25 Workshop with KIMS' },
  { filename: '250822-graduation.jpg', title: '250822 Graudation' },
  { filename: '250709-sajik-baseball-stadium.jpg', title: '250709 Sajik Baseball Stadium' },
  { filename: '247th-ecs-meeting.jpg', title: '247th ECS Meeting (Montreal, Canada)' },
  { filename: '25-spring-electrochemistry.jpg', title: '25 춘계한국전기화학회 (제주도)' },
  { filename: '2025-winter-symposium.jpg', title: '2025 대한화학회 동계 심포지엄 (강원도 홍천 소노캄)' },
  { filename: '241108-happy-birthday.jpg', title: '241108 Happy birthday' },
  { filename: '24-fall-surface-chemistry.jpg', title: '24 추계표면공학회' },
  // Page 2
  { filename: 'lab-cherry-blossom.jpg', title: '연구실 단체 벚꽃 사진' },
  { filename: '2022-spring-surface-chemistry.jpg', title: '2022\' 춘계 한국표면공학회 with Prof. Han\'s group' },
  { filename: 'green-energy-summer-school.jpg', title: '제 2회 그린에너지 소부장 섬머스쿨 초청 발표' },
  { filename: 'waterloo-1.jpg', title: 'at Uni. of Waterloo' },
  { filename: '2019-electrochemistry.jpg', title: '2019\' 전기화학회' },
  { filename: '2021-corrosion-society.jpg', title: '2021 한국부식방식학회 초청발표' },
  { filename: 'alberta.jpg', title: 'at Uni. of Alberta' },
  { filename: 'mcmaster.jpg', title: 'at MacMaster Uni.' },
  { filename: 'waterloo-2.jpg', title: 'at Uni. of Waterloo' },
  // Page 3
  { filename: 'csir.jpg', title: 'at CSIR' },
  { filename: '2018-excellent-employee.jpg', title: '2018\' 출연연 우수직원 이사장 표창' },
  { filename: 'waterloo-3.jpg', title: 'at Uni. of Waterloo' },
  { filename: 'group-photo.jpg', title: '그룹사진' },
];

// Puppeteer로 웹사이트에서 이미지와 제목 추출
async function fetchGalleryImagesFromPage(pageIndex) {
  let browser;
  try {
    console.log(`페이지 ${pageIndex} 로드 중...`);
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const url = `https://icms.pknu.ac.kr/agem/3470?pageIndex=${pageIndex}&bbsId=2401508&searchCondition=title&searchKeyword=`;
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 갤러리 항목 제목과 이미지 URL 추출
    const galleryData = await page.evaluate(() => {
      const items = [];
      
      // 갤러리 리스트 아이템 찾기
      const listItems = Array.from(document.querySelectorAll('li, .list-item, .gallery-item, [class*="gallery"], [class*="board"]'));
      
      listItems.forEach((item, index) => {
        // 제목 찾기
        const titleElement = item.querySelector('a, .title, [class*="title"], strong, b');
        const title = titleElement ? titleElement.textContent.trim() : '';
        
        // 이미지 찾기
        const imgElement = item.querySelector('img');
        let imageUrl = '';
        
        if (imgElement) {
          imageUrl = imgElement.src || imgElement.getAttribute('data-src') || imgElement.getAttribute('data-lazy-src') || '';
        }
        
        // 링크에서 이미지 찾기
        if (!imageUrl) {
          const linkElement = item.querySelector('a');
          if (linkElement && linkElement.href) {
            // 링크가 이미지 파일인 경우
            if (linkElement.href.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
              imageUrl = linkElement.href;
            }
          }
        }
        
        if (title && title.length > 3 && imageUrl && !imageUrl.includes('logo') && !imageUrl.includes('icon')) {
          items.push({
            title: title,
            imageUrl: imageUrl,
            index: index
          });
        }
      });
      
      // 이미지만 있는 경우도 찾기
      const images = Array.from(document.querySelectorAll('img'));
      images.forEach((img, index) => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        if (src && !src.includes('logo') && !src.includes('icon') && !src.includes('button') && !src.includes('common')) {
          // 이미 추가되지 않은 경우만 추가
          const alreadyAdded = items.some(item => item.imageUrl === src);
          if (!alreadyAdded) {
            // 부모 요소에서 제목 찾기
            let parent = img.parentElement;
            let title = '';
            for (let i = 0; i < 5 && parent; i++) {
              const text = parent.textContent?.trim();
              if (text && text.length > 5 && text.length < 100 && !text.includes('http')) {
                title = text.split('\n')[0].trim();
                break;
              }
              parent = parent.parentElement;
            }
            
            if (title || src.match(/gallery|photo|image|img/i)) {
              items.push({
                title: title || `Gallery Item ${index}`,
                imageUrl: src,
                index: index
              });
            }
          }
        }
      });
      
      return items;
    });
    
    console.log(`페이지 ${pageIndex}에서 ${galleryData.length}개 항목 발견`);
    galleryData.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item.title.substring(0, 50)}... -> ${item.imageUrl.substring(0, 80)}...`);
    });
    
    return galleryData;
  } catch (error) {
    console.error(`페이지 ${pageIndex} 오류:`, error.message);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// 제목을 파일명에 매핑
function matchTitleToFilename(title, items) {
  const titleLower = title.toLowerCase().replace(/[^\w\s가-힣]/g, '');
  
  for (const item of items) {
    const itemTitleLower = item.title.toLowerCase().replace(/[^\w\s가-힣]/g, '');
    
    // 정확한 매칭
    if (titleLower === itemTitleLower) {
      return item.filename;
    }
    
    // 부분 매칭 (주요 키워드)
    const titleKeywords = titleLower.split(/\s+/).filter(k => k.length > 2);
    const itemKeywords = itemTitleLower.split(/\s+/).filter(k => k.length > 2);
    
    const matchCount = titleKeywords.filter(k => itemKeywords.some(ik => ik.includes(k) || k.includes(ik))).length;
    if (matchCount >= Math.min(2, titleKeywords.length)) {
      return item.filename;
    }
  }
  
  return null;
}

// 모든 페이지에서 갤러리 데이터 수집
async function fetchAllGalleryData() {
  const allData = [];
  
  for (let pageIndex = 1; pageIndex <= 3; pageIndex++) {
    const pageData = await fetchGalleryImagesFromPage(pageIndex);
    allData.push(...pageData);
    await new Promise(resolve => setTimeout(resolve, 3000)); // 페이지 간 대기
  }
  
  return allData;
}

// 모든 이미지 다운로드
async function downloadAll() {
  console.log('갤러리 이미지 다운로드 시작 (정확한 매칭)...\n');
  
  // 모든 페이지에서 데이터 수집
  const allGalleryData = await fetchAllGalleryData();
  
  console.log(`\n총 ${allGalleryData.length}개 항목 발견\n`);
  
  // 각 이미지를 다운로드
  const downloads = [];
  const downloadedFiles = new Set();
  
  for (const item of allGalleryData) {
    const filename = matchTitleToFilename(item.title, galleryItems);
    
    if (filename && !downloadedFiles.has(filename)) {
      downloadedFiles.add(filename);
      const filepath = path.join(galleryDir, filename);
      
      downloads.push(
        downloadImage(item.imageUrl, filepath)
          .then(() => {
            console.log(`✓ Matched: ${item.title.substring(0, 40)}... -> ${filename}`);
          })
          .catch(err => {
            console.error(`✗ Failed to download ${filename}:`, err.message);
          })
      );
    } else if (!filename) {
      console.log(`⚠ No match found for: ${item.title.substring(0, 50)}...`);
    }
  }
  
  await Promise.all(downloads);
  console.log('\n다운로드 완료!');
  console.log(`다운로드된 이미지: ${galleryDir}`);
}

// 스크립트 실행
if (require.main === module) {
  downloadAll().catch(console.error);
}

module.exports = { downloadImage, fetchAllGalleryData, downloadAll };

