import axios, { type AxiosResponse } from 'axios'
import { z } from 'zod'

import { API_BASE_URL } from '../config'
import { APIError, BaseError, Code } from '../types'

const errorResponseSchema = z.object({
  error: z.object({
    code: z.number(),
    type: z.string(),
    message: z.string(),
  }),
})

export type ErrorResponse = z.infer<typeof errorResponseSchema>

export const isErrorResponse = (obj: unknown): obj is ErrorResponse =>
  errorResponseSchema.safeParse(obj).success

const request = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

const onFulfilled = (resp: AxiosResponse) => resp.data

const onRejected = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    throw BaseError.from(Code.UNKNOWN, 'Unexpected error')
  }

  if (!error.response) {
    throw BaseError.from(Code.NETWORK_ERROR, error.message)
  }

  const { status, data } = error.response
  if (isErrorResponse(data)) {
    const { code, type, message } = data.error
    throw new APIError(status, code, type, message)
  }

  // should not happen, check if server sends in correct format or add more guards above
  throw BaseError.from(Code.UNSPECIFIED, 'Error occurred')
}

request.interceptors.response.use(onFulfilled, onRejected)

export default request
