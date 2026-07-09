import { useQuery } from "@tanstack/react-query"

import { getMeetingById } from "@/features/meetings/services/meetings.service"

export function useMeeting(id: string | undefined) {
  return useQuery({
    queryKey: ["meetings", "detail", id],
    queryFn: () => getMeetingById(id as string),
    enabled: !!id,
  })
}
