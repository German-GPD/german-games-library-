(() => {
"use strict";
const games=Array.isArray(window.GAMES)?window.GAMES:[];
const stats=window.GAME_STATS||{};
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
const image=g=>g.appid?"https://cdn.akamai.steamstatic.com/steam/apps/"+g.appid+"/header.jpg":"";
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
 const poster=url?'<img loading="lazy" src="'+url+'" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.hidden=false"><span class="poster-fallback" hidden>'+initials+'</span>':'<span class="poster-fallback">'+initials+'</span>';
 const meta=s?'<div class="personal-meta"><div class="personal-meta-row"><span>Время</span><b>≈ '+s.hours+' ч</b></div>'+(pct===null?'<div class="personal-meta-row"><span>Достижения</span><b>Нет данных</b></div>':'<div><div class="personal-meta-row"><span>Ачивки</span><b>≈ '+pct+'%</b></div><div class="achievement-track"><span style="width:'+pct+'%"></span></div></div>')+'</div><div class="progress-note">ПРЕДВАРИТЕЛЬНАЯ ОЦЕНКА</div>':'';
 return '<article class="game-card" tabindex="0" role="button" data-game="'+esc(g.id)+'" aria-label="Подробнее: '+esc(g.title)+'"><div class="game-poster">'+poster+'<span class="status-badge'+(played(g)?" played":"")+(completed(g)?" completed":"")+'">'+statusLabel(g)+'</span>'+(g.featured?'<span class="favorite-mark" aria-label="Избранное">✦</span>':"")+'</div><div class="game-info"><h3 class="game-title">'+esc(g.title)+'</h3><div class="game-meta"><span class="game-genre">'+esc(g.genre)+'</span></div><div class="game-tags">'+tags+'</div>'+meta+'</div></article>';
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
 $("#stat-played").textContent=games.filter(played).length;
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
 $("#dialog-cover").style.backgroundImage=image(g)?'url("'+image(g)+'")':"linear-gradient(135deg,var(--surface2),var(--accent-soft))";
 $("#steam-link").href=g.appid?"https://store.steampowered.com/app/"+g.appid+"/":"https://store.steampowered.com/search/?term="+encodeURIComponent(g.title);
 $("#dialog-stats").innerHTML=s?'<div class="dialog-stat"><span>Время в игре</span><b>≈ '+s.hours+' ч</b><small>оценка</small></div><div class="dialog-stat"><span>Достижения</span><b>'+(pct===null?"—":s.achievements+" / "+s.total)+'</b><small>'+(pct===null?"нет данных":"примерно "+pct+"%")+'</small></div><div class="dialog-stat"><span>Статус</span><b>'+ (completed(g)?"Завершена":played(g)?"Играл":"В списке")+'</b><small>по личной истории</small></div>':'<div class="dialog-stat"><span>Личная статистика</span><b>Нет данных</b><small>игра пока не отмечена</small></div>';
 const dialog=$("#game-dialog");if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");
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
themeLabel();render();
})();