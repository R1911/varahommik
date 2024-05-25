const { twitterClient } = require('../services/twitterClient');
const { getDateTime } = require('../utils/dateTimeHelper');
const path = require('path');

async function updateImages() {
    const month = new Date().getMonth() + 1;
    const winterMonths = [11, 12, 1, 2, 3];
    const isWinter = winterMonths.includes(month);
    const bannerFileName = isWinter ? `winter${Math.floor(Math.random() * 2) + 1}.jpg` : `default${Math.floor(Math.random() * 2) + 1}.jpg`;
    const dpFileName = isWinter ? "DP_winter.jpg" : "DP_default.jpg";
    const bannerFilePath = path.join(__dirname, `../../images/${bannerFileName}`);
    const dpFilePath = path.join(__dirname, `../../images/${dpFileName}`);

    try {
        console.log(`${getDateTime()} Updating profile banner...`);
        await twitterClient.v1.updateAccountProfileBanner(bannerFilePath, {
            width: 1500,
            height: 500,
        });
        console.info(`${getDateTime()} Profile banner updated successfully.`);
        console.log(`${getDateTime()} Updating profile picture...`);
        await twitterClient.v1.updateAccountProfileImage(dpFilePath);
        console.info(`${getDateTime()} Profile picture updated successfully.`);
    } catch (error) {
        console.error(`${getDateTime()} Failed to update images. Error Message:`, error.message);
        console.error(`${getDateTime()} Error Stack Trace:`, error.stack);
    }
}


module.exports = { updateImages };
