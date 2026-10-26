/**
 * Cloudflare Worker for German'$ Games Library.
 * Configure secrets: STEAM_API_KEY, STEAM_ID.
 * Optional variable: ALLOWED_ORIGIN=https://german-gpd.github.io
 */
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "https://german-gpd.github.io";
    const cors = {
      "Access-Control-Allow-Origin": origin === allowedOrigin ? origin : allowedOrigin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
      "Vary": "Origin"
    };
    if (request.method === "OPTIONS") return new Response(null, {status:204,headers:cors});
    if (request.method !== "GET") return Response.json({error:"Method not allowed"},{status:405,headers:cors});
    if (!env.STEAM_API_KEY || !env.STEAM_ID) return Response.json({error:"Set STEAM_API_KEY and STEAM_ID in Worker secrets."},{status:503,headers:cors});
    try {
      const api = new URL("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/");
      api.searchParams.set("key", env.STEAM_API_KEY);
      api.searchParams.set("steamids", env.STEAM_ID);
      const response = await fetch(api, {headers:{"Accept":"application/json"}});
      if (!response.ok) return Response.json({error:"Steam API unavailable"},{status:502,headers:cors});
      const payload = await response.json();
      const player = payload?.response?.players?.[0];
      if (!player) return Response.json({error:"Steam profile not found or not public."},{status:404,headers:cors});
      return Response.json({
        steamid: player.steamid,
        personaname: player.personaname,
        avatar: player.avatarfull,
        profileurl: player.profileurl,
        gameextrainfo: player.gameextrainfo || null,
        gameid: player.gameid || null,
        online: Boolean(player.gameextrainfo)
      }, {headers:cors});
    } catch (_) {
      return Response.json({error:"Unexpected upstream error"},{status:502,headers:cors});
    }
  }
};
