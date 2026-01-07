import { Navigate, useLocation } from 'react-router-dom'
import { useFinance } from '@/context/FinanceContext'

interface ProtectedRouteProps {
  children: JSX.Element
  requireMaster?: boolean
}

export const ProtectedRoute = ({
  children,
  requireMaster = false,
}: ProtectedRouteProps) => {
  const { currentUser } = useFinance()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireMaster && currentUser.role !== 'master') {
    return <Navigate to="/" replace />
  }

  return children
}
