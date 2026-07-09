import { useQuery } from "@tanstack/react-query"

import { getAllNotificationsForUser } from "@/features/notifications/services/notifications.service"

export function useNotifications(uid: string | undefined) {
  return useQuery({
    queryKey: ["notifications", "all", uid],
    queryFn: () => getAllNotificationsForUser(uid as string),
    enabled: !!uid,
  })
}
