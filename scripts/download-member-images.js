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
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 멤버 정보와 이미지 URL 추출
    const memberData = await page.evaluate(() => {
      const members = [];
      const memberCards = document.querySelectorAll('div[class*="member"], .member-card, [class*="professor photo"]');
      
      // 이미지와 이름을 함께 찾기
      const images = Array.from(document.querySelectorAll('img'));
      const headings = Array.from(document.querySelectorAll('h3, h4, .name, [class*="name"]'));
      
      images.forEach((img, index) => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        if (src && src.includes('photo') && !src.includes('logo') && !src.includes('icon')) {
          // 이미지 근처의 이름 찾기
          let name = '';
          let parent = img.parentElement;
          for (let i = 0; i < 10 && parent; i++) {
            const heading = parent.querySelector('h3, h4, .name, [class*="name"]');
            if (heading) {
              name = heading.textContent?.trim() || '';
              break;
            }
            parent = parent.parentElement;
          }
          
          if (name) {
            members.push({ name, imageUrl: src });
          }
        }
      });
      
      return members;
    });
    
    console.log(`발견된 멤버: ${memberData.length}명`);
    memberData.forEach(m => console.log(`  - ${m.name}: ${m.imageUrl}`));
    
    // 각 멤버의 이미지 다운로드
    for (const member of memberData) {
      const filename = memberMapping[member.name];
      if (filename) {
        const filepath = path.join(outputDir, filename);
        try {
          // 절대 URL로 변환
          let imageUrl = member.imageUrl;
          if (imageUrl.startsWith('/')) {
            imageUrl = `https://icms.pknu.ac.kr${imageUrl}`;
          }
          
          await downloadImage(imageUrl, filepath);
        } catch (error) {
          console.error(`✗ ${member.name} 이미지 다운로드 실패:`, error.message);
        }
      } else {
        console.log(`⚠ ${member.name}에 대한 매핑이 없습니다.`);
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

