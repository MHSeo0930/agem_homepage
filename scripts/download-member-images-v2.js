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
    
    // 모든 이미지 URL 추출
    const allImages = await page.evaluate(() => {
      const images = [];
      const imgElements = document.querySelectorAll('img');
      
      imgElements.forEach((img) => {
        const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.getAttribute('srcset');
        if (src && (src.includes('photo') || src.includes('upload') || src.includes('member'))) {
          // 이미지 근처의 텍스트 찾기
          let context = '';
          let parent = img.parentElement;
          for (let i = 0; i < 5 && parent; i++) {
            const text = parent.textContent?.trim() || '';
            if (text.length > 0 && text.length < 200) {
              context = text;
              break;
            }
            parent = parent.parentElement;
          }
          
          images.push({ 
            url: src,
            context: context.substring(0, 100),
            alt: img.alt || ''
          });
        }
      });
      
      return images;
    });
    
    console.log(`발견된 이미지: ${allImages.length}개`);
    allImages.forEach((img, idx) => {
      console.log(`${idx + 1}. ${img.url}`);
      console.log(`   컨텍스트: ${img.context}`);
    });
    
    // HTML 전체를 가져와서 분석
    const htmlContent = await page.content();
    console.log('\nHTML에서 이미지 URL 검색 중...');
    
    // 정규식으로 이미지 URL 추출
    const imageUrlPattern = /https?:\/\/[^"'\s]+(?:photo|upload|member)[^"'\s]+\.(?:jpg|jpeg|png|gif)/gi;
    const foundUrls = htmlContent.match(imageUrlPattern) || [];
    
    console.log(`정규식으로 발견된 URL: ${foundUrls.length}개`);
    const uniqueUrls = [...new Set(foundUrls)];
    uniqueUrls.forEach((url, idx) => {
      console.log(`${idx + 1}. ${url}`);
    });
    
    // 각 멤버에 대해 이미지 찾기 및 다운로드
    const memberNames = Object.keys(memberMapping);
    for (const memberName of memberNames) {
      if (memberName === 'Min Ho Seo') continue; // 교수는 이미 다운로드됨
      
      // 멤버 이름이 포함된 이미지 찾기
      const matchingUrl = uniqueUrls.find(url => {
        // URL이나 컨텍스트에서 멤버 이름 찾기
        const lowerUrl = url.toLowerCase();
        const lowerName = memberName.toLowerCase().replace(/\s+/g, '');
        return lowerUrl.includes(lowerName) || lowerUrl.includes(memberName.split(' ')[0].toLowerCase());
      });
      
      if (matchingUrl) {
        const filename = memberMapping[memberName];
        const filepath = path.join(outputDir, filename);
        try {
          await downloadImage(matchingUrl, filepath);
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

