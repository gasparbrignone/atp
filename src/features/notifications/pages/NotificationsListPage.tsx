import { Bell, CheckCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { EmptyState } from "@/components/common/EmptyState"
import { ErrorState } from "@/components/common/ErrorState"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useNotifications } from "@/features/notifications/hooks/useNotifications"
import {
  markAllAsRead,
  markAsRead,
} from "@/features/notifications/services/notifications.service"
import type { Notification } from "@/features/notifications/types/notification"
import { getNotificationLink } from "@/features/notifications/utils/notificationLink"

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
})

export function NotificationsListPage() {
  const { firebaseUser } = useAuth()
  const navigate = useNavigate()
  const { data: notifications, isLoading, isError, refetch } = useNotifications(
    firebaseUser?.uid
  )
  const unreadCount = (notifications ?? []).filter((n) => !n.read).length

  async function handleOpen(notification: Notification) {
    if (!notification.read) {
      markAsRead(notification.id)
        .then(() => refetch())
        .catch(() => {
          // Best-effort: si falla, la notificación queda como no leída.
        })
    }

    const link = getNotificationLink(notification)
    if (link) {
      navigate(link)
    }
  }

  async function handleMarkAllAsRead() {
    if (!notifications) return
    try {
      await markAllAsRead(notifications)
      await refetch()
    } catch {
      // Best-effort.
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-semibold">Notificaciones</h1>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleMarkAllAsRead}>
            <CheckCheck className="size-4" />
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {!isLoading && isError && <ErrorState />}

      {!isLoading && !isError && notifications?.length === 0 && (
        <EmptyState icon={Bell} title="No tenés notificaciones" />
      )}

      {!isLoading && !isError && notifications && notifications.length > 0 && (
        <div className="flex flex-col gap-2">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleOpen(notification)}
              className={cn(
                "flex flex-col gap-1 rounded-xl border p-3 text-left transition-colors hover:bg-muted/50",
                !notification.read && "border-primary/40 bg-primary/5"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{notification.title}</span>
                <span className="text-muted-foreground text-xs">
                  {dateFormatter.format(notification.createdAt.toDate())}
                </span>
              </div>
              <span className="text-muted-foreground text-sm">{notification.message}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
