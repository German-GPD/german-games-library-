/**
 * German'$ Games Library — Steam sync Cloudflare Worker
 * Set Worker secrets: STEAM_API_KEY, STEAM_ID64
 * Optional variable ALLOWED_ORIGIN defaults to https://german-gpd.github.io
 */
const cors = origin => ({
 "Access-Control-Allow-Origin": origin || "*",
 "Access-Control-Allow-Methods": "GET, OPTIONS",
 "Access-Control-Allow-Headers": "Content-Type",
 "Access-Control-Max-Age": "86400",
 "Vary": "Origin"
});
export default {
 async fetch(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = env.ALLOWED_ORIGIN || "https://german-gpd.github.io";
  if (origin && origin !== allowed) return new Response("Origin not allowed", { status: 403 });
  const headers = { ...cors(allowed), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "GET") return new Response(JSON.stringify({ error: "GET only" }), { status: 405, headers });
  if (!env.STEAM_API_KEY || !/^\d{17}$/.test(env.STEAM_ID64 || "")) return new Response(JSON.stringify({ error: "Set STEAM_API_KEY and STEAM_ID64 as Worker secrets." }), { status: 503, headers });
  try {
   const base = "https://api.steampowered.com";
   const ownedUrl = new URL(base + "/IPlayerService/GetOwnedGames/v1/");
   ownedUrl.searchParams.set("key", env.STEAM_API_KEY);
   ownedUrl.searchParams.set("steamid", env.STEAM_ID64);
   ownedUrl.searchParams.set("include_appinfo", "1");
   ownedUrl.searchParams.set("include_played_free_games", "1");
   const ownedRes = await fetch(ownedUrl, { cf: { cacheTtl: 300, cacheEverything: true } });
   if (!ownedRes.ok) throw new Error("Steam owned-games endpoint returned " + ownedRes.status);
   const ownedJson = await ownedRes.json();
   const owned = ownedJson?.response?.games;
   if (!Array.isArray(owned)) throw new Error("Steam profile game details are private or unavailable.");
   const games = owned.map(g => ({ appid: Number(g.appid), playtimeMinutes: Number(g.playtime_forever) || 0 }));
   const top = [...owned].filter(g => Number(g.playtime_forever) > 0).sort((a,b) => b.playtime_forever-a.playtime_forever).slice(0, 25);
   let cursor = 0;
   const workers = Array.from({ length: 4 }, async () => {
    while (cursor < top.length) {
     const game = top[cursor++];
     try {
      const u = new URL(base + "/ISteamUserStats/GetPlayerAchievements/v1/");
      u.searchParams.set("key", env.STEAM_API_KEY);
      u.searchParams.set("steamid", env.STEAM_ID64);
      u.searchParams.set("appid", String(game.appid));
      const r = await fetch(u);
      if (!r.ok) continue;
      const j = await r.json();
      const a = j?.playerstats?.achievements;
      if (Array.isArray(a) && a.length) {
       const item = games.find(x => x.appid === Number(game.appid));
       if (item) { item.achievements = a.filter(x => Number(x.achieved) === 1).length; item.total = a.length; }
      }
     } catch (_) {}
    }
   });
   await Promise.all(workers);
   return new Response(JSON.stringify({ source: "steam", updatedAt: new Date().toISOString(), count: games.length, games }), { status: 200, headers });
  } catch (error) {
   return new Response(JSON.stringify({ error: error.message || "Steam sync failed" }), { status: 502, headers });
  }
 }
};
