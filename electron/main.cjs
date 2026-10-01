const { app, BrowserWindow, ipcMain, dialog, shell, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const https = require('https');
const { spawn, execFile } = require('child_process');

let mainWindow = null;
const activeDownloads = new Map(); // id -> ChildProcess

// Determine bin paths
function getBinPath(filename) {
  const devPath = path.join(__dirname, '..', 'bin', filename);
  if (fs.existsSync(devPath)) return devPath;

  const prodPath = path.join(process.resourcesPath, 'bin', filename);
  if (fs.existsSync(prodPath)) return prodPath;

  const appPath = path.join(app.getAppPath(), '..', 'bin', filename);
  if (fs.existsSync(appPath)) return appPath;

  return filename;
}

const ytdlpPath = getBinPath('yt-dlp.exe');
const ffmpegDir = path.dirname(getBinPath('ffmpeg.exe'));

// Ensure default download directory
const defaultDownloadDir = path.join(os.homedir(), 'Downloads', 'SpectreWare');
if (!fs.existsSync(defaultDownloadDir)) {
  try {
    fs.mkdirSync(defaultDownloadDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create default download directory:', err);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 880,
    height: 620,
    minWidth: 780,
    minHeight: 520,
    frame: false,
    backgroundColor: '#09090c',
    title: 'SpectreWare 1.0',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true
    }
  });

  const devUrl = 'http://localhost:5173';
  const distFile = path.join(__dirname, '..', 'dist', 'index.html');

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(devUrl).catch(() => {
      setTimeout(() => mainWindow.loadURL(devUrl), 1000);
    });
  } else if (fs.existsSync(distFile)) {
    mainWindow.loadFile(distFile);
  } else {
    mainWindow.loadURL(devUrl).catch(() => {
      setTimeout(() => mainWindow.loadURL(devUrl), 1000);
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

function killProcessTree(child) {
  if (!child || !child.pid) return;
  try {
    if (process.platform === 'win32') {
      execFile('taskkill', ['/pid', child.pid.toString(), '/T', '/F'], () => {});
    } else {
      child.kill('SIGTERM');
    }
  } catch (_) {}
}

app.on('window-all-closed', () => {
  // Cancel any running downloads cleanly including child process tree
  for (const [id, child] of activeDownloads.entries()) {
    killProcessTree(child);
  }
  activeDownloads.clear();
  if (process.platform !== 'darwin') app.quit();
});

// IPC: Window Controls
ipcMain.handle('window-control', (_event, action) => {
  if (!mainWindow) return false;
  switch (action) {
    case 'minimize':
      mainWindow.minimize();
      return true;
    case 'maximize':
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
        return false;
      } else {
        mainWindow.maximize();
        return true;
      }
    case 'close':
      mainWindow.close();
      return true;
    case 'isMaximized':
      return mainWindow.isMaximized();
    default:
      return false;
  }
});

// IPC: Folder & File Operations
ipcMain.handle('get-default-path', () => defaultDownloadDir);

ipcMain.handle('select-folder', async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Download Folder - SpectreWare',
    defaultPath: defaultDownloadDir,
    properties: ['openDirectory', 'createDirectory']
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  return result.filePaths[0];
});

ipcMain.handle('open-folder', async (_event, folderPath) => {
  const target = folderPath || defaultDownloadDir;
  if (fs.existsSync(target)) {
    await shell.openPath(target);
    return true;
  }
  return false;
});

ipcMain.handle('open-file', async (_event, filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    await shell.openPath(filePath);
    return true;
  }
  return false;
});

ipcMain.handle('read-clipboard', () => {
  const text = clipboard.readText().trim();
  if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|tiktok\.com|twitter\.com|x\.com|facebook\.com|instagram\.com|twitch\.tv|bilibili\.com)\/.+$/i.test(text)) {
    return text;
  }
  return '';
});

// IPC: Get Verified Subsystem Versions
ipcMain.handle('get-system-versions', async () => {
  const getVersion = (cmd, args) =>
    new Promise((resolve) => {
      execFile(cmd, args, { timeout: 4000 }, (err, stdout) => {
        if (err || !stdout) resolve('Unknown');
        else resolve(stdout.trim().split('\n')[0]);
      });
    });

  let ytdlpVer = 'Ready';
  if (fs.existsSync(ytdlpPath)) {
    const raw = await getVersion(ytdlpPath, ['--version']);
    ytdlpVer = raw || '2026.x';
  }

  const ffmpegBin = path.join(ffmpegDir, 'ffmpeg.exe');
  let ffmpegVer = 'Ready';
  if (fs.existsSync(ffmpegBin)) {
    const raw = await getVersion(ffmpegBin, ['-version']);
    const m = raw.match(/ffmpeg version\s+([^\s]+)/i);
    ffmpegVer = m ? m[1] : 'GPL 7.x';
  }

  return {
    suite: '1.0.0',
    ytdlp: ytdlpVer,
    ffmpeg: ffmpegVer,
    electron: process.versions.electron || '41.x'
  };
});

// IPC: Real-time Maintenance & Killswitch Status Checker
ipcMain.handle('check-maintenance-status', async (_event, customUrl) => {
  // First check local status.json for local/offline fallback
  const localStatusPath = path.join(__dirname, '..', 'status.json');
  const resStatusPath = path.join(process.resourcesPath, 'status.json');
  const statusFile = fs.existsSync(localStatusPath) ? localStatusPath : (fs.existsSync(resStatusPath) ? resStatusPath : null);
  let localData = null;
  if (statusFile) {
    try {
      localData = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    } catch (_) {}
  }

  const targetUrl =
    customUrl ||
    'https://raw.githubusercontent.com/tigergenz/SpectreWare/main/status.json';

  const urlWithCacheBust = `${targetUrl}?_t=${Date.now()}`;

  return new Promise((resolve) => {
    const req = https.get(
      urlWithCacheBust,
      {
        headers: {
          'User-Agent': 'SpectreWare-Desktop/1.0',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache'
        },
        timeout: 4500
      },
      (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          // If remote fails, fallback to local if available
          return resolve(localData || { maintenance: false, statusCode: res.statusCode });
        }

        let raw = '';
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(raw);
            resolve(parsed);
          } catch (_) {
            resolve(localData || { maintenance: false });
          }
        });
      }
    );

    req.on('error', () => {
      // In case of offline, return local status or default false
      resolve(localData || { maintenance: false, offline: true });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(localData || { maintenance: false, timeout: true });
    });
  });
});

// IPC: Fetch Video Information
ipcMain.handle('fetch-info', async (_event, url) => {
  return new Promise((resolve, reject) => {
    if (!url || typeof url !== 'string') {
      return reject(new Error('Invalid URL provided'));
    }

    const args = [
      '--dump-single-json',
      '--no-warnings',
      '--no-playlist',
      '--skip-download',
      url
    ];

    execFile(ytdlpPath, args, { maxBuffer: 50 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        console.error('yt-dlp info error:', stderr || error.message);
        return reject(new Error(stderr || error.message));
      }

      try {
        const data = JSON.parse(stdout);

        // Process available video formats and heights
        const resolutionsSet = new Set();
        if (Array.isArray(data.formats)) {
          for (const f of data.formats) {
            if (f.height && f.vcodec && f.vcodec !== 'none') {
              resolutionsSet.add(f.height);
            }
          }
        }

        // Sort descending: e.g. 2160, 1440, 1080, 720, 480, 360
        const sortedResolutions = Array.from(resolutionsSet).sort((a, b) => b - a);

        const info = {
          id: data.id,
          title: data.title || 'Unknown Title',
          thumbnail: data.thumbnail || (data.thumbnails && data.thumbnails.length ? data.thumbnails[data.thumbnails.length - 1].url : ''),
          duration: data.duration || 0,
          uploader: data.uploader || data.channel || 'Unknown Uploader',
          viewCount: data.view_count || 0,
          webpageUrl: data.webpage_url || url,
          resolutions: sortedResolutions.length > 0 ? sortedResolutions : [1080, 720, 480],
          description: (data.description || '').slice(0, 300)
        };

        resolve(info);
      } catch (parseErr) {
        console.error('JSON parse error:', parseErr);
        reject(new Error('Failed to parse video metadata: ' + parseErr.message));
      }
    });
  });
});

// IPC: Start Download with Real-Time Progress Stream
ipcMain.handle('start-download', async (event, params) => {
  const {
    id,
    url,
    type = 'video', // 'video' | 'audio'
    quality = '1080',
    audioFormat = 'mp3', // 'mp3' | 'm4a'
    audioBitrate = '320', // '320' | '256' | '192' | '128'
    outputDir = defaultDownloadDir,
    title = 'video'
  } = params;

  if (activeDownloads.has(id)) {
    return { success: false, message: 'Download already in progress' };
  }

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const args = [
    '--newline',
    '--no-playlist',
    '--no-warnings',
    '--ffmpeg-location', ffmpegDir,
  ];

  if (params.embedThumbnail || params.embedThumbnails) {
    args.push('--embed-thumbnail', '--add-metadata');
  }

  if (type === 'audio') {
    args.push(
      '-x',
      '--audio-format', audioFormat,
      '--audio-quality', audioBitrate === '320' ? '0' : (audioBitrate === '256' ? '2' : '4'),
      '-o', path.join(outputDir, '%(title)s.%(ext)s'),
      url
    );
  } else {
    // Video download: merge best video <= selected height with best audio
    const formatSpec = `bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]/best`;
    args.push(
      '-f', formatSpec,
      '--merge-output-format', 'mp4',
      '-o', path.join(outputDir, '%(title)s.%(ext)s'),
      url
    );
  }

  const child = spawn(ytdlpPath, args);
  activeDownloads.set(id, child);

  let finalFilePath = '';

  child.stdout.on('data', (chunk) => {
    const text = chunk.toString();
    const lines = text.split(/\r?\n/);

    for (const line of lines) {
      if (!line.trim()) continue;

      // Check destination file name
      // e.g., [download] Destination: ... or [Merger] Merging formats into "..."
      const destMatch = line.match(/(?:Destination:\s+|Merging formats into\s+["']?)([^"'\r\n]+)/i);
      if (destMatch && destMatch[1]) {
        finalFilePath = destMatch[1].trim();
      }

      // Check progress pattern:
      // [download]  45.2% of  125.40MiB at  15.30MiB/s ETA 00:04
      const progressMatch = line.match(/\[download\]\s+([\d.]+)%\s+of\s+~?([\w.]+)\s+at\s+([\w./]+)\s+ETA\s+([\d:]+)/i);
      if (progressMatch) {
        const percent = parseFloat(progressMatch[1]);
        const totalSize = progressMatch[2];
        const speed = progressMatch[3];
        const eta = progressMatch[4];

        if (mainWindow) {
          mainWindow.setProgressBar(Math.min(Math.max(percent / 100, 0), 1));
          mainWindow.webContents.send('download-progress', {
            id,
            percent,
            speed,
            eta,
            totalSize,
            status: 'downloading',
            line
          });
        }
      } else if (line.includes('[download] 100%')) {
        if (mainWindow) {
          mainWindow.webContents.send('download-progress', {
            id,
            percent: 100,
            speed: '0 KiB/s',
            eta: '00:00',
            status: 'processing',
            line: 'Finalizing & Converting...'
          });
        }
      }
    }
  });

  child.stderr.on('data', (chunk) => {
    console.error(`yt-dlp stderr [${id}]:`, chunk.toString());
  });

  child.on('close', (code) => {
    activeDownloads.delete(id);
    if (mainWindow && activeDownloads.size === 0) {
      mainWindow.setProgressBar(-1);
    }
    if (code === 0) {
      if (mainWindow) {
        mainWindow.webContents.send('download-complete', {
          id,
          filePath: finalFilePath || path.join(outputDir, `${title}.${type === 'audio' ? audioFormat : 'mp4'}`),
          outputDir
        });
      }
    } else {
      if (mainWindow) {
        mainWindow.webContents.send('download-error', {
          id,
          message: `Process exited with code ${code}`
        });
      }
    }
  });

  child.on('error', (err) => {
    activeDownloads.delete(id);
    if (mainWindow && activeDownloads.size === 0) {
      mainWindow.setProgressBar(-1);
    }
    if (mainWindow) {
      mainWindow.webContents.send('download-error', {
        id,
        message: err.message
      });
    }
  });

  return { success: true, message: 'Download initiated' };
});

// IPC: Cancel Active Download
ipcMain.handle('cancel-download', (_event, id) => {
  if (activeDownloads.has(id)) {
    const child = activeDownloads.get(id);
    killProcessTree(child);
    activeDownloads.delete(id);
    if (mainWindow && activeDownloads.size === 0) {
      mainWindow.setProgressBar(-1);
    }
    return true;
  }
  return false;
});
