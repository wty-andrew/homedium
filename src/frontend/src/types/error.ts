export class BaseError extends Error {
  readonly code: number
  readonly type: string

  constructor(code: number, type: string, message: string) {
    super(message)
    this.code = code
    this.type = type
  }

  static from(code: Code, message: string): BaseError {
    return new BaseError(code, CodeType[code], message)
  }
}

export class APIError extends BaseError {
  readonly status: number

  constructor(status: number, code: number, type: string, message: string) {
    super(code, type, message)
    this.status = status
  }
}

export enum Code {
  UNSPECIFIED = -1,
  OK = 0,

  UNKNOWN = 100,
  NETWORK_ERROR = 200,
}

const CodeType: { [K in Code]: string } = {
  [Code.UNSPECIFIED]: 'UNSPECIFIED',
  [Code.OK]: 'OK',
  [Code.UNKNOWN]: 'UNKNOWN',
  [Code.NETWORK_ERROR]: 'NETWORK_ERROR',
}
