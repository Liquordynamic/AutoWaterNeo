import 'reflect-metadata'
import { v4 as uuidv4 } from 'uuid'
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('model_node')
export class modelNode {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255, nullable: false, default: 'test' })
  name: string

  @Column({ type: 'simple-array', nullable: true, default: [] })
  param_key: string[]

  @Column({ type: 'varchar', length: 255, nullable: true, default: 'test' })
  program: string

  @Column({ type: 'varchar', length: 255, nullable: true, default: 'test' })
  exe_prefix: string

  @Column({ type: 'varchar', length: 255, nullable: true, default: 'test' })
  conda_env: string

  private generateUUID = (): string => {
    return uuidv4()
  }

  constructor(
    name: string,
    param_key: string[],
    program: string,
    exe_prefix: string,
    conda_env: string
  ) {
    this.id = this.generateUUID()
    this.name = name
    this.param_key = param_key
    this.program = program
    this.exe_prefix = exe_prefix
    this.conda_env = conda_env
  }
}
