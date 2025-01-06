import 'reflect-metadata'
import { Res } from '../types'
import { modelNode } from '../model/modelNode'
import * as fs from 'fs/promises'
import * as path from 'path'
import { taskNode } from '../model/taskNode'
import { processUtil } from '../util/processUtil'
import { baseService } from './base/baseService'
import { Repository } from 'typeorm'
import { repositoryUtil } from '../util/repositoryUtil'
import { fileUtil } from '../util/fileUtil'
import { existsSync } from 'fs'

export class modelService extends baseService<modelNode> {
  private _modelNodeRepo: Repository<modelNode> = repositoryUtil.getRepository(modelNode)
  private _scriptDir = import.meta.env.MAIN_VITE_SCRIPTS_DIR

  // 注册模型
  public register = async (data: modelNode, parentId?: string, filePath?: string): Promise<Res> => {
    try {
      if (data.type === 'script' && !filePath) {
        return Res.error('script file is required for script type model')
      }
      const new_model_node = new modelNode(data)
      // 如果模型类型为script，则需要注册模型文件
      if (data.type === 'script' && filePath) {
        // 区分zip文件和脚本文件
        if (filePath.endsWith('.zip')) {
          // 解压zip文件
          await fileUtil.extractZipFile(new_model_node.id, filePath)
        } else {
          // 复制脚本文件到模型目录
          const modelDir = path.join(this._scriptDir, new_model_node.id)
          await fs.mkdir(modelDir, { recursive: true })
          await fs.copyFile(filePath, path.join(modelDir, data.model_config.entry_file ?? ''))
        }
      }
      // 注册成功后，保存模型节点
      const result = await this.createNode(new_model_node, parentId)
      if (result.success && result.data) {
        return Res.success('model registered successfully', result.data.id)
      } else {
        return Res.error('Failed to register model')
      }
    } catch (error) {
      return Res.error('Failed to register model')
    }
  }

  // 删除模型
  public delete = async (id: string): Promise<Res> => {
    try {
      // 删除模型目录
      const modelDir = path.join(this._scriptDir, id)
      // 如果模型目录存在，则删除
      if (existsSync(modelDir)) {
        await fs.rm(modelDir, { recursive: true, force: true })
      }
      // 删除模型节点
      await this._modelNodeRepo.delete({ id: id })
      return Res.success('model deleted successfully')
    } catch (error) {
      console.error(`Failed to delete model: ${error}`)
      return Res.error('Failed to delete model')
    }
  }

  // 使用默认值测试模型
  public test = async (id: string): Promise<Res> => {
    try {
      const model = await this._modelNodeRepo.findOne({ where: { id: id } })
      if (!model) {
        return Res.error('model not found')
      }
      // 根据param_key和param_config生成测试task_node
      const param_key = model.param_key
      const param_config = model.param_config
      const task_node = new taskNode({
        name: 'test',
        model_node_id: model.id,
        status: 'created',
        params: {}
      })
      for (const key of param_key) {
        const defaultValue = param_config.find((item) => item.name === key)?.defaultValue
        if (defaultValue) {
          task_node.params[key] = defaultValue
        }
      }
      console.log(task_node)
      if (model.type === 'script') {
        const task_node_id = await processUtil.buildScriptProcess(task_node)
        return Res.success('model test task created', task_node_id)
      } else {
        return Res.error('model type not supported temporarily')
      }
    } catch (error) {
      console.error(`Failed to test model: ${error}`)
      return Res.error('Failed to test model')
    }
  }
}
