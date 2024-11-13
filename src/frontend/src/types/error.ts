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

  BAD_REQUEST = 400,
  AUTH_ERROR = 401,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,

  NETWORK_ERROR = 600,
}

const CodeType: { [K in Code]: string } = {
  [Code.UNSPECIFIED]: 'UNSPECIFIED',
  [Code.OK]: 'OK',
  [Code.UNKNOWN]: 'UNKNOWN',
  [Code.BAD_REQUEST]: 'BAD_REQUEST',
  [Code.AUTH_ERROR]: 'AUTH_ERROR',
  [Code.NOT_FOUND]: 'NOT_FOUND',
  [Code.INTERNAL_ERROR]: 'INTERNAL_ERROR',
  [Code.NETWORK_ERROR]: 'NETWORK_ERROR',
}
