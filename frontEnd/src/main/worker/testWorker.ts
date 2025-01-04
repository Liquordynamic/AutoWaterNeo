/* eslint-disable @typescript-eslint/explicit-function-return-type */
// worker.js
import { parentPort } from 'worker_threads'

// Simulated processing delay
const simulateWork = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Task handlers for different types of work
const taskHandlers = {
  // Process array data
  processArray: async (data) => {
    await simulateWork(100) // Simulate some work
    return data.map((num) => num * 2)
  },

  // Aggregate data
  aggregate: async (data) => {
    await simulateWork(150)
    return data.reduce((sum, num) => sum + num, 0)
  },

  // Filter data
  filter: async (data, criteria) => {
    await simulateWork(120)
    return data.filter((num) => num > criteria)
  },

  // Text processing
  processText: async (text) => {
    await simulateWork(200)
    return text.split(' ').length
  }
}
if (!parentPort) throw new Error('IllegalState')
// Handle incoming messages
parentPort.on('message', async ({ task, workerId }) => {
  try {
    if (!parentPort) throw new Error('IllegalState')
    // Log start of processing
    parentPort.postMessage({
      type: 'status',
      workerId,
      data: 'processing'
    })

    let result

    // Process based on task type
    switch (task.type) {
      case 'processArray':
        result = await taskHandlers.processArray(task.data)
        break

      case 'aggregate':
        result = await taskHandlers.aggregate(task.data)
        break

      case 'filter':
        result = await taskHandlers.filter(task.data, task.criteria)
        break

      case 'processText':
        result = await taskHandlers.processText(task.data)
        break

      default:
        throw new Error(`Unknown task type: ${task.type}`)
    }

    // Send back successful result
    parentPort.postMessage({
      type: 'result',
      workerId,
      data: result
    })
  } catch (error) {
    // Send back error if something went wrong
    if (!parentPort) throw new Error('IllegalState')
    parentPort.postMessage({
      type: 'error',
      workerId,
      error: (error as Error).message
    })
  }
})

// Handle errors in the worker
process.on('unhandledRejection', (error) => {
  if (!parentPort) throw new Error('IllegalState')
  parentPort.postMessage({
    type: 'error',
    workerId: 'unknown',
    error: (error as Error).message
  })
})
