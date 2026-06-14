require("dotenv").config();
const axios = require("axios");
const { App } = require("@slack/bolt");
const SUPPORTED_ANIMALS = ['dog','cat','panda','fox','koala','bird','raccoon','kangaroo','red_panda','whale','birb']

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/birdie-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();
app.command("/birdie-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/birdie-help - Open this menu
/birdie-ping - Check bot latency
/birdie-catfact - Get a cat fact
/birdie-joke - Listen to a Joke
/birdie-pixel - Get an image and a fact of the animal you choose!(The animal library is kinda small for now)`
  });
});
app.command("/birdie-catfact", async ({ ack, say }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await say({ text: `:cat_blob:Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await say({ text: "Failed to fetch a cat fact." });
  }
});
app.command("/birdie-joke", async ({ ack, say }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await say({
      text:
`${response.data.setup}

${response.data.punchline}:cat_laugh:`
    });
  } catch (err) {
    await say({ text: "Failed to fetch a joke." });
  }
});
app.command('/birdie-pixel', async ({ command, ack, say }) => {
  await ack();

  const animal = command.text.trim().toLowerCase();

  if (!animal) {
    await say(`Which animal would you like to see?? Currently Supported: ${SUPPORTED_ANIMALS.join(', ')}`);
    return;
  }

  if (!SUPPORTED_ANIMALS.includes(animal)) {
    await say(`Sorry, I don't have pictures of "${animal}" yet. Currently Available animals are: ${SUPPORTED_ANIMALS.join('\n')}`);
    return;
  }

  try {
    const res = await fetch(`https://some-random-api.com/animal/${animal}`);
    const data = await res.json();

    await say({
      blocks: [
        {
          type: "image",
          image_url: data.image,
          alt_text: animal
        },
        {
          type: "context",
          elements: [
            { type: "mrkdwn", text: `🐾 *${animal}* fact: ${data.fact}` }
          ]
        }
      ]
    });
  } catch (err) {
    console.error(err);
    await say("Oops, something went wrong fetching that image.");
  }
});
