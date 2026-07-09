import { useQuery } from "@tanstack/react-query"

import { getEventById } from "@/features/calendar/services/events.service"

export function useEvent(id: string | undefined) {
  return useQuery({
    queryKey: ["events", "detail", id],
    queryFn: () => getEventById(id as string),
    enabled: !!id,
  })
}
