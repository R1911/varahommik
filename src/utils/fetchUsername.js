const { twitterClient } = require("../services/twitterClient");

async function fetchBotUsername() {
  try {
    const userData = await twitterClient.v2.me();
    return userData.data.username;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
}

module.exports = { fetchBotUsername };
