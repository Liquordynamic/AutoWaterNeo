import 'reflect-metadata'
import { Entity, Column, TreeChildren, TreeParent, Tree } from 'typeorm'
import { baseNode } from './base/baseNode'

@Entity('data_node')
@Tree('materialized-path')
export class dataNode extends baseNode {
  @Column({ type: 'varchar', length: 255, nullable: false, default: 'vector' })
  type: 'vector' | 'raster' | 'other' = 'vector'

  @Column({ type: 'json', nullable: false, default: {} })
  data_source: {
    // 数据源类型
    type: 'db' | 'file' | 'service'

    // 数据库域名
    db_type?: 'mysql' | 'postgresql' | 'oracle' | 'sqlserver' | 'db2' | 'sqlite' | 'other'
    db_host?: string
    db_port?: number
    db_name?: string
    db_user?: string
    db_password?: string
    db_table?: string

    // 文件
    file_path?: string
    file_type?: string

    // 服务
    service_url?: string
    service_method?: string
    service_params?: string
  } = {
    type: 'db'
  }

  @Column({ type: 'json', nullable: true, default: {} })
  usage: {
    type?: string
    // 矢量
    visualization_field?: string
    detail_field?: string
    // 栅格
    min_zoom?: number
    max_zoom?: number
    size?: number
  } = {}

  @TreeParent()
  declare parent: dataNode | null

  @TreeChildren()
  declare children: dataNode[]

  constructor(init?: Partial<dataNode>) {
    super(init)
    if (init) {
      this.type = init.type || 'vector'
      this.data_source = init.data_source || { type: 'db' }
      this.usage = init.usage || {}
    }
  }
}
