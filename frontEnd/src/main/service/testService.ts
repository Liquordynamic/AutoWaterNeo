import { ResponseCode, Res } from '../types'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const testData = (): Res => {
  return { code: ResponseCode.SUCCESS, message: 'Hello from Express!', success: true }
}

const testRunPy = async (pyPath: string, name: string): Promise<Res> => {
  try {
    // 执行命令并等待结果
    const { stdout, stderr } = await execAsync(`python ${pyPath} ${name}`)

    if (stderr) {
      console.warn(`exec warning: ${stderr}`)
    }

    return {
      code: ResponseCode.SUCCESS,
      message: stdout.trim(), // 去除多余的换行符
      success: true
    }
  } catch (error) {
    console.error(`exec error: ${error}`)
    return {
      code: ResponseCode.ERROR,
      message: 'Server Error',
      success: false
    }
  }
}

export const testService = {
  testData,
  testRunPy
}
