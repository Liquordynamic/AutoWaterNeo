/* eslint-disable @typescript-eslint/no-explicit-any */
// 获取当前设备的 CPU 线程数目，作为 numberOfThreads 的默认值。
const { length: cpusLength } = require('os').cpus()
import { Worker } from 'node:worker_threads'
import { EventEmitter } from 'events'

type TaskObj = {
  data: any
  cb: (error: any, result: any) => void
}

export default class WorkerPool extends EventEmitter {
  workerPath: string
  numberOfThreads: number
  _queue: TaskObj[]
  _workersById: { [key: string]: Worker }
  _activeWorkersById: { [key: string]: boolean }
  //   _monitorWorker: Worker

  constructor(workerPath: string, options = {}, numberOfThreads = cpusLength) {
    if (numberOfThreads < 1) {
      throw new Error('Number of threads should be greater or equal than 1!')
    }
    super()
    this.workerPath = workerPath
    this.numberOfThreads = numberOfThreads
    // 任务队列
    this._queue = []
    // Worker 索引
    this._workersById = {}
    // Worker 激活状态索引
    this._activeWorkersById = {}
    // this._monitorWorker = new Worker()
    // 创建 Workers
    for (let i = 0; i < this.numberOfThreads; i++) {
      const worker = new Worker(workerPath, options)
      this._workersById[i] = worker
      // 将这些 Worker 设置为未激活状态
      this._activeWorkersById[i] = false
    }
  }
  /**
   * 检查空闲的 Worker
   */
  private getInactiveWorkerId(): number {
    for (let i = 0; i < this.numberOfThreads; i++) {
      if (!this._activeWorkersById[i]) return i
    }
    return -1
  }
  /**
   * 调用 Worker 执行，目的是在指定的 Worker 里执行指定的任务
   */
  runWorker(workerId: number, taskObj: TaskObj): void {
    const worker = this._workersById[workerId]
    // 当任务执行完毕后执行
    const doAfterTaskIsFinished = (): void => {
      // 去除所有的 Listener，不然一次次添加不同的 Listener 会内存溢出（OOM）
      worker.removeAllListeners('message')
      worker.removeAllListeners('error')
      // 将这个 Worker 设为未激活状态
      this._activeWorkersById[workerId] = false

      if (this._queue.length) {
        // 任务队列非空，使用该 Worker 执行任务队列中第一个任务
        // 已检查 _queue 非空，所以可以安全地使用 shift()
        this.runWorker(workerId, this._queue.shift() as TaskObj)
      }
    }
    // 将这个 Worker 设置为激活状态
    this._activeWorkersById[workerId] = true
    // 设置两个回调，用于 Worker 的监听器
    const messageCallback = (result: any): void => {
      console.log('thread', worker.threadId, ':', result)
      taskObj.cb(null, result)
      doAfterTaskIsFinished()
    }
    const errorCallback = (error: any): void => {
      taskObj.cb(error, null)
      doAfterTaskIsFinished()
    }
    // 为 Worker 添加 'message' 和 'error' 两个 Listener
    worker.once('message', messageCallback)
    worker.once('error', errorCallback)
    // 将数据传给 Worker 供其获取和执行
    worker.postMessage(taskObj.data)
  }
  /**
   * 运行线程
   */
  run(data: any): Promise<any> {
    // Promise 是个好东西
    return new Promise((resolve, reject): number | null => {
      // 调用 getInactiveWorkerId() 获取一个空闲的 Worker
      const availableWorkerId = this.getInactiveWorkerId()
      const taskObj = {
        data,
        cb: (error: any, result: any): void => {
          // 虽然 Workers 需要使用 Listener 和 Callback，但这不能阻止我们使用 Promise，对吧？
          // 不，你不能 util.promisify(taskObj) 。人不能，至少不应该。
          if (error) reject(error)
          return resolve(result)
        }
      }
      if (availableWorkerId === -1) {
        // 当前没有空闲的 Workers 了，把任务丢进队列里，这样一旦有 Workers 空闲时就会开始执行。
        this._queue.push(taskObj)
        return null
      }
      // 有一个空闲的 Worker，用它执行任务
      this.runWorker(availableWorkerId, taskObj)
      return availableWorkerId
    })
  }
  /**
   * 销毁
   */
  destroy(force = false): void {
    for (let i = 0; i < this.numberOfThreads; i++) {
      if (this._activeWorkersById[i] && !force) {
        // 通常情况下，不应该在还有 Worker 在执行的时候就销毁它，这一定是什么地方出了问题，所以还是抛个 Error 比较好
        // 不过保留一个 force 参数，总有人用得到的
        throw new Error(`The worker ${i} is still runing!`)
      }
      // 销毁这个 Worker
      this._workersById[i].terminate()
    }
  }
}
module.exports = WorkerPool
