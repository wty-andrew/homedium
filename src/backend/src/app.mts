import cors from 'cors'
import express from 'express'
import type { Store } from 'express-session'
import { StatusCodes } from 'http-status-codes'
import passport from 'passport'
import pinoHttp from 'pino-http'
import { v4 as uuidv4 } from 'uuid'

import { type Config, isDev } from './config.mjs'
import { createRedisStore } from './database/redis.mjs'
import logger from './logger.mjs'
import { errorHandler } from './middlewares/error-handler.mjs'
import session from './middlewares/session.mjs'
import { configurePassport } from './passport.mjs'
import router from './routes/index.mjs'

const httpLogger = pinoHttp({
  logger,
  genReqId: (req, res) => {
    const existingID = req.id ?? req.headers['x-request-id']
    if (existingID) return existingID
    const id = uuidv4()
    res.setHeader('x-request-id', id)
    return id
  },
})

export const createApp = async (config: Config) => {
  await configurePassport(config)

  let store: Store | undefined
  if (config.REDIS_URI) {
    store = await createRedisStore(config.REDIS_URI)
  }

  const app = express()

  if (isDev) {
    app.use(cors({ origin: config.ALLOWED_ORIGIN, credentials: true }))
  }

  app.use(httpLogger)
  app.use(express.json())
  app.use(session({ store, secret: config.SESSION_SECRET }))
  app.use(passport.initialize())
  app.use(passport.session())

  router(app)

  app.get('/healthz', (req, res) => {
    res.status(StatusCodes.OK).send()
  })

  app.use(errorHandler)
  return app
}
