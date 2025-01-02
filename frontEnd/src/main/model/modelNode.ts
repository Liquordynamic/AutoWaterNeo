import 'reflect-metadata'
import { v4 as uuidv4 } from 'uuid'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('model_node')
export class modelNode {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255, nullable: false, default: 'test' })
  name: string

  @Column({ type: 'varchar', length: 32, nullable: false })
  type: 'script' | 'rest_api' | 'grpc' | 'local_service' | 'message_queue'

  @Column({ type: 'simple-array', nullable: true, default: [] })
  param_key: string[]

  @Column({ type: 'json', nullable: true })
  param_config: {
    name: string
    defaultValue?: string
    prefix?: string
    required?: boolean
    description?: string
  }[]

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
  }

  private generateUUID = (): string => {
    return uuidv4()
  }

  constructor(
    name: string,
    type: 'script' | 'rest_api' | 'grpc' | 'local_service' | 'message_queue',
    param_key: string[],
    param_config: modelNode['param_config'],
    model_config: modelNode['model_config']
  ) {
    this.id = this.generateUUID()
    this.name = name
    this.param_key = param_key ? (Array.isArray(param_key) ? [...param_key] : []) : []
    this.param_config = param_config ? [...param_config] : []
    this.type = type
    this.model_config = { ...model_config }
  }
}
