import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { fetchAuthUser } from './authSlice'

export function useAuthUser() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)
  const error = useSelector((state) => state.auth.error)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!user && !loading && token) {
      dispatch(fetchAuthUser())
    }
  }, [user, loading, dispatch])

  useEffect(() => {
    console.log('Auth user state:', user)
  }, [user])

  return { user, loading, error }
}
