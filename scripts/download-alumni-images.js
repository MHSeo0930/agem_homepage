const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const url = 'https://icms.pknu.ac.kr/agem/3461';
const outputDir = path.join(__dirname, '../public/images/alumni');

// 출력 디렉토리 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 이미지 다운로드 함수
function downloadImage(imageUrl, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = imageUrl.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(filepath);
    protocol.get(imageUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ 다운로드 완료: ${path.basename(filepath)}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // 리다이렉트 처리
        file.close();
        fs.unlinkSync(filepath);
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`HTTP ${response.statusCode}: ${imageUrl}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

// Alumni 순서와 파일명 매핑 (웹사이트 순서대로)
const alumniOrder = [
  { name: 'Jee Min Hwang', filename: 'jee-min-hwang.jpg' },
  { name: 'Jong Min Lee', filename: 'jong-min-lee.jpg' },
  { name: 'Mun Seon Kang', filename: 'mun-seon-kang.jpg' },
  { name: 'Sung Young Yang', filename: 'sung-young-yang.jpg' },
  { name: 'Song Jin', filename: 'song-jin.jpg' },
];

async function downloadAlumniImages() {
  let browser;
  try {
    console.log('브라우저 시작 중...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log(`페이지 로딩 중: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // 페이지가 완전히 로드될 때까지 대기
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 모든 이미지 URL과 컨텍스트 추출
    const allImages = await page.evaluate(() => {
      const images = [];
      const imgElements = document.querySelectorAll('img[alt="professor photo"]');
      
      imgElements.forEach((img) => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        if (src && src.includes('upload') && !src.includes('error')) {
          // 이미지 근처의 텍스트 찾기
          let context = '';
          let parent = img.parentElement;
          for (let i = 0; i < 10 && parent; i++) {
            const text = parent.textContent?.trim() || '';
            if (text.length > 10 && text.length < 300) {
              context = text;
              break;
            }
            parent = parent.parentElement;
          }
          
          images.push({ 
            url: src,
            context: context
          });
        }
      });
      
      return images;
    });
    
    console.log(`발견된 이미지: ${allImages.length}개\n`);
    
    // 순서대로 매핑
    let imageIndex = 0;
    for (const alumnus of alumniOrder) {
      if (imageIndex < allImages.length) {
        const image = allImages[imageIndex];
        const filepath = path.join(outputDir, alumnus.filename);
        
        try {
          // 절대 URL로 변환
          let imageUrl = image.url;
          if (imageUrl.startsWith('/')) {
            imageUrl = `https://icms.pknu.ac.kr${imageUrl}`;
          }
          
          console.log(`${alumnus.name} -> ${alumnus.filename}`);
          console.log(`  URL: ${imageUrl}`);
          console.log(`  컨텍스트: ${image.context.substring(0, 50)}...`);
          await downloadImage(imageUrl, filepath);
          imageIndex++;
        } catch (error) {
          console.error(`✗ ${alumnus.name} 이미지 다운로드 실패:`, error.message);
          imageIndex++;
        }
      } else {
        console.log(`⚠ ${alumnus.name}에 대한 이미지를 찾을 수 없습니다.`);
      }
    }
    
    console.log('\n모든 이미지 다운로드 완료!');
    
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

downloadAlumniImages();

