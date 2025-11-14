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

// 멤버 이름과 파일명 매핑
const memberMapping = {
  'Minseon Park': 'minseon-park.jpg',
  'Min Ho Seo': 'professor.jpg', // 교수는 이미 다운로드됨
  'Seung Min Woo': 'seung-min-woo.jpg',
  'Juwan Woo': 'juwan-woo.jpg',
  'Daehun Kim': 'daehun-kim.jpg',
  'Mingyeong Jeong': 'mingyeong-jeong.jpg',
  'Yerim Kim': 'yerim-kim.jpg',
  'So Jin Bae': 'so-jin-bae.jpg',
  'Juhyeong Jeon': 'juhyeong-jeon.jpg',
  'Kiju lee': 'kiju-lee.jpg',
  'Seoyun Choi': 'seoyun-choi.jpg',
};

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
      const imgElements = document.querySelectorAll('img');
      
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
    
    // 각 멤버에 대해 이미지 찾기 및 다운로드
    const memberNames = Object.keys(memberMapping);
    for (const memberName of memberNames) {
      if (memberName === 'Min Ho Seo') continue; // 교수는 이미 다운로드됨
      
      // 멤버 이름이 컨텍스트에 포함된 이미지 찾기
      const matchingImage = allImages.find(img => {
        const context = img.context.toLowerCase();
        const nameParts = memberName.toLowerCase().split(' ');
        return nameParts.some(part => context.includes(part));
      });
      
      if (matchingImage) {
        const filename = memberMapping[memberName];
        const filepath = path.join(outputDir, filename);
        try {
          // 절대 URL로 변환
          let imageUrl = matchingImage.url;
          if (imageUrl.startsWith('/')) {
            imageUrl = `https://icms.pknu.ac.kr${imageUrl}`;
          }
          
          console.log(`${memberName} -> ${filename}`);
          console.log(`  URL: ${imageUrl}`);
          await downloadImage(imageUrl, filepath);
        } catch (error) {
          console.error(`✗ ${memberName} 이미지 다운로드 실패:`, error.message);
        }
      } else {
        console.log(`⚠ ${memberName}에 대한 이미지를 찾을 수 없습니다.`);
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

