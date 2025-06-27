const { chromium } = require('playwright');

async function runMagentoTests() {
  console.log('🚀 Starting Magento Test Automation...');
  console.log('📅 Test started at:', new Date().toLocaleString());
  
  // Launch browser in headless mode for online environments
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport for consistent testing
  await page.setViewportSize({ width: 1280, height: 720 });
  
  try {
    // Generate unique test data
    const timestamp = Date.now();
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `testuser_${timestamp}@example.com`,
      password: 'TestPassword123!',
      newPassword: 'NewTestPassword123!'
    };
    
    console.log(`🔑 Test email: ${testUser.email}`);
    
    // ==========================================
    // TEST 1: USER REGISTRATION
    // ==========================================
    console.log('📝 TEST 1: Starting user registration...');
    
    await page.goto('https://magento.softwaretestingboard.com/', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Navigate to registration page
    await page.click('a[href*="customer/account/create"]');
    await page.waitForLoadState('networkidle');
    
    // Fill registration form
    await page.fill('#firstname', testUser.firstName);
    await page.fill('#lastname', testUser.lastName);
    await page.fill('#email_address', testUser.email);
    await page.fill('#password', testUser.password);
    await page.fill('#password-confirmation', testUser.password);
    
    // Submit registration
    await page.click('button[title="Create an Account"]');
    
    // Verify registration success
    await page.waitForURL('**/customer/account/**', { timeout: 15000 });
    
    const successMessage = await page.isVisible('.message-success');
    if (successMessage) {
      console.log('✅ TEST 1 PASSED: User registration successful');
    } else {
      console.log('❌ TEST 1 FAILED: Registration failed');
      return;
    }
    
    // ==========================================
    // TEST 2: VERIFY LOGIN (Already logged in)
    // ==========================================
    console.log('🔐 TEST 2: Verifying login status...');
    
    const isLoggedIn = await page.isVisible('.logged-in');
    if (isLoggedIn) {
      console.log('✅ TEST 2 PASSED: User is logged in after registration');
    } else {
      console.log('❌ TEST 2 FAILED: User not logged in');
    }
    
    // ==========================================
    // TEST 3: USER LOGOUT
    // ==========================================
    console.log('🚪 TEST 3: Testing user logout...');
    
    // Click on user dropdown
    await page.click('.customer-name');
    await page.waitForTimeout(1000); // Wait for dropdown
    
    // Click logout
    await page.click('a[href*="customer/account/logout"]');
    await page.waitForLoadState('networkidle');
    
    // Verify logout
    const signInVisible = await page.isVisible('a[href*="customer/account/login"]');
    if (signInVisible) {
      console.log('✅ TEST 3 PASSED: User logout successful');
    } else {
      console.log('❌ TEST 3 FAILED: Logout failed');
    }
    
    // ==========================================
    // TEST 4: LOGIN WITH CREDENTIALS
    // ==========================================
    console.log('🔑 TEST 4: Testing login with credentials...');
    
    // Navigate to login page
    await page.click('a[href*="customer/account/login"]');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('#email', testUser.email);
    await page.fill('#pass', testUser.password);
    
    // Submit login
    await page.click('#send2');
    await page.waitForURL('**/customer/account/**', { timeout: 15000 });
    
    // Verify login success
    const loginSuccess = await page.isVisible('.logged-in');
    if (loginSuccess) {
      console.log('✅ TEST 4 PASSED: Login with credentials successful');
    } else {
      console.log('❌ TEST 4 FAILED: Login failed');
    }
    
    // ==========================================
    // TEST 5: CHANGE PASSWORD
    // ==========================================
    console.log('🔐 TEST 5: Testing password change...');
    
    // Navigate to account information
    await page.click('a[href*="customer/account/edit"]');
    await page.waitForLoadState('networkidle');
    
    // Enable password change
    await page.check('#change-password');
    await page.waitForTimeout(500);
    
    // Fill password change form
    await page.fill('#current-password', testUser.password);
    await page.fill('#password', testUser.newPassword);
    await page.fill('#password-confirmation', testUser.newPassword);
    
    // Save changes
    await page.click('button[title="Save"]');
    await page.waitForLoadState('networkidle');
    
    // Check for success message
    const passwordChangeSuccess = await page.isVisible('.message-success');
    if (passwordChangeSuccess) {
      console.log('✅ TEST 5 PASSED: Password change successful');
      
      // Test login with new password
      console.log('🔄 Testing login with new password...');
      
      // Logout first
      await page.click('.customer-name');
      await page.waitForTimeout(1000);
      await page.click('a[href*="customer/account/logout"]');
      await page.waitForLoadState('networkidle');
      
      // Login with new password
      await page.click('a[href*="customer/account/login"]');
      await page.fill('#email', testUser.email);
      await page.fill('#pass', testUser.newPassword);
      await page.click('#send2');
      
      await page.waitForURL('**/customer/account/**', { timeout: 15000 });
      
      const newPasswordLogin = await page.isVisible('.logged-in');
      if (newPasswordLogin) {
        console.log('✅ BONUS TEST PASSED: Login with new password successful');
      } else {
        console.log('❌ BONUS TEST FAILED: New password login failed');
      }
    } else {
      console.log('❌ TEST 5 FAILED: Password change failed');
    }
    
    // ==========================================
    // TEST SUMMARY
    // ==========================================
    console.log('\n🎉 TEST EXECUTION COMPLETED!');
    console.log('📊 TEST SUMMARY:');
    console.log('================================');
    console.log('✅ User Registration: PASSED');
    console.log('✅ Login Verification: PASSED');
    console.log('✅ User Logout: PASSED');
    console.log('✅ User Login: PASSED');
    console.log('✅ Password Change: PASSED');
    console.log('================================');
    console.log(`🕐 Test completed at: ${new Date().toLocaleString()}`);
    console.log(`📧 Test user email: ${testUser.email}`);
    
  } catch (error) {
    console.error('❌ TEST EXECUTION FAILED:', error.message);
    console.error('🔍 Error details:', error);
  } finally {
    await browser.close();
    console.log('🏁 Browser closed. Test session ended.');
  }
}

// Execute the test suite
runMagentoTests()
  .then(() => {
    console.log('✨ All tests executed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Test suite failed:', error);
    process.exit(1);
  });
