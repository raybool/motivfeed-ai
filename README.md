# MotivFeed AI

US-oriented market-research landing page for **MotivFeed AI** — a concept for finding motivational short-form videos across TikTok, Instagram Reels and YouTube Shorts by user intent rather than hashtags.

## Purpose

This site is designed to validate:

- primary motivation use cases;
- preferred short-form platforms;
- current discovery pain points;
- expected usage frequency;
- willingness to pay;
- beta / waitlist intent.

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static server.

```bash
npx serve .
```

## GitHub Pages

Publish from the repository root on the `main` branch. The production URL is expected to be:

`https://raybool.github.io/motivfeed-ai/`

## Notes

The current research prototype stores survey responses locally in the visitor's browser (`localStorage`). Before paid traffic, connect analytics and a durable research backend such as PostHog + Supabase.


## Analytics

Production GA4 instrumentation is configured for Measurement ID `G-BJNH8VS40B`.

- Consent Mode v2 with analytics opt-in
- No ad personalization signals
- Funnel events for hero search, survey progression, pricing, completion and strong intent
- No raw free-form search or survey text sent to GA4
- Privacy page and cookie settings
- Full setup guide: [docs/ga4-setup.md](./docs/ga4-setup.md)
