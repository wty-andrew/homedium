import type { ErrorRequestHandler, RequestHandler, Response } from 'express'

import { isDev } from '../config.mjs'
import { BadRequestError, HttpError, InternalError } from '../types/index.mjs'

type ErrorResponse = {
  error: {
    code: number
    type: string
    message: string
  }
}

const sendError = (res: Response<ErrorResponse>, error: HttpError) => {
  const { status, code, type, message } = error
  res.status(status).json({ error: { code, type, message } })
}

export const asyncHandler =
  (handler: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next)

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  // body-parser error, see: https://github.com/expressjs/body-parser/issues/122
  if (err.type === 'entity.parse.failed') {
    return sendError(res, new BadRequestError('Malformed body'))
  }
  if (err instanceof HttpError) {
    return sendError(res, err)
  }

  sendError(res, new InternalError(isDev ? err.message : 'Unexpected error'))
}
