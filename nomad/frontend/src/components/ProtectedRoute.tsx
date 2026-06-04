import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '../hooks/useAuth'

type Props = {
  children: ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />
}

export default ProtectedRoute
