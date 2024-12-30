import 'reflect-metadata'
import { Repository } from 'typeorm'
import { AppDataSource } from '../data-source'
import { modelNode } from '../model/modelNode'
import { taskNode } from '../model/taskNode'

const EntityMap = {
  modelNode: modelNode,
  taskNode: taskNode
} as const

export class repositoryUtil {
  public static getRepository<T extends keyof typeof EntityMap>(
    node: T
  ): Repository<InstanceType<(typeof EntityMap)[T]>> {
    return AppDataSource.getRepository<InstanceType<(typeof EntityMap)[T]>>(EntityMap[node])
  }
}
