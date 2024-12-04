const puppeteer = require("puppeteer");
const checkGoogleAvailability = require("./tanaka-google");
const checkPaypayAvailability = require("./tanaka-paypay");

const POLLING_INTERVAL = 60 * 1000; // 1分ごと
let browser; // グローバルで共有するブラウザインスタンス
// セットアップ
async function setup() {
  console.log("監視を開始します...");
  browser = await puppeteer.launch({ headless: "new" });
  // 初回実行
  await checkGoogleAvailability(browser);
  await checkPaypayAvailability(browser);
  // 定期的に実行
  setInterval(() => checkGoogleAvailability(browser), POLLING_INTERVAL);
  setInterval(() => checkPaypayAvailability(browser), POLLING_INTERVAL);
}
setup();