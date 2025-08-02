const { contextBridge, ipcRenderer } = require('electron');

// Безопасно экспонируем API для renderer процесса
contextBridge.exposeInMainWorld('electron', {
  // Управление окном
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  
  // Уведомления
  updateBadge: (count) => ipcRenderer.send('update-badge', count),
  
  // Системная информация
  platform: process.platform,
  
  // Версии
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
});