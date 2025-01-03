import { Repository, DeepPartial, ObjectLiteral, FindOptionsWhere } from 'typeorm'
import { baseNode } from '../../model/base/baseNode'
import { repositoryUtil } from '../../util/repositoryUtil'
import { Res } from '../../types'
// 使用泛型
export interface IBaseService<T extends baseNode> {
  getNode(id: string): Promise<Res<T>>
  getNodeList(): Promise<Res<T[]>>
  createNode(node: T): Promise<Res<T>>
  updateNode(id: string, node: T): Promise<Res<T>>
  deleteNode(id: string): Promise<Res<void>>
}

export abstract class baseService<T extends baseNode> implements IBaseService<T> {
  private _baseNodeRepo: Repository<T>

  constructor(private entityClass: new () => T) {
    this._baseNodeRepo = repositoryUtil.getRepository(this.entityClass)
  }

  // 获取节点
  public async getNode(id: string): Promise<Res<T>> {
    const node = await this._baseNodeRepo.findOne({ where: { id: id } as FindOptionsWhere<T> })
    if (!node) {
      return Res.error('Node not found')
    }
    return Res.success('Node found', node)
  }

  // 获取节点列表
  public async getNodeList(): Promise<Res<T[]>> {
    const nodes = await this._baseNodeRepo.find()
    return Res.success('Node list found', nodes)
  }

  // 创建节点
  public async createNode(node: T): Promise<Res<T>> {
    try {
      const result = await this._baseNodeRepo.save(node)
      return Res.success('Node created successfully', result)
    } catch (error) {
      return Res.error('Failed to create node')
    }
  }

  // 更新节点
  public async updateNode(id: string, node: T): Promise<Res<T>> {
    try {
      await this._baseNodeRepo.update(id, node as DeepPartial<T & ObjectLiteral>)
      return Res.success('Node updated successfully')
    } catch (error) {
      return Res.error('Failed to update node')
    }
  }

  // 删除节点
  public async deleteNode(id: string): Promise<Res<void>> {
    try {
      await this._baseNodeRepo.delete(id)
      return Res.success('Node deleted successfully')
    } catch (error) {
      return Res.error('Failed to delete node')
    }
  }
}
