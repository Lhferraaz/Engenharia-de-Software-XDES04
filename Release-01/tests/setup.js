import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js'; // Note a importação com .js

export const BASE_URL = 'http://localhost:8080/';

export async function createDriver() {
  // Configuração para Selenium com ES Modules
  const options = new chrome.Options();
  // Descomente a linha abaixo para rodar em modo headless (sem abrir o navegador)
  // options.addArguments('--headless');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1920,1080');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  return driver;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}