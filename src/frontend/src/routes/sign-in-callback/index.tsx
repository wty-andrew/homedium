import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { API_BASE_URL } from '../../config'

const SignInCallback = () => {
  const { search } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const query = new URLSearchParams(search)
    if (query.get('code') && query.get('state')) {
      window.location.assign(`${API_BASE_URL}/auth/oidc/callback${search}`)
    } else {
      navigate('/signin')
    }
    return
  }, [search, navigate])

  return <div>Loading...</div>
}

export default SignInCallback
