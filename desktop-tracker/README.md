# German'$ Game Tracker (Windows)

The tracker detects known running game processes and publishes the current game plus completed sessions to `data/games-db.json` in the repository. The website reads that JSON and displays the current title, Steam header image (when an app ID is known), and live session duration.

## First launch (one-time setup)

1. Download `German-Games-Tracker.exe` from the latest workflow/release.
2. Run it. On first launch it asks for a GitHub fine-grained personal access token.
3. Create the token at https://github.com/settings/personal-access-tokens/new and limit it to repository `German-GPD/german-games-library-` with **Contents: Read and write**. Paste it into the tracker. The token is stored locally in `%LOCALAPPDATA%\\GermanGamesTracker\\config.json`, not committed to the repository.
4. The app copies itself to `%LOCALAPPDATA%\\GermanGamesTracker\\German-Games-Tracker.exe` and creates a Windows Startup shortcut.

GitHub Pages deployment is asynchronous, so a new status may take a short time to appear on the public site. The tracker only commits when the game changes, not every polling interval.

## Process recognition

The tracker uses an explicit executable-name map, including `gta_sa.exe` and `playgtasanandreas.exe` for **Grand Theft Auto: San Andreas**. Unknown executables are ignored rather than mislabeled as a game. More aliases can be added in `tracker.py`.

## Data and privacy

- The public repository database stores the current game and up to 500 completed session records.
- No screenshots, keystrokes, full process list, or unrelated application names are uploaded.
- The token is stored locally on your PC. Do not share the token or the local config file.
- The public database is readable by anyone because the website is public. It contains game titles and session timestamps only.
- A GitHub token is required because GitHub Pages is static and cannot accept uploads directly. No Cloudflare account or server is used.

## Build

GitHub Actions builds the Windows executable automatically when `desktop-tracker/tracker.py` changes. To build locally with Python 3.12:

```powershell
python -m pip install pyinstaller
pyinstaller --noconfirm --clean --onefile --windowed --name "German-Games-Tracker" desktop-tracker/tracker.py
```
