const {By, Key, until, Builder} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname,"..", 'screenshots');
//garante que a pasta de screenshots exista
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR ,{ recursive: true });
}
async function takeScreenshot(driver, name) {
    try {
        const image = await driver.takeScreenshot();
        const filePath = path.join(SCREENSHOT_DIR, `${name}.png`);
        fs.writeFileSync(filePath, image, 'base64');
        console.log(`Screenshot salva: ${filePath}`);
    }catch(e){
        console.warn('Erro ao tirar foto');
    }
}
async function  main() {
    let driver;
    try{
        let options = new chrome.Options();
        options.addArguments(
              '--headless=new'
            , '--disable-gpu'
            , '--window-size=1920,1080'
            , '--no-sandbox'
            , '--disable-dev-shm-usage'
        );
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        await driver.manage().setTimeouts({ implicit: 5000, pageLoad: 15000});

        await driver.get(BASE_URL+ '/login');

        await takeScreenshot(driver, "Pagina_login");

        await driver.findElement(By.name('username')).sendKeys('admin');
        await driver.findElement(By.name('password')).sendKeys('admin', Key.RETURN);

        await takeScreenshot(driver, "Login_realizado");

        await driver.wait(until.urlIs(`${BASE_URL}/calculo`), 5000);
        await takeScreenshot(driver, "Pagina_calculo");

        await driver.findElement(By.id('altura')).sendKeys('5');
        await driver.findElement(By.id('largura')).sendKeys('10');
        await driver.findElement(By.id('btnCalcular')).click();

        await driver.wait(async () => {
            const el = await driver.findElement(By.id('data'));
            const txt = await el.getText();
            return txt && txt.length > 0;
        }, 5000);
        const dataText = await driver.findElement(By.id('data')).getText();
        console.log('Resultado do cálculo:', dataText);

        if (!dataText.includes('50')) throw new Error('Resultado esperado não encontrado');
    }finally{
        if(driver) {
            await driver.quit();
        }
    }
        /*const driver = await new Bilder().forBrowser('chrome').setChromeOptions(options).build();
        await driver.get(BASE_URL);
        await takeScreenshot(driver, 'home_page');
        await driver.findElement(By.name('username')).sendKeys('admin');
        await driver.findElement(By.name('password')).sendKeys('admin', Key.RETURN);
        await driver.wait(until.urlIs(`${BASE_URL}/calculo`), 5000);
        await takeScreenshot(driver, 'calculo_page');
        await driver.findElement(By.id('altura')).sendKeys('5');
        await driver.findElement(By.id('largura')).sendKeys('10');
        await driver.findElement(By.id('calculoForm')).submit();
        await driver.wait(until.elementLocated(By.id('data')), 5000);
        const dataText = await driver.findElement(By.id('data')).getText();
        console.log('Resultado do cálculo:', dataText);
        await takeScreenshot(driver, 'resultado_calculo');
        await driver.quit();*/
}

main().catch(err => {
    console.error('Erro no teste:', err);
    process.exit(1);
});