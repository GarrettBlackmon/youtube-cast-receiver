const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron')
const path = require('path');

const iconPath = path.join(__dirname, "build", "icon.png");
const userAgent = 'Mozilla/5.0 (PS4; Leanback Shell) Gecko/20100101 Firefox/65.0 LeanbackShell/01.00.01.75 Sony PS4/ (PS4, , no, CH)';

let win = null;
let tray = null;

function trayImage() {
    if (process.platform === 'darwin') {
        // the menu bar wants a monochrome template image, macOS inverts it for us on dark backgrounds
        const image = nativeImage.createFromPath(path.join(__dirname, 'assets', 'tray', 'iconTemplate.png'));
        image.setTemplateImage(true);
        return image;
    }
    if (process.platform === 'win32') {
        return path.join(__dirname, 'assets', 'tray', 'icon.ico');
    }
    return path.join(__dirname, 'assets', 'tray', 'icon.png');
}

function showWindow() {
    if (!win) {
        createWindow();
        return;
    }
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
}

function createTray() {
    tray = new Tray(trayImage());
    tray.setToolTip('Youtube Cast Receiver');
    tray.setContextMenu(Menu.buildFromTemplate([
        { label: 'Show', click: showWindow },
        { type: 'separator' },
        { label: 'Quit', click: () => app.quit() }
    ]));
    // linux only gets the context menu, the click events are mac/windows only
    tray.on('click', showWindow);
}

function createWindow () {
    win = new BrowserWindow(
      {
        fullscreen: true,
        icon: iconPath,
        autoHideMenuBar: true,
        webPreferences: {
          // keep timers and the cast connection running at full speed when we're not in front
          backgroundThrottling: false
        }
      });
    win.loadURL('https://youtube.com/tv', { userAgent: userAgent });

    win.on('closed', () => {
      win = null
    });
 }

// launching a second copy should bring the running one forward instead of starting another
if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    app.on('second-instance', showWindow);

    app.whenReady().then(() => {
        createTray();
        createWindow()

        app.on('activate', () => {
          if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
          } else {
            showWindow();
          }
        })
      })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          app.quit()
        }
      })
}
