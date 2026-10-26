"""
German'$ Game Tracker — local foreground-game time tracker for Windows.
Tracks only the active foreground process; no screenshots, keystrokes, network, or telemetry.
"""
import ctypes
import json
import os
import sqlite3
import sys
import time
from datetime import datetime, date
from pathlib import Path
import tkinter as tk
from tkinter import ttk, messagebox, filedialog

APP_NAME = "German'$ Game Tracker"
APP_DIR = Path(os.environ.get("LOCALAPPDATA", str(Path.home()))) / "GermanGamesTracker"
APP_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = APP_DIR / "tracker.sqlite3"
POLL_SECONDS = 5
IGNORE = {
    # Windows shell and system utilities
    "explorer.exe", "dwm.exe", "searchhost.exe", "startmenuexperiencehost.exe",
    "applicationframehost.exe", "textinputhost.exe", "shellexperiencehost.exe",
    "lockapp.exe", "taskmgr.exe", "systemsettings.exe", "runtimebroker.exe",
    "ctfmon.exe", "searchindexer.exe", "securityhealthsystray.exe",
    # Common non-game foreground apps
    "chrome.exe", "msedge.exe", "firefox.exe", "brave.exe", "opera.exe",
    "yandex.exe", "browser.exe", "discord.exe", "telegram.exe", "whatsapp.exe",
    "spotify.exe", "yandexmusic.exe", "steam.exe", "steamwebhelper.exe",
    "epicgameslauncher.exe", "goggalaxy.exe", "ubisoftconnect.exe",
    "ea.exe", "eadesktop.exe", "battle.net.exe", "battlenet.exe",
    "code.exe", "webstorm64.exe", "idea64.exe", "notepad.exe",
    "notepad++.exe", "powershell.exe", "pwsh.exe", "cmd.exe", "windowsterminal.exe",
    "obs64.exe", "obs.exe", "snippingtool.exe", "photos.exe",
    "python.exe", "pythonw.exe",
}

def foreground_process():
    try:
        hwnd = ctypes.windll.user32.GetForegroundWindow()
        if not hwnd:
            return None
        pid = ctypes.c_ulong()
        ctypes.windll.user32.GetWindowThreadProcessId(hwnd, ctypes.byref(pid))
        if not pid.value:
            return None
        PROCESS_QUERY_LIMITED_INFORMATION = 0x1000
        h = ctypes.windll.kernel32.OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, False, pid.value)
        if not h:
            return None
        try:
            buf = ctypes.create_unicode_buffer(1024)
            size = ctypes.c_ulong(len(buf))
            if ctypes.windll.kernel32.QueryFullProcessImageNameW(h, 0, buf, ctypes.byref(size)):
                name = Path(buf.value).name
                if name.lower() not in IGNORE:
                    return name
        finally:
            ctypes.windll.kernel32.CloseHandle(h)
    except Exception:
        return None
    return None

class TrackerApp:
    def __init__(self, root):
        self.root = root
        self.root.title(APP_NAME)
        self.root.geometry("820x590")
        self.root.minsize(680, 480)
        self.root.configure(bg="#101318")
        self.running = True
        self.last_proc = None
        self.last_tick = time.monotonic()
        self.init_db()
        self.build_ui()
        self.refresh()
        self.tick()

    def init_db(self):
        with sqlite3.connect(DB_PATH) as db:
            db.execute("""CREATE TABLE IF NOT EXISTS sessions(
                id INTEGER PRIMARY KEY, process TEXT NOT NULL, started TEXT NOT NULL,
                ended TEXT NOT NULL, seconds INTEGER NOT NULL, day TEXT NOT NULL)""")

    def build_ui(self):
        style = ttk.Style()
        style.theme_use("clam")
        style.configure("TCombobox", fieldbackground="#20252d", background="#20252d", foreground="#f2f4f7")
        header = tk.Frame(self.root, bg="#101318", padx=24, pady=20)
        header.pack(fill="x")
        tk.Label(header, text="G’", font=("Segoe UI", 28, "bold"), fg="#d9e5ef", bg="#101318").pack(side="left")
        title = tk.Frame(header, bg="#101318")
        title.pack(side="left", padx=12)
        tk.Label(title, text="GERMAN'$ GAME TRACKER", font=("Segoe UI", 15, "bold"), fg="#f2f4f7", bg="#101318").pack(anchor="w")
        tk.Label(title, text="LOCAL PLAYTIME · PRIVATE BY DESIGN", font=("Segoe UI", 9), fg="#91a0b0", bg="#101318").pack(anchor="w", pady=(3,0))
        self.live = tk.Label(header, text="● TRACKING", fg="#83d6a8", bg="#101318", font=("Segoe UI", 9, "bold"))
        self.live.pack(side="right", anchor="n", pady=8)
        self.total_label = tk.Label(self.root, text="0 h", font=("Segoe UI", 32, "bold"), fg="#f2f4f7", bg="#101318")
        self.total_label.pack(anchor="w", padx=28, pady=(2,0))
        tk.Label(self.root, text="Tracked foreground-app time", fg="#91a0b0", bg="#101318", font=("Segoe UI", 10)).pack(anchor="w", padx=30)
        panel = tk.Frame(self.root, bg="#191e25", padx=16, pady=14)
        panel.pack(fill="both", expand=True, padx=24, pady=18)
        tk.Label(panel, text="RECENT ACTIVITY", fg="#91a0b0", bg="#191e25", font=("Segoe UI", 9, "bold")).pack(anchor="w", pady=(0,10))
        cols = ("game", "today", "total")
        self.tree = ttk.Treeview(panel, columns=cols, show="headings", height=12)
        self.tree.heading("game", text="Process / game")
        self.tree.heading("today", text="Today")
        self.tree.heading("total", text="Total")
        self.tree.column("game", width=420)
        self.tree.column("today", width=120, anchor="e")
        self.tree.column("total", width=120, anchor="e")
        self.tree.pack(fill="both", expand=True)
        style.configure("Treeview", background="#191e25", fieldbackground="#191e25", foreground="#f2f4f7", rowheight=28, borderwidth=0)
        style.configure("Treeview.Heading", background="#252c35", foreground="#dce4eb", padding=8, font=("Segoe UI", 9, "bold"))
        style.map("Treeview", background=[("selected", "#34495b")])
        footer = tk.Frame(self.root, bg="#101318", padx=24, pady=(0,20))
        footer.pack(fill="x")
        tk.Button(footer, text="Export JSON for website", command=self.export_json, bg="#dce7ef", fg="#11161b", relief="flat", padx=14, pady=9).pack(side="left")
        tk.Button(footer, text="Open data folder", command=self.open_data, bg="#20252d", fg="#f2f4f7", relief="flat", padx=14, pady=9).pack(side="left", padx=8)
        tk.Label(footer, text="No screenshots · no keystrokes · no network", fg="#91a0b0", bg="#101318", font=("Segoe UI", 9)).pack(side="right")

    def tick(self):
        now = time.monotonic()
        elapsed = max(0, min(POLL_SECONDS + 2, int(now - self.last_tick)))
        self.last_tick = now
        proc = foreground_process()
        if self.last_proc and elapsed:
            with sqlite3.connect(DB_PATH) as db:
                db.execute("INSERT INTO sessions(process,started,ended,seconds,day) VALUES(?,?,?,?,?)",
                           (self.last_proc, datetime.now().isoformat(timespec="seconds"), datetime.now().isoformat(timespec="seconds"), elapsed, date.today().isoformat()))
        self.last_proc = proc
        self.refresh()
        self.root.after(POLL_SECONDS * 1000, self.tick)

    def refresh(self):
        with sqlite3.connect(DB_PATH) as db:
            rows = db.execute("SELECT process, SUM(seconds), SUM(CASE WHEN day=? THEN seconds ELSE 0 END) FROM sessions GROUP BY process ORDER BY SUM(seconds) DESC", (date.today().isoformat(),)).fetchall()
        total = sum(r[1] or 0 for r in rows)
        self.total_label.config(text=f"{total/3600:.1f} h")
        for item in self.tree.get_children():
            self.tree.delete(item)
        for name, total_sec, today_sec in rows:
            self.tree.insert("", "end", values=(name, self.fmt(today_sec), self.fmt(total_sec)))

    @staticmethod
    def fmt(seconds):
        seconds = int(seconds or 0)
        return f"{seconds//3600} h {(seconds%3600)//60:02d} m"

    def export_json(self):
        with sqlite3.connect(DB_PATH) as db:
            rows = db.execute("SELECT process, SUM(seconds) FROM sessions GROUP BY process ORDER BY SUM(seconds) DESC").fetchall()
        payload = {"source":"german-games-tracker","exportedAt":datetime.now().astimezone().isoformat(),
                   "games":[{"process":name,"playtimeSeconds":int(seconds or 0),"hours":round((seconds or 0)/3600,2)} for name,seconds in rows]}
        path = filedialog.asksaveasfilename(defaultextension=".json", initialfile="german-games-tracker.json", filetypes=[("JSON","*.json")])
        if path:
            Path(path).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
            messagebox.showinfo(APP_NAME, "Export saved. You can keep it locally or import it into the website when that feature is enabled.")

    def open_data(self):
        os.startfile(str(APP_DIR))

if __name__ == "__main__":
    if os.name != "nt":
        raise SystemExit("Windows only")
    root = tk.Tk()
    TrackerApp(root)
    root.mainloop()
