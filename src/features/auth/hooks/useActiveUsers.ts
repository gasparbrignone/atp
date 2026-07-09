import { useQuery } from "@tanstack/react-query"

import { getAllActiveUsers } from "@/features/auth/services/user.service"

export function useActiveUsers() {
  return useQuery({
    queryKey: ["users", "active"],
    queryFn: getAllActiveUsers,
  })
}
