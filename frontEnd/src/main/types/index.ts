import { modelNode } from '../model/modelNode'
import { taskNode } from '../model/taskNode'

export enum ResponseCode {
  SUCCESS = 200,
  ERROR = 500
}

export interface ResDTO {
  code: number
  success: boolean
  message: string
}

export type ResData = string | modelNode | taskNode | modelNode[] | taskNode[]

export class Res<T = ResData> {
  code: number
  success: boolean
  message: string
  data?: T

  constructor(code: number, success: boolean, message: string, data?: T) {
    this.code = code
    this.success = success
    this.message = message
    this.data = data
  }

  public static success<T>(message: string, data?: T): Res<T> {
    return new Res<T>(ResponseCode.SUCCESS, true, message, data)
  }

  public static error<T>(message: string, data?: T): Res<T> {
    return new Res<T>(ResponseCode.ERROR, false, message, data)
  }
}
