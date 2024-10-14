import type { Request } from 'express'
import passport, { Strategy, type StrategyCreated } from 'passport'

import type { User } from '../../types/index.mjs'

class MockStrategy extends Strategy {
  name?: string
  user: User

  constructor(options: { user: User }) {
    super()
    this.user = options.user
  }

  authenticate(this: StrategyCreated<this>, req: Request, options?: any) {
    this.success(this.user)
  }
}

export const mockPassportOidc = () => {
    // TODO: create fixture
    const user: User = { email: 'admin@example.com' }
    passport.use('oidc', new MockStrategy({ user }))
    passport.serializeUser<User>((user, done) => {
      done(null, user)
    })
    passport.deserializeUser<User>((user, done) => {
      done(null, user)
    })
}
