import 'reflect-metadata'
import { v4 as uuidv4 } from 'uuid'
import 'reflect-metadata'
// import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

// @Entity()
export class modelNode {
  // @PrimaryGeneratedColumn('uuid')
  private _id: string
  // @Column()
  private _name: string
  // @Column('simple-array')
  private _param_key: string[]
  // @Column()
  private _program: string
  // @Column()
  private _exe_prefix: string
  // @Column()
  private _conda_env: string

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
    this._id = this.generateUUID()
    this._name = name
    this._param_key = param_key
    this._program = program
    this._exe_prefix = exe_prefix
    this._conda_env = conda_env
  }

  // id
  get id(): string {
    return this._id
  }

  set id(value: string) {
    this._id = value
  }

  // name
  get name(): string {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }

  // param_key
  get param_key(): string[] {
    return this._param_key
  }

  set param_key(value: string[]) {
    this._param_key = value
  }

  // program
  get program(): string {
    return this._program
  }

  set program(value: string) {
    this._program = value
  }

  // exe_prefix
  get exe_prefix(): string {
    return this._exe_prefix
  }

  set exe_prefix(value: string) {
    this._exe_prefix = value
  }

  // conda_env
  get conda_env(): string {
    return this._conda_env
  }

  set conda_env(value: string) {
    this._conda_env = value
  }
}
