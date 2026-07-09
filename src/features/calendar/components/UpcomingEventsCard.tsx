import { CalendarDays } from "lucide-react"

import { EmptyState } from "@/components/common/EmptyState"
import { ErrorState } from "@/components/common/ErrorState"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useUpcomingEvents } from "@/features/calendar/hooks/useUpcomingEvents"

const eventDateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
})

export function UpcomingEventsCard() {
  const { data: events, isLoading, isError } = useUpcomingEvents()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Próximas actividades</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        )}

        {!isLoading && isError && <ErrorState />}

        {!isLoading && !isError && events?.length === 0 && (
          <EmptyState
            icon={CalendarDays}
            title="No hay actividades próximas"
          />
        )}

        {!isLoading && !isError && events && events.length > 0 && (
          <ul className="flex flex-col gap-3">
            {events.map((event) => (
              <li key={event.id} className="flex items-center justify-between gap-2">
                <span className="text-sm">{event.title}</span>
                <span className="text-muted-foreground text-xs">
                  {eventDateFormatter.format(event.startDate.toDate())}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
