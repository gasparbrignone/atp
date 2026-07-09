import { useQuery } from "@tanstack/react-query"

import { getUpcomingEvents } from "@/features/calendar/services/events.service"

export function useUpcomingEvents() {
  return useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: () => getUpcomingEvents(),
  })
}
