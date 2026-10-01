const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('spectreAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('window-control', 'minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-control', 'maximize'),
  closeWindow: () => ipcRenderer.invoke('window-control', 'close'),
  isMaximized: () => ipcRenderer.invoke('window-control', 'isMaximized'),

  // System & Path operations
  getDefaultDownloadPath: () => ipcRenderer.invoke('get-default-path'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  openFolder: (dirPath) => ipcRenderer.invoke('open-folder', dirPath),
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
  readClipboard: () => ipcRenderer.invoke('read-clipboard'),

  // yt-dlp Video / Audio Operations
  fetchVideoInfo: (url) => ipcRenderer.invoke('fetch-info', url),
  startDownload: (params) => ipcRenderer.invoke('start-download', params),
  cancelDownload: (id) => ipcRenderer.invoke('cancel-download', id),

  // Event Listeners for real-time progress
  onDownloadProgress: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('download-progress', listener);
    return () => ipcRenderer.removeListener('download-progress', listener);
  },
  onDownloadComplete: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('download-complete', listener);
    return () => ipcRenderer.removeListener('download-complete', listener);
  },
  onDownloadError: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('download-error', listener);
    return () => ipcRenderer.removeListener('download-error', listener);
  }
});
