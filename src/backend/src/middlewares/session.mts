import RedisStore from 'connect-redis'
import session, { type SessionOptions } from 'express-session'
import { createClient } from 'redis'

import { REDIS_URI, SESSION_SECRET } from '../config.mjs'
import logger from '../logger.mjs'

const redisClient = createClient({ url: REDIS_URI })
redisClient
  .on('error', (err) => logger.error('Redis error: %s', err))
  .connect()
  .then(() => logger.info('Redis connected'))

const store = new RedisStore({ client: redisClient })

const sessionMiddleware = (options?: SessionOptions) =>
  session({
    store,
    resave: false,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    rolling: true,
    proxy: true,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'lax',
    },
    ...options,
  })

export default sessionMiddleware
