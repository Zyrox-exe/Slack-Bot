# Birdie 🐦

A simple Slack bot built for Hack Club Stardance.

## Commands

| Command | Description |
|---|---|
| `/birdie-joke` | Get a random joke |
| `/birdie-catfact` | Get a random cat fact |
| `/birdie-help` | Show the help menu |
| `/birdie-ping` | Check if the bot is online |

## Setup

1. Clone the repo
   ```bash
   git clone <your-repo-url>
   cd Slack-Bot
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file with your Slack credentials
   ```
   SLACK_BOT_TOKEN=your-token-here
   SLACK_SIGNING_SECRET=your-secret-here
   ```

4. Run the bot
   ```bash
   node index.js
   ```

## Deployment

This bot is deployed on [Hack Club Nest](https://nest.hackclub.com) using systemd as a persistent service.

## Built With

- [Node.js](https://nodejs.org)
- [Slack Bolt](https://slack.dev/bolt-js)

Built as part of [Hack Club Stardance Program](https://stardance.space).
