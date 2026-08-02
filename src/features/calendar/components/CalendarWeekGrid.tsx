import { useMemo } from "react"
import { useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"
import type { CalendarEvent } from "@/features/calendar/types/event"
import { addDays, isSameDay, startOfDay } from "@/features/calendar/utils/calendarGrid"
import { EVENT_COLOR_VALUES } from "@/features/calendar/utils/eventColors"
import { routes } from "@/routes/routes"

const START_HOUR = 7
const END_HOUR = 22
const HOUR_HEIGHT = 48
const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT

const weekdayFormatter = new Intl.DateTimeFormat("es-AR", { weekday: "short" })

// Formato manual de 24hs: Intl con es-AR puede devolver "07:00 a. m.", que no
// entra en la columna angosta de horarios y se corta en dos líneas.
function formatHourLabel(hour: number): string {
  return `${String(hour).padStart(2, "0")}:00`
}

interface CalendarWeekGridProps {
  days: Date[]
  events: CalendarEvent[]
}

function eventOccursOnDay(event: CalendarEvent, day: Date): boolean {
  const dayStart = startOfDay(day)
  const dayEnd = addDays(dayStart, 1)
  return event.startDate.toDate() < dayEnd && event.endDate.toDate() >= dayStart
}

function getDayBounds(day: Date) {
  const start = new Date(day)
  start.setHours(START_HOUR, 0, 0, 0)
  const end = new Date(day)
  end.setHours(END_HOUR, 0, 0, 0)
  return { start, end }
}

function getTimedEventPosition(event: CalendarEvent, day: Date) {
  const { start: dayStart, end: dayEnd } = getDayBounds(day)
  const eventStart = event.startDate.toDate()
  const eventEnd = event.endDate.toDate()
  const clippedStart = eventStart < dayStart ? dayStart : eventStart
  const clippedEnd = eventEnd > dayEnd ? dayEnd : eventEnd

  if (clippedEnd <= clippedStart) return null

  const pxPerMinute = HOUR_HEIGHT / 60
  const top = ((clippedStart.getTime() - dayStart.getTime()) / 60000) * pxPerMinute
  const height = Math.max(
    ((clippedEnd.getTime() - clippedStart.getTime()) / 60000) * pxPerMinute,
    20
  )

  return { top, height }
}

function getNowIndicatorTop(day: Date): number | null {
  const now = new Date()
  if (!isSameDay(now, day)) return null
  const { start: dayStart, end: dayEnd } = getDayBounds(day)
  if (now < dayStart || now > dayEnd) return null
  return ((now.getTime() - dayStart.getTime()) / 60000) * (HOUR_HEIGHT / 60)
}

export function CalendarWeekGrid({ days, events }: CalendarWeekGridProps) {
  const navigate = useNavigate()
  const today = new Date()

  const hours = useMemo(
    () => Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i),
    []
  )

  const allDayByDay = useMemo(
    () => days.map((day) => events.filter((e) => e.allDay && eventOccursOnDay(e, day))),
    [days, events]
  )

  const timedByDay = useMemo(
    () => days.map((day) => events.filter((e) => !e.allDay && eventOccursOnDay(e, day))),
    [days, events]
  )

  const hasAllDay = allDayByDay.some((dayEvents) => dayEvents.length > 0)

  return (
    <div className="overflow-x-auto rounded-xl border">
      <div style={{ minWidth: 48 + days.length * 104 }}>
        {/* Encabezado de días */}
        <div className="grid" style={{ gridTemplateColumns: `48px repeat(${days.length}, 1fr)` }}>
          <div className="border-b" />
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                "text-muted-foreground border-b border-l p-1.5 text-center text-xs font-medium",
                isSameDay(day, today) && "text-primary"
              )}
            >
              <div className="capitalize">{weekdayFormatter.format(day)}</div>
              <div
                className={cn(
                  "mx-auto mt-0.5 flex size-5 items-center justify-center rounded-full text-sm",
                  isSameDay(day, today) && "bg-primary text-primary-foreground"
                )}
              >
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Fila de "todo el día" */}
        {hasAllDay && (
          <div
            className="grid border-b"
            style={{ gridTemplateColumns: `48px repeat(${days.length}, 1fr)` }}
          >
            <div className="text-muted-foreground p-1 text-[10px]">Todo el día</div>
            {allDayByDay.map((dayEvents, index) => (
              <div key={days[index].toISOString()} className="flex flex-col gap-0.5 border-l p-0.5">
                {dayEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => navigate(routes.eventDetail(event.id))}
                    className="truncate rounded px-1 py-0.5 text-left text-[10px] text-white"
                    style={{ backgroundColor: EVENT_COLOR_VALUES[event.color] }}
                    title={event.title}
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Grilla de horarios */}
        <div className="grid" style={{ gridTemplateColumns: `48px repeat(${days.length}, 1fr)` }}>
          <div className="relative" style={{ height: TOTAL_HEIGHT }}>
            {hours.map((hour) => (
              <div
                key={hour}
                className="text-muted-foreground absolute right-1 -translate-y-1/2 text-[10px] whitespace-nowrap"
                style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}
              >
                {formatHourLabel(hour)}
              </div>
            ))}
          </div>

          {days.map((day, dayIndex) => {
            const nowTop = getNowIndicatorTop(day)

            return (
              <div
                key={day.toISOString()}
                className="relative border-l"
                style={{ height: TOTAL_HEIGHT }}
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="absolute inset-x-0 border-t"
                    style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}
                  />
                ))}

                {nowTop !== null && (
                  <div
                    className="bg-destructive absolute inset-x-0 z-10 h-px"
                    style={{ top: nowTop }}
                  />
                )}

                {timedByDay[dayIndex].map((event) => {
                  const position = getTimedEventPosition(event, day)
                  if (!position) return null

                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => navigate(routes.eventDetail(event.id))}
                      className="absolute inset-x-0.5 overflow-hidden rounded px-1 py-0.5 text-left text-[10px] text-white"
                      style={{
                        top: position.top,
                        height: position.height,
                        backgroundColor: EVENT_COLOR_VALUES[event.color],
                      }}
                      title={event.title}
                    >
                      {event.title}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
