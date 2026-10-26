# Steam sync Worker

Run these commands from this directory with Node.js installed:

```sh
npx wrangler login
npx wrangler deploy
npx wrangler secret put STEAM_API_KEY
npx wrangler secret put STEAM_ID64
```

- `STEAM_API_KEY`: Steam Web API key, stored as a Cloudflare Worker secret.
- `STEAM_ID64`: your 17-digit SteamID64.
- Make the Steam profile and **Game details** public.
- After deploy, copy the Worker URL into `window.STEAM_SYNC_ENDPOINT` in `../js/config.js`.
- Do not place API keys in `js/config.js`, HTML, or any committed file.

The endpoint returns playtime for owned Steam games and requests achievement counts for up to 25 most-played games. The static site fetches fresh values when opened and when the sync button is pressed.
