import { parentPort, workerData, isMainThread } from 'worker_threads'

if (!isMainThread) {
  const pPort = parentPort
  if (!pPort) throw new Error('IllegalState')

  pPort.on('message', (msg) => {
    console.log('msg from main:', msg)
    pPort.postMessage(`hello from worker ${workerData}`)
  })
}
