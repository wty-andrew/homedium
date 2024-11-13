import { StatusCodes } from 'http-status-codes'

export class BaseError extends Error {
  readonly code: number
  readonly type: string

  constructor(code: number, type: string, message: string) {
    super(message)
    this.code = code
    this.type = type
  }
}

export class HttpError extends BaseError {
  readonly status: number

  constructor(status: number, code: Code, message: string) {
    super(code, CodeType[code], message)
    this.status = status
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(StatusCodes.BAD_REQUEST, Code.BAD_REQUEST, message)
  }
}

export class AuthenticationError extends HttpError {
  constructor(message: string) {
    super(StatusCodes.UNAUTHORIZED, Code.AUTH_ERROR, message)
  }
}

export class InternalError extends HttpError {
  constructor(message: string) {
    super(StatusCodes.INTERNAL_SERVER_ERROR, Code.INTERNAL_ERROR, message)
  }
}

export enum Code {
  UNSPECIFIED = -1,
  OK = 0,
  UNKNOWN = 100,

  // share common http status codes
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
