import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({ path: [`.env.${process.env.NODE_ENV}`, '.env'] })

const schema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(8000),
  ALLOWED_ORIGIN: z.string().default('https://localhost:3000'),
  // Opentelemetry
  OTEL_SERVICE_NAME: z.string().default('unknown_service'),
  OTEL_SERVICE_VERSION: z.string().default('0.1.0'),
  // Session
  REDIS_URI: z.string().optional(),
  SESSION_SECRET: z.string().min(1),
  // OpenID Connect
  OIDC_BASE_URL: z.string().url(),
  OIDC_CLIENT_ID: z.string().min(1),
  OIDC_CLIENT_SECRET: z.string().min(1),
  OIDC_REDIRECT_URI: z.string().url(),
  AUTH_FAILURE_REDIRECT: z.string().url(),
  AUTH_SUCCESS_REDIRECT: z.string().url(),
})

export type Config = z.infer<typeof schema>

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  throw new Error(parsed.error.toString())
}

const config = parsed.data

const { NODE_ENV } = config
export const isProd = NODE_ENV === 'production'
export const isDev = NODE_ENV === 'development'
export const isTest = NODE_ENV === 'test'

export default config
