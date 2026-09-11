# ColdLife Twin

## GitHub repository

https://github.com/anshgupta652006-ux/coldlife-twin

AI-powered pharmaceutical cold-chain digital twin built with React, Vite, Supabase, Leaflet, Recharts and Gemini.

## Features

- Live fleet map with fuel and cooling telemetry
- Critical shipment detection from temperature, survival, risk and quarantine state
- Live ETA and remaining distance
- Compact chain of custody
- Driver and vehicle health monitoring
- Supabase realtime-ready backend
- Controlled cooling/quarantine RPC actions
- Fast Gemini prediction through a Supabase Edge Function
- Local fallback demo data, so the UI still renders if optional tables are unavailable

## Architecture

`React/Vite -> Supabase Database/RPC -> Supabase Edge Function -> Gemini API`

The Gemini API key is **never** stored in the frontend.

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set in `.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

Never put a Supabase `service_role` key or Gemini API key in Vite environment variables.

## Supabase backend

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Run `supabase/schema.sql`.
4. Install/login to Supabase CLI:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

5. Store Gemini securely:

```bash
npx supabase secrets set GEMINI_API_KEY=YOUR_GEMINI_KEY
```

6. Deploy the Edge Function:

```bash
npx supabase functions deploy gemini-predict
```

## Deploy to Vercel

Import this repository into Vercel. Add these project environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Build command: `npm run build`  
Output: `dist`

## Deploy to Netlify

Import the repository and add the same two environment variables. `netlify.toml` is included.

## Deploy to GitHub Pages

The included workflow `.github/workflows/deploy-pages.yml` builds and deploys on every push to `main`.

In GitHub repository **Settings -> Secrets and variables -> Actions**, add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Then in **Settings -> Pages**, choose **GitHub Actions** as the source.

## Create/push the repo from a Mac

If GitHub CLI is installed and authenticated:

```bash
git init
git add .
git commit -m "Initial ColdLife Twin deployment"
git branch -M main
gh repo create coldlife-twin --public --source=. --remote=origin --push
```

Use `--private` instead of `--public` if preferred.

## Security

This repository contains no API secrets. `.env` is gitignored. Gemini runs behind a Supabase Edge Function and reads `GEMINI_API_KEY` from Supabase secrets.
