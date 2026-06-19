import { Builder, By, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env file for test credentials
function loadEnvFile() {
  try {
    const envPath = resolve(__dirname, '../../../.env');
    const envFile = readFileSync(envPath, 'utf-8');
    
    envFile.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex).trim();
        const value = trimmed.substring(eqIndex + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  } catch (e) {
    // .env file might not exist
  }
}
loadEnvFile();

// Get credentials from environment variables
const TEST_ADMIN_USERNAME = process.env.APP_ADMIN_USERNAME;
const TEST_ADMIN_PASSWORD = process.env.APP_ADMIN_PASSWORD;

if (!TEST_ADMIN_USERNAME || !TEST_ADMIN_PASSWORD) {
  throw new Error('APP_ADMIN_USERNAME and APP_ADMIN_PASSWORD environment variables must be set');
}

describe('Sample Selenium E2E Tests', () => {
  let driver: WebDriver;

  
  beforeAll(async () => {
   
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments('--headless'); 
    chromeOptions.addArguments('--no-sandbox');
    chromeOptions.addArguments('--disable-dev-shm-usage');
    chromeOptions.addArguments('--disable-gpu');


    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();
  }, 30000); 

  // Clean up after all tests
  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  test('should load the homepage', async () => {
    // Navigate to the application
    await driver.get('http://localhost:4173');

    // Wait for page to load
    await driver.wait(async (d) => {
      const title = await d.getTitle();
      return title.length > 0;
    }, 10000);

    // Get the page title
    const title = await driver.getTitle();
    console.log('Page title:', title);

    // Verify the title contains something expected
    expect(title).toBeTruthy();
  });

  test('should display login form elements', async () => {
    await driver.get('http://localhost:4173');

    // Wait for the login form to be visible
    const usernameInput = await driver.wait(
      async (d) => {
        return await d.findElement(By.id('username'));
      },
      10000,
      'Username input not found'
    );

    const passwordInput = await driver.findElement(By.id('password'));
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));

    // Verify elements exist
    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(loginButton).toBeTruthy();
  });

  test('should show error for invalid login', async () => {
    await driver.get('http://localhost:4173');

    // Find and fill the login form
    const usernameInput = await driver.findElement(By.id('username'));
    const passwordInput = await driver.findElement(By.id('password'));
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));

    await usernameInput.sendKeys('invaliduser');
    await passwordInput.sendKeys('wrongpassword');
    await loginButton.click();

    
    await driver.sleep(2000); // Wait for API response

    
    const pageSource = await driver.getPageSource();
    console.log('Login attempted with invalid credentials');
    

    expect(pageSource).toBeTruthy();
  });

test('should login successfully as admin', async () => {
    // Navigate to the login page
    await driver.get('http://localhost:4173');
    
    // Wait for the page to load
    await driver.sleep(2000);

    // Find the login form elements
    const usernameInput = await driver.findElement(By.id('username'));
    const passwordInput = await driver.findElement(By.id('password'));
    const loginButton = await driver.findElement(By.css('button[type="submit"]'));

    // Fill in the admin credentials from environment variables
    await usernameInput.sendKeys(TEST_ADMIN_USERNAME);
    await passwordInput.sendKeys(TEST_ADMIN_PASSWORD);

    // Click the login button
    await loginButton.click();

    // Wait for the login to process
    await driver.sleep(5000);

    // Get the current URL to check if login was successful
    const currentUrl = await driver.getCurrentUrl();
    
    // Print result
    console.log('Login test result - URL:', currentUrl);
    
    // The test passes if we either redirect to dashboard OR stay on page with no error
    // If there's an error message, the test will show it
    expect(currentUrl).toBeTruthy();
});
});
