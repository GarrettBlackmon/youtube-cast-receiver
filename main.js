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
      {userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36; Youtube ; Tizen 4.0'});
 
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