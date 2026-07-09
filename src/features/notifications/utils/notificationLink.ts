import { routes } from "@/routes/routes"
import { NOTIFICATION_TYPES, type Notification } from "@/features/notifications/types/notification"

export function getNotificationLink(notification: Notification): string | null {
  if (!notification.relatedId) return null

  switch (notification.type) {
    case NOTIFICATION_TYPES.TASK:
      return routes.taskDetail(notification.relatedId)
    case NOTIFICATION_TYPES.MEETING:
      return routes.meetingDetail(notification.relatedId)
    case NOTIFICATION_TYPES.CALENDAR:
      return routes.eventDetail(notification.relatedId)
    case NOTIFICATION_TYPES.MESITA:
      return routes.mesita
    default:
      return null
  }
}
