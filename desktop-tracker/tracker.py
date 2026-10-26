"""German'$ Games Library live tracker for Windows.
Publishes only the current game and completed sessions to the repository JSON database.
A GitHub fine-grained token with Contents: Read and write is required once.
"""
import base64, ctypes, json, os, shutil, subprocess, sys, time, urllib.error, urllib.request
from datetime import datetime, timezone
from pathlib import Path
import tkinter as tk
from tkinter import simpledialog, messagebox

REPO = "German-GPD/german-games-library-"
DB_FILE = "data/games-db.json"
APP = "GermanGamesTracker"
ROOT = Path(os.environ.get("LOCALAPPDATA", str(Path.home()))) / APP
ROOT.mkdir(parents=True, exist_ok=True)
CONFIG = ROOT / "config.json"
POLL = 15

# Exact executable aliases, including alternate launcher names.
GAMES = {
 "gta_sa.exe": ("Grand Theft Auto: San Andreas", "12120"),
 "sanandreas.exe": ("Grand Theft Auto: San Andreas – The Definitive Edition", ""),
 "gtasa.exe": ("Grand Theft Auto: San Andreas – The Definitive Edition", ""),
 "gta3.exe": ("Grand Theft Auto III", "12100"),
 "libertycity.exe": ("Grand Theft Auto III – The Definitive Edition", ""),
 "vicecity.exe": ("Grand Theft Auto: Vice City – The Definitive Edition", ""),
 "playgtasanandreas.exe": ("Grand Theft Auto: San Andreas", "12120"),
 "gta-sa.exe": ("Grand Theft Auto: San Andreas", "12120"),
 "gta-vc.exe": ("Grand Theft Auto: Vice City", "12130"),
 "gta3.exe": ("Grand Theft Auto III", "12100"),
 "gtaiv.exe": ("Grand Theft Auto IV", "12210"),
 "gta5.exe": ("Grand Theft Auto V", "271590"),
 "playgtav.exe": ("Grand Theft Auto V", "271590"),
 "forzahorizon5.exe": ("Forza Horizon 5", "1551360"),
 "forzahorizon4.exe": ("Forza Horizon 4", "1293830"),
 "forzahorizon6.exe": ("Forza Horizon 6", ""),
 "hl2.exe": ("Half-Life 2", "220"),
 "sleepingdogs.exe": ("Sleeping Dogs: Definitive Edition", "307690"),
 "maxpayne3.exe": ("Max Payne 3", "204100"),
 "mafia2.exe": ("Mafia II", "50130"),
 "mafiadefinitiveedition.exe": ("Mafia: Definitive Edition", "1030840"),
 "farcry3.exe": ("Far Cry 3", "220240"),
 "farcry4.exe": ("Far Cry 4", "298110"),
 "farcry5.exe": ("Far Cry 5", "552520"),
 "farcry6.exe": ("Far Cry 6", ""),
 "watchdogs.exe": ("Watch Dogs", "243470"),
 "watchdogs2.exe": ("Watch Dogs 2", "447040"),
 "witcher3.exe": ("The Witcher 3: Wild Hunt", "292030"),
 "cyberpunk2077.exe": ("Cyberpunk 2077", "1091500"),
 "rdr2.exe": ("Red Dead Redemption 2", "1174180"),
 "minecraft.exe": ("Minecraft", ""),
 "javaw.exe": ("Minecraft", ""),
 "needforspeed.exe": ("Need for Speed", ""),
 "nfs.exe": ("Need for Speed", ""),
 "speed.exe": ("Need for Speed: Most Wanted", ""),
 "eurotrucks2.exe": ("Euro Truck Simulator 2", "227300"),
 "amtrucks.exe": ("American Truck Simulator", "270880"),
 "miside.exe": ("MiSide", "2527500"),
 "eldenring.exe": ("Elden Ring", "1245620"),
 "r5apex.exe": ("Apex Legends", "1172470"),
 "cs2.exe": ("Counter-Strike 2", "730"),
 "dota2.exe": ("Dota 2", "570"),
 "rocketleague.exe": ("Rocket League", "252950"),
 "robloxplayerbeta.exe": ("Roblox", ""),
 "stardew valley.exe": ("Stardew Valley", "413150"),
 "fallout4.exe": ("Fallout 4", "377160"),
 "skyrimse.exe": ("The Elder Scrolls V: Skyrim Special Edition", "489830"),
}
IGNORE = {"steam.exe","steamwebhelper.exe","epicgameslauncher.exe","goggalaxy.exe","ubisoftconnect.exe","eadesktop.exe","ea.exe","battle.net.exe","battlenet.exe","discord.exe","chrome.exe","msedge.exe","firefox.exe","explorer.exe","dwm.exe","taskmgr.exe","searchhost.exe","code.exe","webstorm64.exe","telegram.exe","spotify.exe","yandexmusic.exe"}

def request_json(url, token, method="GET", payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "Authorization": "Bearer " + token, "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json",
        "User-Agent": "German-Games-Library-Tracker"})
    with urllib.request.urlopen(req, timeout=20) as r:
        raw = r.read()
        return json.loads(raw) if raw else {}

def detect_game():
    """Detect known games and likely game executables without spawning a visible console."""
    try:
        import psutil
    except ImportError:
        return None

    # These launchers and common helper processes are never games themselves.
    ignored = IGNORE | {
        "crashreporter.exe", "crashhandler.exe", "crashpad_handler.exe",
        "unins000.exe", "unitycrashhandler64.exe", "unitycrashhandler.exe",
        "easyanticheat.exe", "easyanticheat_eos.exe", "battleye.exe",
        "start_protected_game.exe", "steamerrorreporter.exe",
        "gameoverlayui.exe", "overlay.exe", "ubisoftconnect.exe",
        "epicwebhelper.exe", "epicgameslauncher.exe", "galaxyclient.exe",
        "xboxapp.exe", "gamingservices.exe", "gamingservicesnet.exe",
    }
    game_roots = (
        "\\steamapps\\common\\", "\\epic games\\", "\\gog galaxy\\games\\",
        "\\ubisoft game launcher\\games\\", "\\xboxgames\\",
        "\\windowsapps\\", "\\riot games\\", "\\ea games\\",
        "\\program files\\games\\", "\\games\\"
    )
    found = []
    for proc in psutil.process_iter(["name", "exe", "cmdline"]):
        try:
            name = (proc.info.get("name") or "").strip().lower()
            if not name or name in ignored:
                continue
            exe_path = (proc.info.get("exe") or "").lower().replace("/", "\\")
            # Exact aliases always win, including non-Steam editions and launchers.
            if name in GAMES:
                title, appid = GAMES[name]
                # Generic Java is accepted only when the command line identifies Minecraft.
                if name == "javaw.exe":
                    cmd = " ".join(proc.info.get("cmdline") or []).lower()
                    if not any(x in cmd for x in ("minecraft", "net.minecraft", "forge", "fabric")):
                        continue
                found.append((0 if name != "javaw.exe" else 2, name, title, appid))
                continue
            # Broad fallback: recognize executables installed inside known game libraries.
            if exe_path and any(root in exe_path for root in game_roots):
                folder = Path(exe_path).parent.name.lower()
                # Exclude common game services, redistributables and support tools.
                if any(x in exe_path for x in (
                    "\\redist\\", "\\redistributable\\", "\\support\\",
                    "\\easyanticheat\\", "\\battleye\\", "\\_commonredist\\",
                    "\\engine\\binaries\\thirdparty\\"
                )):
                    continue
                stem = Path(name).stem
                if stem in ("unins000", "setup", "installer", "crashreporter", "crashhandler"):
                    continue
                title = Path(folder).name.replace("_", " ").replace("-", " ").strip()
                if not title or title.lower() in ("binaries", "win64", "win32"):
                    title = stem.replace("_", " ").replace("-", " ").strip()
                # Keep the executable's readable name instead of guessing an incorrect title.
                title = " ".join(w.capitalize() if w.islower() else w for w in title.split())
                found.append((1, name, title, ""))
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess, OSError):
            continue
        except Exception:
            continue
    if not found:
        return None
    found.sort(key=lambda x: (x[0], x[1]))
    _, process, title, appid = found[0]
    return {"process": process, "title": title, "appid": appid}

def install_startup():
    if getattr(sys, "frozen", False):
        target = ROOT / "German-Games-Tracker.exe"
        try:
            if Path(sys.executable).resolve() != target.resolve():
                shutil.copy2(sys.executable, target)
                startup = Path(os.environ.get("APPDATA", str(Path.home()))) / "Microsoft/Windows/Start Menu/Programs/Startup"
                startup.mkdir(parents=True, exist_ok=True)
                link = startup / "German Games Tracker.lnk"
                ps = '$s=(New-Object -COM WScript.Shell).CreateShortcut(' + json.dumps(str(link)) + ');$s.TargetPath=' + json.dumps(str(target)) + ';$s.WorkingDirectory=' + json.dumps(str(ROOT)) + ';$s.Save()'
                subprocess.run(["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps], creationflags=0x08000000, timeout=15)
                subprocess.Popen([str(target)], close_fds=True)
                raise SystemExit
        except SystemExit:
            raise
        except Exception:
            pass

def load_config():
    try:
        return json.loads(CONFIG.read_text(encoding="utf-8"))
    except Exception:
        return {}

def configure_token():
    root = tk.Tk(); root.withdraw()
    messagebox.showinfo("German Games Tracker", "Нужен GitHub fine-grained token один раз: только репозиторий German-GPD/german-games-library-, разрешение Contents: Read and write. Создай его: https://github.com/settings/personal-access-tokens/new\nТокен хранится локально на этом ПК и не публикуется в репозитории.")
    token = simpledialog.askstring("GitHub token", "Вставь токен GitHub (ghp_… или github_pat_…):", show="*")
    root.destroy()
    if not token:
        return None
    try:
        request_json("https://api.github.com/repos/" + REPO, token)
        CONFIG.write_text(json.dumps({"token":token}), encoding="utf-8")
        return token
    except Exception as e:
        messagebox.showerror("Ошибка GitHub", "Токен не подошёл или нет доступа к репозиторию.\n" + str(e))
        return None

def publish(token, game, current, history):
    api = "https://api.github.com/repos/" + REPO + "/contents/" + DB_FILE
    try:
        old = request_json(api, token)
        sha = old.get("sha")
        try:
            db = json.loads(base64.b64decode(old["content"]).decode("utf-8"))
        except Exception:
            db = {"current": None, "history": []}
    except urllib.error.HTTPError as e:
        if e.code != 404:
            raise
        sha = None
        db = {"current": None, "history": []}
    if current and current.get("startedAt"):
        db.setdefault("history", []).append(current)
    db["history"] = db.get("history", [])[-500:]
    db["current"] = game
    payload = {"message": "Update live game presence", "content": base64.b64encode(json.dumps(db, ensure_ascii=False, indent=2).encode()).decode()}
    if sha: payload["sha"] = sha
    request_json(api, token, "PUT", payload)

def main():
    if os.name != "nt":
        raise SystemExit("Windows only")
    install_startup()
    cfg = load_config()
    token = cfg.get("token") or configure_token()
    if not token:
        return
    # Tiny status window; close button hides to background, explicit Quit exits.
    root = tk.Tk()
    root.title("German'$ Game Tracker")
    root.geometry("390x145")
    root.configure(bg="#11151b")
    status = tk.Label(root, text="Трекер запущен", fg="#eef3f8", bg="#11151b", font=("Segoe UI", 12, "bold"))
    status.pack(pady=(22,8))
    detail = tk.Label(root, text="Ожидание игры…", fg="#9eacba", bg="#11151b", font=("Segoe UI", 10))
    detail.pack()
    tk.Label(root, text="Только текущая игра + история сессий · GitHub", fg="#7d8b99", bg="#11151b", font=("Segoe UI", 8)).pack(pady=12)
    state = {"key": "__init__", "started": None, "title": None, "appid": None}
    def tick():
        try:
            detected = detect_game()
            key = detected["process"] if detected else None
            now = datetime.now(timezone.utc).isoformat(timespec="seconds")
            if key != state["key"]:
                previous = None
                if state["key"] not in (None, "__init__"):
                    previous = {"title":state["title"],"appid":state["appid"],"process":state["key"],"startedAt":state["started"],"endedAt":now}
                    publish(token, None, previous, None)
                state.update({"key":key,"started":now if detected else None,"title":detected["title"] if detected else None,"appid":detected["appid"] if detected else None})
                current = ({**detected,"startedAt":state["started"],"updatedAt":now} if detected else None)
                publish(token, current, None, None)
            elif detected:
                status.config(text="● СЕЙЧАС ИГРАЕШЬ", fg="#83d6a8")
                detail.config(text=detected["title"] + " · " + state["key"])
            else:
                status.config(text="● ТРЕКЕР РАБОТАЕТ", fg="#83d6a8")
                detail.config(text="Игра не запущена")
        except Exception as e:
            status.config(text="Нет связи с GitHub", fg="#ffb4a9")
            detail.config(text=str(e)[:75])
        root.after(POLL * 1000, tick)
    def close_window():
        root.iconify()
    root.protocol("WM_DELETE_WINDOW", close_window)
    menu = tk.Menu(root, tearoff=0)
    menu.add_command(label="Показать окно", command=root.deiconify)
    menu.add_command(label="Выход", command=root.destroy)
    def tray_note():
        messagebox.showinfo("German Games Tracker", "Окно можно скрыть; автозапуск включён. Чтобы выйти, нажми «Выход» в окне.")
    root.bind("<Escape>", lambda e: root.withdraw())
    root.after(500, tick)
    root.mainloop()

if __name__ == "__main__":
    main()
