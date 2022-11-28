// @ts-check
const { test, expect } = require('@playwright/test');

let page;
let browser;

test.use({
  viewport:{
    height:824,
    width:1530
  }
})
test.beforeAll(async({browser},testInfo) => {  
  
  page=await browser.newPage({
    recordVideo: {
      dir: testInfo.outputPath('./test-results/videos/'),
    }
});
});
test('Login into application', async ({ }) => {
  await page.goto("https://www.saucedemo.com/")
  await page.locator("//*[@data-test='username']").fill("standard_user");
  await page.locator("//*[@data-test='password']").fill("secret_sauce");
  await page.locator("//*[@id='login-button']").click();
  await expect(page).toHaveURL(/inventory/);
});
test('Select product and Navigate to cart', async ({ }) => {
  //*[@id='add-to-cart-sauce-labs-backpack']
  await page.locator("//*[@id='add-to-cart-sauce-labs-backpack']").click();
  await page.locator('//*[@class="shopping_cart_link"]').click();
  await expect(page).toHaveURL(/cart/);
  await page.locator("//*[@id='checkout']").click();
  await expect(page).toHaveURL(/checkout-step-one/);
  await page.locator("//*[@data-test='firstName']").fill("Ganesh");
  await page.locator("//*[@data-test='lastName']").fill("D");
  await page.locator("//*[@data-test='postalCode']").fill("600004");
  await page.locator("//*[@data-test='continue']").click();
  await page.locator("//*[@id='finish']").click();
  await expect(page).toHaveURL(/checkout-complete/);
});

test.afterAll(async ({}, testInfo) => {
  const videoPath = testInfo.outputPath('my-video.webm');
  await Promise.all([
    page.video().saveAs(videoPath),
    page.close()
  ]);
  testInfo.attachments.push({
    name: 'video',
    path: videoPath,
    contentType: 'video/webm'
  });
});

