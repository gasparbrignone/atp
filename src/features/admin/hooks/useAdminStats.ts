import { useQuery } from "@tanstack/react-query"

import { getAdminStats } from "@/features/admin/services/admin.service"

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getAdminStats,
  })
}
