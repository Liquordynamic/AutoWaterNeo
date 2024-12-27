export enum ResponseCode {
  SUCCESS = 200,
  ERROR = 500
}

export interface Res {
  code: number
  success: boolean
  message: string
}
