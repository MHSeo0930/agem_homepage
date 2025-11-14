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

// Puppeteer로 웹사이트에서 이미지 추출
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
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 갤러리 항목 제목과 이미지 URL 추출
    const galleryData = await page.evaluate(() => {
      const items = [];
      const galleryItems = document.querySelectorAll('.gallery-item, [class*="gallery"], .board-list li, .list-item');
      
      // 이미지와 제목을 함께 찾기
      const images = Array.from(document.querySelectorAll('img'));
      const links = Array.from(document.querySelectorAll('a'));
      
      images.forEach((img, index) => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        if (src && !src.includes('logo') && !src.includes('icon') && !src.includes('button') && !src.includes('common')) {
          // 제목 찾기 (이미지 근처의 텍스트)
          let title = '';
          let parent = img.parentElement;
          for (let i = 0; i < 5 && parent; i++) {
            const text = parent.textContent?.trim();
            if (text && text.length > 5 && text.length < 100) {
              title = text;
              break;
            }
            parent = parent.parentElement;
          }
          
          items.push({
            title: title || `gallery-item-${index}`,
            imageUrl: src
          });
        }
      });
      
      return items;
    });
    
    console.log(`페이지 ${pageIndex}에서 ${galleryData.length}개 항목 발견`);
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

// 모든 페이지에서 갤러리 데이터 수집
async function fetchAllGalleryData() {
  const allData = [];
  
  for (let pageIndex = 1; pageIndex <= 3; pageIndex++) {
    const pageData = await fetchGalleryImagesFromPage(pageIndex);
    allData.push(...pageData);
    await new Promise(resolve => setTimeout(resolve, 2000)); // 페이지 간 대기
  }
  
  return allData;
}

// 파일명 생성 (제목 기반)
function generateFilename(title, index) {
  // 한글과 영문, 숫자만 남기고 특수문자 제거
  const cleanTitle = title
    .replace(/[^\w\s가-힣]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 50);
  
  return `${cleanTitle || `gallery-${index}`}.jpg`;
}

// 모든 이미지 다운로드
async function downloadAll() {
  console.log('갤러리 이미지 다운로드 시작 (모든 페이지)...\n');
  
  // 모든 페이지에서 데이터 수집
  const allGalleryData = await fetchAllGalleryData();
  
  console.log(`\n총 ${allGalleryData.length}개 항목 발견\n`);
  
  // 각 이미지를 다운로드
  const downloads = [];
  
  for (let i = 0; i < allGalleryData.length; i++) {
    const item = allGalleryData[i];
    const filename = generateFilename(item.title, i + 1);
    const filepath = path.join(galleryDir, filename);
    
    downloads.push(
      downloadImage(item.imageUrl, filepath)
        .catch(err => {
          console.error(`✗ Failed to download ${filename}:`, err.message);
        })
    );
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

