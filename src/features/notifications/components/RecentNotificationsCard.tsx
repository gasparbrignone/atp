import { Bell } from "lucide-react"
import { Link } from "react-router-dom"

import { EmptyState } from "@/components/common/EmptyState"
import { ErrorState } from "@/components/common/ErrorState"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useRecentNotifications } from "@/features/notifications/hooks/useRecentNotifications"
import { routes } from "@/routes/routes"

export function RecentNotificationsCard() {
  const { firebaseUser } = useAuth()
  const {
    data: notifications,
    isLoading,
    isError,
  } = useRecentNotifications(firebaseUser?.uid)

  return (
    <Link to={routes.notifications} className="block">
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Notificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          )}

          {!isLoading && isError && <ErrorState />}

          {!isLoading && !isError && notifications?.length === 0 && (
            <EmptyState icon={Bell} title="No tenés notificaciones nuevas" />
          )}

          {!isLoading && !isError && notifications && notifications.length > 0 && (
            <ul className="flex flex-col gap-3">
              {notifications.map((notification) => (
                <li key={notification.id} className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">
                    {notification.title}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {notification.message}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
