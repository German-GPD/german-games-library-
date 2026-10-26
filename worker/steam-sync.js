/**
 * German'$ Games Library — dual-account Steam sync.
 * Secrets: STEAM_API_KEY, STEAM_ID64, STEAM_ID64_2 (optional).
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
  const origin=request.headers.get("Origin")||"";
  const allowed=env.ALLOWED_ORIGIN||"https://german-gpd.github.io";
  if(origin&&origin!==allowed)return new Response("Origin not allowed",{status:403});
  const headers={...cors(allowed),"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store"};
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers});
  if(request.method!=="GET")return new Response(JSON.stringify({error:"GET only"}),{status:405,headers});
  if(!env.STEAM_API_KEY)return new Response(JSON.stringify({error:"Set STEAM_API_KEY as a Worker secret."}),{status:503,headers});
  const ids=[env.STEAM_ID64,env.STEAM_ID64_2].filter((id,i,a)=>/^\d{17}$/.test(id||"")&&a.indexOf(id)===i);
  if(!ids.length)return new Response(JSON.stringify({error:"Set STEAM_ID64 and optionally STEAM_ID64_2 as Worker secrets."}),{status:503,headers});
  const base="https://api.steampowered.com";
  const get=async url=>{const r=await fetch(url);if(!r.ok)throw new Error("Steam API returned "+r.status);return r.json()};
  try{
   const summaryUrl=new URL(base+"/ISteamUser/GetPlayerSummaries/v2/");
   summaryUrl.searchParams.set("key",env.STEAM_API_KEY);summaryUrl.searchParams.set("steamids",ids.join(","));
   const summaryJson=await get(summaryUrl);
   const players=(summaryJson?.response?.players||[]).map(p=>({steamid:p.steamid,personaName:p.personaname||"Steam user",gameName:p.gameextrainfo||"",appid:Number(p.gameid)||0,avatar:p.avatarfull||""}));
   const nowPlaying=players.filter(p=>p.appid>0&&p.gameName);
   const mode=new URL(request.url).searchParams.get("mode");
   if(mode==="presence")return new Response(JSON.stringify({source:"steam",updatedAt:new Date().toISOString(),nowPlaying}),{status:200,headers});
   const accountResults=await Promise.all(ids.map(async steamid=>{
    const u=new URL(base+"/IPlayerService/GetOwnedGames/v1/");
    u.searchParams.set("key",env.STEAM_API_KEY);u.searchParams.set("steamid",steamid);
    u.searchParams.set("include_appinfo","1");u.searchParams.set("include_played_free_games","1");
    const json=await get(u);
    if(!Array.isArray(json?.response?.games))throw new Error("Steam Game Details are private or unavailable for account "+steamid);
    return {steamid,games:json.response.games};
   }));
   const merged=new Map();
   for(const account of accountResults)for(const g of account.games){
    const appid=Number(g.appid);if(!appid)continue;
    const prev=merged.get(appid)||{appid,playtimeMinutes:0,accounts:0};
    prev.playtimeMinutes+=Number(g.playtime_forever)||0;prev.accounts++;
    merged.set(appid,prev);
   }
   const games=[...merged.values()];
   const top=[...games].filter(g=>g.playtimeMinutes>0).sort((a,b)=>b.playtimeMinutes-a.playtimeMinutes).slice(0,25);
   let cursor=0;
   const workers=Array.from({length:4},async()=>{
    while(cursor<top.length){
     const game=top[cursor++];
     // Achievements are account-specific; union achieved achievement names across both profiles.
     const achieved=new Set();let totalNames=new Set();
     for(const steamid of ids){
      try{
       const u=new URL(base+"/ISteamUserStats/GetPlayerAchievements/v1/");
       u.searchParams.set("key",env.STEAM_API_KEY);u.searchParams.set("steamid",steamid);u.searchParams.set("appid",String(game.appid));
       const j=await get(u);const list=j?.playerstats?.achievements;
       if(Array.isArray(list))for(const a of list){if(a.apiname)totalNames.add(a.apiname);if(Number(a.achieved)===1&&a.apiname)achieved.add(a.apiname)}
      }catch(_){}
     }
     if(totalNames.size){game.achievements=achieved.size;game.total=totalNames.size}
    }
   });
   await Promise.all(workers);
   const current=nowPlaying.map(p=>({...p,totalHours:Math.round((merged.get(p.appid)?.playtimeMinutes||0)/60*10)/10}));
   return new Response(JSON.stringify({source:"steam",updatedAt:new Date().toISOString(),count:games.length,accounts:ids.length,games,nowPlaying:current}),{status:200,headers});
  }catch(error){return new Response(JSON.stringify({error:error.message||"Steam sync failed"}),{status:502,headers})}
 }
};
