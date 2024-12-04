const notifier = require("node-notifier");
const URL =
  "https://paypaygourmet.yahoo.co.jp/place/g-HaQnOeFunDo/course/?date=20241205&bm=slga_googleih_kw_brand_other&person=2&time=1730";
async function checkPaypayAvailability(browser) {
  const page = await browser.newPage();
  try {
    await page.goto(URL);
    await page.waitForSelector(".reservation__button");
    await page.click(".reservation__button");
    await page.waitForSelector(".time__item");
    const timeSlots = await page.evaluate(() => {
      return [...document.querySelectorAll(".time__item")].map(
        (x) => x.innerText
      );
    });
    console.log(
      `${new Date().toLocaleString("JP", {
        timeZone: "Asia/Tokyo",
      })} PayPay[${timeSlots}]`
    );
    // 18, 19時台の予約枠があるかチェック
    const hasHappyTime = timeSlots.some(
      (slot) => slot.includes("19:") || slot.includes("18:")
    );
    if (hasHappyTime) {
      notifier.notify({
        title: "Paypayで予約可能時間があります",
        message: `新たな予約枠が見つかりました！ ${timeSlots}`,
        sound: true,
      });
    }
  } catch (error) {
    console.error("Paypayでエラーが発生しました:", error);
  } finally {
    await page.close();
  }
}
module.exports = checkPaypayAvailability;