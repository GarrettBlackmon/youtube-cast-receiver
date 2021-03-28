const { app, BrowserWindow } = require('electron')

function createWindow () {
    win = new BrowserWindow({fullscreen: true});
    win.loadURL('http://youtube.com/tv',
      {userAgent: 'Mozilla/5.0 (Linux; Tizen 2.3) AppleWebKit/538.1 (KHTML, like Gecko)Version/2.3 TV Safari/538.1'});
 
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