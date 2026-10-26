# German'$ Game Tracker (Windows)

Small Windows desktop app that tracks the foreground application every five seconds and records approximate active time locally. It does not take screenshots, record keystrokes, send data to a server, or run analytics.

## Download

After the GitHub Actions workflow **Build Windows tracker** finishes, open the run under **Actions** and download the **German-Games-Tracker-Windows** artifact. Extract the ZIP and run `German-Games-Tracker.exe`.

## Data and privacy

- Data stays on this PC in `%LOCALAPPDATA%\\GermanGamesTracker\\tracker.sqlite3`.
- Time is attributed to the foreground process name, so some launchers/game processes may not match the display title in the website catalog.
- Tracking pauses for excluded Windows shell/system processes and when no eligible foreground process is detected.
- Use **Export JSON for website** to export a local copy. It currently exports process names and tracked time; it does not automatically upload anything.

## Build locally

Python 3.12 + PyInstaller:
```powershell
python -m pip install pyinstaller
pyinstaller --noconfirm --clean --onefile --windowed --name "German-Games-Tracker" desktop-tracker/tracker.py
```

The executable is created in `dist\\German-Games-Tracker.exe`.
