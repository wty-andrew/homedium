import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'

import { AUTH_ENDPOINT, getLoggedInUser, logout } from '../api/auth'
import type { User } from '../types'

const signIn = () => window.location.assign(`${AUTH_ENDPOINT}/oidc`)

interface AuthContext {
  user: User | null
  isLoading: boolean
  signIn: () => void
  signOut: () => void
}

const authContext = createContext<AuthContext | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getLoggedInUser()
        setUser(user)
      } catch (err) {}
      setIsLoading(false)
    }
    fetchUser()
  }, [])

  const signOut = useCallback(async () => {
    await logout()
    setUser(null)
  }, [])

  return (
    <authContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </authContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(authContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
