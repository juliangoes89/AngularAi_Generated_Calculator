const { setWorldConstructor, Before, After } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');

class CustomWorld {
  constructor() {
    this.browser = null;
    this.page = null;
    this.baseUrl = 'http://localhost:4200';
  }

  async openBrowser() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1200, height: 800 });
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async navigateToCalculator() {
    await this.page.goto(this.baseUrl);
    await this.page.waitForSelector('.calculator', { timeout: 10000 });
  }

  async clickButton(buttonText) {
    const buttonSelector = `button:contains("${buttonText}")`;
    await this.page.evaluate((text) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const button = buttons.find(b => b.textContent.trim() === text);
      if (button) {
        button.click();
      } else {
        throw new Error(`Button with text "${text}" not found`);
      }
    }, buttonText);
    // Small delay to allow for UI updates
    await this.page.waitForTimeout(100);
  }

  async getCurrentDisplay() {
    return await this.page.$eval('.current-operand', el => el.textContent.trim());
  }

  async getPreviousDisplay() {
    return await this.page.$eval('.previous-operand', el => el.textContent.trim());
  }
}

setWorldConstructor(CustomWorld);

Before(async function() {
  await this.openBrowser();
  await this.navigateToCalculator();
});

After(async function() {
  await this.closeBrowser();
});

module.exports = {
  default: {
    require: ['features/step_definitions/*.js'],
    format: ['@cucumber/pretty-formatter'],
    paths: ['features/**/*.feature'],
    publishQuiet: true
  }
};