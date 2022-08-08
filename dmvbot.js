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
      
        /* if you want to print the text
        
        let [getFirstXPath] = await page.$x('//*[@id="noReservations"]/div/p[1]');
        let dmvtext = await page.evaluate(getFirstXPath => getFirstXPath.textContent, getFirstXPath);
        
        */
      
        //throw new Exception(); //test catch
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
    
    // avoid site detection mechanism
    const randInt = Math.floor(Math.random()*4);
    let currentNum;

    if (randInt == 0) currentNum = 10066;
    if (randInt == 1) currentNum = 10850;
    if (randInt == 2) currentNum = 12223;
    if (randInt == 3) currentNum = 14938;

    await page.waitForTimeout(currentNum); // avoid site rate limit
    startOver();
  }

})();
