import type { CalendarEvent } from "@/features/calendar/types/event"
import { isSameDay } from "@/features/calendar/utils/calendarGrid"

const dayFormatter = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short" })
const dayLongFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
})
const timeFormatter = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" })

export function formatEventDateRange(event: CalendarEvent, long = false): string {
  const start = event.startDate.toDate()
  const end = event.endDate.toDate()
  const sameDay = isSameDay(start, end)
  const dayFmt = long ? dayLongFormatter : dayFormatter

  if (event.allDay) {
    if (sameDay) return `${dayFmt.format(start)} · Todo el día`
    return `${dayFmt.format(start)} al ${dayFmt.format(end)} · Todo el día`
  }

  if (sameDay) {
    return `${dayFmt.format(start)} · ${timeFormatter.format(start)} a ${timeFormatter.format(end)}`
  }

  return `${dayFmt.format(start)} ${timeFormatter.format(start)} al ${dayFmt.format(end)} ${timeFormatter.format(end)}`
}
