import 'reflect-metadata'
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/logo.png?asset'
import express from 'express'
import cors from 'cors'
import { testController } from './controller/testController'
import { AppDataSource } from './data-source'
import { Worker } from 'worker_threads'
// import createWorker from './worker/simpleWorker?nodeWorker'
import workerPath from './worker/testWorker?modulePath'
import supervisorWorkerPath from './worker/supervisorWorker?modulePath'
// import WorkerPool from './worker/workerPool'
import WorkerPool from './worker/workerPool.simple'
import { modelController } from './controller/modelController'

const server = express()
const port = 3000
// const staticDir = 'D:/2024-work/HKData'
const staticDir = 'E:/HKData/3DTiles' //ljx数据地址
// const staticDir = 'E:/香港瓦片'

server.use(cors())
server.use(express.static(staticDir))
// parse application/x-www-form-urlencoded
server.use(express.urlencoded({ extended: false }))
// parse application/json
server.use(express.json())

// Controller
server.use('/api/test', testController)
server.use('/api/model', modelController)

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
      // nodeIntegration: true,  // 可选，如果需要在渲染进程使用 Node.js API
      nodeIntegrationInWorker: true, // 在 Web Worker 中启用 Node.js API
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

  // const workerPool = new WorkerPool(workerPath)
  // Promise.all(
  //   [4, 12, 13, 15].map(async (item) => {
  //     await workerPool.run({ userId: item })
  //   })
  // ).then(() => {
  //   // 销毁线程池
  //   workerPool.destroy()
  // })
  const workPoolTest = false
  if (workPoolTest) {
    const pool = new WorkerPool({
      numWorkers: 4,
      taskTimeout: 5000,
      workerPath
    })
    const supervisor = new Worker(supervisorWorkerPath)

    // Forward worker pool events to supervisor
    pool.on('workerMessage', (data) => {
      supervisor.postMessage({ type: 'workerMessage', data })
    })

    pool.on('workerError', (data) => {
      supervisor.postMessage({ type: 'workerError', data })
    })

    pool.on('workerExit', (data) => {
      supervisor.postMessage({ type: 'workerExit', data })
    })

    supervisor.on('message', (message) => {
      if (message.type === 'combinedResults') {
        console.log('Combined results:', message.data)
      } else if (message.type === 'status') {
        console.log('Worker pool status:', message.data)
      }
    })

    // Method 1: Using completion event
    // pool.on('allTasksComplete', (status) => {
    //   console.log('All tasks completed!', status)
    //   // You can now safely terminate or process final results
    // })

    // Method 2: Monitor completion status
    pool.on('completionStatus', (status) => {
      console.log('Completion status:', {
        completed: status.completedTasks,
        failed: status.failedTasks,
        remaining: status.remainingTasks,
        total: status.totalTasks,
        percentComplete: ((status.completedTasks / status.totalTasks) * 100).toFixed(2) + '%'
      })
    })

    try {
      const tasks = [
        { type: 'aggregate', data: [1, 2, 3] },
        { type: 'aggregate', data: [4, 5, 6] },
        { type: 'aggregate', data: [7, 8, 9] }
      ]

      await Promise.all(tasks.map((task) => pool.executeTask(task)))
      // Method 3: Using batch execution
      // const { results, status } = await pool.executeBatch(tasks)
      // console.log('Batch execution completed:', {
      //   results,
      //   status
      // })
    } finally {
      await pool.terminate()
      await supervisor.terminate()
    }
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
