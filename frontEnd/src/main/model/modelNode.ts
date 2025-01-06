import 'reflect-metadata'
import { Entity, Column, TreeChildren, TreeParent, Tree } from 'typeorm'
import { baseNode } from './base/baseNode'

@Entity('model_node')
@Tree('materialized-path')
export class modelNode extends baseNode {
  @Column({ type: 'varchar', length: 32, nullable: false, default: 'category' })
  type: 'category' | 'script' | 'rest_api' | 'grpc' | 'local_service' | 'message_queue' = 'category'

  @Column({ type: 'simple-array', nullable: true, default: [] })
  param_key: string[] = []

  @Column({ type: 'json', nullable: true })
  param_config: {
    name: string
    defaultValue?: string
    prefix?: string
    required?: boolean
    description?: string
  }[] = []

  @Column({ type: 'json', nullable: true })
  model_config: {
    // 脚本类型配置
    entry_file?: string
    exe_prefix?: string
    conda_env?: string

    // REST API配置
    endpoint?: string
    method?: string
    headers?: Record<string, string>

    // gRPC配置
    grpcHost?: string
    grpcPort?: number
    serviceName?: string
    methodName?: string
    protoPath?: string

    // 本地服务配置
    serviceHost?: string
    servicePort?: number
    protocol?: string // 通信协议

    // 消息队列配置
    queueName?: string
    broker?: string
    exchange?: string // 用于 RabbitMQ 等
    topic?: string // 用于 Kafka 等
  } = {}

  @TreeParent()
  declare parent: modelNode | null

  @TreeChildren()
  declare children: modelNode[]

  constructor(init?: Partial<modelNode>) {
    super(init)
    if (init) {
      this.type = init.type || 'script'
      this.param_key = init.param_key || []
      this.param_config = init.param_config || []
      this.model_config = init.model_config || {}
    }
  }
}
