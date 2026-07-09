import { useQuery } from "@tanstack/react-query"

import { getSettings } from "@/features/admin/services/settings.service"

export function useSettings() {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: getSettings,
  })
}
