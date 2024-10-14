import request from 'supertest'

import { createApp } from '../app.mjs'
import config from '../config.mjs'

const app = await createApp(config)

describe('GET /healthz', () => {
  it('returns status 200', async () => {
    const resp = await request(app).get('/healthz')

    expect(resp.status).toBe(200)
  })
})

describe('GET /non-exist-endpoint', () => {
  it('returns status 404', async () => {
    const resp = await request(app).get('/non-exist-endpoint')

    expect(resp.status).toBe(404)
  })
})
