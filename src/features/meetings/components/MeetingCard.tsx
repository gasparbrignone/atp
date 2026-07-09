import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Meeting } from "@/features/meetings/types/meeting"
import { routes } from "@/routes/routes"

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

export function MeetingCard({ meeting }: { meeting: Meeting }) {
  return (
    <Link to={routes.meetingDetail(meeting.id)} className="block">
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">{meeting.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground flex items-center justify-between text-sm">
          <span>{dateFormatter.format(meeting.date.toDate())}</span>
          <span>
            {meeting.attendees.length}{" "}
            {meeting.attendees.length === 1 ? "asistente" : "asistentes"}
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}
