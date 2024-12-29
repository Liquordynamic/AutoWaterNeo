import 'reflect-metadata'
import { ResponseCode, Res } from '../types'
import { processUtil } from '../util/processUtil'
import { modelNode } from '../model/modelNode'
import { taskNode } from '../model/taskNode'
import { repositoryUtil } from '../util/repositoryUtil'
import { Repository } from 'typeorm'

export class testService {
  private _modelNodeRepo: Repository<modelNode> = repositoryUtil.getRepository('modelNode')

  public testData = (): Res => {
    return { code: ResponseCode.SUCCESS, message: 'Hello from Express!', success: true }
  }

  public testRunPy = async (name: string): Promise<Res> => {
    try {
      const model_node: modelNode | null = await this._modelNodeRepo.findOne({
        where: { name: 'test' }
      })
      if (model_node) {
        const node = new taskNode(model_node.id, 'created', { name: name })
        const task_node_id = await processUtil.build(node)
        return Res.success(task_node_id)
      } else {
        console.log('modelNode not found')
        return Res.error('modelNode not found')
      }
    } catch (error) {
      console.error(`exec error: ${error}`)
      return Res.error('failed to start child process')
    }
  }
}
