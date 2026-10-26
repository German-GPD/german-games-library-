// Read-only statistics renderer. Personal stats are intentionally not editable on the website.
(() => {
 "use strict";
 const stats=window.GAME_STATS||{};
 window.GAME_LIBRARY_STATS={games:Object.keys(stats).length,completed:Object.values(stats).filter(s=>s.completion==="completed").length,estimated:true};
})();