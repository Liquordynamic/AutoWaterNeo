import 'reflect-metadata'
import express from 'express'
import { Request, Response } from 'express'
import { testService } from '../service/testService'
import path from 'path'

export const testController = express.Router()

// api/test/data
testController.get('/data', (_req: Request, res: Response) => {
  res.status(200).json(testService.testData())
})
// api/test/run-python
testController.get('/run-python', async (req: Request, res: Response) => {
  const pythonScriptPath = path.join('D:/data/autowater/py', 'test.py')
  console.log(req.query.name)
  const name = (req.query.name as string) || 'World' // 获取 URL 参数 name
  try {
    // 调用 testRunPy 并等待结果
    const result = await testService.testRunPy(pythonScriptPath, name)
    // 根据结果返回响应
    res.status(result.code).json(result)
  } catch (error) {
    console.error('Unexpected error:', error)
    res.status(500).json({
      code: 500,
      message: 'Unexpected Server Error',
      success: false
    })
  }
})
