import { useAuthUser } from '../../redux/useAuthUser'
import { Navigate, useLocation } from 'react-router-dom'

const RequireAuth = ({ children, roles }) => {
  const user = useAuthUser()
  const location = useLocation()

  // Not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // If roles are specified, check user roles by slug
  if (
    roles &&
    roles.length > 0 &&
    (!user.roles || !user.roles.some(r => roles.includes(r.slug)))
  ) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RequireAuth
