# Welcome to AR1's Remix & CF Workers Boilerplate

Tech Stack:

- [TailwindCSS](https://tailwindcss.com/)
- [Remix](https://remix.run/)
- [CF Workers](https://cloudflare.com/workers/)
- [Zustand](https://github.com/pmndrs/zustand)

## Contents:

- [Setup](#setup)
- [Development](#development)
- [Deployment](#deployment)

## Setup

Create a project using this template by running:

```ssh
npx create-remix@latest --template ahmedriad1/remix-boilerplate
```

To setup the project you need to do the following:

- Copy `.env.example` to `.env`
- Run `npm install`

## Development

```sh
npm run dev
```

If you want to check the production build, you can stop the dev server and run
following commands:

```sh
npm run build
npm start
```

## Deployment

There are two ways to deploy the project:

1. Github Actions (Recommended):

- Set gihub secrets:

```sh
gh secret put CF_ACCOUNT_ID
gh secret put CF_API_TOKEN
gh secret put SESSION_SECRET
```

- That's it, now u can just push the project and it'll be deployed to CF
  Workers.

2. Deploy Manually:

- Make sure you have the following:

  - set environment variable `CF_ACCOUNT_ID` in `.env` or set `account_id`
    `wrangler.toml`
  - authenticated using wrangler

- Then run the following command:

```sh
npm run deploy
```

Enjoy! 💚
