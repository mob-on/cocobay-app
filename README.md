# COCOBAY telegram app

## Requirements

Check the `engines` section of [package.json](package.json) to see the required versions of:

- Node
- npm

### Prepare the repository to work

- `yarn prepare` will set up locally things like husky for pre-commit hooks

## Testing

### Test environment

The ideal test environment for the Telegram app is the telegram app itself.

Ideally you would interact with a device (or a telegram desktop app) to open the game following [Ton's documentation to debug Telegram apps](https://docs.ton.org/develop/dapps/telegram-apps/testing-apps#using-bots-in-the-test-environment)

It's possible to test the app by creating a test account (you will need an SMS for validation, and I've only been able to set it up in iOS or the Telegram desktop app, using the debugging build from the link above).

Once you are using Telegram's test environment, you'll be able to interact with @BotFather (beware of impersonators) to set up the bot, without the restriction of TLS/SSL requirement either, so you could point to 127.0.0.1 (not localhost) or your local network IP address.

### Running load tests

Execute from the root of the project the following:

`yarn load-test <path to test file>`

Example:

`yarn load-test backend/test/load/healthcheck/healthcheck.load-spec.js`

Tests results are visible on-screen and also through grafana in http://localhost:2000

## IDEs

### VSCode users

If you're a VSCode user, you may need to configure some additional settings to get the maximum from your IDE in this repo, namely:

- Install extensions:

  - eslint
  - Prettier - Code formatter

- More optional extensions:
  - code spell checker
  - Git Mob co-author commits
  - Live Share
  - Markdown Preview Mermaid Support
