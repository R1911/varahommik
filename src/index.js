const { scheduleCronJobs } = require('./cronJobs');
const { getDateTime } = require('./utils/dateTimeHelper');
const { fetchBotUsername } = require('./utils/fetchUsername');

async function initialize() {
    try {
        const username = await fetchBotUsername();
        console.info(`${getDateTime()} @${username} bot is running.`); 
        scheduleCronJobs();
    } catch (error) {
        console.error('Error initializing the bot:', error);
    }
}

initialize();