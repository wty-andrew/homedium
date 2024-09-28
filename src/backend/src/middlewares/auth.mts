import type { RequestHandler } from 'express'

import { AuthenticationError } from '../types/index.mjs'

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next(new AuthenticationError('Unauthorized'))
    return
  }
  next()
}
