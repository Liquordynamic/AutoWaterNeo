/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { parentPort } from 'worker_threads'
import { WorkerMessage } from './workerTypes'

class SupervisorWorker {
  private results: Map<number, any> = new Map()
  private workerStatus: Map<number, string> = new Map()
  private combinedData: any = null

  constructor() {
    this.initialize()
  }

  private initialize(): void {
    if (!parentPort) throw new Error('Supervisor worker must be run in a worker thread')

    parentPort.on('message', (message: { type: string; data: WorkerMessage }) => {
      switch (message.type) {
        case 'workerMessage':
          this.handleWorkerMessage(message.data)
          break
        case 'workerError':
          this.handleWorkerError({
            workerId: message.data.workerId,
            error: message.data.error || new Error('Unknown error')
          })
          break
        case 'workerExit':
          this.handleWorkerExit({
            workerId: message.data.workerId,
            code: message.data.exitCode || 0
          })
          break
      }
    })
  }

  private handleWorkerMessage(msgData: WorkerMessage): void {
    const { type, workerId, data } = msgData
    // console.log('mes data', msgData)
    if (type === 'result') {
      this.results.set(workerId, data)
      this.combineResults()
    }

    this.workerStatus.set(workerId, data)
    this.reportStatus()
  }

  private handleWorkerError(data: { workerId: number; error: Error }): void {
    this.workerStatus.set(data.workerId, 'error')
    this.reportStatus()
  }

  private handleWorkerExit(data: { workerId: number; code: number }): void {
    this.workerStatus.set(data.workerId, 'exited')
    this.reportStatus()
  }

  private combineResults(): void {
    // Example combination logic - modify based on your needs
    this.combinedData = Array.from(this.results.values()).reduce((acc, curr) => {
      return Array.isArray(curr) ? [...acc, ...curr] : [...acc, curr]
    }, [])

    parentPort?.postMessage({
      type: 'combinedResults',
      data: this.combinedData
    })
  }

  private reportStatus(): void {
    parentPort?.postMessage({
      type: 'status',
      data: {
        workerStatus: Object.fromEntries(this.workerStatus),
        activeWorkers: Array.from(this.workerStatus.entries()).filter(
          ([_, status]) => status !== 'exited'
        ).length
      }
    })
  }
}

// Start the supervisor
new SupervisorWorker()
