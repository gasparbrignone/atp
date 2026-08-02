import { Navigate, Outlet } from "react-router-dom"

import { LoadingState } from "@/components/common/LoadingState"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { PendingApprovalPage } from "@/features/auth/pages/PendingApprovalPage"
import { routes } from "@/routes/routes"
import { USER_STATUSES } from "@/types/user"

export function ProtectedRoute() {
  const { firebaseUser, profile, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingState />
  }

  if (!firebaseUser) {
    return <Navigate to={routes.login} replace />
  }

  if (profile?.status !== USER_STATUSES.ACTIVE) {
    return <PendingApprovalPage status={profile?.status ?? null} />
  }

  return <Outlet />
}
