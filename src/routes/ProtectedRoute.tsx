import { Navigate, Outlet } from "react-router-dom"

import { LoadingState } from "@/components/common/LoadingState"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { routes } from "@/routes/routes"

export function ProtectedRoute() {
  const { firebaseUser, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingState />
  }

  if (!firebaseUser) {
    return <Navigate to={routes.login} replace />
  }

  return <Outlet />
}
