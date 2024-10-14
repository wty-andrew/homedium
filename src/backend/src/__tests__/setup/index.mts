import { mockPassportOidc as configurePassport } from '../utils/index.mjs'

vi.mock('../../passport.mts', () => ({ configurePassport }))
