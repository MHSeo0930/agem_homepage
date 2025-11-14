const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const url = 'https://icms.pknu.ac.kr/agem/3460';
const outputDir = path.join(__dirname, '../public/images/members');

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

// 멤버 순서와 파일명 매핑 (웹사이트 순서대로)
const memberOrder = [
  { name: 'Minseon Park', filename: 'minseon-park.jpg' },
  { name: 'Min Ho Seo', filename: 'professor.jpg', skip: true }, // 이미 다운로드됨
  { name: 'Seung Min Woo', filename: 'seung-min-woo.jpg' },
  { name: 'Juwan Woo', filename: 'juwan-woo.jpg' },
  { name: 'Daehun Kim', filename: 'daehun-kim.jpg' },
  { name: 'Mingyeong Jeong', filename: 'mingyeong-jeong.jpg' },
  { name: 'Yerim Kim', filename: 'yerim-kim.jpg' },
  { name: 'So Jin Bae', filename: 'so-jin-bae.jpg' },
  { name: 'Juhyeong Jeon', filename: 'juhyeong-jeon.jpg' },
  { name: 'Kiju lee', filename: 'kiju-lee.jpg' },
  { name: 'Seoyun Choi', filename: 'seoyun-choi.jpg' },
];

async function downloadMemberImages() {
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
    for (const member of memberOrder) {
      if (member.skip) {
        console.log(`⏭ ${member.name} 건너뜀 (이미 다운로드됨)`);
        continue;
      }
      
      if (imageIndex < allImages.length) {
        const image = allImages[imageIndex];
        const filepath = path.join(outputDir, member.filename);
        
        try {
          // 절대 URL로 변환
          let imageUrl = image.url;
          if (imageUrl.startsWith('/')) {
            imageUrl = `https://icms.pknu.ac.kr${imageUrl}`;
          }
          
          console.log(`${member.name} -> ${member.filename}`);
          console.log(`  URL: ${imageUrl}`);
          console.log(`  컨텍스트: ${image.context.substring(0, 50)}...`);
          await downloadImage(imageUrl, filepath);
          imageIndex++;
        } catch (error) {
          console.error(`✗ ${member.name} 이미지 다운로드 실패:`, error.message);
          imageIndex++;
        }
      } else {
        console.log(`⚠ ${member.name}에 대한 이미지를 찾을 수 없습니다.`);
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

downloadMemberImages();

