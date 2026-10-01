# 👻 SPECTREWARE 1.0
### Advanced Cyber-Dark Media Extractor & Roblox UI Library

---

## ⚡ Overview
**SpectreWare 1.0** is an ultra-fast, premium desktop application engineered for high-definition video extraction and lossless audio conversion from YouTube, Shorts, TikTok, Twitch, and more. Built with a futuristic Ghost Spectre dark-mode design (`#06080e`), glassmorphism telemetry, and direct hardware-accelerated muxing.

It also bundles **SpectreWareUI**, a complete Roblox Luau UI library with identical obsidian-dark aesthetics and ambient aura lighting for game automation & script execution.

---

## 🚀 Key Features

* **High-Definition Video Extraction:** Support for **4K Ultra HD (2160p)**, **1440p (2K)**, **1080p 60FPS**, **720p HD**, and standard resolutions.
* **Lossless Audio Extraction:** Extract direct audio streams converted into **320 kbps Studio Quality MP3** or **Apple AAC (M4A)** with full ID3 metadata & embedded cover art.
* **Ambient Accent Aura:** Calibrated multi-color glow system (Cobalt Sapphire, Glacier Cyan, Obsidian Violet, Tactical Emerald, Crimson Rose, Solar Amber, Obsidian Stealth).
* **Master System Preferences:** Global suite settings, storage path selector, and clipboard auto-detection.
* **Real-Time Telemetry:** Live download progress bar, network throughput speed meter (`MB/s`), remaining time ETA, and dynamic FFmpeg stream-merging status.
* **Custom Frameless Titlebar:** Windows 11 style draggable glass titlebar with taskbar progress and minimize, maximize/restore, and close buttons.

---

## 🎮 SpectreWareUI • Roblox Luau Library

SpectreWareUI is included in this repository as a standalone, zero-dependency Luau library for Roblox executors (CoreGui / `gethui()` safe):

### 📥 Instant Loadstring
```lua
local SpectreWareUI = loadstring(game:HttpGet("https://raw.githubusercontent.com/tigergenz/SpectreWare/main/SpectreWareUI.lua"))()

local Window = SpectreWareUI:CreateWindow({
    Title = "SpectreWare",
    SubTitle = "Suite v1.0",
    Theme = "Cobalt", -- "Cobalt" | "Glacier" | "Violet" | "Emerald"
    ToggleKey = Enum.KeyCode.RightControl
})

local MainTab = Window:CreateTab("Auto Farm")
MainTab:CreateSection("Combat")

MainTab:CreateToggle({
    Name = "Auto Attack Mobs",
    Default = false,
    Callback = function(enabled)
        print("Auto Farm Active:", enabled)
    end
})

MainTab:CreateSlider({
    Name = "Attack Speed",
    Min = 5,
    Max = 30,
    Default = 15,
    Callback = function(val)
        print("Speed:", val)
    end
})

MainTab:CreateDropdown({
    Name = "Target Mob",
    Options = { "Zombie Lv.1", "Skeleton Boss", "Bandit" },
    Default = "Zombie Lv.1",
    Callback = function(selected)
        print("Target:", selected)
    end
})
```

See [`Example_AutoFarm.lua`](Example_AutoFarm.lua) for a full runnable example.

---

## 🛠️ Desktop Suite Architecture

| Component | Technology |
|---|---|
| **App Shell** | Electron 41 (Frameless Native Window, IPC Isolation) |
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **UI & Styling** | Tailwind CSS + Lucide Icons + Obsidian Matte Dark |
| **Download Engine** | `yt-dlp` (Standalone Binary) |
| **Media Muxer & Transcoder** | `FFmpeg` (GPL Build with AAC/MP3 Encoders) |

---

## 📦 How to Run Desktop App

### Method 1: Instant Launch (Double Click)
Double-click `run.bat` in the project folder.

### Method 2: Command Line
```powershell
npm start
```

### Method 3: Development Mode (Hot-Reload)
```powershell
npm run app
```
