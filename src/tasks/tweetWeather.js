const { twitterClient } = require('../services/twitterClient');
const { scrapeWeatherDetails } = require('../services/weatherScraper');
const fs = require('fs');
const path = require('path');
const { getDateTime } = require('../utils/dateTimeHelper');

// Function to prepare and tweet weather update
async function tweetWeatherUpdate() {
    const dateTime = new Date();
    const currentDate = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    let earlyWeather;

    if (month >= 9 || month <= 4) {
        const weatherDataRaw = fs.readFileSync(path.join(__dirname, "../weatherData.json"));
        earlyWeather = JSON.parse(weatherDataRaw);
    }

    const weather = await scrapeWeatherDetails();
    const { phenomenon, tempmin, tempmax } = weather;
    let weatherContent;

    if (earlyWeather && currentDate === earlyWeather.dateChecked) {
        const adjustedTempMin = Math.min(tempmin, earlyWeather.tempmin);
        weatherContent = `Tänane õhutemperatuur jääb vahemikku ${adjustedTempMin} kuni ${tempmax} kraadi. ${phenomenon}`;
    } else {
        if (tempmin > 15) {
            weatherContent = `Täna on sooja kuni ${tempmax} kraadi. ${phenomenon}`;
        } else {
            weatherContent = `Tänane õhutemperatuur jääb vahemikku ${tempmin} kuni ${tempmax} kraadi. ${phenomenon}`;
        }
    }

    const tweetDataPath = path.join(__dirname, "../tweet.json");
    const tweetDataRaw = fs.readFileSync(tweetDataPath);
    const { tweetId } = JSON.parse(tweetDataRaw);

    const response = await twitterClient.v2.reply(weatherContent, tweetId);
    console.info(`${getDateTime()} Replied to tweet ID: ${tweetId} with weather update.`);
}


async function checkEarlyWeather() {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    if (month >= 9 || month <= 4) {  // Check weather from September to April
        const weather = await scrapeWeatherDetails();
        const weatherData = {
            tempmin: weather.tempmin,
            dateChecked: currentDate.getDate()
        };
        fs.writeFileSync(path.join(__dirname, "../weatherData.json"), JSON.stringify(weatherData));
        console.log(`${getDateTime()} Stored early morning weather data`);
    }
}


module.exports = { tweetWeatherUpdate, checkEarlyWeather };
