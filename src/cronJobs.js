const { CronJob } = require('cron');
const { updateImages } = require('./tasks/updateImages');
const { tweetWeatherUpdate, checkEarlyWeather } = require('./tasks/tweetWeather');
const { tweet } = require('./tasks/tweetContent');

const scheduleCronJobs = () => {
    new CronJob("0 0 0 1 * *", updateImages, null, true, 'Europe/Tallinn');
    new CronJob("0 0 8 * * *", tweetWeatherUpdate, null, true, 'Europe/Tallinn');
    new CronJob("0 0 7 * * *", checkEarlyWeather, null, true, 'Europe/Tallinn', true);
    new CronJob("0 30 5 * * *", tweet, null, true, 'Europe/Tallinn');
};

module.exports = { scheduleCronJobs };
