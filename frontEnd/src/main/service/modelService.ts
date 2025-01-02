import 'reflect-metadata'
import { Res } from '../types'
import { modelNode } from '../model/modelNode'
import { repositoryUtil } from '../util/repositoryUtil'
import { Repository } from 'typeorm'
import * as fs from 'fs/promises'
import * as path from 'path'
import AdmZip from 'adm-zip'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { createReadStream } from 'fs'
import { taskNode } from '../model/taskNode'
import { processUtil } from '../util/processUtil'

export class modelService {
  private _modelNodeRepo: Repository<modelNode> = repositoryUtil.getRepository('modelNode')
  private _scriptDir = import.meta.env.MAIN_VITE_SCRIPTS_DIR

  // 解压zip文件
  private async extractZipFile(model_node_id: string, zipFile: string): Promise<string> {
    const modelDir = path.join(this._scriptDir, model_node_id)
    // 确保目录存在
    await fs.mkdir(modelDir, { recursive: true })

    const tempZipPath = path.join(modelDir, 'temp.zip')

    // 使用 stream 处理 File
    const readStream = createReadStream(zipFile)
    const writeStream = createWriteStream(tempZipPath)
    await pipeline(readStream, writeStream)

    // 解压文件
    const zip = new AdmZip(tempZipPath)
    zip.extractAllTo(modelDir, true)

    // 删除临时zip文件
    await fs.unlink(tempZipPath)

    return modelDir
  }

  // 注册模型
  public register = async (data: modelNode, filePath: string): Promise<Res> => {
    try {
      if (data.type === 'script' && !filePath) {
        return Res.error('script file is required for script type model')
      }

      const model_node = new modelNode(
        data.name,
        data.type,
        data.param_key,
        data.param_config,
        data.model_config
      )

      if (data.type === 'script' && filePath) {
        // 区分zip文件和脚本文件
        if (filePath.endsWith('.zip')) {
          console.log('zip file')
          // 解压zip文件
          await this.extractZipFile(model_node.id, filePath)
        } else {
          // 复制脚本文件到模型目录
          const modelDir = path.join(this._scriptDir, model_node.id)
          await fs.mkdir(modelDir, { recursive: true })
          await fs.copyFile(filePath, path.join(modelDir, model_node.model_config.entry_file ?? ''))
        }
      }

      const result = await this._modelNodeRepo.save(model_node)
      return Res.success('model registered successfully', result.id)
    } catch (error) {
      console.error(`Failed to register model: ${error}`)
      return Res.error('Failed to register model')
    }
  }

  // 获取模型列表
  public list = async (): Promise<Res> => {
    try {
      const modelNodeList = await this._modelNodeRepo.find()
      return Res.success('model list fetched successfully', modelNodeList)
    } catch (error) {
      console.error(`Failed to get model list: ${error}`)
      return Res.error('Failed to get model list')
    }
  }

  // 删除模型
  public delete = async (id: string): Promise<Res> => {
    try {
      await this._modelNodeRepo.delete({ id: id })
      // 删除模型目录
      const modelDir = path.join(this._scriptDir, id)
      await fs.rm(modelDir, { recursive: true, force: true })
      return Res.success('model deleted successfully')
    } catch (error) {
      console.error(`Failed to delete model: ${error}`)
      return Res.error('Failed to delete model')
    }
  }

  // 更新模型
  public update = async (id: string, data: modelNode): Promise<Res> => {
    try {
      await this._modelNodeRepo.update(id, data)
      return Res.success('model updated successfully')
    } catch (error) {
      console.error(`Failed to update model: ${error}`)
      return Res.error('Failed to update model')
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
      const task_node = new taskNode(model.id, 'created', {})
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
