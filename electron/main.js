// Modules to control application life and create native browser window
const {app, BrowserWindow,Menu,screen} = require('electron')
const ipc = require('electron').ipcMain;
const path = require('path')
//Menu.setApplicationMenu(null)
const mode = 'development'
const Store = require('electron-store');
// 初始化
Store.initRenderer();

const remote = require("@electron/remote/main");
const { fstat } = require('fs');

//...

try {
    require('electron-reloader')(module,{});
  } catch (_) {}
let status = 0;
let mainWindow =null;
//app.setName("db-design");
function createWindow () {
  // Create the browser window.
    mainWindow = new BrowserWindow({
    width: screen.getPrimaryDisplay().workAreaSize.width-20,
    height: screen.getPrimaryDisplay().workAreaSize.height-10,
    minWidth: screen.getPrimaryDisplay().workAreaSize.width-20,
    minHeight:screen.getPrimaryDisplay().workAreaSize.height-10,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation:false
    }
  })
  // and load the index.html of the app.
  mainWindow.loadURL(mode === 'development' ? 'http://localhost:2103' : `file://${path.join(__dirname, '../dist/index.html')}`)

    // Open the DevTools.
    if (mode === 'development') {
      //  mainWindow.webContents.openDevTools()
    }
    mainWindow.on("close",(e)=>{
      if (status == 0) {
        if (mainWindow) {
            e.preventDefault();
        }
        mainWindow.webContents.send('app-close');
      }
    })
  

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  remote.initialize();
  remote.enable(mainWindow.webContents);
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
 
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// app.on('window-all-closed', function (e) {
//   if (process.platform !== 'darwin') app.quit()
// })
ipc.on('closed', _ => {
  status = 1;
  if (process.platform !== 'darwin') {
      app.quit();
  }
  mainWindow.close();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.