const { TwitterApi } = require("twitter-api-v2");
const { getEnv } = require('../utils/environment');

const client = new TwitterApi({
    appKey: getEnv('API_KEY'),
    appSecret: getEnv('API_SECRET'),
    accessToken: getEnv('ACCESS_TOKEN'),
    accessSecret: getEnv('ACCESS_SECRET'),
  });
  
  const bearer = new TwitterApi(getEnv('BEARER_TOKEN'));

const twitterClient = client.readWrite;
const twitterBearer = bearer.readOnly;

module.exports = { twitterClient, twitterBearer };
