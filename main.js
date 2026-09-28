const { app, BrowserWindow } = require('electron')
const path = require('path');
const iconPath = path.join(__dirname, "build", "icon.png");
const userAgent = 'Mozilla/5.0 (PS4; Leanback Shell) Gecko/20100101 Firefox/65.0 LeanbackShell/01.00.01.75 Sony PS4/ (PS4, , no, CH)';
const tvUrl = 'https://youtube.com/tv';
const startPage = path.join(__dirname, 'renderer', 'start.html');

// the spoofed TV user agent has to apply to every navigation, not just the
// first one, otherwise youtube bounces us the moment it navigates itself
app.userAgentFallback = userAgent;

let win = null;
// we open youtube.com/tv on our own exactly once; after that the start page's
// Reload link is what tries again, so a dead connection can't put us in a loop
let openedTv = false;

function createWindow () {
    win = new BrowserWindow(
      {
        fullscreen: true,
        icon: iconPath,
        autoHideMenuBar: true,
        backgroundColor: '#15171c'
      });

    // start on the bundled page so the window has something in it from the
    // first frame, including when there is no network at all
    openedTv = false;
    win.loadFile(startPage);

    win.webContents.on('did-finish-load', () => {
      if (openedTv) return;
      openedTv = true;
      win.loadURL(tvUrl);
    });

    win.webContents.on('did-fail-load', (_event, errorCode, _description, _url, isMainFrame) => {
      // -3 is ERR_ABORTED, which is what we get for navigating away ourselves
      if (!isMainFrame || errorCode === -3) return;
      openedTv = true;
      win.loadFile(startPage, { query: { offline: '1' } });
    });

    win.on('closed', () => {
      win = null
    });
 }

 app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
