const { app, BrowserWindow } = require('electron')
const path = require('path');
const iconPath = path.join(__dirname, "build", "icon.png");

function createWindow () {
    win = new BrowserWindow(
      {
        fullscreen: true,
        icon: iconPath,
        autoHideMenuBar: true
      });
    win.loadURL('http://youtube.com/tv',
      {userAgent: 'Mozilla/5.0 (PS4; Leanback Shell) Gecko/20100101 Firefox/65.0 LeanbackShell/01.00.01.75 Sony PS4/ (PS4, , no, CH)'});
 
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
