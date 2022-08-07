const puppeteer = require("puppeteer");

(async () => {

  const link = 'ws://127.0.0.1:9222/devtools/browser/9592d003-6783-4c18-8aeb-ea6a470fd02a';
  const browser = await puppeteer.connect({

    headless: true,
    defaultViewport: null,
    browserWSEndpoint: link,
  });

  const page = await browser.newPage();
  await page.goto("https://ridmvreservations.ri.gov/slot", {
    waitUntil: "networkidle2",
  })

  await page.select('#selectedCategory', '4')
  await page.waitForTimeout(1000);
  
  await page.waitForSelector('#mainContent > div.app-main-content > div > form > div:nth-child(2) > div:nth-child(5)');
  await page.click('#mainContent > div.app-main-content > div > form > div:nth-child(2) > div:nth-child(5)');
  await page.waitForTimeout(1000);

  await page.waitForSelector('#mainContent > div.app-main-content > div > form > div.app-button-group > button.app-btn-primary');
  await page.click('#mainContent > div.app-main-content > div > form > div.app-button-group > button.app-btn-primary');
  await page.waitForTimeout(3000);

  startOver(); 
  
  async function startOver(){

    await page.reload({
      waitUntil: "networkidle2",
    });

    try {
        await page.waitForXPath('//*[@id="noReservations"]/div/p[1]');
        let [getFirstXPath] = await page.$x('//*[@id="noReservations"]/div/p[1]');
        let dmvtext = await page.evaluate(getFirstXPath => getFirstXPath.textContent, getFirstXPath);
    } catch {
        const page2 = await browser.newPage();
        await page2.goto("https://mail.google.com/mail/u/0/#drafts?compose=jrjtXPVtPCqRVBRBcmzTTsFtCKvdJBBxpsgjRSXxQKVsHtNvqtvJlZfkqGKvBPfmQKznhWQh", {
            waitUntil: "networkidle2",
        })
        
        const elements = await page2.$x('//*[@id=":4l"]');
        await elements[0].click();
        console.log("EMAIL SENT");
        await browser.disconnect();
    }
    
    await page.waitForTimeout(10000); //avoid site rate limit
    startOver();
  }

})();