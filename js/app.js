(() => {
"use strict";
const games=Array.isArray(window.GAMES)?window.GAMES:[];
const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const genreItems=[
{name:"Открытый мир",mark:"OW",icon:"⌖",desc:"Свобода и исследование"},
{name:"Гонки",mark:"GT",icon:"↗",desc:"Скорость и автомобили"},
{name:"Криминал",mark:"CR",icon:"◈",desc:"Истории улиц"},
{name:"Шутеры",mark:"FPS",icon:"＋",desc:"Экшен и драйв",match:"Шутер"},
{name:"Приключения",mark:"ADV",icon:"✦",desc:"Сюжет и открытия",match:"Приключение"},
{name:"Хорроры",mark:"HR",icon:"◒",desc:"Напряжение и мистика",match:"Хоррор"},
{name:"Симуляторы",mark:"SIM",icon:"▦",desc:"Погружение в процесс",match:"Симулятор"},
{name:"Головоломки",mark:"PUZ",icon:"⌘",desc:"Логика и механики",match:"Головоломка"}
];
const state={query:"",status:"all",letter:"",genre:"",sort:"alphabetical",limit:60};
const $=s=>document.querySelector(s);
const alphabetGrid=$("#alphabet-grid"),genreGrid=$("#genre-grid"),sections=$("#game-sections");
const clean=v=>String(v||"").toLocaleLowerCase("ru").replace(/[’']/g,"").trim();
const letterOf=g=>(g.letter||g.title.charAt(0)).toUpperCase();
const played=g=>g.status==="played",known=g=>g.status==="known"||played(g);
const image=g=>g.appid?"https://cdn.akamai.steamstatic.com/steam/apps/"+g.appid+"/header.jpg":"";
const escapeHtml=v=>String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const statusLabel=g=>played(g)?"ИГРАЛ":known(g)?"ЗНАЮ":"В СПИСКЕ";
const statusText=g=>played(g)?"Играл / проходил":known(g)?"Знакомая игра":"Рекомендация";
function renderAlphabet(){
 alphabetGrid.innerHTML=alphabet.map(l=>{const n=games.filter(g=>letterOf(g)===l).length;return '<button class="letter-button'+(n?' has-games':'')+(state.letter===l?' selected':'')+'" data-letter="'+l+'" aria-label="'+l+', '+n+' игр"'+(n?"":" disabled")+'><span>'+l+'</span><small>'+n+'</small></button>'}).join("");
}
function renderGenres(){
 genreGrid.innerHTML=genreItems.map(item=>{const match=item.match||item.name;const n=games.filter(g=>g.genre===match||(g.tags||[]).includes(match)).length;return '<button class="genre-card'+(state.genre===match?' active':'')+'" data-genre="'+escapeHtml(match)+'" data-mark="'+item.mark+'"><span class="genre-icon">'+item.icon+'</span><strong>'+item.name+'</strong><small>'+item.desc+' · '+n+'</small></button>'}).join("");
}
function filteredGames(){
 const q=clean(state.query);
 const result=games.filter(g=>{
  if(state.status==="known"&&!known(g))return false;
  if(state.status==="played"&&!played(g))return false;
  if(state.status==="candidate"&&known(g))return false;
  if(state.letter&&letterOf(g)!==state.letter)return false;
  if(state.genre&&g.genre!==state.genre&&!(g.tags||[]).includes(state.genre))return false;
  if(q&&!clean([g.title,g.genre,...(g.tags||[])].join(" ")).includes(q))return false;
  return true;
 });
 result.sort((a,b)=>{if(state.sort==="popular"&&!!a.featured!==!!b.featured)return a.featured?-1:1;return a.title.localeCompare(b.title,"en",{sensitivity:"base"})});
 return result;
}
function card(g){
 const url=image(g),label=statusLabel(g),tags=(g.tags||[]).slice(0,2).map(t=>'<span class="mini-tag">'+escapeHtml(t)+'</span>').join("");
 const initials=escapeHtml((g.title||"G").split(/[\s:–-]+/).slice(0,2).map(s=>s[0]||"").join("").toUpperCase());
 const poster=url?'<img loading="lazy" src="'+url+'" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.hidden=false"><span class="poster-fallback" hidden>'+initials+'</span>':'<span class="poster-fallback">'+initials+'</span>';
 return '<article class="game-card" tabindex="0" role="button" data-game="'+escapeHtml(g.id)+'" aria-label="Подробнее: '+escapeHtml(g.title)+'"><div class="game-poster">'+poster+'<span class="status-badge'+(played(g)?" played":"")+'">'+label+'</span>'+(g.featured?'<span class="favorite-mark" aria-label="Избранное">✦</span>':"")+'</div><div class="game-info"><h3 class="game-title">'+escapeHtml(g.title)+'</h3><div class="game-meta"><span class="game-genre">'+escapeHtml(g.genre)+'</span></div><div class="game-tags">'+tags+'</div></div></article>';
}
function renderFilters(){
 const chips=[];
 if(state.query)chips.push(["Поиск: "+state.query,"query"]);
 if(state.letter)chips.push(["Буква: "+state.letter,"letter"]);
 if(state.genre)chips.push(["Жанр: "+state.genre,"genre"]);
 if(state.status!=="all")chips.push(["Статус: "+(state.status==="known"?"Знаю":state.status==="played"?"Играл":"В списке"),"status"]);
 const el=$("#active-filters");el.hidden=!chips.length;
 el.innerHTML=chips.map(([label,key])=>'<span class="filter-chip">'+escapeHtml(label)+'<button data-clear="'+key+'" aria-label="Сбросить фильтр">×</button></span>').join("");
}
function render(){
 const all=filteredGames(),shown=all.slice(0,state.limit),groups={};
 shown.forEach(g=>{const l=letterOf(g);(groups[l]||(groups[l]=[])).push(g)});
 sections.innerHTML=Object.keys(groups).sort().map(l=>'<section class="game-group" id="letter-'+l+'"><div class="group-head"><span class="group-letter">'+l+'</span><span class="group-title">Игры на '+l+'</span><span class="group-count">'+groups[l].length+' игр</span></div><div class="game-grid">'+groups[l].map(card).join("")+'</div></section>').join("");
 $("#stat-total").textContent=games.length;$("#stat-known").textContent=games.filter(known).length;$("#stat-played").textContent=games.filter(played).length;$("#visible-count").textContent=all.length;
 $("#result-note").textContent=all.length?"Показано "+shown.length+" из "+all.length+" игр":"Нет игр по заданным условиям";
 $("#show-more").hidden=all.length<=shown.length;$("#empty-state").hidden=all.length!==0;
 renderFilters();renderAlphabet();renderGenres();
}
function reset(){
 state.query="";state.status="all";state.letter="";state.genre="";state.limit=60;
 $("#search-input").value="";$("#sort-select").value="alphabetical";
 document.querySelectorAll("[data-status]").forEach(b=>b.classList.toggle("active",b.dataset.status==="all"));render();
}
function openGame(id){
 const g=games.find(x=>x.id===id);if(!g)return;
 $("#dialog-title").textContent=g.title;$("#dialog-kicker").textContent=letterOf(g)+" / "+statusText(g).toUpperCase();
 $("#dialog-description").textContent=g.description||(g.title+" — "+g.genre+". "+(g.tags||[]).join(", ")+".");
 $("#dialog-tags").innerHTML='<span class="mini-tag">'+escapeHtml(g.genre)+'</span>'+(g.tags||[]).map(t=>'<span class="mini-tag">'+escapeHtml(t)+'</span>').join("");
 $("#dialog-cover").style.backgroundImage=image(g)?'url("'+image(g)+'")':"linear-gradient(135deg,var(--surface2),var(--accentSoft))";
 $("#steam-link").href=g.appid?"https://store.steampowered.com/app/"+g.appid+"/":"https://store.steampowered.com/search/?term="+encodeURIComponent(g.title);
 const btn=$("#toggle-known");btn.textContent=g.status==="played"?"Уже отмечена: играл":g.status==="known"?"Убрать отметку «Знаю»":"Отметить как знакомую";btn.disabled=g.status==="played";btn.dataset.game=id;
 const dialog=$("#game-dialog");if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");
}
function toggleKnown(id){
 const g=games.find(x=>x.id===id);if(!g||g.status==="played")return;
 g.status=g.status==="known"?"candidate":"known";
 try{const saved=JSON.parse(localStorage.getItem("german-games-status")||"{}");saved[id]=g.status;localStorage.setItem("german-games-status",JSON.stringify(saved))}catch(_){}
 $("#game-dialog").close();render();
}
function loadSaved(){
 // Keep the catalog as the source of truth for games already marked as played.
 // Older browser storage could contain stale "candidate" values and hide most of the library.
 try{const saved=JSON.parse(localStorage.getItem("german-games-status")||"{}");games.forEach(g=>{if(g.status!=="played"&&(saved[g.id]==="known"||saved[g.id]==="candidate"))g.status=saved[g.id]})}catch(_){}
}
function themeLabel(){
 const media=window.matchMedia("(prefers-color-scheme: dark)"),update=()=>{$("#theme-label").textContent=media.matches?"Тёмная тема":"Светлая тема";const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=media.matches?"#111316":"#f4f5f7"};
 update();if(media.addEventListener)media.addEventListener("change",update);else if(media.addListener)media.addListener(update);
}
alphabetGrid.addEventListener("click",e=>{const b=e.target.closest("[data-letter]");if(!b)return;state.letter=state.letter===b.dataset.letter?"":b.dataset.letter;state.limit=200;render();$("#collection").scrollIntoView({behavior:"smooth",block:"start"})});
genreGrid.addEventListener("click",e=>{const b=e.target.closest("[data-genre]");if(!b)return;state.genre=state.genre===b.dataset.genre?"":b.dataset.genre;state.limit=200;render();$("#collection").scrollIntoView({behavior:"smooth",block:"start"})});
sections.addEventListener("click",e=>{const c=e.target.closest("[data-game]");if(c)openGame(c.dataset.game)});
sections.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-game]")){e.preventDefault();openGame(e.target.dataset.game)}});
$("#search-input").addEventListener("input",e=>{state.query=e.target.value;state.limit=200;render()});
$("#status-filters").addEventListener("click",e=>{const b=e.target.closest("[data-status]");if(!b)return;state.status=b.dataset.status;document.querySelectorAll("[data-status]").forEach(x=>x.classList.toggle("active",x===b));state.limit=200;render()});
$("#sort-select").addEventListener("change",e=>{state.sort=e.target.value;render()});
$("#show-more").addEventListener("click",()=>{state.limit+=60;render()});
$("#reset-filters").addEventListener("click",reset);
$("#active-filters").addEventListener("click",e=>{const b=e.target.closest("[data-clear]");if(!b)return;const k=b.dataset.clear;if(k==="query"){state.query="";$("#search-input").value=""}if(k==="letter")state.letter="";if(k==="genre")state.genre="";if(k==="status"){state.status="all";document.querySelectorAll("[data-status]").forEach(x=>x.classList.toggle("active",x.dataset.status==="all"))}render()});
$("#dialog-close").addEventListener("click",()=>$("#game-dialog").close());
$("#game-dialog").addEventListener("click",e=>{if(e.target===$("#game-dialog"))$("#game-dialog").close()});
$("#toggle-known").addEventListener("click",e=>toggleKnown(e.currentTarget.dataset.game));
document.addEventListener("keydown",e=>{if(e.key==="/"&&!["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)){e.preventDefault();$("#search-input").focus()}if(e.key==="Escape"&&$("#game-dialog").open)$("#game-dialog").close()});
loadSaved();themeLabel();render();
})();