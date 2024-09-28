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
    super(StatusCodes.BAD_REQUEST, Code.INTERNAL, message)
  }
}

export class AuthenticationError extends HttpError {
  constructor(message: string) {
    super(StatusCodes.UNAUTHORIZED, Code.UNAUTHORIZED, message)
  }
}

export class InternalError extends HttpError {
  constructor(message: string) {
    super(StatusCodes.INTERNAL_SERVER_ERROR, Code.INTERNAL, message)
  }
}

export enum Code {
  // shared with the frontend
  UNSPECIFIED = -1,
  OK = 0,

  UNKNOWN = 100,
  NETWORK_ERROR = 200,

  // server-side only
  UNAUTHORIZED = 300,
  INTERNAL = 400,
}

const CodeType: { [K in Code]: string } = {
  [Code.UNSPECIFIED]: 'UNSPECIFIED',
  [Code.OK]: 'OK',
  [Code.UNKNOWN]: 'UNKNOWN',
  [Code.NETWORK_ERROR]: 'NETWORK_ERROR',
  [Code.UNAUTHORIZED]: 'UNAUTHORIZED',
  [Code.INTERNAL]: 'INTERNAL',
}
