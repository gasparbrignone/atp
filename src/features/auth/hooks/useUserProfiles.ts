import { useQuery } from "@tanstack/react-query"

import { getUserProfiles } from "@/features/auth/services/user.service"

export function useUserProfiles(uids: string[]) {
  const sortedUids = [...new Set(uids)].sort()

  return useQuery({
    queryKey: ["users", "byIds", sortedUids],
    queryFn: () => getUserProfiles(sortedUids),
    enabled: sortedUids.length > 0,
  })
}
