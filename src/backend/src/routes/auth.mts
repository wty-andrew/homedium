import { Router } from 'express'
import passport from 'passport'

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
      res.status(204).send()
    })
  })
})

router.get('/check', requireAuth, (req, res) => {
  res.status(200).send({ success: true, data: req.user })
})

export default router
