// Interactive analytics for the personal library. Estimates are clearly labelled; local tracker data is opt-in.
(() => {
 "use strict";
 const stats=window.GAME_STATS||{};
 const games=Array.isArray(window.GAMES)?window.GAMES:[];
 window.GAME_LIBRARY_STATS={games:Object.keys(stats).length,completed:Object.values(stats).filter(s=>s.completion==="completed").length,estimated:true};
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const fmt=n=>Number(n||0).toLocaleString("ru-RU",{maximumFractionDigits:1});
 const css=`
 #analytics{padding:58px 0 10px}
 .an-head{display:flex;justify-content:space-between;align-items:end;gap:18px;margin-bottom:22px}
 .an-head h2{font-size:clamp(27px,3vw,38px);letter-spacing:-.05em;margin:10px 0 0}
 .an-head p{max-width:360px;color:var(--muted);font-size:12px;margin:0}
 .an-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:14px}
 .an-kpi,.an-panel{background:var(--surface);border:1px solid var(--line);border-radius:15px}
 .an-kpi{padding:18px 20px;min-height:112px}.an-kpi small{display:block;color:var(--muted);font-size:9px;letter-spacing:.12em;font-weight:800}
 .an-kpi strong{display:block;font-size:29px;letter-spacing:-.05em;margin:8px 0 3px}.an-kpi span{color:var(--muted);font-size:10px}
 .an-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
 .an-panel{padding:20px;min-width:0}.an-panel h3{font-size:13px;margin:0 0 5px}.an-sub{color:var(--muted);font-size:10px;margin-bottom:20px}
 .an-bars{display:grid;gap:13px}.an-bar-row{display:grid;grid-template-columns:minmax(70px,125px) 1fr 38px;align-items:center;gap:10px;font-size:10px}
 .an-bar-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--muted)}.an-bar-track{height:8px;border-radius:99px;background:var(--surface2);overflow:hidden}
 .an-bar-fill{height:100%;border-radius:99px;background:var(--accent);min-width:2px}.an-bar-value{text-align:right;font-variant-numeric:tabular-nums;font-weight:750}
 .an-donut-wrap{display:flex;align-items:center;gap:22px;min-height:180px}.an-donut{width:150px;height:150px;flex:0 0 150px}
 .an-legend{display:grid;gap:12px}.an-legend-row{display:flex;align-items:center;gap:8px;font-size:11px}.an-dot{width:9px;height:9px;border-radius:3px;background:var(--accent);flex-shrink:0}.an-legend-row small{color:var(--muted);margin-left:auto;padding-left:10px}
 .an-import{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:14px;padding:15px 17px;border:1px dashed var(--line);border-radius:13px}
 .an-import p{font-size:10px;color:var(--muted);margin:4px 0 0}.an-import input{max-width:230px;font-size:10px;color:var(--muted)}
 .an-local{display:grid;gap:9px;margin-top:14px}.an-local:empty{display:none}.an-local-row{display:flex;justify-content:space-between;gap:12px;font-size:11px;padding-bottom:8px;border-bottom:1px solid var(--line)}.an-local-row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--muted)}.an-local-row b{white-space:nowrap}
 .an-note{font-size:10px;color:var(--muted);margin-top:13px;line-height:1.65}
 @media(max-width:850px){.an-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.an-grid{grid-template-columns:1fr}}
 @media(max-width:540px){.an-head{align-items:start;flex-direction:column}.an-kpi{padding:14px}.an-kpi strong{font-size:24px}.an-panel{padding:15px}.an-donut-wrap{gap:12px}.an-donut{width:120px;height:120px;flex-basis:120px}}
 `;
 const style=document.createElement("style");style.textContent=css;document.head.appendChild(style);
 const section=document.createElement("section");section.className="section";section.id="analytics";
 section.innerHTML=`
 <div class="an-head"><div><div class="eyebrow">YOUR PLAYING PROFILE</div><h2>Игровая аналитика</h2></div><p>Статистика библиотеки, прогресс и любимые жанры. Оценочные значения не выдаются за реальные данные.</p></div>
 <div class="an-kpis" id="an-kpis"></div>
 <div class="an-grid">
  <article class="an-panel"><h3>Время по играм</h3><div class="an-sub" id="an-hours-caption">Топ игр по времени · предварительные оценки</div><div class="an-bars" id="an-hours"></div></article>
  <article class="an-panel"><h3>Структура библиотеки</h3><div class="an-sub">Распределение игр по личным отметкам</div><div class="an-donut-wrap" id="an-status"></div></article>
  <article class="an-panel"><h3>Любимые жанры</h3><div class="an-sub">Количество игр в каждом жанре</div><div class="an-bars" id="an-genres"></div></article>
  <article class="an-panel"><h3>Достижения</h3><div class="an-sub">Прогресс там, где для игры есть оценка</div><div class="an-bars" id="an-achievements"></div><p class="an-note">Steam-синхронизация может заменить оценочные часы и достижения доступными данными аккаунта, не меняя твой каталог и личные статусы.</p></article>
 </div>
 <div class="an-import"><div><b>Локальный трекер для Windows</b><p>Импортируй JSON из German'$ Game Tracker. Эти данные показываются отдельно и не меняют библиотеку.</p></div><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><a class="button primary" href="https://github.com/German-GPD/german-games-library-/releases/download/desktop-tracker-latest/German-Games-Tracker.exe">Скачать .EXE ↗</a><input id="an-import-file" type="file" accept=".json,application/json" aria-label="Импорт JSON трекера"></div></div>
 <div class="an-panel" style="margin-top:14px"><h3>Локальная активность с ПК</h3><div class="an-sub" id="an-local-caption">Пока нет импортированных данных</div><div class="an-local" id="an-local"></div></div>
 <p class="an-note">Приватность: сайт не отправляет импортированный файл на сервер. Импорт обрабатывается в этом браузере и сохраняется только локально.</p>`;
 const profile=document.querySelector("#profile");
 if(profile)profile.insertAdjacentElement("afterend",section);else document.querySelector("main")?.prepend(section);
 const nav=document.querySelector(".main-nav");
 if(nav&&!nav.querySelector('a[href="#analytics"]')){const a=document.createElement("a");a.href="#analytics";a.textContent="Статистика";nav.insertBefore(a,nav.querySelector('a[href="#integrations"]'));}
 const allHours=Object.values(stats).reduce((n,s)=>n+(Number(s.hours)||0),0);
 const completed=games.filter(g=>stats[g.id]?.completion==="completed").length;
 const played=games.filter(g=>g.status==="played").length;
 const estimates=Object.values(stats).some(s=>s.estimated===true||s.source==="estimate");
 document.querySelector("#an-kpis").innerHTML=[
  ["Игр в каталоге",games.length,"личная коллекция"],
  ["Отмечено завершёнными",completed,"по личным отметкам"],
  ["Часов в статистике",fmt(allHours),estimates?"есть предварительные оценки":"доступные данные"],
  ["С отметкой «играл»",played,"по каталогу"]
 ].map(([l,v,n])=>'<div class="an-kpi"><small>'+esc(l)+'</small><strong>'+esc(v)+'</strong><span>'+esc(n)+'</span></div>').join("");
 const hours=games.map(g=>({title:g.title,hours:Number(stats[g.id]?.hours)||0,real:stats[g.id]?.hoursEstimated===false||stats[g.id]?.estimated===false})).filter(g=>g.hours>0).sort((a,b)=>b.hours-a.hours).slice(0,7);
 const bars=(items,label,value,max)=>items.map(it=>'<div class="an-bar-row"><span class="an-bar-label" title="'+esc(label(it))+'">'+esc(label(it))+'</span><div class="an-bar-track"><div class="an-bar-fill" style="width:'+Math.max(1,(value(it)/Math.max(1,max))*100)+'%"></div></div><span class="an-bar-value">'+esc(fmt(value(it)))+'</span></div>').join("")||'<p class="an-note">Пока нет данных.</p>';
 document.querySelector("#an-hours").innerHTML=bars(hours,x=>x.title,x=>x.hours,Math.max(...hours.map(x=>x.hours),1));
 const byStatus=[{name:"Завершил",count:completed},{name:"Играл",count:games.filter(g=>g.status==="played"&&stats[g.id]?.completion!=="completed").length},{name:"В списке / знаю",count:games.filter(g=>g.status!=="played"&&stats[g.id]?.completion!=="completed").length}];
 const total=byStatus.reduce((n,x)=>n+x.count,0)||1,colors=["var(--accent)","var(--green)","var(--surface3)"];
 let offset=0;const circumference=2*Math.PI*48;
 const arcs=byStatus.map((x,i)=>{const len=x.count/total*circumference;const arc='<circle cx="60" cy="60" r="48" fill="none" stroke="'+colors[i]+'" stroke-width="14" stroke-dasharray="'+len+' '+(circumference-len)+'" stroke-dashoffset="'+(-offset)+'" transform="rotate(-90 60 60)"/>';offset+=len;return arc}).join("");
 document.querySelector("#an-status").innerHTML='<svg class="an-donut" viewBox="0 0 120 120" role="img" aria-label="Распределение игр по статусам">'+arcs+'<text x="60" y="57" text-anchor="middle" fill="var(--text)" font-size="21" font-weight="700">'+games.length+'</text><text x="60" y="73" text-anchor="middle" fill="var(--muted)" font-size="8">ИГР</text></svg><div class="an-legend">'+byStatus.map((x,i)=>'<div class="an-legend-row"><i class="an-dot" style="background:'+colors[i]+'"></i>'+esc(x.name)+'<small>'+x.count+'</small></div>').join("")+'</div>';
 const genreCounts={};games.forEach(g=>genreCounts[g.genre]=(genreCounts[g.genre]||0)+1);
 const genres=Object.entries(genreCounts).map(([name,count])=>({name,count})).sort((a,b)=>b.count-a.count).slice(0,7);
 document.querySelector("#an-genres").innerHTML=bars(genres,x=>x.name,x=>x.count,Math.max(...genres.map(x=>x.count),1));
 const achievements=games.map(g=>{const s=stats[g.id]||{};return {title:g.title,pct:Number(s.total)>0?Math.round(Number(s.achievements||0)/Number(s.total)*100):0,has:Number(s.total)>0,real:s.achievementsEstimated===false||s.estimated===false}}).filter(x=>x.has).sort((a,b)=>b.pct-a.pct).slice(0,7);
 document.querySelector("#an-achievements").innerHTML=bars(achievements,x=>x.title,x=>x.pct,100);
 let imported=[];try{imported=JSON.parse(localStorage.getItem("gpd-local-tracker-v1")||"[]")}catch{}
 const renderLocal=()=>{const box=document.querySelector("#an-local");box.innerHTML=imported.slice(0,15).map(x=>'<div class="an-local-row"><span title="'+esc(x.process)+'">'+esc(x.process)+'</span><b>'+esc(fmt(Number(x.hours)||Number(x.playtimeSeconds||0)/3600))+' ч</b></div>').join("");document.querySelector("#an-local-caption").textContent=imported.length?"Импортировано приложений: "+imported.length+" · хранится только в этом браузере":"Пока нет импортированных данных";};
 renderLocal();
 document.querySelector("#an-import-file").addEventListener("change",async e=>{const file=e.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());if(data.source!=="german-games-tracker"||!Array.isArray(data.games))throw new Error("Это не экспорт German'$ Game Tracker");imported=data.games.filter(x=>x&&typeof x.process==="string").map(x=>({process:x.process,hours:Number(x.hours)||Number(x.playtimeSeconds||0)/3600}));localStorage.setItem("gpd-local-tracker-v1",JSON.stringify(imported));renderLocal();document.querySelector("#an-local-caption").textContent="Импорт успешно выполнен · "+imported.length+" процессов";}catch(err){alert("Не удалось импортировать JSON: "+err.message)}e.target.value="";});
})();