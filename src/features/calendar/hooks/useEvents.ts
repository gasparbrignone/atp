import { useQuery } from "@tanstack/react-query"

import { getAllEvents } from "@/features/calendar/services/events.service"

export function useEvents() {
  return useQuery({
    queryKey: ["events", "list"],
    queryFn: getAllEvents,
  })
}
