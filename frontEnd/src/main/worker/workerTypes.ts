/* eslint-disable @typescript-eslint/no-explicit-any */
// types.ts
export interface WorkerMessage {
  type: 'result' | 'error' | 'status'
  workerId: number
  data?: any
  error?: Error
  exitCode?: number
}

export interface WorkerPoolConfig {
  workerPath: string
  numWorkers: number
  taskTimeout?: number
}

export interface CompletionStatus {
  totalTasks: number
  completedTasks: number
  failedTasks: number
  remainingTasks: number
  isComplete: boolean
}
