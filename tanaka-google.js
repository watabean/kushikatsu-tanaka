const puppeteer = require("puppeteer");
const notifier = require("node-notifier");
const URL =
  "https://www.google.com/maps/reserve/dine?c=UL_5ICBWwQo&ssst=2024-12-05T10%3A00%3A00.000Z&ld=20241205T190000&ps=2&gei=wjtOZ6zjJInn2roP5fbgkAQ&hl=ja-JP&opi=89978449&source=pa&sourceurl=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3D%25E4%25B8%25B2%25E3%2582%25AB%25E3%2583%2584%25E7%2594%25B0%25E4%25B8%25AD%2B%25E5%25B7%259D%25E5%25B4%258E%26rlz%3D1CDGOYI_enJP903JP903%26oq%3D%25E4%25B8%25B2%25E3%2582%25AB%25E3%2583%2584%25E7%2594%25B0%25E4%25B8%25AD%2B%25E3%2581%258B%25E3%2582%258F%25E3%2581%2595%25E3%2581%258D%26gs_lcrp%3DEgZjaHJvbWUqDwgBEAAYBBiDARixAxiABDIGCAAQRRg5Mg8IARAAGAQYgwEYsQMYgAQyCQgCEAAYBBiABDIJCAMQABgEGIAEMgkIBBAAGAQYgAQyCQgFEAAYBBiABDIJCAYQABgEGIAEMgkIBxAAGAQYgAQyCQgIEAAYBBiABDIJCAkQABgEGIAE0gEINjM0NWowajeoAhmwAgHiAwQYASBf%26hl%3Dja%26sourceid%3Dchrome-mobile%26ie%3DUTF-8&ihs=1";
async function checkGoogleAvailability(browser) {
  const page = await browser.newPage();
  try {
    await page.goto(URL);
    await page.waitForSelector(".VfPpkd-LgbsSe");
    const timeSlots = await page.evaluate(() => {
      return [
        ...document.querySelectorAll(".VfPpkd-LgbsSe:not([disabled])"),
      ].map((x) => x.innerText);
    });
    console.log(
      `${new Date().toLocaleString("JP", {
        timeZone: "Asia/Tokyo",
      })} Google[${timeSlots}]`
    );
    // 18, 19時台の予約枠があるかチェック
    const hasHappyTime = timeSlots.some(
      (slot) => slot.includes("19:") || slot.includes("18:")
    );
    if (hasHappyTime) {
      notifier.notify({
        title: "Googleで予約可能時間があります",
        message: `新たな予約枠が見つかりました！ ${timeSlots}`,
        sound: true,
      });
    }
  } catch (error) {
    console.error("Googleでエラーが発生しました:", error);
  } finally {
    await page.close();
  }
}
module.exports = checkGoogleAvailability;