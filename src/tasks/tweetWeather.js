const { twitterClient } = require('../services/twitterClient');
const { scrapeWeatherDetails } = require('../services/weatherScraper');
const fs = require('fs');
const path = require('path');
const { getDateTime } = require('../utils/dateTimeHelper');

// Function to prepare and tweet weather update
async function tweetWeatherUpdate() {
    const dateTime = getDateTime();
    try {
        const weather = await scrapeWeatherDetails();
        const { phenomenon, tempmin, tempmax } = weather;
        let weatherContent;

        if (tempmin > 15) {
            weatherContent = `Täna on sooja kuni ${tempmax} kraadi. ${phenomenon}`;
        } else {
            weatherContent = `Tänane õhutemperatuur jääb vahemikku ${tempmin} kuni ${tempmax} kraadi. ${phenomenon}`;
        }

        // Read the last tweet ID to reply to
        const tweetDataPath = path.join(__dirname, "../tweet.json");
        const tweetDataRaw = fs.readFileSync(tweetDataPath);
        const { tweetId } = JSON.parse(tweetDataRaw);

        // Reply to the previous tweet with weather update
        const response = await twitterClient.v2.reply(weatherContent, tweetId);
        console.info(`${getDateTime()} Replied to tweet ID: ${tweetId} with weather update.`);
    } catch (error) {
        console.error(`${getDateTime()} Failed to tweet weather update:`, error);
    }
}

module.exports = { tweetWeatherUpdate };
