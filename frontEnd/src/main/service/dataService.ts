import { repositoryUtil } from '../util/repositoryUtil'
import { dataNode } from '../model/dataNode'
import { Repository } from 'typeorm'

export class dataService {
  private _dataNodeRepo: Repository<dataNode> = repositoryUtil.getRepository('dataNode')

  // 获取数据节点
  public async getDataNode(id: string): Promise<dataNode> {
    const dataNode = await this._dataNodeRepo.findOne({ where: { id } })
    if (!dataNode) {
      throw new Error('Data node not found')
    }
    return dataNode
  }

  // 获取数据节点列表
  public async getDataNodeList(): Promise<dataNode[]> {
    return await this._dataNodeRepo.find()
  }

  // 创建数据节点
  public async createDataNode(dataNode: dataNode): Promise<dataNode> {
    return await this._dataNodeRepo.save(dataNode)
  }

  // 更新数据节点
  public async updateDataNode(dataNode: dataNode): Promise<dataNode> {
    return await this._dataNodeRepo.save(dataNode)
  }

  // 删除数据节点
  public async deleteDataNode(id: string): Promise<void> {
    await this._dataNodeRepo.delete(id)
  }
}
