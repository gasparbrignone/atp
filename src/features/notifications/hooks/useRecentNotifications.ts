import { useQuery } from "@tanstack/react-query"

import { getRecentNotifications } from "@/features/notifications/services/notifications.service"

export function useRecentNotifications(uid: string | undefined) {
  return useQuery({
    queryKey: ["notifications", "recent", uid],
    queryFn: () => getRecentNotifications(uid as string),
    enabled: !!uid,
  })
}
