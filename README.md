# Grafbase ⨯ Clerk ⨯ Next.js

This examples shows how to connect Clerk as your Identity Provider with your Grafbase project &mdash; [Read the guide](https://grafbase.com/guides/using-clerk-as-your-identity-provider-with-grafbase)

## Requirements

**Node `>=18.15.0`**

## Getting Started

1. Run `cp .env.example .env`
1. Run `cp grafbase/.env.example grafbase/.env`
1. Open `.env` in your code editor, and provide your Grafbase API endpoint and [Clerk API Keys](https://dashboard.clerk.com/last-active?path=api-keys)
1. Open `grafbase/.env` in your code editor, and provide your Clerk issuer URL
1. Run `npm install`, or `yarn install` to install dependencies
1. Run `npx grafbase dev` to start local dev server with your schema
1. Run `npm run dev`, or `yarn dev` (in a new terminal)
1. Visit [http://localhost:3000](http://localhost:3000)
