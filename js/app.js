(() => {
"use strict";
const games=Array.isArray(window.GAMES)?window.GAMES:[];
const stats=window.GAME_STATS||{};
let liveSteam=false;
const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const genres=[...new Set(games.map(g=>g.genre))].sort((a,b)=>a.localeCompare(b,"ru"));
const state={query:"",status:"all",letter:"",genre:"",sort:"alphabetical",limit:60};
const $=s=>document.querySelector(s);
const sections=$("#game-sections"),alphabetGrid=$("#alphabet-grid"),genreGrid=$("#genre-grid");
const clean=v=>String(v||"").toLocaleLowerCase("ru").replace(/[’']/g,"").trim();
const letterOf=g=>(g.letter||g.title.charAt(0)).toUpperCase();
const played=g=>g.status==="played";
const known=g=>g.status==="known"||played(g);
const completed=g=>stats[g.id]?.completion==="completed";
const image=g=>g.appid&&Number(g.appid)>0?"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/"+g.appid+"/header.jpg":"";
const esc=v=>String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function progress(g){const s=stats[g.id];return s&&s.total>0?Math.round(s.achievements/s.total*100):null}
function statusLabel(g){return completed(g)?"ЗАВЕРШИЛ":played(g)?"ИГРАЛ":known(g)?"ЗНАЮ":"В СПИСКЕ"}
function renderGenres(){
 genreGrid.innerHTML=genres.map(name=>'<button class="genre-item'+(state.genre===name?' active':'')+'" data-genre="'+esc(name)+'"><span>'+esc(name)+'</span><small>'+games.filter(g=>g.genre===name).length+'</small></button>').join("");
 const secondary=$("#genre-grid-secondary");
 secondary.innerHTML=genres.map(name=>'<button class="genre-pill'+(state.genre===name?' active':'')+'" data-genre="'+esc(name)+'">'+esc(name)+' <span>'+games.filter(g=>g.genre===name).length+'</span></button>').join("");
}
function renderAlphabet(){
 alphabetGrid.innerHTML=alphabet.map(l=>{const n=games.filter(g=>letterOf(g)===l).length;return '<button class="letter-button'+(n?' has-games':'')+(state.letter===l?' selected':'')+'" data-letter="'+l+'" aria-label="'+l+', '+n+' игр"'+(n?"":" disabled")+'>'+l+'</button>'}).join("");
}
function filteredGames(){
 const q=clean(state.query);
 const out=games.filter(g=>{
  if(state.status==="played"&&!played(g))return false;
  if(state.status==="completed"&&!completed(g))return false;
  if(state.status==="candidate"&&known(g))return false;
  if(state.letter&&letterOf(g)!==state.letter)return false;
  if(state.genre&&g.genre!==state.genre&&!(g.tags||[]).includes(state.genre))return false;
  if(q&&!clean([g.title,g.genre,...(g.tags||[])].join(" ")).includes(q))return false;
  return true;
 });
 out.sort((a,b)=>{
  if(state.sort==="popular"&&!!a.featured!==!!b.featured)return a.featured?-1:1;
  if(state.sort==="hours")return (stats[b.id]?.hours||0)-(stats[a.id]?.hours||0);
  return a.title.localeCompare(b.title,"en",{sensitivity:"base"});
 });
 return out;
}
function card(g){
 const s=stats[g.id],pct=progress(g),url=image(g),tags=(g.tags||[]).slice(0,2).map(t=>'<span class="mini-tag">'+esc(t)+'</span>').join("");
 const initials=esc(g.title.split(/[\s:–-]+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase());
 const poster='<img class="game-cover" loading="lazy" src="'+(url||"data:,")+'" alt="" data-title="'+esc(g.title)+'" data-genre="'+esc(g.genre)+'" data-appid="'+(g.appid||"")+'" onerror="window.GPD_IMAGE_FALLBACK&&window.GPD_IMAGE_FALLBACK(this)"><span class="poster-fallback" hidden>'+initials+'</span>';
 const meta=s?'<div class="personal-meta"><div class="personal-meta-row"><span>Время</span><b>'+(s.hoursEstimated===false?'':'≈ ')+s.hours+' ч</b></div>'+(pct===null?'<div class="personal-meta-row"><span>Достижения</span><b>Нет данных</b></div>':'<div><div class="personal-meta-row"><span>Ачивки</span><b>'+(s.achievementsEstimated===false?'':'≈ ')+pct+'%</b></div><div class="achievement-track"><span style="width:'+pct+'%"></span></div></div>')+'</div><div class="progress-note">'+(s.hoursEstimated===false?(s.achievementsEstimated===false?'STEAM SYNC':'STEAM HOURS · ACHIEVEMENT ESTIMATE'):'ПРЕДВАРИТЕЛЬНАЯ ОЦЕНКА')+'</div>':'';
 return '<article class="game-card" tabindex="0" role="button" data-game="'+esc(g.id)+'" aria-label="Подробнее: '+esc(g.title)+'"><div class="game-poster">'+poster+'<span class="status-badge'+(played(g)?" played":"")+(completed(g)?" completed":"")+'">'+statusLabel(g)+'</span>'+(g.featured?'<span class="favorite-mark" aria-label="Избранное">✦</span>':"")+'</div><div class="game-info"><h3 class="game-title">'+esc(g.title)+'</h3><div class="game-meta"><span class="game-genre">'+esc(g.genre)+'</span></div><div class="game-tags">'+tags+'</div>'+(g.description?'<p class="game-summary">'+esc(g.description)+'</p>':'')+meta+'</div></article>';
}
function renderFilters(){
 const chips=[];
 if(state.query)chips.push(["Поиск: "+state.query,"query"]);
 if(state.letter)chips.push(["Буква: "+state.letter,"letter"]);
 if(state.genre)chips.push(["Жанр: "+state.genre,"genre"]);
 if(state.status!=="all")chips.push(["Статус: "+({played:"Играл",completed:"Завершил",candidate:"В списке"}[state.status]||state.status),"status"]);
 const el=$("#active-filters");el.hidden=!chips.length;
 el.innerHTML=chips.map(([label,key])=>'<span class="filter-chip">'+esc(label)+'<button data-clear="'+key+'" aria-label="Сбросить фильтр">×</button></span>').join("");
}
function render(){
 const all=filteredGames(),shown=all.slice(0,state.limit),groups={};
 shown.forEach(g=>{const l=letterOf(g);(groups[l]||(groups[l]=[])).push(g)});
 sections.innerHTML=Object.keys(groups).sort().map(l=>'<section class="game-group" id="letter-'+l+'"><div class="group-head"><span class="group-letter">'+l+'</span><span class="group-title">На '+l+'</span><span class="group-count">'+groups[l].length+' игр</span></div><div class="game-grid">'+groups[l].map(card).join("")+'</div></section>').join("");
 const totalHours=Object.values(stats).reduce((n,s)=>n+(Number(s.hours)||0),0);
 $("#stat-total").textContent=games.length;
 $("#stat-played").textContent=games.filter(g=>played(g)||(stats[g.id]?.source==="steam"&&Number(stats[g.id]?.hours)>0)).length;
 $("#stat-completed").textContent=Object.values(stats).filter(s=>s.completion==="completed").length;
 $("#stat-hours").textContent=totalHours>=1000?(totalHours/1000).toFixed(1)+"k":totalHours.toLocaleString("ru-RU");
 $("#visible-count").textContent=all.length;
 $("#result-note").textContent=all.length?"Показано "+shown.length+" из "+all.length+" игр":"Нет игр по заданным условиям";
 $("#show-more").hidden=all.length<=shown.length;$("#empty-state").hidden=all.length!==0;
 renderFilters();renderAlphabet();renderGenres();
}
function reset(){state.query="";state.status="all";state.letter="";state.genre="";state.limit=60;$("#search-input").value="";$("#sort-select").value="alphabetical";document.querySelectorAll("[data-status]").forEach(b=>b.classList.toggle("active",b.dataset.status==="all"));render()}
function openGame(id){
 const g=games.find(x=>x.id===id);if(!g)return;
 const s=stats[g.id],pct=progress(g);
 $("#dialog-title").textContent=g.title;$("#dialog-kicker").textContent=letterOf(g)+" / "+statusLabel(g);
 $("#dialog-description").textContent=g.description||(g.title+" — "+g.genre+". "+(g.tags||[]).join(", ")+".");
 $("#dialog-tags").innerHTML='<span class="mini-tag">'+esc(g.genre)+'</span>'+(g.tags||[]).map(t=>'<span class="mini-tag">'+esc(t)+'</span>').join("");

 const seriesRules=[[/^Grand Theft Auto/i,"Grand Theft Auto"],[/^Forza Horizon/i,"Forza Horizon"],[/^Forza Motorsport/i,"Forza Motorsport"],[/^Half-Life/i,"Half-Life"],[/^Portal/i,"Portal"],[/^POSTAL/i,"POSTAL"],[/^Mafia/i,"Mafia"],[/^Just Cause/i,"Just Cause"],[/^Max Payne/i,"Max Payne"],[/^Need for Speed/i,"Need for Speed"],[//^(Rise of the Tomb Raider|Shadow of the Tomb Raider|Tomb Raider)/i,"Tomb Raider"],[/^The Sims/i,"The Sims"],[/^The Simpsons/i,"The Simpsons"],[/^Far Cry/i,"Far Cry"],[/^Metro/i,"Metro"],[/^The Last of Us/i,"The Last of Us"],[/^Uncharted/i,"Uncharted"],[/^Red Dead Redemption/i,"Red Dead Redemption"],[/^Watch Dogs/i,"Watch Dogs"],[/^Assassin's Creed/i,"Assassin's Creed"],[/^Resident Evil/i,"Resident Evil"],[/^Battlefield/i,"Battlefield"],[/^Call of Duty/i,"Call of Duty"],[/^Dying Light/i,"Dying Light"],[/^Saints Row/i,"Saints Row"],[/^Alan Wake/i,"Alan Wake"],[/^The Crew/i,"The Crew"],[/^Kingdom Come/i,"Kingdom Come: Deliverance"]];
 const series=g.series||(seriesRules.find(rule=>rule[0].test(g.title))||[])[1]||"Отдельная игра";
 const details=[["Серия / франшиза",series],["Жанр",g.genre||"Не указан"],["Темы",(g.tags||[]).join(" · ")||"Не указаны"],["Источник",Number(g.appid)>0?"Steam · App ID "+g.appid:"Вне Steam / App ID не задан"]];
 $("#dialog-extra-info").innerHTML=details.map(([label,value])=>'<div class="dialog-detail"><small>'+esc(label)+'</small><b>'+esc(value)+'</b></div>').join("");

 $("#dialog-cover").style.backgroundImage=image(g)?'url("'+image(g)+'")':"linear-gradient(135deg,var(--surface2),var(--accent-soft))";
 $("#steam-link").href=g.appid?"https://store.steampowered.com/app/"+g.appid+"/":"https://store.steampowered.com/search/?term="+encodeURIComponent(g.title);
 $("#dialog-stats").innerHTML=s?'<div class="dialog-stat"><span>Время в игре</span><b>'+(s.hoursEstimated===false?'':'≈ ')+s.hours+' ч</b><small>'+(s.hoursEstimated===false?'Steam':'оценка')+'</small></div><div class="dialog-stat"><span>Достижения</span><b>'+(pct===null?'—':s.achievements+' / '+s.total)+'</b><small>'+(pct===null?'нет данных':(s.achievementsEstimated===false?'Steam':'примерно')+' '+pct+'%')+'</small></div><div class="dialog-stat"><span>Статус</span><b>'+ (completed(g)?"Завершена":played(g)?"Играл":"В списке")+'</b><small>по личной истории</small></div>':'<div class="dialog-stat"><span>Личная статистика</span><b>Нет данных</b><small>игра пока не отмечена</small></div>';
 const dialog=$("#game-dialog");if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");
}

function updateNowPlaying(payload){
 const root=$("#now-playing-content");if(!root)return;
 const active=Array.isArray(payload.nowPlaying)?payload.nowPlaying:[];
 const now=Date.now();
 const memoryKey="gpd-now-playing-sessions-v1";
 let sessions={};try{sessions=JSON.parse(sessionStorage.getItem(memoryKey)||"{}")}catch{}
 const liveKeys=new Set(active.map(x=>String(x.steamid||"")+"-"+String(x.appid||"")));
 Object.keys(sessions).forEach(k=>{if(!liveKeys.has(k))delete sessions[k]});
 if(!active.length){
  root.innerHTML='<div class="now-playing-empty"><span class="now-playing-symbol">Ⅱ</span><div><b>Сейчас не играет</b><p>В публичном статусе Steam ни на одном из подключённых аккаунтов не отображается запущенная игра.</p></div></div>';
  try{sessionStorage.setItem(memoryKey,JSON.stringify(sessions))}catch{}return;
 }
 active.forEach(x=>{const k=String(x.steamid||"")+"-"+String(x.appid||"");if(!sessions[k])sessions[k]={startedAt:now};});
 try{sessionStorage.setItem(memoryKey,JSON.stringify(sessions))}catch{}
 const duration=ms=>{const m=Math.max(0,Math.floor(ms/60000));return m<60?m+" мин":Math.floor(m/60)+" ч "+(m%60)+" мин"};
 root.innerHTML=active.map(x=>{
  const k=String(x.steamid||"")+"-"+String(x.appid||"");const elapsed=now-(sessions[k]?.startedAt||now);
  const game=games.find(g=>String(g.appid)===String(x.appid));
  const art=game&&game.appid?"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/"+game.appid+"/header.jpg":"";
  const cover=art?'<img src="'+art+'" alt="" loading="lazy" onerror="this.style.display=\'none\'">':'';
  return '<article class="now-playing-card"><div class="now-playing-cover">'+cover+'<span>ИГРАЕТ СЕЙЧАС</span></div><div class="now-playing-details"><div class="now-playing-account">'+esc(x.personaName||"Steam")+'</div><h3>'+esc(x.gameName||"Неизвестная игра")+'</h3><div class="now-playing-metrics"><div><small>На странице</small><b>'+duration(elapsed)+'</b></div><div><small>Всего в Steam</small><b>'+(Number.isFinite(Number(x.totalHours))?Number(x.totalHours).toLocaleString("ru-RU",{maximumFractionDigits:1})+" ч":"—")+'</b></div></div>'+(game?'<a class="now-playing-link" href="#collection" data-now-game="'+esc(game.id)+'">Открыть игру в библиотеке ↗</a>':'<a class="now-playing-link" href="https://store.steampowered.com/app/'+encodeURIComponent(x.appid||"")+'/" target="_blank" rel="noreferrer">Страница в Steam ↗</a>')+'</div></article>';
 }).join("");
}

function setupSteamSync(){
 const button=$("#steam-sync"),status=$("#steam-sync-status"),stateEl=$("#steam-state");
 if(!button||!status||!stateEl)return;
 const endpoint=String(window.STEAM_SYNC_ENDPOINT||"").trim();
 if(!endpoint){button.addEventListener("click",()=>{status.textContent="Нужно развернуть worker/steam-sync.js на Cloudflare и указать URL Worker в js/config.js. API-ключ в браузер не вставлять.";status.classList.add("sync-warning")});return}
 const pollPresence=async()=>{
  try{const u=new URL(endpoint);u.searchParams.set("mode","presence");const r=await fetch(u.toString(),{headers:{Accept:"application/json"},cache:"no-store"});const p=await r.json();if(r.ok&&Array.isArray(p.nowPlaying))updateNowPlaying(p)}catch(_){}
 };
 pollPresence();window.setInterval(pollPresence,60*1000);
 const sync=async()=>{
  button.disabled=true;button.textContent="↻ Синхронизация…";
  try{
   const response=await fetch(endpoint,{headers:{Accept:"application/json"},cache:"no-store"});
   const payload=await response.json();
   if(!response.ok||!Array.isArray(payload.games))throw new Error(payload.error||("HTTP "+response.status));
   let updated=0;
   payload.games.forEach(item=>{
    const game=games.find(g=>String(g.appid)===String(item.appid));if(!game)return;
    const previous=stats[game.id]||{};
    stats[game.id]={...previous,hours:Math.round((Number(item.playtimeMinutes)||0)/60*10)/10,hoursEstimated:false,source:"steam",completion:previous.completion||"playing"};
    if(Number.isFinite(item.achievements)&&Number.isFinite(item.total)&&item.total>0){stats[game.id].achievements=item.achievements;stats[game.id].total=item.total;stats[game.id].achievementsEstimated=false}else{stats[game.id].achievementsEstimated=previous.achievementsEstimated!==false}
    updated++;
   });
   if(!updated)throw new Error("В профиле не найдены игры из каталога");
   if(Array.isArray(payload.nowPlaying))updateNowPlaying(payload);
   liveSteam=true;stateEl.innerHTML="<i></i> Подключён · актуальные данные";
   status.textContent="Steam обновлён: "+updated+" игр. Часы реальные; достижения обновлены там, где Steam их отдаёт. "+new Date().toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"});
   const note=$("#stat-hours-note");if(note)note.textContent="реальные данные Steam";
   render();setupMotion();
  }catch(error){status.textContent="Не удалось синхронизировать: "+error.message;status.classList.add("sync-warning");stateEl.innerHTML="<i></i> Нет соединения"}
  finally{button.disabled=false;button.textContent="↻ Синхронизировать"}
 };
 button.addEventListener("click",sync);sync();window.setInterval(()=>{if(!button.disabled)sync()},30*60*1000);
}
window.GPD_IMAGE_FALLBACK=function(img){
 const id=String(img.dataset.appid||"");const n=Number(img.dataset.attempt||0);
 const title=img.dataset.title||"GAME";const genre=img.dataset.genre||"GAME LIBRARY";
 const urls=id&&Number(id)>0?["https://cdn.akamai.steamstatic.com/steam/apps/"+id+"/header.jpg","https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/"+id+"/header.jpg","https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/"+id+"/library_600x900.jpg"]:[];
 if(n<urls.length){img.dataset.attempt=String(n+1);img.src=urls[n];return}
 const safe=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
 const label=safe(title);const kind=safe(genre).slice(0,35);
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="460" height="215" viewBox="0 0 460 215"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#17212b"/><stop offset=".55" stop-color="#344a5b"/><stop offset="1" stop-color="#11151b"/></linearGradient><pattern id="p" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M22 0H0V22" fill="none" stroke="#fff" stroke-opacity=".08"/></pattern></defs><rect width="460" height="215" fill="url(#g)"/><rect width="460" height="215" fill="url(#p)"/><path d="M-20 200L170 10h85L65 200zM240 220L460 0v90L330 220z" fill="#b7d7e8" fill-opacity=".12"/><text x="24" y="36" fill="#b7d7e8" font-family="monospace" font-size="10" letter-spacing="3">GERMAN / GPD · ARCHIVE</text><text x="24" y="137" fill="#fff" font-family="Arial,sans-serif" font-weight="700" font-size="'+(title.length>27?21:29)+'">'+label+'</text><text x="25" y="171" fill="#b7d7e8" font-family="monospace" font-size="12" letter-spacing="2">'+kind+'</text><rect x="24" y="188" width="56" height="3" fill="#b7d7e8"/></svg>';
 img.onerror=null;img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);img.classList.add("generated-cover");
};
function setupMotion(){
 if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window))return;
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.08});
 document.querySelectorAll(".game-card,.stat-card,.integration-card,.sidebar-block").forEach((el,i)=>{el.classList.add("motion-in");el.style.setProperty("--motion-delay",Math.min(i%8,7)*45+"ms");observer.observe(el)});
}

function themeLabel(){
 const media=window.matchMedia("(prefers-color-scheme: dark)"),update=()=>{$("#theme-label").textContent=media.matches?"Тёмная тема":"Светлая тема";const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=media.matches?"#0d0f12":"#f4f5f7"};
 update();if(media.addEventListener)media.addEventListener("change",update);else if(media.addListener)media.addListener(update);
}
function setGenre(g){state.genre=state.genre===g?"":g;state.limit=200;render();$("#collection").scrollIntoView({behavior:"smooth",block:"start"})}
$("#search-input").addEventListener("input",e=>{state.query=e.target.value;state.limit=200;render()});
$("#status-filters").addEventListener("click",e=>{const b=e.target.closest("[data-status]");if(!b)return;state.status=b.dataset.status;document.querySelectorAll("[data-status]").forEach(x=>x.classList.toggle("active",x===b));state.limit=200;render()});
$("#sort-select").addEventListener("change",e=>{state.sort=e.target.value;render()});
$("#show-more").addEventListener("click",()=>{state.limit+=60;render()});
$("#reset-filters").addEventListener("click",reset);
$("#active-filters").addEventListener("click",e=>{const b=e.target.closest("[data-clear]");if(!b)return;const k=b.dataset.clear;if(k==="query"){state.query="";$("#search-input").value=""}if(k==="letter")state.letter="";if(k==="genre")state.genre="";if(k==="status"){state.status="all";document.querySelectorAll("[data-status]").forEach(x=>x.classList.toggle("active",x.dataset.status==="all"))}render()});
[sections,genreGrid,$("#genre-grid-secondary"),alphabetGrid].forEach(root=>root.addEventListener("click",e=>{const card=e.target.closest("[data-game]");if(card){openGame(card.dataset.game);return}const g=e.target.closest("[data-genre]");if(g){setGenre(g.dataset.genre);return}const l=e.target.closest("[data-letter]");if(l){state.letter=state.letter===l.dataset.letter?"":l.dataset.letter;state.limit=200;render();$("#collection").scrollIntoView({behavior:"smooth",block:"start"})}}));
sections.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-game]")){e.preventDefault();openGame(e.target.dataset.game)}});
$("#dialog-close").addEventListener("click",()=>$("#game-dialog").close());
$("#dialog-close-bottom").addEventListener("click",()=>$("#game-dialog").close());
$("#game-dialog").addEventListener("click",e=>{if(e.target===$("#game-dialog"))$("#game-dialog").close()});
document.addEventListener("keydown",e=>{if(e.key==="/"&&!["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)){e.preventDefault();$("#search-input").focus()}if(e.key==="Escape"&&$("#game-dialog").open)$("#game-dialog").close()});
themeLabel();render();setupSteamSync();setupMotion();
document.querySelector("#now-playing-content")?.addEventListener("click",e=>{const a=e.target.closest("[data-now-game]");if(a){e.preventDefault();openGame(a.dataset.nowGame);document.querySelector("#collection")?.scrollIntoView({behavior:"smooth",block:"start"})}});
})();