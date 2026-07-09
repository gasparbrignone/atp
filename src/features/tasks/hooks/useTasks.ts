import { useQuery } from "@tanstack/react-query"

import { getAllTasks } from "@/features/tasks/services/tasks.service"

export function useTasks() {
  return useQuery({
    queryKey: ["tasks", "list"],
    queryFn: getAllTasks,
  })
}
