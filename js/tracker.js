(() => {
"use strict";
const $ = (s) => document.querySelector(s);
const TRACK_KEY = "german-games-tracker-v1";
const STEAM_KEY = "german-games-steam-settings-v1";
const completionLabels = {unplayed:"Не проходил",playing:"Играю",completed:"Прошёл","completed-100":"100% / все ачивки"};
let tracker = {};
let settings = {profile:"", endpoint:""};
let activeGame = null;
const games = () => Array.isArray(window.GAMES) ? window.GAMES : [];
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || "null") || fallback; } catch (_) { return fallback; } };
const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} };
function summary() {
  const got = Math.max(0, Number($("#achievements-input").value) || 0);
  const total = Math.max(0, Number($("#achievements-total-input").value) || 0);
  $("#tracker-summary").textContent = total ? "Ачивки: " + Math.min(100, Math.round(got / total * 100)) + "% · " + got + " из " + total : "Укажи общее число ачивок, чтобы видеть прогресс.";
}
function currentGame() {
  const title = $("#dialog-title")?.textContent;
  return games().find(g => g.title === title) || null;
}
function loadGame() {
  activeGame = currentGame();
  if (!activeGame) return;
  const s = tracker[activeGame.id] || {};
  $("#playtime-input").value = s.hours ?? "";
  $("#achievements-input").value = s.achievements ?? "";
  $("#achievements-total-input").value = s.total ?? "";
  $("#completion-input").value = s.completion || "unplayed";
  summary();
}
function refreshCard(id) {
  const card = document.querySelector('[data-game="' + CSS.escape(id) + '"]');
  if (!card) return;
  card.querySelector(".personal-meta")?.remove();
  const s = tracker[id];
  if (!s || (!(Number(s.hours) > 0) && !(Number(s.total) > 0) && (!s.completion || s.completion === "unplayed"))) return;
  const meta = document.createElement("div");
  meta.className = "personal-meta";
  if (Number(s.hours) > 0) { const el = document.createElement("span"); el.textContent = "◷ " + s.hours + " ч"; meta.append(el); }
  if (Number(s.total) > 0) { const el = document.createElement("span"); el.textContent = "◆ " + (s.achievements || 0) + "/" + s.total; meta.append(el); }
  if (s.completion && s.completion !== "unplayed") { const el = document.createElement("span"); el.textContent = completionLabels[s.completion] || s.completion; meta.append(el); }
  card.querySelector(".game-info")?.append(meta);
}
function refreshAllCards() { games().forEach(g => refreshCard(g.id)); }
function saveGame() {
  if (!activeGame) return;
  const hours = Math.max(0, Math.min(100000, Number($("#playtime-input").value) || 0));
  const achievements = Math.max(0, Math.min(10000, Math.floor(Number($("#achievements-input").value) || 0)));
  const total = Math.max(0, Math.min(10000, Math.floor(Number($("#achievements-total-input").value) || 0)));
  if (total && achievements > total) { $("#tracker-summary").textContent = "Полученных ачивок не может быть больше общего количества."; return; }
  tracker[activeGame.id] = {hours, achievements, total, completion:$("#completion-input").value};
  write(TRACK_KEY, tracker);
  if (["completed","completed-100"].includes(tracker[activeGame.id].completion)) {
    activeGame.status = "played";
    const statuses = read("german-games-status", {});
    statuses[activeGame.id] = "played";
    write("german-games-status", statuses);
  }
  refreshCard(activeGame.id);
  const search = $("#search-input");
  if (search) search.dispatchEvent(new Event("input", {bubbles:true}));
  $("#game-dialog").close();
}
async function connectSteam() {
  const profile = $("#steam-profile").value.trim();
  const endpoint = $("#steam-endpoint").value.trim();
  if (!profile) { $("#steam-status-title").textContent = "Нужна ссылка на Steam-профиль"; $("#steam-status-text").textContent = "Вставь публичную ссылку на свой профиль."; return; }
  if (!/^https:\/\/steamcommunity\.com\/(id|profiles)\//i.test(profile)) { $("#steam-status-title").textContent = "Проверь ссылку"; $("#steam-status-text").textContent = "Нужна ссылка steamcommunity.com/id/... или /profiles/...."; return; }
  settings = {profile, endpoint}; write(STEAM_KEY, settings);
  if (!endpoint) { $("#steam-status-title").textContent = "Профиль сохранён · API не настроен"; $("#steam-status-text").textContent = "Для текущей игры и автосинхронизации нужен серверный API-посредник."; return; }
  try {
    const response = await fetch(endpoint, {headers:{Accept:"application/json"}});
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    $("#steam-status-title").textContent = data.personaname ? "Steam подключён: " + data.personaname : "API отвечает";
    $("#steam-status-text").textContent = data.gameextrainfo ? "Сейчас играет: " + data.gameextrainfo : "Профиль доступен; сейчас игра не отображается.";
    const now = $("#now-playing"); now.hidden = !data.gameextrainfo; now.textContent = data.gameextrainfo ? "▶ Сейчас играет: " + data.gameextrainfo : "";
  } catch (_) { $("#steam-status-title").textContent = "Не удалось подключиться"; $("#steam-status-text").textContent = "Проверь адрес API, CORS и доступность сервера."; }
}
function exportStats() {
  const payload = {schema:1, exportedAt:new Date().toISOString(), tracker, statuses:Object.fromEntries(games().map(g=>[g.id,g.status])), steamProfile:settings.profile || ""};
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)], {type:"application/json"}));
  const a = document.createElement("a"); a.href = url; a.download = "german-games-library-stats.json"; a.click(); URL.revokeObjectURL(url);
}
function importStats(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (data.schema !== 1 || !data.tracker || typeof data.tracker !== "object") throw new Error("format");
      tracker = data.tracker;
      const statuses = read("german-games-status", {});
      Object.entries(data.statuses || {}).forEach(([id,status]) => { if (games().some(g=>g.id===id) && ["played","known","candidate"].includes(status)) { const game=games().find(g=>g.id===id); game.status=status; statuses[id]=status; } });
      write(TRACK_KEY,tracker); write("german-games-status",statuses);
      refreshAllCards();
      $("#steam-status-title").textContent = "Статистика импортирована";
      $("#steam-status-text").textContent = "Данные восстановлены из JSON-файла.";
      $("#search-input").dispatchEvent(new Event("input",{bubbles:true}));
    } catch (_) { $("#steam-status-title").textContent = "Не удалось импортировать"; $("#steam-status-text").textContent = "Файл повреждён или имеет неподходящий формат."; }
  };
  reader.readAsText(file);
}
function init() {
  tracker = read(TRACK_KEY, {});
  settings = read(STEAM_KEY, {profile:"",endpoint:""});
  $("#steam-profile").value = settings.profile || "";
  $("#steam-endpoint").value = settings.endpoint || "";
  if (settings.profile) { $("#steam-status-title").textContent = "Steam-профиль сохранён"; $("#steam-status-text").textContent = "Нажми «Проверить подключение», чтобы обновить статус."; }
  $("#save-tracker").addEventListener("click", saveGame);
  ["#achievements-input","#achievements-total-input"].forEach(s=>$(s).addEventListener("input",summary));
  $("#steam-connect").addEventListener("click",connectSteam);
  $("#steam-disconnect").addEventListener("click",()=>{settings={profile:"",endpoint:""};write(STEAM_KEY,settings);$("#steam-profile").value="";$("#steam-endpoint").value="";$("#steam-status-title").textContent="Steam не подключён";$("#steam-status-text").textContent="Настройки подключения очищены.";$("#now-playing").hidden=true;});
  $("#export-stats").addEventListener("click",exportStats);
  $("#import-stats").addEventListener("change",e=>{importStats(e.target.files[0]);e.target.value="";});
  const dialog = $("#game-dialog");
  new MutationObserver(()=>{if(dialog.open)loadGame();}).observe(dialog,{attributes:true,attributeFilter:["open"]});
  $("#game-dialog").addEventListener("click",e=>{if(e.target.closest("#dialog-close"))activeGame=null;});
  new MutationObserver(refreshAllCards).observe($("#game-sections"),{childList:true});
  refreshAllCards();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",init); else init();
})();