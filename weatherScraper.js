const axios = require("axios");
const { parseString } = require("xml2js");

// Function to directly construct appropriate weather phrases in Estonian
function constructWeatherPhrase(phenomenon) {
  const phrases = {
    Clear: "Ilm on selge",
    "Few clouds": "Ilm on vähese pilvisusega",
    "Scattered clouds": "Ilm on hajusa pilvisusega",
    "Broken clouds": "Ilm on katkiste pilvedega",
    "Light shower": "Kohati sajab kerget hoovihma",
    "Moderate shower": "Kohati sajab mõõdukat hoovihma",
    Rain: "Vihmane ilm",
    Thunderstorm: "Kohati on äikeseoht",
    Snow: "Ilm on lumine",
    Mist: "Ilm on udune",
  };

  return phrases[phenomenon] || `Ilm on ${phenomenon.toLowerCase()}`;
}

async function scrapeWeatherDetails() {
  try {
    const response = await axios.get(
      "https://www.ilmateenistus.ee/ilma_andmed/xml/forecast.php"
    );
    const xmlData = response.data;

    // Parse the XML data
    let jsonData;
    parseString(xmlData, (err, result) => {
      if (err) {
        throw err;
      }
      jsonData = result;
    });

    const weatherDetails = jsonData.forecasts.forecast[0].day[0];
    const phenomenonPhrase = constructWeatherPhrase(
      weatherDetails.phenomenon[0]
    );
    const tempmin = parseInt(weatherDetails.tempmin[0], 10);
    const tempmax = parseInt(weatherDetails.tempmax[0], 10);

    return {
      phenomenon: phenomenonPhrase,
      tempmin: tempmin,
      tempmax: tempmax,
    };
  } catch (error) {
    console.error("Error scraping weather details:", error);
    throw error; // Rethrow the error to the caller
  }
}

module.exports = { scrapeWeatherDetails };
