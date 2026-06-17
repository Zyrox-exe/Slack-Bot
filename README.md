# Birdie 🐦

A simple Slack bot built for Hack Club Stardance.

## Commands

| Command | Description |
|---|---|
| `/birdie-joke` | Get a random joke |
| `/birdie-catfact` | Get a random cat fact |
| `/birdie-help` | Show the help menu |
| `/birdie-ping` | Check if the bot is online |
| `/birdie-pixel [animal]` | Get a photo and random fact about the given animal |
| `/birdie-fact` | Get a useless fact you never needed |
| `/birdie-weatheroday` | Check the weather without opening your window |

## Setup

1. Clone the repo
   ```bash
   git clone https://github.com/Zyrox-exe/Slack-Bot.git
   cd Slack-Bot
   ```

2. Install dependencies<br>
*First install node.js for you respective Operating System [Here](https://nodejs.org/en/download)<br>
Then follow steps below*
   ```bash
   npm init -y
   npm insall @slack/bolt dotenv
   ```

3. Create a `.env` file with your Slack credentials
   ```
   SLACK_BOT_TOKEN=your-token-here
   SLACK_APP_TOKEN=your-app-token-here
   ```

4. Run the bot
   ```bash
   node index.js
   ```

## Deployment

This bot is deployed on [Hack Club Nest](https://nest.hackclub.com).

## Built With

- [Node.js](https://nodejs.org)
- [Slack Bolt](https://slack.dev/bolt-js)

As part of [Hack Club Stardance Program](https://stardance.space).