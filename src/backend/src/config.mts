import dotenv from 'dotenv'

dotenv.config({ path: [`.env.${process.env.NODE_ENV}`, '.env'] })

export const isProd = process.env.NODE_ENV === 'production'
export const isDev = process.env.NODE_ENV === 'development'

const env = (name: string, default_?: string): string => {
  const value = process.env[name] || default_
  if (value === undefined) throw new Error(`Missing env variable: ${name}`)
  return value
}

// Development
export const PORT = Number(env('PORT', '8000'))
export const ALLOWED_ORIGIN = env('ALLOWED_ORIGIN', 'https://localhost:3000')

// Opentelemetry
export const SERVICE_NAME = env('OTEL_SERVICE_NAME', 'unknown_service')
export const SERVICE_VERSION = env('OTEL_SERVICE_VERSION', '0.1.0')

// Session
export const REDIS_URI = env('REDIS_URI')
export const SESSION_SECRET = env('SESSION_SECRET')

// OpenID Connect
export const OIDC_BASE_URL = env('OIDC_BASE_URL')
export const OIDC_CLIENT_ID = env('OIDC_CLIENT_ID')
export const OIDC_CLIENT_SECRET = env('OIDC_CLIENT_SECRET')
export const OIDC_REDIRECT_URI = env('OIDC_REDIRECT_URI')
export const AUTH_FAILURE_REDIRECT = env('AUTH_FAILURE_REDIRECT')
export const AUTH_SUCCESS_REDIRECT = env('AUTH_SUCCESS_REDIRECT')
