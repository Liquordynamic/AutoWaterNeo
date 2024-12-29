import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { modelNode } from './model/modelNode'
import { taskNode } from './model/taskNode'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost', // 数据库主机
  port: 5432, // 数据库端口
  username: 'postgres', // 数据库用户名
  password: '123456', // 数据库密码
  database: 'autowater', // 数据库名称
  synchronize: true, // 是否自动同步数据库表结构，生产环境建议关闭
  logging: true, // 是否启用日志
  entities: [modelNode, taskNode] // 实体路径
})
