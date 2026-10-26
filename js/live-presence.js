(() => {
 "use strict";
 const endpoint = "./data/games-db.json";
 const section = document.querySelector("#now-playing");
 if (!section) return;
 const esc = s => String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const fmt = seconds => { seconds=Math.max(0,Math.floor(seconds)); const h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=seconds%60; return h ? h+" ч "+String(m).padStart(2,"0")+" мин" : m+" мин "+String(s).padStart(2,"0")+" с"; };
 let started = 0;
 async function refresh(){
  const box=document.querySelector("#now-playing-content");
  if(!box)return;
  try{
   const r=await fetch(endpoint+"?v="+Date.now(),{cache:"no-store"});
   if(!r.ok)throw new Error("db unavailable");
   const db=await r.json(), g=db.current;
   if(!g||!g.title||!g.startedAt){
    box.innerHTML='<div class="now-playing-empty"><span class="now-playing-symbol">Ⅱ</span><div><b>Сейчас не играю</b><p>Запусти игру — трекер опубликует её название, обложку и длительность сессии.</p></div></div>';
    started=0;
    return;
   }
   const start=Date.parse(g.startedAt);
   if(!Number.isFinite(start))throw new Error("invalid session");
   const image=g.appid ? "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/"+encodeURIComponent(g.appid)+"/header.jpg" : "";
   box.innerHTML='<article class="now-playing-card">'+
    '<div class="now-playing-art">'+
    (image?'<img src="'+image+'" alt="Обложка игры: '+esc(g.title)+'" onerror="this.style.display=\'none\'">':'<div class="now-playing-art-placeholder">G’</div>')+
    '<span class="now-playing-art-label">GERMAN’$ · GAME SESSION</span></div>'+
    '<div class="now-playing-details"><span class="now-playing-live"><i></i> LIVE · СЕЙЧАС ИГРАЮ</span>'+
    '<h3 class="now-playing-game-title">'+esc(g.title)+'</h3>'+
    '<p class="now-playing-subtitle">Текущая игровая сессия с твоего ПК</p>'+
    '<div class="now-playing-timer"><strong id="live-session-time">—</strong><span>в игре</span></div></div></article>';
   started=start;
   const t=document.querySelector("#live-session-time");if(t)t.textContent=fmt((Date.now()-started)/1000);
  }catch(_){
   // Keep the rest of the library usable if the live database is temporarily unavailable.
  }
 }
 setInterval(()=>{const t=document.querySelector("#live-session-time");if(t&&started)t.textContent=fmt((Date.now()-started)/1000)},1000);
 refresh();setInterval(refresh,20000);
})();