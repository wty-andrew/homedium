import { createApp } from './app.mjs'
import config from './config.mjs'
import logger from './logger.mjs'

const main = async () => {
  const app = await createApp(config)
  const server = app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
  })

  const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT']
  for (const signal of signals) {
    process.on(signal, () => {
      logger.info(`Received ${signal}, shutting down`)
      server.close(() => process.exit(0))
    })
  }
}

main()
