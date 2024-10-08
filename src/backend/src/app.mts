import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import passport from 'passport'
import pinoHttp from 'pino-http'
import { v4 as uuidv4 } from 'uuid'

import { ALLOWED_ORIGIN, isDev } from './config.mjs'
import logger from './logger.mjs'
import { errorHandler } from './middlewares/error-handler.mjs'
import session from './middlewares/session.mjs'
import { configurePassport } from './passport.mjs'
import router from './routes/index.mjs'

await configurePassport()

const app = express()

if (isDev) {
  app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }))
}

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

app.use(httpLogger)
app.use(cookieParser())
app.use(express.json())
app.use(session())
app.use(passport.initialize())
app.use(passport.session())

router(app)

app.get('/healthz', (req, res) => {
  res.status(StatusCodes.OK).send()
})

app.use(errorHandler)

export default app
