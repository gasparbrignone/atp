import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EVENT_TYPE_LABELS, type CalendarEvent } from "@/features/calendar/types/event"
import { routes } from "@/routes/routes"

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

export function EventCard({ event }: { event: CalendarEvent }) {
  return (
    <Link to={routes.eventDetail(event.id)} className="block">
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground flex items-center justify-between text-sm">
          <span>{dateFormatter.format(event.startDate.toDate())}</span>
          <Badge variant="outline">{EVENT_TYPE_LABELS[event.type]}</Badge>
        </CardContent>
      </Card>
    </Link>
  )
}
