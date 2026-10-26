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
    box.innerHTML='<div class="now-playing-empty"><span class="now-playing-symbol">Ⅱ</span><div><b>Сейчас не играю</b><p>Когда трекер обнаружит игру на ПК, она появится здесь.</p></div></div>';
    return;
   }
   const start=Date.parse(g.startedAt);
   if(!Number.isFinite(start))throw new Error("invalid session");
   const image=g.appid ? "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/"+encodeURIComponent(g.appid)+"/header.jpg" : "";
   box.innerHTML='<article style="display:flex;gap:18px;align-items:center;max-width:760px;padding:18px;border:1px solid var(--line);border-radius:16px;background:var(--surface)">'+
    (image?'<img src="'+image+'" alt="" style="width:min(42%,240px);aspect-ratio:460/215;object-fit:cover;border-radius:10px" onerror="this.style.display=\'none\'">':'')+
    '<div style="min-width:0"><span class="eyebrow"><span class="live-dot"></span> LIVE · СЕЙЧАС ИГРАЮ</span><h3 style="font-size:clamp(18px,3vw,26px);margin:9px 0">'+esc(g.title)+'</h3><p style="color:var(--muted);margin:0">В этой сессии: <b id="live-session-time">—</b></p></div></article>';
   started=start;
   const t=document.querySelector("#live-session-time");if(t)t.textContent=fmt((Date.now()-started)/1000);
  }catch(_){
   // Keep the rest of the library usable if the live database is temporarily unavailable.
  }
 }
 setInterval(()=>{const t=document.querySelector("#live-session-time");if(t&&started)t.textContent=fmt((Date.now()-started)/1000)},1000);
 refresh();setInterval(refresh,20000);
})();