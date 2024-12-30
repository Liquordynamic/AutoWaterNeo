import 'reflect-metadata'
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/logo.png?asset'
import express from 'express'
import cors from 'cors'
import { testController } from './controller/testController'
import { AppDataSource } from './data-source'

const server = express()
const port = 3000
// const staticDir = 'D:/2024-work/HKData'
const staticDir = 'E:/HKData/3DTiles'   //ljx数据地址
// const staticDir = 'E:/香港瓦片'

server.use(cors())
server.use(express.static(staticDir))
// parse application/x-www-form-urlencoded
server.use(express.urlencoded({ extended: false }))
// parse application/json
server.use(express.json())

// Controller
server.use('/api/test', testController)

server.listen(port, () => {
  console.log('Express server is running on http://localhost:3000')
})

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 使用 ipcMain.handle 监听渲染进程的异步请求
ipcMain.handle('sendJSONToMain', async (_event, data) => {
  console.log('Received JSON from renderer:', data)

  // 假设对数据进行一些处理
  const result = {
    a: 321,
    b: 654
  }

  // 返回处理后的结果
  return result
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  await AppDataSource.initialize()
  console.log('Data Source has been initialized!')

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
