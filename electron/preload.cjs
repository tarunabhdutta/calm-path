// The only bridge between the page and the PC. No Node access in the page.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('calmDesk', {
  readVault: () => ipcRenderer.invoke('vault:read'),
  writeVault: (json) => ipcRenderer.invoke('vault:write', json),
  backup: (json) => ipcRenderer.invoke('vault:backup', json),
  restorePick: () => ipcRenderer.invoke('vault:restorePick'),
  exportFile: (name, json) => ipcRenderer.invoke('file:export', name, json),
  info: () => ipcRenderer.invoke('desk:info'),
  chooseBackupDir: () => ipcRenderer.invoke('desk:chooseBackupDir'),
  notify: (title, body) => ipcRenderer.send('desk:notify', title, body),
});
