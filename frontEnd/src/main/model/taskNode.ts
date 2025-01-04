import 'reflect-metadata'
import { Entity, Column, Tree, TreeChildren, TreeParent } from 'typeorm'
import { baseNode } from './base/baseNode'
import { v4 as uuidv4 } from 'uuid'

@Entity('task_node')
@Tree('materialized-path')
export class taskNode extends baseNode {
  @Column({ type: 'uuid', nullable: false, default: () => 'uuid_generate_v4()' })
  model_node_id: string = uuidv4()

  @Column({ type: 'varchar', length: 255, nullable: false, default: 'default' })
  status: string = 'default'

  @Column({ type: 'simple-json', nullable: true, default: {} })
  params: Record<string, string> = {}

  @TreeParent()
  parent!: taskNode | null

  @TreeChildren()
  children!: taskNode[]

  constructor(init?: Partial<taskNode>) {
    super(init)
    if (init) {
      this.model_node_id = init.model_node_id || ''
      this.status = init.status || ''
      this.params = init.params || {}
    }
  }
}
