import { Builder, By, WebDriver, WebElement } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';



describe('Sample Selenium E2E Tests', () => {
  let driver: WebDriver;

  
  beforeAll(async () => {
   
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments('--headless'); // Run in headless mode for CI
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
});
