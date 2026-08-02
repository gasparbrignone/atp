import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CalendarEvent } from "@/features/calendar/types/event"
import { EVENT_COLOR_VALUES } from "@/features/calendar/utils/eventColors"
import { formatEventDateRange } from "@/features/calendar/utils/eventFormat"
import { routes } from "@/routes/routes"

export function EventCard({ event }: { event: CalendarEvent }) {
  return (
    <Link to={routes.eventDetail(event.id)} className="block">
      <Card
        className="border-l-4 transition-colors hover:bg-muted/50"
        style={{ borderLeftColor: EVENT_COLOR_VALUES[event.color] }}
      >
        <CardHeader>
          <CardTitle className="text-base">{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          {formatEventDateRange(event)}
        </CardContent>
      </Card>
    </Link>
  )
}
