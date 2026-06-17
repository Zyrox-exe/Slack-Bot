require("dotenv").config();
const axios = require("axios");
const { App } = require("@slack/bolt");
const SUPPORTED_ANIMALS = [
  "dog",
  "cat",
  "panda",
  "fox",
  "koala",
  "bird",
  "raccoon",
  "kangaroo",
  "red_panda",
  "whale",
  "birb",
];

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.command("/birdie-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({
    response_type: "in_channel",
    text: `Pong!\nLatency: ${latency}ms`,
  });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();
app.command("/birdie-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text: `Available Commands:
/birdie-help - Open this menu
/birdie-ping - Check bot latency
/birdie-catfact - Get a cat fact
/birdie-joke - Listen to a Joke
/birdie-pixel - Get an image and a fact of the animal you choose!(The animal library is kinda small for now)
/birdie-fact - Get a random (useless) fact
/birdie-weathertoday - Check the today's weather(birds watch the sky better!)`,
  });
});
app.command("/birdie-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({
      response_type: "in_channel",
      text: `:cat_blob:Cat Fact:\n${response.data.fact}`,
    });
  } catch (err) {
    await respond({
      response_type: "in_channel",
      text: "Failed to fetch a cat fact.",
    });
  }
});
app.command("/birdie-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get(
      "https://official-joke-api.appspot.com/random_joke",
    );
    await respond({
      response_type: "in_channel",
      text: `${response.data.setup}

${response.data.punchline}:cat_laugh:`,
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});
app.command("/birdie-pixel", async ({ command, ack, respond }) => {
  await ack();

  const animal = command.text.trim().toLowerCase();

  if (!animal) {
    await respond(`Add the animal you want to see with the pixel command.
      Currently Supported: ${SUPPORTED_ANIMALS.join(", ")}`);
    return;
  }

  if (!SUPPORTED_ANIMALS.includes(animal)) {
    await respond(
      `Sorry, I don't have pictures of "${animal}" yet. Currently Available animals are: ${SUPPORTED_ANIMALS.join("\n")}`,
    );
    return;
  }

  try {
    const res = await fetch(`https://some-random-api.com/animal/${animal}`);
    const data = await res.json();

    await respond({
      response_type: "in_channel",
      blocks: [
        {
          type: "image",
          image_url: data.image,
          alt_text: animal,
        },
        {
          type: "context",
          elements: [
            { type: "mrkdwn", text: `🐾 *${animal}* fact: ${data.fact}` },
          ],
        },
      ],
    });
  } catch (err) {
    console.error(err);
    await respond("Oops, something went wrong fetching that image.");
  }
});
app.command("/birdie-fact", async ({ ack, respond }) => {
  await ack();

  try {
    const res = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random");
    const data = await res.json();

    await respond({
      response_type: "in_channel",
      text: `🗑️ Useless fact: ${data.text}`,
    });
  } catch (err) {
    console.error(err);
    await respond("Oops, couldn't grab a fact right now.");
  }
});

app.command('/birdie-weathertoday', async ({ command, ack, respond }) => {
  // 1. Acknowledge immediately to avoid timeout
  await ack(); 
  
  const city = command.text.trim();
  
  if (!city) {
    await respond("Please provide a city name, e.g., /birdie-weathertoday London");
    return;
  }

  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geoData = await geoRes.json();

    if (!geoData.results) {
      await respond(`Sorry, I couldn't find a city named ${city}.`);
      return;
    }

    const { latitude, longitude, name } = geoData.results[0];

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`);
    const weatherData = await weatherRes.json();
    const curr = weatherData.current;

    const message = `Weather in ${name}:
> 🌡️ Temperature: ${curr.temperature_2m}°C
> 🤒 Feels like: ${curr.apparent_temperature}°C
> 💧 Humidity: ${curr.relative_humidity_2m}%
> 💨 Wind Speed: ${curr.wind_speed_10m} km/h`;

    // 2. Respond to the channel
    await respond({
      text: message,
      response_type: "in_channel"
    });
    
  } catch (error) {
    console.error(error);
    await respond("Oops! Something went wrong fetching the weather.");
  }
});