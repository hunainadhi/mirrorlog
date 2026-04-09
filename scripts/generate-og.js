const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  
  const filePath = path.resolve(__dirname, '../public/og-image.html');
  await page.goto(`file://${filePath}`);
  
  await page.screenshot({
    path: path.resolve(__dirname, '../public/og-image.png'),
    clip: { x: 0, y: 0, width: 1200, height: 630 },
    type: 'png',
  });
  
  await browser.close();
  console.log('OG image generated at public/og-image.png');
})();