import 'reflect-metadata'
import { taskNode } from '../model/taskNode'
import { modelNode } from '../model/modelNode'
// import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { repositoryUtil } from './repositoryUtil'

export class processUtil {
  private static _condaStr: string = 'conda activate '

  public static build = async (taskNode: taskNode): Promise<void> => {
    const modelNode: modelNode | null = await repositoryUtil.getRepository('modelNode').findOne({
      where: { id: taskNode.modelNodeID }
    })
    if (modelNode) {
      // return spawn(this._condaStr + modelNode.conda_env + ' ' + , [, modelNode.program])
      console.log(this._condaStr + modelNode.conda_env + ' ' + modelNode.program)
    } else {
      throw new Error('modelNode not found')
    }
  }
}
