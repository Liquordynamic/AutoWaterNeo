import 'reflect-metadata'
import { Repository } from 'typeorm'
import { AppDataSource } from '../data-source'
import { modelNode } from '../model/modelNode'
import { taskNode } from '../model/taskNode'

const EntityMap = {
  modelNode: modelNode,
  taskNode: taskNode
}

export class repositoryUtil {
  public static getRepository(node: string): Repository<modelNode> {
    return AppDataSource.getRepository(EntityMap[node])
  }
}
