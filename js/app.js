(() => {
"use strict";
const games=Array.isArray(window.GAMES)?window.GAMES:[];
const alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const $=s=>document.querySelector(s);
const sections=$("#game-sections"),alphabetGrid=$("#alphabet-grid"),genreGrid=$("#genre-grid");
const genres=[...new Set(games.map(g=>g.genre).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"ru"));
const state={query:"",status:"all",letter:"",genre:"",sort:"alphabetical",limit:60};
const statusByTitle=new Map();
const STATUS_LABELS={0:"НЕ ИГРАЛ",1:"ИГРАЛ",2:"ПОЧТИ ПРОШЁЛ",3:"ПРОЙДЕНА",4:"ВСЕ ДОСТИЖЕНИЯ"};
const gameStatus=g=>statusByTitle.get(clean(g.title))??(g.status==="played"?1:0);
const completed=g=>gameStatus(g)>=3;
const playedDays=new Set();let calendarCursor=new Date();calendarCursor.setDate(1);let selectedCalendarDay="";
const clean=v=>String(v||"").toLocaleLowerCase("ru").replace(/[’']/g,"").trim();
const letterOf=g=>(g.letter||g.title.charAt(0)).toUpperCase();

const esc=v=>String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const image=g=>g.cover||(g.appid&&Number(g.appid)>0?"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/"+g.appid+"/header.jpg":"");
function placeholderCover(g){
 const safe=s=>String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
 const title=String(g.title||"GAME"),genre=safe(g.genre||"GAME LIBRARY");
 const hue=(String(g.id||g.title).split("").reduce((n,c)=>n+c.charCodeAt(0),0)*17)%360;
 const words=title.split(/\s+/),lines=[];let line="";
 words.forEach(word=>{if((line+" "+word).trim().length>22&&line){lines.push(line);line=word}else line=(line+" "+word).trim()});
 if(line)lines.push(line);if(lines.length>4)lines.splice(4,lines.length-4);
 const titleSvg=lines.map((part,i)=>'<text x="36" y="'+(365+i*42)+'" fill="#fff" font-family="Arial,sans-serif" font-size="'+(part.length>20?23:30)+'" font-weight="700">'+safe(part)+'</text>').join("");
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="hsl('+hue+',70%,42%)"/><stop offset="1" stop-color="hsl('+((hue+65)%360)+',68%,12%)"/></linearGradient><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#fff" stroke-opacity=".07"/></pattern></defs><rect width="600" height="600" fill="url(#bg)"/><rect width="600" height="600" fill="url(#grid)"/><circle cx="505" cy="105" r="155" fill="#fff" fill-opacity=".1"/><path d="M-80 600L300 0h130L50 600zM250 650L650 180v170L410 650z" fill="#fff" fill-opacity=".08"/><rect x="36" y="42" width="54" height="5" rx="2.5" fill="#fff" fill-opacity=".85"/><text x="36" y="75" fill="#fff" fill-opacity=".78" font-family="monospace" font-size="13" letter-spacing="2">GERMAN / GPD</text><text x="36" y="112" fill="#fff" fill-opacity=".7" font-family="monospace" font-size="12" letter-spacing="3">GAME ARCHIVE</text>'+titleSvg+'<text x="36" y="545" fill="#fff" fill-opacity=".78" font-family="monospace" font-size="14" letter-spacing="2">'+genre.toUpperCase().slice(0,35)+'</text><rect x="36" y="562" width="70" height="4" rx="2" fill="#fff"/></svg>';
 return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
}
function readStatic(text){text.split(/\r?\n/).forEach(line=>{const s=line.trim();if(!s||s.startsWith("#"))return;const m=s.match(/^(.*?)\s*=\s*(0|1|2|3|4|true|false)\s*$/i);if(m){const raw=m[2].toLowerCase();statusByTitle.set(clean(m[1]),raw==="true"?3:raw==="false"?0:Number(raw))}})}
const descriptions={"gta-v":"Лос-Сантос — огромный открытый мир, криминальные истории и свобода исследовать город на любой машине.","gta-san-andreas":"Классическая криминальная история CJ: районы Сан-Андреаса, погони, задания и огромная свобода действий.","gta-vice-city":"Неоновые улицы Vice City, атмосфера 80-х и криминальный путь к вершине города.","gta-iv":"Мрачная история Нико Беллика о жизни, выборе и криминальном мире Либерти-Сити.","forza-horizon-5":"Фестивальные гонки по Мексике: сотни автомобилей, открытые дороги и свободное исследование мира.","forza-horizon-4":"Гоночный фестиваль в Британии с открытым миром, сезонными изменениями и большим автопарком.","cyberpunk-2077":"Ночной город — футуристический мегаполис, где решения, импланты и контракты формируют путь V.","red-dead-redemption-2":"Большое приключение банды Ван дер Линде на закате эпохи Дикого Запада.","sleeping-dogs":"Криминальный боевик в Гонконге, где полицейский под прикрытием балансирует между законом и триадами.","mafia-definitive":"Кинематографичная криминальная история о подъёме Томми Анджело в мафии Lost Heaven.","mafia-2-definitive":"Послевоенный город, криминальная карьера Вито Скалетты и атмосфера Америки середины XX века.","half-life-2":"Научно-фантастический шутер с напряжённой историей, физическими головоломками и исследованием мира.","portal-2":"Пространственные головоломки с порталами, фирменным юмором и кооперативным режимом.","far-cry-5":"Открытый мир Монтаны, сопротивление культу и свобода проходить задания разными способами.","far-cry-6":"Остров Яра, партизанская борьба и открытый мир под властью Антона Кастильо.","far-cry-primal":"Доисторический мир, охота, приручение зверей и борьба за выживание в долине Орос.","watch-dogs":"Хакер Эйден Пирс использует инфраструктуру Чикаго, чтобы вести собственную войну.","watch-dogs-2":"Сан-Франциско, хакерская группа DedSec и множество способов взламывать городские системы.","just-cause-3":"Огромный архипелаг, крюк-кошка, крылатый костюм и масштабный хаос.","metro-2033-redux":"Мрачное путешествие по тоннелям московского метро после ядерной катастрофы.","my-summer-car":"Хардкорный симулятор сборки автомобиля и жизни в финской глубинке.","my-winter-car":"Зимняя автомобильная рутина, техника и выживание в холодной финской глубинке.","minecraft":"Песочница, где можно строить, исследовать мир, добывать ресурсы и выживать.","the-forest":"Выживание на опасном острове, строительство убежища и исследование леса с его тайнами.","detroit":"Интерактивная научно-фантастическая драма, где решения меняют судьбы андроидов и людей.","resident-evil-2-remake":"Выживание в Раккун-Сити с исследованием локаций и нехваткой ресурсов.","god-of-war-ragnarok":"Мифологическое приключение Кратоса и Атрея на фоне приближающегося Рагнарёка.","spiderman-remastered":"Питер Паркер защищает Нью-Йорк, перемещаясь по городу на паутине."};
function descriptionFor(g){if(g.description&&g.description.length>150)return g.description;if(descriptions[g.id])return descriptions[g.id];const genre=g.genre||"приключение",tags=(g.tags||[]).slice(0,3).join(", ");const base={"Гонки":"Гоночная игра с автомобилями, заездами и настройкой машин.","Открытый мир":"Исследуй большой мир, выполняй задания и выбирай собственный путь.","Шутер":"Экшен с перестрелками, опасными противниками и продвижением по сюжету.","Приключение":"Приключение с исследованием, заданиями и собственной историей.","Приключения":"Приключение с исследованием, заданиями и собственной историей.","Экшен":"Динамичный экшен со сражениями и продвижением по уровням.","Симулятор":"Симуляция с упором на технику, повседневные задачи и самостоятельные решения.","RPG":"Ролевая игра с развитием персонажа, заданиями и исследованием мира.","Хоррор":"Напряжённая история с опасностями и борьбой за выживание."}[genre]||"Игра из личной коллекции с собственным стилем и игровыми механиками.";return base+" В этой игре тебя ждут "+(tags?tags.toLocaleLowerCase("ru"):"сюжетные задачи, исследование и развитие навыков")+". "+(g.appid&&Number(g.appid)>0?"Открой карточку, чтобы перейти к странице игры в Steam.":"Игра добавлена в личную библиотеку; ссылка на Steam может быть доступна через поиск по названию.");}
function setupHeroShowcase(){
 const slots=[...document.querySelectorAll(".hero-visual .cover-stack img")];
 const pool=games.filter(g=>g.appid&&Number(g.appid)>0&&!g.cover);
 if(pool.length<3)return;
 // Shuffle on every page load; the three slots always receive distinct games.
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
 slots.forEach((img,i)=>{
  const g=pool[i];if(!g)return;
  img.alt=g.title;img.dataset.title=g.title;img.dataset.genre=g.genre||"Игра";img.dataset.appid=String(g.appid);
  img.onerror=()=>{img.onerror=null;img.src=placeholderCover(g)};
  img.src=image(g);
 });
 document.querySelector(".hero-visual")?.classList.add("showcase-ready");
}
function renderGenres(){
 genreGrid.innerHTML=genres.map(name=>'<button class="genre-item'+(state.genre===name?' active':'')+'" data-genre="'+esc(name)+'"><span>'+esc(name)+'</span><small>'+games.filter(g=>g.genre===name).length+'</small></button>').join("");
 const secondary=$("#genre-grid-secondary");if(secondary)secondary.innerHTML=genres.map(name=>'<button class="genre-pill'+(state.genre===name?' active':'')+'" data-genre="'+esc(name)+'">'+esc(name)+' <span>'+games.filter(g=>g.genre===name).length+'</span></button>').join("");
}
function renderAlphabet(){alphabetGrid.innerHTML=alphabet.map(l=>{const n=games.filter(g=>letterOf(g)===l).length;return '<button class="letter-button'+(n?' has-games':'')+(state.letter===l?' selected':'')+'" data-letter="'+l+'" aria-label="'+l+', '+n+' игр"'+(n?"":" disabled")+'>'+l+'</button>'}).join("")}
function filteredGames(){
 const q=clean(state.query);
 const out=games.filter(g=>{
  if(state.status==="completed"&&!completed(g))return false;
  if(state.status==="unfinished"&&completed(g))return false;
  if(state.letter&&letterOf(g)!==state.letter)return false;
  if(state.genre&&g.genre!==state.genre&&!(g.tags||[]).includes(state.genre))return false;
  if(q&&!clean([g.title,g.genre,...(g.tags||[])].join(" ")).includes(q))return false;
  return true;
 });
 out.sort((a,b)=>{return a.title.localeCompare(b.title,"en",{sensitivity:"base"})});
 return out;
}
function card(g){
 const url=image(g),tags=(g.tags||[]).slice(0,2).map(t=>'<span class="mini-tag">'+esc(t)+'</span>').join("");
 const poster='<img class="game-cover" loading="lazy" src="'+(url||placeholderCover(g))+'" alt="" data-title="'+esc(g.title)+'" data-genre="'+esc(g.genre||"Игра")+'" data-appid="'+(g.appid||"")+'" onerror="window.GPD_IMAGE_FALLBACK&&window.GPD_IMAGE_FALLBACK(this)">';
 const progress=gameStatus(g),isDone=progress>=3;
 return '<article class="game-card" tabindex="0" role="button" data-game="'+esc(g.id)+'" aria-label="Подробнее: '+esc(g.title)+'"><div class="game-poster">'+poster+'<span class="status-badge status-'+progress+(isDone?" completed":"")+'">'+STATUS_LABELS[progress]+'</span>'+(g.cult?'<span class="favorite-mark" aria-label="Культовая игра">✦ КУЛЬТ</span>':"")+'</div><div class="game-info"><h3 class="game-title">'+esc(g.title)+'</h3><div class="game-meta"><span class="game-genre">'+esc(g.genre||"Игра")+'</span></div><div class="game-tags">'+tags+'</div><p class="game-summary">'+esc(descriptionFor(g))+'</p></div></article>';
}
function renderFilters(){
 const chips=[];if(state.query)chips.push(["Поиск: "+state.query,"query"]);if(state.letter)chips.push(["Буква: "+state.letter,"letter"]);if(state.genre)chips.push(["Жанр: "+state.genre,"genre"]);if(state.status!=="all")chips.push(["Статус: "+(state.status==="completed"?"Пройдены":"Не пройдены"),"status"]);
 const el=$("#active-filters");el.hidden=!chips.length;el.innerHTML=chips.map(([label,key])=>'<span class="filter-chip">'+esc(label)+'<button data-clear="'+key+'" aria-label="Сбросить фильтр">×</button></span>').join("");
}
function renderCalendar(){
 const monthEl=$("#calendar-month"),yearEl=$("#calendar-year"),daysEl=$("#calendar-days");if(!monthEl||!daysEl)return;
 const year=calendarCursor.getFullYear(),month=calendarCursor.getMonth();monthEl.textContent=new Intl.DateTimeFormat("ru-RU",{month:"long"}).format(calendarCursor);yearEl.textContent=year;
 const first=new Date(year,month,1),offset=(first.getDay()+6)%7,start=new Date(year,month,1-offset),today=new Date();let html="";
 for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const key=[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");const classes=["calendar-day",d.getMonth()!==month?"outside":"",d.toDateString()===today.toDateString()?"today":"",playedDays.has(key)?"played":"",selectedCalendarDay===key?"selected":""].filter(Boolean).join(" ");html+='<button class="'+classes+'" data-calendar-date="'+key+'" aria-label="'+key+(playedDays.has(key)?", игровой день":"")+'">'+d.getDate()+"</button>"}
 daysEl.innerHTML=html;$("#calendar-selected-label").textContent=selectedCalendarDay?(playedDays.has(selectedCalendarDay)?selectedCalendarDay+" · игровой день":selectedCalendarDay+" · нажми ещё раз, чтобы отметить игровой день"):"Нажми на дату, чтобы отметить игровой день";
}
function render(){
 const all=filteredGames(),shown=all,groups={};shown.forEach(g=>{const l=letterOf(g);(groups[l]||(groups[l]=[])).push(g)});
 sections.innerHTML=Object.keys(groups).sort().map(l=>'<section class="game-group" id="letter-'+l+'"><div class="group-head"><span class="group-letter">'+l+'</span><span class="group-title">На '+l+'</span><span class="group-count">'+groups[l].length+' игр</span></div><div class="game-grid">'+groups[l].map(card).join("")+'</div></section>').join("");
 $("#stat-total").textContent=games.length;$("#stat-completed").textContent=games.filter(completed).length;$("#visible-count").textContent=all.length;
 $("#result-note").textContent=all.length?"Показано "+shown.length+" из "+all.length+" игр":"Нет игр по заданным условиям";
 $("#empty-state").hidden=all.length!==0;renderFilters();renderAlphabet();renderGenres();renderCalendar();setupMotion();
}
function reset(){state.query="";state.status="all";state.letter="";state.genre="";state.limit=60;$("#search-input").value="";$("#sort-select").value="alphabetical";document.querySelectorAll("[data-status]").forEach(b=>b.classList.toggle("active",b.dataset.status==="all"));render()}
function openGame(id){
 const key=String(id||"").trim();const g=games.find(x=>String(x.id)===key);if(!g){console.warn("Game not found:",key);return}const progress=gameStatus(g),isDone=progress>=3,url=image(g);
 $("#dialog-cover").innerHTML=url?'<img src="'+url+'" alt="" data-appid="'+(g.appid||"")+'" data-title="'+esc(g.title)+'" data-genre="'+esc(g.genre||"Игра")+'" onerror="window.GPD_IMAGE_FALLBACK&&window.GPD_IMAGE_FALLBACK(this)">':'<img src="'+placeholderCover(g)+'" alt="">';
 $("#dialog-kicker").textContent=STATUS_LABELS[progress];$("#dialog-title").textContent=g.title;$("#dialog-description").textContent=descriptionFor(g);
 $("#dialog-tags").innerHTML='<span class="mini-tag">'+esc(g.genre||"Игра")+'</span>'+(g.tags||[]).map(t=>'<span class="mini-tag">'+esc(t)+'</span>').join("");
 $("#dialog-extra-info").innerHTML='<div><span>Статус</span><b>'+STATUS_LABELS[progress]+'</b></div><div><span>Культовая игра</span><b>'+(g.cult?"Да":"Нет")+'</b></div>';
 $("#dialog-stats").innerHTML="";$(".dialog-note").textContent="Статус прохождения хранится в game-static.txt.";
 $("#steam-link").href=g.appid&&Number(g.appid)>0&&g.id!=="gta-definitive-san-andreas"?"https://store.steampowered.com/app/"+encodeURIComponent(g.appid)+"/":"https://store.steampowered.com/search/?term="+encodeURIComponent(g.title);const dialog=$("#game-dialog");if(dialog.open)dialog.close();if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");
}
window.GPD_IMAGE_FALLBACK=function(img){
 const id=String(img.dataset.appid||""),n=Number(img.dataset.attempt||0);
 const urls=id&&Number(id)>0?[
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/"+id+"/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/"+id+"/header.jpg",
  "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/"+id+"/library_hero.jpg",
  "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/"+id+"/library_600x900.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/"+id+"/library_600x900.jpg"
 ]:[];
 if(n<urls.length){img.dataset.attempt=String(n+1);img.src=urls[n];return}
 img.onerror=null;img.classList.add("generated-cover");
 img.src=placeholderCover({id:img.dataset.title||"unknown",title:img.dataset.title||"GAME",genre:img.dataset.genre||"GAME LIBRARY"});
};
let motionObserver=null;function setupMotion(){if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window)){document.querySelectorAll(".motion-in").forEach(el=>el.classList.add("is-visible"));return}if(!motionObserver)motionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");motionObserver.unobserve(entry.target)}}),{threshold:.06,rootMargin:"0px 0px 40px 0px"});document.querySelectorAll(".game-card,.stat-card,.sidebar-block").forEach((el,i)=>{el.classList.add("motion-in");el.style.setProperty("--motion-delay",Math.min(i%6,5)*24+"ms");if(!el.classList.contains("is-visible"))motionObserver.observe(el)})}
function themeLabel(){const media=window.matchMedia("(prefers-color-scheme: dark)"),update=()=>{$("#theme-label").textContent=media.matches?"Тёмная тема":"Светлая тема";const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=media.matches?"#0d0f12":"#f4f5f7"};update();if(media.addEventListener)media.addEventListener("change",update);else if(media.addListener)media.addListener(update)}
function setGenre(g){state.genre=state.genre===g?"":g;state.limit=200;render();$("#collection").scrollIntoView({behavior:"smooth",block:"start"})}
$("#search-input").addEventListener("input",e=>{state.query=e.target.value;state.limit=200;render()});
$("#status-filters").addEventListener("click",e=>{const b=e.target.closest("[data-status]");if(!b)return;state.status=b.dataset.status;document.querySelectorAll("[data-status]").forEach(x=>x.classList.toggle("active",x===b));state.limit=200;render()});
$("#sort-select").addEventListener("change",e=>{state.sort=e.target.value;render()});$("#reset-filters").addEventListener("click",reset);
function pickRandomGame(){
 const list=filteredGames();if(!list.length)return;
 const g=list[Math.floor(Math.random()*list.length)];
 openGame(g.id);
}
$("#random-game")?.addEventListener("click",pickRandomGame);
$("#random-game-bottom")?.addEventListener("click",pickRandomGame);

$("#active-filters").addEventListener("click",e=>{const b=e.target.closest("[data-clear]");if(!b)return;const k=b.dataset.clear;if(k==="query"){state.query="";$("#search-input").value=""}if(k==="letter")state.letter="";if(k==="genre")state.genre="";if(k==="status"){state.status="all";document.querySelectorAll("[data-status]").forEach(x=>x.classList.toggle("active",x.dataset.status==="all"))}render()});
document.addEventListener("click",e=>{const c=e.target instanceof Element?e.target.closest("[data-game]"):null;if(c){e.preventDefault();openGame(c.getAttribute("data-game"));return}const root=e.target instanceof Element?e.target.closest("#genre-grid,#genre-grid-secondary,#alphabet-grid"):null;if(!root)return;const g=e.target.closest("[data-genre]");if(g){setGenre(g.dataset.genre);return}const l=e.target.closest("[data-letter]");if(l&&!l.disabled){state.letter=state.letter===l.dataset.letter?"":l.dataset.letter;state.limit=200;render();$("#collection").scrollIntoView({behavior:"smooth",block:"start"})}},true);
sections.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-game]")){e.preventDefault();openGame(e.target.dataset.game)}});
$("#calendar-prev")?.addEventListener("click",()=>{calendarCursor.setMonth(calendarCursor.getMonth()-1);renderCalendar()});
$("#calendar-next")?.addEventListener("click",()=>{calendarCursor.setMonth(calendarCursor.getMonth()+1);renderCalendar()});
$("#calendar-days")?.addEventListener("click",e=>{const b=e.target.closest("[data-calendar-date]");if(!b)return;const date=b.dataset.calendarDate;if(selectedCalendarDay===date){if(playedDays.has(date))playedDays.delete(date);else playedDays.add(date)}selectedCalendarDay=date;try{localStorage.setItem("gpd-played-days",JSON.stringify([...playedDays]))}catch(_){}renderCalendar()});
try{const saved=JSON.parse(localStorage.getItem("gpd-played-days")||"[]");if(Array.isArray(saved))saved.forEach(d=>{if(typeof d==="string"&&d.length===10&&d[4]==="-"&&d[7]==="-")playedDays.add(d)})}catch(_){}
$("#dialog-close").addEventListener("click",()=>$("#game-dialog").close());$("#dialog-close-bottom").addEventListener("click",()=>$("#game-dialog").close());$("#game-dialog").addEventListener("click",e=>{if(e.target===$("#game-dialog"))$("#game-dialog").close()});
document.addEventListener("keydown",e=>{if(e.key==="/"&& !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)){e.preventDefault();$("#search-input").focus()}if(e.key==="Escape"&&$("#game-dialog").open)$("#game-dialog").close()});
async function start(){try{const response=await fetch("game-static.txt?v=1",{cache:"no-store"});if(response.ok)readStatic(await response.text())}catch(_){}themeLabel();setupHeroShowcase();render()}start();
})();