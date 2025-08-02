import { app, BrowserWindow, Menu, Tray, nativeImage, shell } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    frame: false, // Убираем стандартную рамку для кастомного title bar
    titleBarStyle: 'hidden',
    backgroundColor: '#0a0a0b',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../../public/icon.png'),
    show: false, // Не показываем окно сразу
  });

  // Плавное появление окна
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Загрузка приложения
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../index.html'));
  }

  // Обработка внешних ссылок
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  const icon = nativeImage.createFromPath(path.join(__dirname, '../../public/tray-icon.png'));
  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Показать Discord Lite',
      click: () => {
        mainWindow?.show();
      }
    },
    {
      label: 'Скрыть',
      click: () => {
        mainWindow?.hide();
      }
    },
    { type: 'separator' },
    {
      label: 'Выход',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Discord Lite');
  tray.setContextMenu(contextMenu);

  // Клик по иконке в трее
  tray.on('click', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.show();
    }
  });
}

// Убираем меню по умолчанию
Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Обработка IPC сообщений от renderer процесса
import { ipcMain } from 'electron';

// Управление окном
ipcMain.on('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.on('window-close', () => {
  mainWindow?.hide();
});

// Получение состояния окна
ipcMain.handle('window-is-maximized', () => {
  return mainWindow?.isMaximized();
});

// Обработка обновления badge (количество непрочитанных)
ipcMain.on('update-badge', (_, count: number) => {
  if (process.platform === 'darwin') {
    app.setBadgeCount(count);
  }
});