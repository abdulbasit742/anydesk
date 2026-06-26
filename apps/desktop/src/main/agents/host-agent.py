#!/usr/bin/env python3
"""
RemoteDesk Host Agent — Enables REAL remote control of the host machine.
Adapted from anydeskantigravity1 project.
Uses pyautogui for mouse/keyboard control and pyperclip for clipboard sync.
"""
import os
import sys
import time
import threading
import argparse
import platform

try:
    import pyautogui
    import pyperclip
    import socketio
except ImportError:
    print("[agent] Installing dependencies...")
    os.system(f"{sys.executable} -m pip install pyautogui pyperclip python-socketio[client] websocket-client")
    import pyautogui
    import pyperclip
    import socketio

# Safety settings
pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.01

# Parse arguments
parser = argparse.ArgumentParser(description="RemoteDesk Host Agent")
parser.add_argument("--id", default=os.environ.get("HOST_ID", "000000000"))
parser.add_argument("--server", default=os.environ.get("SERVER_URL", "http://localhost:5000"))
parser.add_argument("--password", default=os.environ.get("HOST_PASSWORD", ""))
args = parser.parse_args()

HOST_ID = args.id
SERVER_URL = args.server
HOST_PASSWORD = args.password
SCREEN_W, SCREEN_H = pyautogui.size()

# Socket.IO client
sio = socketio.Client(reconnection=True, reconnection_attempts=0, reconnection_delay=2)

# Clipboard state
_last_clipboard = ""

# Key mapping for cross-platform compatibility
KEY_MAP = {
    "arrowup": "up", "arrowdown": "down", "arrowleft": "left", "arrowright": "right",
    "escape": "esc", "control": "ctrl", "meta": "win", " ": "space",
    "backspace": "backspace", "delete": "delete", "enter": "enter",
    "tab": "tab", "capslock": "capslock", "shift": "shift",
    "alt": "alt", "home": "home", "end": "end",
    "pageup": "pageup", "pagedown": "pagedown",
    "f1": "f1", "f2": "f2", "f3": "f3", "f4": "f4",
    "f5": "f5", "f6": "f6", "f7": "f7", "f8": "f8",
    "f9": "f9", "f10": "f10", "f11": "f11", "f12": "f12",
}

def clamp01(v):
    """Clamp value between 0 and 1."""
    try:
        return max(0.0, min(1.0, float(v)))
    except (TypeError, ValueError):
        return 0.5

def key_name(value):
    """Normalize key name for pyautogui."""
    value = str(value or "").lower()
    return KEY_MAP.get(value, value if len(value) > 1 else value)

def get_system_info():
    """Get system information for registration."""
    return {
        "os": platform.system(),
        "os_version": platform.version(),
        "hostname": platform.node(),
        "arch": platform.machine(),
        "screen_width": SCREEN_W,
        "screen_height": SCREEN_H,
        "python_version": platform.python_version(),
    }

@sio.event
def connect():
    print(f"[agent] Connected to {SERVER_URL}")
    sio.emit("register-agent", {
        "hostId": HOST_ID,
        "password": HOST_PASSWORD,
        "systemInfo": get_system_info(),
    })

@sio.event
def disconnect():
    print("[agent] Disconnected from server")

@sio.on("registered")
def on_registered(data):
    print(f"[agent] Registered successfully: {data}")

@sio.on("host-disconnected")
def on_host_disconnected():
    print("[agent] Host session ended by server")

@sio.on("control-event")
def on_control_event(event):
    """Handle remote control events from viewer."""
    event_type = event.get("type")
    try:
        if event_type == "move":
            x = int(clamp01(event.get("x")) * SCREEN_W)
            y = int(clamp01(event.get("y")) * SCREEN_H)
            pyautogui.moveTo(x, y, _pause=False)

        elif event_type == "click":
            button = event.get("button", "left")
            clicks = event.get("clicks", 1)
            pyautogui.click(button=button, clicks=clicks)

        elif event_type == "doubleclick":
            button = event.get("button", "left")
            pyautogui.doubleClick(button=button)

        elif event_type == "rightclick":
            pyautogui.rightClick()

        elif event_type == "scroll":
            delta = int(event.get("delta", 0))
            pyautogui.scroll(delta)

        elif event_type == "key":
            key = key_name(event.get("key"))
            if key:
                pyautogui.press(key)

        elif event_type == "keydown":
            key = key_name(event.get("key"))
            if key:
                pyautogui.keyDown(key)

        elif event_type == "keyup":
            key = key_name(event.get("key"))
            if key:
                pyautogui.keyUp(key)

        elif event_type == "hotkey":
            keys = [key_name(k) for k in event.get("keys", []) if key_name(k)]
            if keys:
                pyautogui.hotkey(*keys)

        elif event_type == "type":
            text = event.get("text", "")
            if text:
                pyautogui.typewrite(text, interval=0.02)

        elif event_type == "clipboard":
            text = str(event.get("text", ""))
            pyperclip.copy(text)

        elif event_type == "drag":
            start_x = int(clamp01(event.get("startX")) * SCREEN_W)
            start_y = int(clamp01(event.get("startY")) * SCREEN_H)
            end_x = int(clamp01(event.get("endX")) * SCREEN_W)
            end_y = int(clamp01(event.get("endY")) * SCREEN_H)
            pyautogui.moveTo(start_x, start_y)
            pyautogui.drag(end_x - start_x, end_y - start_y, duration=0.3)

        elif event_type == "screenshot":
            # Take screenshot and send back
            screenshot = pyautogui.screenshot()
            import io, base64
            buffer = io.BytesIO()
            screenshot.save(buffer, format="PNG", optimize=True)
            img_base64 = base64.b64encode(buffer.getvalue()).decode()
            sio.emit("screenshot-response", {"image": img_base64, "hostId": HOST_ID})

        elif event_type == "lock":
            # Lock the workstation
            if platform.system() == "Windows":
                import ctypes
                ctypes.windll.user32.LockWorkStation()
            elif platform.system() == "Linux":
                os.system("loginctl lock-session")
            elif platform.system() == "Darwin":
                os.system("pmset displaysleepnow")

        elif event_type == "restart":
            if platform.system() == "Windows":
                os.system("shutdown /r /t 5")
            else:
                os.system("sudo reboot")

        elif event_type == "shutdown":
            if platform.system() == "Windows":
                os.system("shutdown /s /t 5")
            else:
                os.system("sudo shutdown -h now")

    except Exception as exc:
        print(f"[agent] Failed to handle {event_type}: {exc}")
        sio.emit("agent-error", {"hostId": HOST_ID, "error": str(exc), "event_type": event_type})

@sio.on("get-system-info")
def on_get_system_info(data):
    """Return detailed system info on request."""
    import shutil
    info = get_system_info()
    info.update({
        "cpu_count": os.cpu_count(),
        "disk_total": shutil.disk_usage("/").total,
        "disk_free": shutil.disk_usage("/").free,
    })
    try:
        import psutil
        info["cpu_percent"] = psutil.cpu_percent(interval=1)
        info["memory_total"] = psutil.virtual_memory().total
        info["memory_available"] = psutil.virtual_memory().available
        info["memory_percent"] = psutil.virtual_memory().percent
    except ImportError:
        pass
    sio.emit("system-info-response", {"hostId": HOST_ID, "info": info})

def clipboard_sync_loop():
    """Continuously sync clipboard changes to viewer."""
    global _last_clipboard
    while True:
        try:
            current = pyperclip.paste()
            if current and current != _last_clipboard:
                _last_clipboard = current
                sio.emit("clipboard-update", {"hostId": HOST_ID, "text": current})
        except Exception:
            pass
        time.sleep(1.5)

def heartbeat_loop():
    """Send periodic heartbeat to server."""
    while True:
        try:
            if sio.connected:
                sio.emit("agent-heartbeat", {"hostId": HOST_ID, "timestamp": time.time()})
        except Exception:
            pass
        time.sleep(10)

if __name__ == "__main__":
    print("=" * 50)
    print("  RemoteDesk Host Agent")
    print("=" * 50)
    print(f"  Host ID:    {HOST_ID}")
    print(f"  Server:     {SERVER_URL}")
    print(f"  Screen:     {SCREEN_W}x{SCREEN_H}")
    print(f"  OS:         {platform.system()} {platform.release()}")
    print("=" * 50)

    # Start background threads
    threading.Thread(target=clipboard_sync_loop, daemon=True).start()
    threading.Thread(target=heartbeat_loop, daemon=True).start()

    # Connect to server
    try:
        sio.connect(SERVER_URL, transports=["websocket", "polling"])
        sio.wait()
    except KeyboardInterrupt:
        print("\n[agent] Stopped by user")
    except Exception as exc:
        print(f"[agent] Connection error: {exc}", file=sys.stderr)
        sys.exit(1)
