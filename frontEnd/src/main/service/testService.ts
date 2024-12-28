/*
 * @Author: Stevnda 1849698643@qq.com
 * @Date: 2024-12-27 21:15:47
 * @LastEditors: Stevnda 1849698643@qq.com
 * @LastEditTime: 2024-12-27 23:44:37
 * @FilePath: \frontEnd\src\main\service\testService.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ResponseCode, Res } from '../types'
import { spawn } from 'child_process'

const testData = (): Res => {
  return { code: ResponseCode.SUCCESS, message: 'Hello from Express!', success: true }
}

// const testRunPy = async (pyPath: string, name: string): Promise<Res> => {
//   try {
//     // 执行命令并等待结果
//     const { stdout, stderr } = await execAsync(`python ${pyPath} ${name}`)

//     if (stderr) {
//       console.warn(`exec warning: ${stderr}`)
//     }

//     return {
//       code: ResponseCode.SUCCESS,
//       message: stdout.trim(), // 去除多余的换行符
//       success: true
//     }
//   } catch (error) {
//     console.error(`exec error: ${error}`)
//     return {
//       code: ResponseCode.ERROR,
//       message: 'Server Error',
//       success: false
//     }
//   }
// }
const testRunPy = async (pyPath: string, name: string): Promise<Res> => {
  try {
    // 执行命令并等待结果
    const child = spawn(`python ${pyPath} ${name}`)

    // 捕获标准输出数据
    child.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    // 捕获标准错误数据
    child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
    })

    // 监听子进程退出
    child.on('close', (code) => {
      console.log(`子进程退出，退出码: ${code}`)
    })

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
