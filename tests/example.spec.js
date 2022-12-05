// @ts-check
const { test, expect } = require('@playwright/test');
const { baseConfig } = require('../baseConfig');
const { cartPageLocators } = require('../locators/cartPageLocators');
const { homePageLocators } = require('../locators/homePage');
const { loginPageLocator } = require('../locators/loginPageLocator');
const { cartData } = require('../testData/cartData');
const { loginPage } = require('../testData/loginPage');

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
await page.goto(baseConfig.url);
await page.locator(loginPageLocator.username).fill(loginPage.username);
await page.locator(loginPageLocator.password).fill(loginPage.password);
await page.locator(loginPageLocator.loginbutton).click();
await expect(page).toHaveURL(/inventory/);
});
test.skip('Select the Product ', async ({ }) => {

  await page.locator(cartPageLocators.addCart).click();
  await page.locator(cartPageLocators.cartBtn).click();
  await expect(page).toHaveURL(/cart/);
  await page.locator(cartPageLocators.checkOut).click();
  await expect(page).toHaveURL(/checkout-step-one/);
 
});
test('Check out', async ({ }) => {
  
  await page.locator(cartPageLocators.cartDetailsFirstName).fill(cartData.firstName);
  await page.locator(cartPageLocators.cartDetailsLastName).fill(cartData.lastName);
  await page.locator(cartPageLocators.cartZipCode).fill(cartData.zipCode);
  await page.locator(cartPageLocators.cartContinue).click();
  await page.locator(cartPageLocators.cartFinish).click();
  await expect(page).toHaveURL(/checkout-complete/);
  await page.locator(cartPageLocators.cartBackToHome).click();
});

test.afterAll(async ({}, testInfo) => {

  await page.locator(homePageLocators.menuIcon).click();
  await page.locator(homePageLocators.logOut).click();
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

