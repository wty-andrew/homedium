import type { User as _User } from './index.mjs'

declare global {
  namespace Express {
    interface User extends _User {}
  }
}
