import { useQuery } from "@tanstack/react-query"

import { getAllUsers } from "@/features/admin/services/admin.service"

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: getAllUsers,
  })
}
