# German'$ Games Library

Личная игровая библиотека German'$ Team Coding — адаптивный каталог с обложками в стиле Steam, алфавитом, жанрами, поиском и сводкой личной игровой истории.

**Сайт:** https://german-gpd.github.io/german-games-library-/

## Возможности

- Премиальный нейтральный интерфейс с автоматической светлой/тёмной темой устройства.
- Адаптивная главная страница с личным профилем и статистикой.
- Каталог игр с обложками, фильтрами, поиском, жанрами и A–Z.
- Карточки с примерным временем игры, прогрессом достижений и статусом завершения.
- Окно подробностей игры и переход на её страницу в Steam.
- Статистика только для чтения: сайт не предоставляет ручного редактирования часов, достижений и статусов.
- Предварительные часы и достижения помечены как оценки и не выдаются за реальные данные аккаунта.
- Никаких рекламных трекеров и сторонней аналитики.

## Интеграция со Steam

Для реальной синхронизации нужен публичный профиль Steam, видимые настройки «Данные об играх» и безопасный серверный посредник (например, Cloudflare Worker или небольшой backend). Steam Web API key хранится только в серверных секретах — никогда в JavaScript-файлах или настройках браузера. После подключения сервер может отдавать библиотеке проверенные часы и достижения.

Официальные материалы: [Steam Web API](https://steamcommunity.com/dev) и [Steamworks Web API overview](https://partner.steamgames.com/doc/webapi_overview).

## Интеграция с Hydra Launcher

У Hydra Launcher не обнаружен подтверждённый публичный облачный API для прямой синхронизации с GitHub Pages. Для настоящего импорта потребуется локальный помощник на ПК, который читает библиотеку/метаданные Hydra и передаёт только необходимые данные по локальному защищённому каналу. Доступ к файлам на ПК нельзя получить напрямую из обычной статической веб-страницы.

Проект Hydra: https://github.com/hydra-launcher/hydra

## Структура

- `index.html` — структура сайта.
- `css/style.css` — оформление и адаптивность.
- `js/app.js` — каталог, фильтры, карточки и окно игры.
- `js/games.js` — каталог и предварительная статистика.
- `js/tracker.js` — сводка статистики только для чтения.
- `assets/favicon.svg` — иконка.
- `LICENSE` — лицензия проекта.

## Лицензия

См. файл [LICENSE](LICENSE).


## Live Steam statistics (optional)

The catalogue starts with clearly marked estimates. To replace playtime with real Steam data:

1. In a terminal, open the repository folder and run `cd worker` then `npx wrangler deploy` (or deploy `worker/steam-sync.js` from the Cloudflare dashboard).
2. In the `worker` directory, run `npx wrangler secret put STEAM_API_KEY` and `npx wrangler secret put STEAM_ID64`. The second value is the 17-digit SteamID64. Never commit either secret to GitHub or put the API key in browser JavaScript.
3. Make your Steam profile and **Game details** public.
4. Set `window.STEAM_SYNC_ENDPOINT` in `js/config.js` to the deployed Worker URL.
5. Open the site and press **Синхронизировать**. The page fetches current playtime whenever it syncs. Achievement counts are requested for up to 25 most-played games; other games keep their previous estimate.

Discord presence can show the game currently being played only when activity sharing is enabled. It does not provide your full library, lifetime hours, or achievements, so Steam remains the right source for automatic statistics. Hydra has no documented public cloud endpoint for this static site.
