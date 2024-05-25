require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient } = require("./twitterClient.js");
const CronJob = require("cron").CronJob;
const fs = require("fs");
const path = require("path");
const { scrapeWeatherDetails } = require("./weatherScraper.js");

const dateTime = new Date().toLocaleString().replace(",", "");
console.info(`${dateTime} @varahommik bot is running.`);

async function updateImages() {
  try {
    const dateTime = new Date().toLocaleString().replace(",", "");
    const month = new Date().getMonth() + 1;
    const winterMonths = [11, 12, 1, 2, 3];
    const isWinter = winterMonths.includes(month);
    const bannerFileName = isWinter
      ? `winter${Math.floor(Math.random() * 2) + 1}.jpg`
      : `default${Math.floor(Math.random() * 2) + 1}.jpg`;
    const dpFileName = isWinter ? "DP_winter.jpg" : "DP_default.jpg";
    const bannerFilePath = __dirname + `/images/${bannerFileName}`;
    const dpFilePath = __dirname + `/images/${dpFileName}`;

    console.log(`${dateTime} Updating profile banner...`);
    await twitterClient.v1.updateAccountProfileBanner(bannerFilePath, {
      width: 1500,
      height: 500,
    });
    console.info(`${dateTime} Profile banner updated successfully.`);
    console.log(`${dateTime} Updating profile picture...`);
    await twitterClient.v1.updateAccountProfileImage(dpFilePath);
    console.info(`${dateTime} Profile picture updated successfully.`);
  } catch (error) {
    console.error(
      `${dateTime} Failed to update images. Error Message:`,
      error.message
    );
    console.error(`${dateTime} Error Stack Trace:`, error.stack);
  }
}

const tweetWeatherUpdate = async () => {
  try {
    const weather = await scrapeWeatherDetails();
    const { phenomenon, tempmin, tempmax } = weather;
    const weatherContent = `Tänane ilm tuleb ${tempmin} kuni ${tempmax} kraadi. ${phenomenon}`;

    // Read the last tweet ID to reply to
    const tweetDataPath = path.join(__dirname, "tweet.json");
    const tweetDataRaw = fs.readFileSync(tweetDataPath);
    const { tweetId } = JSON.parse(tweetDataRaw);

    // Reply to the previous tweet with weather update
    const response = await twitterClient.v2.reply(weatherContent, tweetId);
    const dateTime = new Date().toLocaleString().replace(",", "");
    console.info(`${dateTime} Weather tweet made! Reply to tweet ID: ${tweetId}`);
  } catch (e) {
    console.error("Failed to tweet weather update: ", e);
  }
};


const updateImagesJob = new CronJob("0 0 0 1 * *", async () => {
  updateImages(); // Run at 00:00:00 on the first day of each month
});

updateImagesJob.start();

const getTweetContent = () => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;

  let content = "Tere varahommikust! 🌞\nLoodan, et sul tuleb hea päev!";

  // Check for special dates and modify the content accordingly
  if (month === 6 && day === 24) {
    content =
      "Tere varahommikust ning häid jaane! 🌞\nLoodan, et sul tuleb imeline jaanipäev!";
  } else if (month === 6 && day === 23) {
    content =
      "Tere varahommikust! 🌞\nIlusat võidupüha! Loodan, et sul tuleb täna suurepärane päev!";
  } else if (month === 12 && day === 24) {
    content =
      "Head varajast jõuluhommikut! 🌞\nLoodan, et sul on imelised ning rahulikud jõulud!";
  } else if (month === 2 && day === 24) {
    content =
      "Tere varahommikust Eestimaa rahvas! 🌞\nImelist vabariigi aastapäeva!";
  } else if (month === 8 && day === 20) {
    content =
      "Tere varahommikust! 🌞\nLoodan, et naudid tänast taasiseseisvumispäeva!";
  } else if (month === 1 && day === 1) {
    content =
      "Tere varahommikust ning head uut aastat! 🌞\nLoodan, et su uue aasta esimene päev tuleb vahva!";
  } else if ((month === 12 && day === 30) || (month === 12 && day === 31)) {
    content =
      "Tere varahommikust, ning head vana aasta lõppu! 🌞\nLoodan et sul tuleb hea päev!";
  }

  return content; // Default content for other days
};

const tweet = async () => {
  try {
    const content = getTweetContent();
    const response = await twitterClient.v2.tweet(content);
    const dateTime = new Date().toLocaleString().replace(",", "");
    console.info(`${dateTime} Tweet made!`);
    const tweetId = response.data.id;
    const tweetData = JSON.stringify({ tweetId });
    fs.writeFileSync(path.join(__dirname, "tweet.json"), tweetData);
    console.log(`${dateTime} Tweet ID written to tweet.json:`, tweetId);
  } catch (e) {
    console.log(e);
  }
};

const cronTweet = new CronJob("0 30 5 * * *", async () => {
  tweet();
});

cronTweet.start();

const weatherTweetJob = new CronJob("0 0 8 * * *", tweetWeatherUpdate);
weatherTweetJob.start();
