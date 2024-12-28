import 'reflect-metadata'
import { v4 as uuidv4 } from 'uuid'

export class taskNode {
  _id: string
  _modelNodeID: string
  _status: string
  _params: Record<string, string>

  private generateUUID = (): string => {
    return uuidv4()
  }

  constructor(modelNodeID: string, status: string, params: Record<string, string>) {
    this._id = this.generateUUID()
    this._modelNodeID = modelNodeID
    this._status = status
    this._params = params
  }

  // id
  get id(): string {
    return this._id
  }

  set id(value: string) {
    this._id = value
  }

  // modelNodeID
  get modelNodeID(): string {
    return this._modelNodeID
  }

  set modelNodeID(value: string) {
    this._modelNodeID = value
  }

  // status
  get status(): string {
    return this._status
  }

  set status(value: string) {
    this._status = value
  }

  // params
  get params(): Record<string, string> {
    return this._params
  }

  set params(value: Record<string, string>) {
    this._params = value
  }
}
