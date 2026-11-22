"""
HoneyDeck als Windows-Programm: eigenes Fenster (Edge WebView2) mit der gemeinsamen Oberfläche aus web/.

Gespeichert wird in %APPDATA%\\HoneyDeck\\store (eine JSON-Datei je Präsentation) – unabhängig vom Fenster.
Die Oberfläche liest und schreibt den Speicher über den eigenen Server (/__store/…): Die Brücke von pywebview ist für
Megabytes zu langsam – mit ihr stand das Programm beim Öffnen, sobald Präsentationen Bilder trugen. Der Server hört nur auf
127.0.0.1 und verlangt den Schlüssel dieses Programmlaufs (TOKEN) als Kopfzeile, damit keine fremde Seite an den Speicher kommt.
HoneyCut findet HoneyDeck über den Registry-Eintrag HKCU\\Software\\HoneyBalecta\\HoneyDeck\\WebDir (setzt der Installer)
und bettet dieselbe Oberfläche im Reiter „Folien“ ein.
"""
from __future__ import annotations

import json
import os
import hmac
import re
import secrets
import socket
import sys
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, quote, urlsplit

FROZEN = bool(getattr(sys, "frozen", False))
APP_DIR = Path(sys.executable).resolve().parent if FROZEN else Path(__file__).resolve().parent
RES_DIR = Path(getattr(sys, "_MEIPASS", APP_DIR))
WEB_DIR = next((p for p in (APP_DIR / "web", RES_DIR / "web", APP_DIR.parent / "dist-web") if (p / "index.html").is_file()), APP_DIR / "web")
DATA = Path(os.environ.get("APPDATA") or Path.home()) / "HoneyDeck"
STORE = DATA / "store"
STORE.mkdir(parents=True, exist_ok=True)
TITLE = "HoneyDeck"
TOKEN = secrets.token_urlsafe(18)   # Schlüssel dieses Programmlaufs für /__store/


def note(*teile):
    """Startprotokoll %APPDATA%\\HoneyDeck\\start.log (die letzten Läufe) – hilft, wenn das Fenster leer bleibt."""
    try:
        import datetime
        f = DATA / "start.log"
        alt = f.read_text(encoding="utf-8").splitlines()[-200:] if f.is_file() else []
        f.write_text("\n".join(alt + [datetime.datetime.now().isoformat(timespec="seconds") + "  " + " ".join(str(t) for t in teile)]) + "\n", encoding="utf-8")
    except Exception:  # noqa: BLE001
        pass


def webview2_version():
    """Version der Laufzeit „Microsoft Edge WebView2“ aus der Registrierung, sonst ''."""
    try:
        import winreg
        guid = "{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}"
        for root, pfad in ((winreg.HKEY_LOCAL_MACHINE, "SOFTWARE\\WOW6432Node\\Microsoft\\EdgeUpdate\\Clients\\" + guid),
                           (winreg.HKEY_LOCAL_MACHINE, "SOFTWARE\\Microsoft\\EdgeUpdate\\Clients\\" + guid),
                           (winreg.HKEY_CURRENT_USER, "Software\\Microsoft\\EdgeUpdate\\Clients\\" + guid)):
            try:
                with winreg.OpenKey(root, pfad) as k:
                    v = winreg.QueryValueEx(k, "pv")[0]
                    if v and v != "0.0.0.0":
                        return v
            except OSError:
                continue
    except Exception:  # noqa: BLE001
        pass
    return ""


def haenger_beenden() -> int:
    """Frühere Fenster von HoneyDeck beenden, die nicht mehr reagieren („Keine Rückmeldung“).

    Ein hängengebliebenes HoneyDeck hält sein WebView2-Profil fest; jeder weitere Start wartet dann auf dieses Profil und
    bleibt selbst stehen. Beendet werden nur Prozesse derselben Programmdatei, deren sichtbares Fenster Windows als hängend meldet."""
    if sys.platform != "win32" or not FROZEN:
        return 0
    n = 0
    try:
        import ctypes
        from ctypes import wintypes
        u, k = ctypes.windll.user32, ctypes.windll.kernel32
        PROC = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)
        u.EnumWindows.argtypes = [PROC, wintypes.LPARAM]
        u.IsWindowVisible.argtypes = [wintypes.HWND]
        u.IsHungAppWindow.argtypes = [wintypes.HWND]
        u.GetWindowThreadProcessId.argtypes = [wintypes.HWND, ctypes.POINTER(wintypes.DWORD)]
        k.OpenProcess.restype = wintypes.HANDLE
        k.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
        k.QueryFullProcessImageNameW.argtypes = [wintypes.HANDLE, wintypes.DWORD, wintypes.LPWSTR, ctypes.POINTER(wintypes.DWORD)]
        k.TerminateProcess.argtypes = [wintypes.HANDLE, wintypes.UINT]
        k.CloseHandle.argtypes = [wintypes.HANDLE]
        ich, datei, pids = os.getpid(), os.path.normcase(sys.executable), set()

        def fenster(hwnd, _):
            try:
                if u.IsWindowVisible(hwnd) and u.IsHungAppWindow(hwnd):
                    pid = wintypes.DWORD(0)
                    u.GetWindowThreadProcessId(hwnd, ctypes.byref(pid))
                    if pid.value and pid.value != ich:
                        pids.add(pid.value)
            except Exception:  # noqa: BLE001
                pass
            return True
        u.EnumWindows(PROC(fenster), 0)
        for pid in pids:
            h = k.OpenProcess(0x1000 | 0x0001, False, pid)   # PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_TERMINATE
            if not h:
                continue
            try:
                buf, size = ctypes.create_unicode_buffer(1024), wintypes.DWORD(1024)
                if k.QueryFullProcessImageNameW(h, 0, buf, ctypes.byref(size)) and os.path.normcase(buf.value) == datei:
                    if k.TerminateProcess(h, 1):
                        n += 1
            finally:
                k.CloseHandle(h)
    except Exception as e:  # noqa: BLE001
        note("Hänger beenden: Fehler", e)
    return n


_SPERRE = None   # offene Sperrdatei, solange dieses HoneyDeck läuft
PENDING = DATA / "start.pending"   # liegt vom Start bis zum Laden der Seite; bleibt sie liegen, kam der letzte Start nicht durch


def profil() -> Path:
    """Ordner für das WebView2-Profil. In ihm liegt nichts Bleibendes (Präsentationen und Profile stehen in store/).

    Kam der letzte Start nicht bis zur geladenen Seite, wird das Profil verworfen. Läuft noch ein anderes HoneyDeck
    (oder lässt sich das Profil nicht leeren), bekommt dieser Start ein eigenes, frisches Profil – so kann ihn nichts Altes aufhalten."""
    global _SPERRE
    import shutil
    import tempfile
    basis, allein = DATA / "webview", False
    try:
        import msvcrt
        f = open(DATA / "run.lock", "a+")
        try:
            msvcrt.locking(f.fileno(), msvcrt.LK_NBLCK, 1)
            _SPERRE, allein = f, True
        except OSError:
            f.close()
    except ImportError:   # nicht unter Windows
        allein = True
    except Exception:  # noqa: BLE001
        pass
    if allein:
        for alt in DATA.glob("webview-*"):   # Profile früherer Ausweich-Starts
            shutil.rmtree(alt, ignore_errors=True)
        if PENDING.is_file():
            shutil.rmtree(basis, ignore_errors=True)
            note("Letzter Start kam nicht durch – Profil verworfen:", "ja" if not basis.exists() else "nicht ganz")
            if basis.exists():
                allein = False
    if not allein:
        try:
            basis = Path(tempfile.mkdtemp(prefix="webview-", dir=str(DATA)))
        except Exception:  # noqa: BLE001
            pass
    try:
        PENDING.write_text(str(os.getpid()), encoding="utf-8")
    except Exception:  # noqa: BLE001
        pass
    return basis


def fail(msg: str):
    try:
        import ctypes
        ctypes.windll.user32.MessageBoxW(None, msg, TITLE, 0x10)
    except Exception:
        print(msg, file=sys.stderr)
    sys.exit(1)


def key_file(key: str) -> Path:
    return STORE / (re.sub(r"[^A-Za-z0-9_.-]", "_", key)[:120] + ".json")


def store_get(key):
    f = key_file(key)
    return f.read_text(encoding="utf-8") if f.is_file() else None


def store_set(key, value):
    f = key_file(key)
    tmp = f.with_name(f.name + ".tmp")
    tmp.write_text(value, encoding="utf-8")
    tmp.replace(f)
    return True


def store_del(key):
    f = key_file(key)
    if f.is_file():
        f.unlink()
    return True


def store_keys(prefix):
    out, pre = [], re.sub(r"[^A-Za-z0-9_.-]", "_", prefix)
    for f in STORE.glob("*.json"):
        k = f.name[:-5]   # nicht f.stem: Schlüssel wie libd_ID.BILD tragen selbst einen Punkt
        if k.startswith(pre):
            out.append(k.replace("deck_", "deck:", 1) if k.startswith("deck_") else k)
    return out


# Das Fenster und die beim Start übergebene Datei. Bewusst KEIN Objekt für die Brücke von pywebview (js_api):
# pywebview durchsucht ein solches Objekt beim Laden der Seite samt allen öffentlichen Eigenschaften – stand dort das Fenster
# (api.window), lief die Suche durch das ganze native Windows-Fenster. Das hielt den Start an („Keine Rückmeldung“), sobald
# die Seite währenddessen Anfragen stellte. Alles, was die Oberfläche vom Programm braucht, läuft über /__store/.
_FENSTER = None
_OFFEN: Path | None = None


def datei_sichern(name: str, daten: bytes) -> str:
    """„Speichern unter“ zeigen und die Datei schreiben. Gibt den Pfad zurück, '' bei Abbruch."""
    import webview
    if _FENSTER is None:
        raise RuntimeError("kein Fenster")
    art = getattr(getattr(webview, "FileDialog", None), "SAVE", None)
    if art is None:
        art = getattr(webview, "SAVE_DIALOG")
    ext = Path(name).suffix.lstrip(".") or "*"
    try:
        res = _FENSTER.create_file_dialog(art, save_filename=name, file_types=(f"{ext.upper()}-Datei (*.{ext})", "Alle Dateien (*.*)"))
    except Exception:  # noqa: BLE001
        res = _FENSTER.create_file_dialog(art, save_filename=name)
    if not res:
        return ""
    dest = res[0] if isinstance(res, (list, tuple)) else res
    Path(dest).write_bytes(daten)
    return str(dest)


class Quiet(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".js": "text/javascript", ".webmanifest": "application/manifest+json",
                      ".ttf": "font/ttf", ".otf": "font/otf", ".svg": "image/svg+xml"}

    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(WEB_DIR), **k)

    def log_message(self, *a):
        pass

    # Speicher für die Oberfläche: nur mit dem Schlüssel dieses Programmlaufs und nur für Anfragen an 127.0.0.1
    def _store(self, body=None):
        u = urlsplit(self.path)
        if not u.path.startswith("/__store/"):
            return False
        host = (self.headers.get("Host") or "").split(":")[0]
        if host not in ("127.0.0.1", "localhost") or not hmac.compare_digest(self.headers.get("X-HoneyDeck") or "", TOKEN):
            self.send_error(403)
            return True
        op, q = u.path[len("/__store/"):], parse_qs(u.query)
        key, out, typ, extra = (q.get("key") or [""])[0], b"", "application/json", {}
        try:
            if op == "get" and body is None:
                out = (store_get(key) or "").encode("utf-8")
            elif op == "keys" and body is None:
                out = json.dumps(store_keys((q.get("prefix") or [""])[0])).encode("utf-8")
            elif op == "opened" and body is None:   # beim Start übergebene Datei (Doppelklick auf .honeydeck, „Öffnen mit“)
                if _OFFEN is None or not _OFFEN.is_file():
                    self.send_error(404)
                    return True
                out, typ = _OFFEN.read_bytes(), "application/octet-stream"
                extra = {"X-Name": quote(_OFFEN.name)}
            elif op == "save" and body is not None:
                out = datei_sichern(Path((q.get("name") or ["Datei"])[0]).name or "Datei", body).encode("utf-8")
            elif op == "set" and body is not None and key:
                store_set(key, body.decode("utf-8"))
            elif op == "del" and body is not None and key:
                store_del(key)
            else:
                self.send_error(404)
                return True
        except Exception as e:  # noqa: BLE001
            self.send_error(500, str(e)[:120])
            return True
        self.send_response(200)
        self.send_header("Content-Type", typ + "; charset=utf-8")
        self.send_header("Content-Length", str(len(out)))
        for name, wert in extra.items():
            self.send_header(name, wert)
        self.end_headers()
        try:
            self.wfile.write(out)
        except ConnectionError:   # das Fenster hat die Anfrage abgebrochen (neu geladen, geschlossen)
            pass
        return True

    def do_GET(self):
        if not self._store():
            super().do_GET()

    def do_POST(self):
        n = int(self.headers.get("Content-Length") or 0)
        if n > 400_000_000:
            self.send_error(413)
            return
        if not self._store(self.rfile.read(n)):
            self.send_error(405)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


def free_port(start=8790):
    for p in range(start, start + 40):
        with socket.socket() as s:
            try:
                s.bind(("127.0.0.1", p))
                return p
            except OSError:
                continue
    return 0


def fenster_einrichten(fenster, titel: str, maximieren: bool):
    """Fenster mittig auf den Bildschirm setzen und auf Wunsch maximieren.

    Windows legt neue Fenster sonst versetzt nach rechts unten ab. Läuft über die Win32-Funktionen,
    damit Position und Größe bei jeder Bildschirmskalierung in denselben (physischen) Pixeln gerechnet werden."""
    if sys.platform != "win32":
        return
    try:
        import ctypes
        from ctypes import wintypes
        u = ctypes.windll.user32
        hwnd = 0
        try:
            hwnd = int(fenster.native.Handle.ToInt64())
        except Exception:  # noqa: BLE001
            hwnd = u.FindWindowW(None, titel)
        if not hwnd:
            return

        class MONITORINFO(ctypes.Structure):
            _fields_ = [("cbSize", wintypes.DWORD), ("rcMonitor", wintypes.RECT), ("rcWork", wintypes.RECT), ("dwFlags", wintypes.DWORD)]

        r = wintypes.RECT()
        u.GetWindowRect(hwnd, ctypes.byref(r))
        mi = MONITORINFO()
        mi.cbSize = ctypes.sizeof(MONITORINFO)
        u.GetMonitorInfoW(u.MonitorFromWindow(hwnd, 2), ctypes.byref(mi))   # 2 = nächster Bildschirm
        a = mi.rcWork
        aw, ah = a.right - a.left, a.bottom - a.top
        w, h = min(r.right - r.left, int(aw * 0.94)), min(r.bottom - r.top, int(ah * 0.94))
        u.SetWindowPos(hwnd, 0, a.left + (aw - w) // 2, a.top + (ah - h) // 2, w, h, 0x0004 | 0x0010)   # ohne Z-Reihenfolge/Aktivierung
        if maximieren:
            u.ShowWindow(hwnd, 3)   # SW_MAXIMIZE
    except Exception:  # noqa: BLE001
        pass


def main():
    if not (WEB_DIR / "index.html").is_file():
        fail(f"Oberfläche nicht gefunden: {WEB_DIR}")
    try:
        import webview
    except Exception:
        fail("pywebview fehlt – bitte HoneyDeck neu installieren.")
    beendet = haenger_beenden()
    if beendet:
        import time
        time.sleep(1.2)   # ihre WebView2-Prozesse beenden sich mit
    ordner = profil()
    port = free_port()
    wv2 = webview2_version() if sys.platform == "win32" else "-"
    note("Start", "Oberfläche:", WEB_DIR, "| hängende Fenster beendet:", beendet, "| Profil:", ordner.name, "| Port:", port, "| WebView2:", wv2 or "nicht gefunden", "| pywebview:", getattr(webview, "__version__", "?"))
    srv = ThreadingHTTPServer(("127.0.0.1", port), Quiet)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    try:
        import ctypes
        ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID("HoneyDeck.App")
    except Exception:
        pass
    global _FENSTER, _OFFEN
    url = f"http://127.0.0.1:{port}/index.html?desktop=1&k={TOKEN}"
    if len(sys.argv) > 1 and Path(sys.argv[1]).is_file():   # „Öffnen mit“ / Doppelklick auf .honeydeck
        _OFFEN = Path(sys.argv[1]).resolve()
        url += "#open=1"
    _FENSTER = webview.create_window(TITLE, url, width=1440, height=900, min_size=(900, 600), background_color="#131312", text_select=False)
    fenster = _FENSTER
    fenster.events.shown += lambda: fenster_einrichten(fenster, TITLE, True)

    def geladen():
        art = "?"
        try:
            art = getattr(sys.modules.get("webview.platforms.winforms"), "renderer", "?")
        except Exception:  # noqa: BLE001
            pass
        note("Seite geladen", "| Darstellung:", art)
        try:
            PENDING.unlink()
        except Exception:  # noqa: BLE001
            pass
    fenster.events.loaded += geladen
    webview.start(private_mode=False, storage_path=str(ordner))


if __name__ == "__main__":
    main()
