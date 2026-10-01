# SPECTREWARE 1.0
### Ultra-Fast Obsidian Desktop Media Acquisition Suite

An ultra-fast, premium desktop application engineered for high-definition media extraction and lossless audio conversion from YouTube, Shorts, TikTok, Twitch, and more.

Built with **Electron 41**, **React 19**, **TypeScript**, and **Tailwind CSS**, powered under the hood by high-performance **yt-dlp** and **FFmpeg GPL**.

---

## 🚀 Key Features

* **4K 60FPS Video Extraction:** Hardware-level FFmpeg muxing supporting UHD 2160p, QHD 1440p, FHD 1080p, 720p, 480p, and 360p.
* **Lossless Audio Extraction:** Direct 320 kbps Studio MP3 or Apple AAC (M4A) with embedded high-resolution ID3 cover art.
* **Instant URL Detection:** Intelligent auto-clipboard scanning on window focus and debounced auto-analyze on paste (`Ctrl+V`).
* **Live Task Monitoring:** Real-time download telemetry (Speed, ETA, size) with active gradient shimmer pulse during FFmpeg stream muxing.
* **Download Library & Safe Management:** Built-in history with one-click direct playback, folder navigation, and 2-step deletion safety.
* **Dynamic Ambient Aura:** Calibrated 7-hue chromatic background lighting system (Cobalt, Glacier, Violet, Emerald, Crimson, Amber, Stealth) with adjustable intensity.
* **System Verifier:** Live native IPC telemetry reporting real binary versions of yt-dlp, FFmpeg, and Electron.

---

## 📂 Project Structure

```
SpectreWare/
│
├── 🖥️ electron/               # Electron backend & native IPC bridge
│   ├── main.cjs               # Native process lifecycle, IPC handlers, child process manager
│   └── preload.cjs            # Context-isolated IPC API bridge
│
├── 🎨 src/                    # Frontend UI (React 19 + TypeScript)
│   ├── components/            # Luxury UI modules (Downloader, Queue, History, Settings)
│   ├── data/                  # Chromatic aura profiles & changelog
│   ├── types/                 # TypeScript contract definitions
│   ├── utils/                 # Unit & duration formatters
│   ├── App.tsx                # Master desktop state & layout orchestrator
│   └── main.tsx               # Client entry point
│
├── ⚙️ bin/                    # Pre-bundled native binaries (yt-dlp.exe, ffmpeg.exe)
├── 🚀 run.bat                 # Instant 1-click launcher for Windows
└── 📦 package.json            # Node/Vite build configuration
```

---

## 📦 How to Launch

### Method 1: Instant Launch (Windows)
Double-click **`run.bat`** in the project root folder.

### Method 2: Command Line (Production Preview)
```powershell
npm start
```

### Method 3: Developer Mode (Hot-Reload)
Runs Vite with strict port on `localhost:5173` and launches Electron concurrently:
```powershell
npm run app
```

---

## 🛠️ Tech Stack & Binaries
* **Runtime:** Electron 41.x
* **Frontend:** React 19, TypeScript, Tailwind CSS
* **Stream Extractor:** yt-dlp (Bundled)
* **Muxer / Transcoder:** FFmpeg GPL 7.x (Bundled)
* **Packaging:** Vite 8.x
