import { useQuery } from "@tanstack/react-query"

import { getPendingTasksForUser } from "@/features/tasks/services/tasks.service"

export function usePendingTasks(uid: string | undefined) {
  return useQuery({
    queryKey: ["tasks", "pending", uid],
    queryFn: () => getPendingTasksForUser(uid as string),
    enabled: !!uid,
  })
}
