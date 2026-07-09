import { useQuery } from "@tanstack/react-query"

import { getTaskById } from "@/features/tasks/services/tasks.service"

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: ["tasks", "detail", id],
    queryFn: () => getTaskById(id as string),
    enabled: !!id,
  })
}
