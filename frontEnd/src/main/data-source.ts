import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { modelNode } from './model/modelNode'
import { taskNode } from './model/taskNode'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: import.meta.env.MAIN_VITE_DBHOST, // 数据库主机
  port: import.meta.env.MAIN_VITE_DBPORT, // 数据库端口
  username: import.meta.env.MAIN_VITE_USERNAME, // 数据库用户名
  password: import.meta.env.MAIN_VITE_PASSWORD, // 数据库密码
  database: import.meta.env.MAIN_VITE_DBNAME, // 数据库名称
  synchronize: true, // 是否自动同步数据库表结构，生产环境建议关闭
  logging: false, // 是否启用日志
  entities: [modelNode, taskNode] // 实体路径
})
