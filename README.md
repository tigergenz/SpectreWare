# 👻 SPECTREWARE
### Multi-Tool Obsidian Suite & Roblox Luau UI Library

---

## 📂 Project Organization

This repository is strictly organized into two distinct sections:

```
SpectreWare/
│
├── 🎮 roblox/                   # ── Roblox Luau UI Library ──
│   ├── SpectreWareUI.lua       # Core standalone Luau UI library
│   ├── Example_AutoFarm.lua    # Runnable Auto-Farm example (Loads via HttpGet)
│   └── README.md               # Dedicated documentation for Roblox scripters
│
├── 🖥️ Desktop Application        # ── SpectreWare 1.0 Desktop Suite ──
│   ├── electron/               # Electron backend (IPC, yt-dlp, FFmpeg muxer)
│   ├── src/                    # React 19 + TypeScript + Tailwind UI
│   ├── run.bat                 # 1-Click launcher for Windows
│   └── package.json            # Node/Vite dependencies
│
└── 📄 Root Helpers
    ├── SpectreWareUI.lua       # Root alias loader (Redirects to /roblox/)
    └── Example_AutoFarm.lua    # Root alias example script
```

---

## 🎮 1. SpectreWareUI • Roblox Luau Library

A high-performance, dark obsidian (`#06080e`) UI framework tailored for Roblox script execution (Auto Farm, Hubs, Utility scripts).

* **Direct Cloud Loadstring:**
```lua
local SpectreWareUI = loadstring(game:HttpGet("https://raw.githubusercontent.com/tigergenz/SpectreWare/main/roblox/SpectreWareUI.lua"))()

local Window = SpectreWareUI:CreateWindow({
    Title = "SpectreWare",
    SubTitle = "Auto-Farm Suite v1.0",
    Theme = "Cobalt", -- "Cobalt" | "Glacier" | "Violet" | "Emerald"
    ToggleKey = Enum.KeyCode.RightControl
})

local MainTab = Window:CreateTab("Auto Farm")
MainTab:CreateSection("Combat Automation")

MainTab:CreateToggle({
    Name = "Auto Attack Mobs",
    Default = false,
    Callback = function(enabled)
        print("Auto Farm status:", enabled)
    end
})

MainTab:CreateSlider({
    Name = "Hits Per Second",
    Min = 5,
    Max = 30,
    Default = 15,
    Callback = function(val)
        print("Speed:", val)
    end
})

MainTab:CreateDropdown({
    Name = "Select Monster Target",
    Options = { "Zombie Lv.1", "Skeleton Boss", "Bandit Rogue" },
    Default = "Zombie Lv.1",
    Callback = function(selected)
        print("Selected:", selected)
    end
})
```

For complete documentation, element callbacks, and theme presets, see [**`roblox/README.md`**](roblox/README.md).

---

## 🖥️ 2. SpectreWare 1.0 • Desktop Application

An ultra-fast, premium desktop application engineered for high-definition media extraction and lossless audio conversion from YouTube, Shorts, TikTok, Twitch, and more.

### 🚀 Desktop Features
* **4K 60FPS Video Extraction:** Hardware-level FFmpeg muxing for UHD 2160p, QHD 1440p, FHD 1080p.
* **Lossless Audio Extraction:** Direct 320 kbps Studio MP3 or Apple M4A with embedded high-resolution ID3 cover art.
* **Ambient Accent Aura:** Calibrated 7-hue background lighting system matching user preferences.
* **Global System Preferences:** Unified master settings, auto-clipboard detection, and native Windows taskbar progress bar.

### 📦 How to Launch Desktop App
- **Method 1 (Instant):** Double-click `run.bat` in the project root.
- **Method 2 (Command Line):**
  ```powershell
  npm start
  ```
- **Method 3 (Dev Mode with Hot-Reload):**
  ```powershell
  npm run app
  ```
