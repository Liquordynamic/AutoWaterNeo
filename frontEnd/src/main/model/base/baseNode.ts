import { v4 as uuidv4 } from 'uuid'
import 'reflect-metadata'
import { Column, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm'

@Tree('materialized-path')
export abstract class baseNode {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255, nullable: false, default: 'test' })
  name: string

  @TreeParent()
  parent!: baseNode | null

  @TreeChildren()
  children!: baseNode[]

  private generateUUID = (): string => {
    return uuidv4()
  }

  constructor(init?: Partial<baseNode>) {
    this.id = this.generateUUID()
    this.name = init?.name || ''
  }
}
