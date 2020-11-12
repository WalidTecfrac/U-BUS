import { app, protocol, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { autoUpdater } from "electron-updater";
const log = require('electron-log');
autoUpdater.autoDownload = false;
app.setAppUserModelId("u-bus");
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
const isDevelopment = process.env.NODE_ENV !== 'production';
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    frame: false,
    fullscreen: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder
      ///guide/security.html#node-integration for more info
      nodeIntegration: true,
    },
  });
  win.once('ready-to-show', () => {
    win.show()
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    await win.loadURL('app://./index.html');
  }
  function sendStatusToWindow(text) {
    log.info(text);
  }
  ipcMain.on("close-app",() => {
    win.close()
  });
  ipcMain.on("minimize-app", () => {
    win.minimize()
  });
  ipcMain.on("fullscreen-app", () => {
    if(win.fullScreen){
      win.fullScreen = false
    }
    else {
      win.fullScreen = true
    }
  });
  ipcMain.on("download-update", () => {
    autoUpdater.downloadUpdate()
    autoUpdater.on('download-progress', (info) => {
      win.webContents.send("download-progress", info);
    });
    autoUpdater.once('update-downloaded', (info, releaseName) => {
      win.webContents.send("update-downloaded", info, releaseName);
    });
    autoUpdater.once('error', (event, err) => {
      win.webContents.send("update-error", event, err);
    });
  });
  ipcMain.on("quit-and-install", () => {
      autoUpdater.quitAndInstall();
  });
  ipcMain.on("check-for-update", () => {
    autoUpdater
      .checkForUpdates()
    autoUpdater.once('update-available', (info, updateData) => {
      win.webContents.send("update-available", info, updateData);
    });
    autoUpdater.once('update-not-available', (info) => {
      win.webContents.send("update-not-available", info)
    });
    autoUpdater.once('error', (event, err) => {
      win.webContents.send("update-error", event ,err);
    });
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
