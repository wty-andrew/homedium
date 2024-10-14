import request from 'supertest'
import { StatusCodes } from 'http-status-codes'

import { createApp } from '../app.mjs'
import config from '../config.mjs'

const app = await createApp(config)

describe('GET /api/auth/oidc/callback', () => {
  // Dummy test, oidc is mocked
  it('should set cookie and redirect for signed in user', async () => {
    const resp = await request(app).get('/api/auth/oidc/callback')

    expect(resp.status).toBe(StatusCodes.MOVED_TEMPORARILY)
    expect(resp.headers['set-cookie'][0]).toMatch(/connect\.sid=.+;/)
  })
})

describe('GET /api/auth/me', () => {
  it('should return 401 if user not signed in', async () => {
    const resp = await request(app).get('/api/auth/me')

    expect(resp.status).toBe(StatusCodes.UNAUTHORIZED)
  })

  it('should return 200 for signed in user', async () => {
    const { headers } = await request(app).get('/api/auth/oidc/callback')
    const resp = await request(app)
      .get('/api/auth/me')
      .set('Cookie', headers['set-cookie'])

    expect(resp.status).toBe(StatusCodes.OK)
    expect(resp.body).toMatchObject({ user: expect.any(Object) })
  })
})

describe('POST /api/auth/logout', () => {
  it('should logout user', async () => {
    const { headers } = await request(app).get('/api/auth/oidc/callback')
    const resp = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', headers['set-cookie'])

    expect(resp.status).toBe(StatusCodes.NO_CONTENT)
    expect(resp.headers['set-cookie'][0]).toContain('connect.sid=;')
  })
})
