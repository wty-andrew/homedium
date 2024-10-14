import session, { type SessionOptions } from 'express-session'

import { isTest } from '../config.mjs'

const sessionMiddleware = (options: SessionOptions) =>
  session({
    resave: false,
    saveUninitialized: false,
    rolling: true,
    proxy: true,
    cookie: {
      secure: !isTest,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'lax',
    },
    ...options,
  })

export default sessionMiddleware
