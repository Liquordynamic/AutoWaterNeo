import 'reflect-metadata'
import { ResponseCode, Res } from '../types'
// import { spawn } from 'child_process'
import { processUtil } from '../util/processUtil'
import { modelNode } from '../model/modelNode'
import { taskNode } from '../model/taskNode'
import { repositoryUtil } from '../util/repositoryUtil'

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
    // const child = spawn('python', [pyPath, name])

    // let stdoutData = ''
    // let stderrData = ''

    // // 捕获标准输出数据
    // child.stdout.on('data', (data) => {
    //   stdoutData += data.toString()
    //   console.log(`stdout: ${data}`)
    // })

    // // 捕获标准错误数据
    // child.stderr.on('data', (data) => {
    //   stderrData += data.toString()
    //   console.error(`stderr: ${data}`)
    // })

    // // 监听子进程退出
    // child.on('close', (code) => {
    //   console.log(`子进程退出，退出码: ${code}`)
    //   console.log(stdoutData)
    //   console.log(stderrData)
    // })
    const model_node: modelNode | null = await repositoryUtil
      .getRepository('modelNode')
      .findOne({ where: { name: 'test' } })
    if (model_node) {
      const node = new taskNode(model_node.id, 'created', {})
      processUtil.build(node)
    } else {
      throw new Error('modelNode not found')
    }

    return {
      code: ResponseCode.SUCCESS,
      message: '子进程已启动',
      success: true
    }
  } catch (error) {
    console.error(`exec error: ${error}`)
    return {
      code: ResponseCode.ERROR,
      message: '启动子进程失败',
      success: false
    }
  }
}

export const testService = {
  testData,
  testRunPy
}
