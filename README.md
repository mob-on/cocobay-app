# COCOBAY telegram app

## Requirements

Check the `engines` section of [package.json](package.json) to see the required versions of:

- Node
- npm

### Prepare the repository to work

- `yarn prepare` will set up locally things like husky for pre-commit hooks

## Running load tests

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
