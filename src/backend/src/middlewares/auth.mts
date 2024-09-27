import type { RequestHandler } from 'express'

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).send() // TODO: body
    return
  }
  next()
}
