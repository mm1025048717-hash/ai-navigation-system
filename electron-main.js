const { app, BrowserWindow, screen, ipcMain, desktopCapturer } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 关键修复：默认不穿透，让侧边栏可以点击
  mainWindow.setIgnoreMouseEvents(false);

  const url = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(url);

  // 不自动打开调试工具
}

// 动态切换点击穿透状态
ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
  if (mainWindow) {
    mainWindow.setIgnoreMouseEvents(ignore, options || {});
  }
});

// 真实屏幕捕捉 - 支持实时捕获
ipcMain.handle('capture-screen', async () => {
  try {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const sources = await desktopCapturer.getSources({ 
      types: ['screen'], 
      thumbnailSize: { width, height }
    });
    
    if (sources && sources.length > 0) {
      return sources[0].thumbnail.toDataURL();
    }
    return null;
  } catch (err) {
    console.error('Screen capture failed:', err);
    return null;
  }
});

// 获取屏幕尺寸
ipcMain.handle('get-screen-size', async () => {
  try {
    const display = screen.getPrimaryDisplay();
    return {
      width: display.workAreaSize.width,
      height: display.workAreaSize.height,
    };
  } catch (err) {
    console.error('Get screen size failed:', err);
    return { width: 1920, height: 1080 };
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
