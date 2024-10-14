import RedisStore from 'connect-redis'
import { createClient } from 'redis'

import logger from '../logger.mjs'

export const createRedisStore = async (url: string) => {
  const redisClient = createClient({ url })
  await redisClient
    .on('error', (err) => logger.error('Redis error: %s', err))
    .connect()
  logger.info('Redis connected')
  return new RedisStore({ client: redisClient })
}
