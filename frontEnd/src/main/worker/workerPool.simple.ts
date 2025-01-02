/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Worker } from 'worker_threads'
import { EventEmitter } from 'events'
import { CompletionStatus, WorkerMessage, WorkerPoolConfig } from './workerTypes'

export default class WorkerPool extends EventEmitter {
  private workers: Worker[] = []
  private available: number[] = []
  private queue: Array<{
    task: any
    resolve: (result: any) => void
    reject: (error: Error) => void
  }> = []
  private config: WorkerPoolConfig
  private completionStatus: CompletionStatus = {
    totalTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    remainingTasks: 0,
    isComplete: false
  }

  constructor(config: WorkerPoolConfig) {
    super()
    this.config = config
    this.initialize()
  }

  private initialize(): void {
    for (let i = 0; i < this.config.numWorkers; i++) {
      const worker = new Worker(this.config.workerPath)
      worker.on('message', (msg: WorkerMessage) => {
        this.handleWorkerMessage(i, msg)
      })
      worker.on('error', (error) => {
        this.emit('workerError', { workerId: i, error })
      })
      worker.on('exit', (code) => {
        this.emit('workerExit', { workerId: i, code })
      })
      this.workers.push(worker)
      this.available.push(i)
    }
  }

  private handleWorkerMessage(workerId: number, message: WorkerMessage): void {
    this.emit('workerMessage', message)
    if (message.type === 'result') {
      this.completionStatus.completedTasks++
      this.updateCompletionStatus()
      this.available.push(workerId)
      this.processNextTask()
    } else if (message.type === 'error') {
      this.completionStatus.failedTasks++
      this.updateCompletionStatus()
    }
  }

  private updateCompletionStatus(): void {
    this.completionStatus.remainingTasks =
      this.completionStatus.totalTasks -
      (this.completionStatus.completedTasks + this.completionStatus.failedTasks)

    this.completionStatus.isComplete = this.completionStatus.remainingTasks === 0

    if (this.completionStatus.isComplete) {
      this.emit('allTasksComplete', this.completionStatus)
    }

    this.emit('completionStatus', this.completionStatus)
  }

  private processNextTask(): void {
    if (this.queue.length === 0 || this.available.length === 0) return

    const workerId = this.available.shift()!
    const { task, resolve, reject } = this.queue.shift()!

    // const timeout = this.config.taskTimeout
    //   ? setTimeout(() => {
    //       reject(new Error(`Task timeout after ${this.config.taskTimeout}ms`))
    //     }, this.config.taskTimeout)
    //   : null

    this.workers[workerId].postMessage({ task, workerId })
  }

  async executeTask(task: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject })
      this.completionStatus.remainingTasks++
      this.completionStatus.totalTasks++
      this.processNextTask()
    })
  }

  async executeBatch(tasks: any[]): Promise<{ results: any[]; status: CompletionStatus }> {
    this.completionStatus = {
      totalTasks: tasks.length,
      completedTasks: 0,
      failedTasks: 0,
      remainingTasks: tasks.length,
      isComplete: false
    }

    const results = await Promise.all(tasks.map((task) => this.executeTask(task)))
    return { results, status: this.completionStatus }
  }

  terminate(): Promise<number[]> {
    return Promise.all(this.workers.map((worker) => worker.terminate()))
  }
}
