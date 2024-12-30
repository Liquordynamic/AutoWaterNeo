import 'reflect-metadata'
import { v4 as uuidv4 } from 'uuid'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('task_node')
export class taskNode {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', nullable: false })
  model_node_id: string

  @Column({ type: 'varchar', length: 255, nullable: false, default: 'test' })
  status: string

  @Column({ type: 'simple-json', nullable: true, default: {} })
  params: Record<string, string>

  private generateUUID = (): string => {
    return uuidv4()
  }

  constructor(model_node_id: string, status: string, params: Record<string, string>) {
    this.id = this.generateUUID()
    this.model_node_id = model_node_id
    this.status = status
    this.params = params
  }
}
