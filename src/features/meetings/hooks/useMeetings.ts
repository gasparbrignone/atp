import { useQuery } from "@tanstack/react-query"

import { getMeetings } from "@/features/meetings/services/meetings.service"

export function useMeetings() {
  return useQuery({
    queryKey: ["meetings", "list"],
    queryFn: getMeetings,
  })
}
