import {
  type Client,
  type ClientMetadata,
  Issuer,
  Strategy,
  type StrategyVerifyCallback,
} from 'openid-client'
import passport from 'passport'

import type { Config } from './config.mjs'
import type { User } from './types/index.mjs'

interface OidcOptions extends ClientMetadata {
  issuer_url: string
}

const createOidcClient = async (options: OidcOptions): Promise<Client> => {
  const { issuer_url, ...metadata } = options
  const issuer = await Issuer.discover(issuer_url)
  return new issuer.Client({ response_types: ['code'], ...metadata })
}

const configureOidcStrategy = async (options: OidcOptions) => {
  const client = await createOidcClient(options)
  const strategy = new Strategy(
    { client, params: { scope: 'openid email' } },
    ((tokenSet, done) => {
      const { email, sub } = tokenSet.claims()
      // TODO: create new user account in DB if not exists
      done(null, { email: email! })
    }) as StrategyVerifyCallback<User>
  )
  passport.use('oidc', strategy)
  passport.serializeUser<User>((user, done) => {
    done(null, user as User)
  })
  passport.deserializeUser<User>((user, done) => {
    // TODO: load user from DB
    done(null, user)
  })
}

type OidcConfig = Pick<
  Config,
  | 'OIDC_BASE_URL'
  | 'OIDC_CLIENT_ID'
  | 'OIDC_CLIENT_SECRET'
  | 'OIDC_REDIRECT_URI'
>

export const configurePassport = async (config: OidcConfig) => {
  await configureOidcStrategy({
    issuer_url: config.OIDC_BASE_URL,
    client_id: config.OIDC_CLIENT_ID,
    client_secret: config.OIDC_CLIENT_SECRET,
    redirect_uris: [config.OIDC_REDIRECT_URI],
  })
}
