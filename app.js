const { app, BrowserWindow } = require('electron')
const path = require('path')
const server = require("./server");

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webPreferences: {
        nodeIntegration: true,
        devTools: true
      }
    },
    autoHideMenuBar: true
  })

  win.loadFile(path.join(__dirname, `/dist/builder/index.html`))
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
