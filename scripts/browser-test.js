const puppeteer = require('puppeteer');

async function testBrowser() {
  console.log('='.repeat(70));
  console.log('브라우저 자동화 테스트 시작');
  console.log('='.repeat(70));

  const browser = await puppeteer.launch({ 
    headless: false, // 브라우저를 보이게 함
    defaultViewport: { width: 1280, height: 720 }
  });
  
  try {
    const page = await browser.newPage();
    
    // 홈페이지로 이동
    console.log('\n[Step 1] 홈페이지로 이동');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    // 현재 표시된 텍스트 확인
    console.log('\n[Step 2] 현재 표시된 텍스트 확인');
    const currentText = await page.evaluate(() => {
      const section = document.querySelector('#publications');
      if (!section) return null;
      const span = section.querySelector('span.text-sm.text-gray-500');
      return span ? span.textContent.trim() : null;
    });
    console.log(`  현재 표시된 값: ${currentText}`);
    
    // 로그인 (필요한 경우)
    console.log('\n[Step 3] 로그인 확인');
    const allButtons = await page.$$('button');
    let loginButton = null;
    for (const btn of allButtons) {
      const text = await page.evaluate(el => el.textContent || '', btn);
      if (text.includes('Login')) {
        loginButton = btn;
        break;
      }
    }
    if (loginButton) {
      await loginButton.click();
      await page.waitForTimeout(1000);
      // 로그인 폼이 있으면 처리
      const emailInput = await page.$('input[type="email"]');
      const passwordInput = await page.$('input[type="password"]');
      if (emailInput && passwordInput) {
        await emailInput.type('admin@example.com');
        await passwordInput.type('password');
        const submitButton = await page.$('button[type="submit"]');
        if (submitButton) {
          await submitButton.click();
          await page.waitForTimeout(2000);
        }
      }
    } else {
      console.log('  로그인 버튼이 없거나 이미 로그인됨');
    }
    
    // Edit 버튼 찾기 및 클릭
    console.log('\n[Step 4] Edit 버튼 찾기');
    const editButtons = await page.$$('button:has-text("Edit")');
    console.log(`  Edit 버튼 개수: ${editButtons.length}`);
    
    // Publications 섹션의 description Edit 버튼 찾기
    let descriptionEditButton = null;
    for (const btn of editButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      const parent = await page.evaluateHandle(el => el.closest('#publications'), btn);
      if (parent && text.includes('Edit')) {
        descriptionEditButton = btn;
        break;
      }
    }
    
    if (descriptionEditButton) {
      console.log('  ✅ Description Edit 버튼 찾음');
      
      // Edit 버튼 클릭
      await descriptionEditButton.click();
      await page.waitForTimeout(1000);
      
      // Quill 에디터 찾기
      console.log('\n[Step 5] Quill 에디터에서 텍스트 편집');
      const quillEditor = await page.$('.ql-editor');
      if (quillEditor) {
        // 기존 텍스트 선택 및 삭제
        await quillEditor.click({ clickCount: 3 });
        await page.keyboard.press('Backspace');
        
        // 새 텍스트 입력
        const newText = 'Recent publications in electrocatalysts, fuel cells, water electrolysis, and energy materials.\n전기화학촉매, 연료전지, 수전해, 에너지 소재 분야의 최근 논문입니다.';
        await page.keyboard.type(newText);
        await page.waitForTimeout(1000);
        
        console.log('  ✅ 텍스트 입력 완료');
        
        // Save 버튼 찾기 및 클릭
        console.log('\n[Step 6] Save 버튼 클릭');
        const allButtons = await page.$$('button');
        let saveButton = null;
        for (const btn of allButtons) {
          const text = await page.evaluate(el => el.textContent || '', btn);
          if (text.includes('Save')) {
            saveButton = btn;
            break;
          }
        }
        if (saveButton) {
          await saveButton.click();
          await page.waitForTimeout(3000);
          console.log('  ✅ 저장 완료');
        } else {
          console.log('  ⚠️ Save 버튼을 찾을 수 없음');
        }
      }
    }
    
    // 저장 후 표시된 텍스트 확인
    console.log('\n[Step 7] 저장 후 표시된 텍스트 확인');
    await page.waitForTimeout(1000);
    const savedText = await page.evaluate(() => {
      const section = document.querySelector('#publications');
      if (!section) return null;
      const span = section.querySelector('span.text-sm.text-gray-500');
      return span ? span.textContent.trim() : null;
    });
    console.log(`  저장 후 표시된 값: ${savedText}`);
    
    if (savedText && savedText.includes('전기화학촉매')) {
      console.log('  ✅ 저장된 값이 올바르게 표시됨!');
    } else {
      console.log('  ⚠️ 저장된 값이 예상과 다름');
    }
    
    // 그린에너지 페이지로 이동
    console.log('\n[Step 8] Research → Green Energy Materials로 이동');
    const greenEnergyLink = await page.$('a[href*="green-energy"]');
    if (greenEnergyLink) {
      await greenEnergyLink.click();
      await page.waitForTimeout(2000);
      console.log('  ✅ Green Energy Materials 페이지로 이동');
    } else {
      // 메뉴에서 찾기
      const researchLink = await page.$('a[href*="research"]');
      if (researchLink) {
        await researchLink.click();
        await page.waitForTimeout(1000);
        const greenLink = await page.$('a[href*="green-energy"]');
        if (greenLink) {
          await greenLink.click();
          await page.waitForTimeout(2000);
          console.log('  ✅ Green Energy Materials 페이지로 이동');
        }
      }
    }
    
    // 다시 홈페이지로 돌아옴
    console.log('\n[Step 9] 홈페이지로 돌아옴');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    await page.waitForTimeout(2000);
    
    // 돌아온 후 표시된 텍스트 확인
    console.log('\n[Step 10] 돌아온 후 표시된 텍스트 확인');
    const finalText = await page.evaluate(() => {
      const section = document.querySelector('#publications');
      if (!section) return null;
      const span = section.querySelector('span.text-sm.text-gray-500');
      return span ? span.textContent.trim() : null;
    });
    console.log(`  돌아온 후 표시된 값: ${finalText}`);
    
    if (finalText && finalText.includes('전기화학촉매')) {
      console.log('\n' + '='.repeat(70));
      console.log('✅ 테스트 성공: 저장된 값이 유지됨!');
      console.log('='.repeat(70));
    } else {
      console.log('\n' + '='.repeat(70));
      console.log('❌ 테스트 실패: 저장된 값이 유지되지 않음');
      console.log('='.repeat(70));
    }
    
    // 브라우저를 5초간 열어둠 (확인용)
    console.log('\n브라우저를 5초간 열어둡니다...');
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('테스트 중 오류 발생:', error);
  } finally {
    await browser.close();
  }
}

// 개발 서버가 실행 중인지 확인
const http = require('http');

function checkServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      resolve(true);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  console.log('개발 서버 확인 중...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ 개발 서버가 실행 중이지 않습니다.');
    console.log('다음 명령어로 개발 서버를 시작하세요:');
    console.log('  npm run dev');
    process.exit(1);
  }
  
  console.log('✅ 개발 서버가 실행 중입니다.');
  await testBrowser();
}

main().catch(console.error);

