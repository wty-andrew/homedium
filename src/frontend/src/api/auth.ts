import { API_BASE_URL } from '../config'
import type { User } from '../types'
import request from './request'

export const AUTH_ENDPOINT = `${API_BASE_URL}/auth`

interface UserResponse {
  user: User
}

export const getLoggedInUser = async () => {
  const resp = await request.get<never, UserResponse>(`${AUTH_ENDPOINT}/me`)
  return resp.user
}

export const logout = () => request.post<never, void>(`${AUTH_ENDPOINT}/logout`)
