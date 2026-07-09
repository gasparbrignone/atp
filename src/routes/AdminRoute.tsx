import { Navigate, Outlet } from "react-router-dom"

import { LoadingState } from "@/components/common/LoadingState"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { routes } from "@/routes/routes"
import { USER_ROLES } from "@/types/user"

export function AdminRoute() {
  const { profile, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingState />
  }

  if (profile?.role !== USER_ROLES.ADMIN) {
    return <Navigate to={routes.dashboard} replace />
  }

  return <Outlet />
}
