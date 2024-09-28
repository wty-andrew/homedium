import { Router } from 'express'
import passport from 'passport'
import { StatusCodes } from 'http-status-codes'

import { AUTH_FAILURE_REDIRECT, AUTH_SUCCESS_REDIRECT } from '../config.mjs'
import logger from '../logger.mjs'
import { requireAuth } from '../middlewares/auth.mjs'

const router = Router()

router.get('/oidc', passport.authenticate('oidc'))

router.get(
  '/oidc/callback',
  passport.authenticate('oidc', {
    successRedirect: AUTH_SUCCESS_REDIRECT,
    failureRedirect: AUTH_FAILURE_REDIRECT,
  })
)

router.post('/logout', async (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      logger.error({ err }, 'Error logging out')
      return next(err)
    }
    req.session.destroy((err) => {
      if (err) {
        logger.error({ err }, 'Error destroying session')
        return next(err)
      }
      res.status(StatusCodes.NO_CONTENT).clearCookie('connect.sid').send()
    })
  })
})

router.get('/me', requireAuth, (req, res) => {
  res.status(StatusCodes.OK).send({ user: req.user })
})

export default router
