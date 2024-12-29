import 'reflect-metadata'
import { taskNode } from '../model/taskNode'
import { modelNode } from '../model/modelNode'
import { spawn } from 'child_process'
import { repositoryUtil } from './repositoryUtil'
import { Repository } from 'typeorm'

export class processUtil {
  // private static _condaStr: string = 'conda activate'
  private static _sysCmdExeStr: string = process.platform === 'win32' ? 'cmd.exe' : 'bash'
  private static _sysLinkStr: string = process.platform === 'win32' ? '/c' : '-c'

  private static _modelNodeRepo: Repository<modelNode> = repositoryUtil.getRepository('modelNode')
  private static _taskNodeRepo: Repository<taskNode> = repositoryUtil.getRepository('taskNode')

  public static build = async (task_node: taskNode): Promise<string> => {
    const model_node: modelNode | null = await this._modelNodeRepo.findOne({
      where: { id: task_node.model_node_id }
    })

    if (model_node) {
      // 处理参数
      let paramString = ''
      if (model_node.param_key && task_node.params) {
        const paramKeys = model_node.param_key
        const taskParams = task_node.params

        paramString = paramKeys
          .map((key: string) => key.trim())
          .map((key: string) => {
            const value = taskParams[key]
            return value !== undefined ? `${value}` : ''
          })
          .filter((param: string) => param !== '')
          .join(' ')
      }

      const childProcess = spawn(this._sysCmdExeStr, [
        this._sysLinkStr,
        model_node.exe_prefix,
        model_node.program,
        paramString
      ])

      // 进程开始时更新状态
      task_node.status = 'running'
      const task_node_saved = await this._taskNodeRepo.save(task_node)

      // 输出处理
      childProcess.stdout.on('data', (data: Buffer) => {
        console.log(`stdout: ${data.toString()}`)
      })

      childProcess.stderr.on('data', (data: Buffer) => {
        console.error(`stderr: ${data.toString()}`)
      })

      // 进程结束时更新状态
      childProcess.on('close', async (code: number) => {
        task_node.status = code === 0 ? 'success' : 'error'
        await this._taskNodeRepo.save(task_node)
        console.log(`Process closed with code ${code}, status updated to ${task_node.status}`)
      })

      // 错误处理
      childProcess.on('error', async (err: Error) => {
        task_node.status = 'error'
        await this._taskNodeRepo.save(task_node)
        console.error('Process error:', err)
      })
      return task_node_saved.id
    } else {
      throw new Error('modelNode not found')
    }
  }
}
