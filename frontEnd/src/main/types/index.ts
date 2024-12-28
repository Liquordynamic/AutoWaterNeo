export enum ResponseCode {
  SUCCESS = 200,
  ERROR = 500
}

export interface ResDTO {
  code: number
  success: boolean
  message: string
}

export class Res {
  code: number
  success: boolean
  message: string

  constructor(code: number, success: boolean, message: string) {
    this.code = code
    this.success = success
    this.message = message
  }

  public static success(message: string): Res {
    return new Res(ResponseCode.SUCCESS, true, message)
  }

  public static error(message: string): Res {
    return new Res(ResponseCode.ERROR, false, message)
  }
}
