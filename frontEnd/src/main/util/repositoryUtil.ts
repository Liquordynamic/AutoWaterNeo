import 'reflect-metadata'
import { Repository } from 'typeorm'
import { AppDataSource } from '../data-source'
import { baseNode } from '../model/base/baseNode'

export class repositoryUtil {
  public static getRepository<T extends baseNode>(nodeType: new () => T): Repository<T> {
    return AppDataSource.getRepository(nodeType)
  }
}
