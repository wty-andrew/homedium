import { type Application, Router } from 'express'

import authRouter from './auth.mjs'

const router = (app: Application): void => {
  const apiRouter = Router()
  apiRouter.use('/auth', authRouter)

  app.use('/api', apiRouter)
}

export default router
