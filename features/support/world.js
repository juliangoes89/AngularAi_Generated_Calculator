const { setWorldConstructor, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');

// Set default timeout to 30 seconds
setDefaultTimeout(30000);

let globalBrowser;

class CalculatorWorld {
  constructor() {
    this.browser = globalBrowser;
    this.page = null;
    this.baseUrl = 'http://localhost:4200';
  }

  async createPage() {
    if (!globalBrowser) {
      console.log('🌐 Launching browser...');
      globalBrowser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-web-security']
      });
      this.browser = globalBrowser;
    }
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1200, height: 800 });
  }

  async closePage() {
    if (this.page) {
      await this.page.close();
    }
  }

  async navigateToCalculator() {
    // Check if Angular server is running by trying to connect
    let retries = 5;
    while (retries > 0) {
      try {
        console.log(`Attempting to connect to ${this.baseUrl}...`);
        await this.page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 10000 });
        await this.page.waitForSelector('.calculator', { timeout: 15000 });
        console.log('✅ Successfully connected to calculator!');
        return; // Success
      } catch (error) {
        retries--;
        if (retries === 0) {
          throw new Error(`❌ Could not connect to Angular server at ${this.baseUrl}. 

PLEASE MAKE SURE THE ANGULAR SERVER IS RUNNING:
1. Open a new terminal
2. Run: npm start
3. Wait for "compiled successfully" message
4. Then run the Cucumber tests again

Error: ${error.message}`);
        }
        console.log(`⏳ Retrying connection to Angular server... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }

  async clickButton(buttonText) {
    await this.page.evaluate((text) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const button = buttons.find(b => b.textContent.trim() === text);
      if (button) {
        button.click();
      } else {
        const availableButtons = buttons.map(b => `"${b.textContent.trim()}"`).join(', ');
        throw new Error(`Button with text "${text}" not found. Available buttons: ${availableButtons}`);
      }
    }, buttonText);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async getCurrentDisplay() {
    try {
      return await this.page.$eval('.current-operand', el => el.textContent.trim());
    } catch (error) {
      throw new Error('Could not find current display element. Make sure the calculator is loaded.');
    }
  }

  async getPreviousDisplay() {
    try {
      return await this.page.$eval('.previous-operand', el => el.textContent.trim());
    } catch (error) {
      return ''; // Previous display might be empty
    }
  }
}

setWorldConstructor(CalculatorWorld);

Before(async function() {
  await this.createPage();
  await this.navigateToCalculator();
});

After(async function() {
  await this.closePage();
});

// Cleanup on process exit
process.on('exit', async () => {
  if (globalBrowser) {
    await globalBrowser.close();
  }
});

process.on('SIGINT', async () => {
  if (globalBrowser) {
    await globalBrowser.close();
  }
  process.exit(0);
});

module.exports = {
  default: {
    require: ['features/support/world.js', 'features/step_definitions/*.js'],
    format: ['progress-bar'],
    paths: ['features/**/*.feature'],
    publishQuiet: true,
    parallel: 1,
    retry: 0,
    timeout: 30000
  }
};