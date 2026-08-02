import { useMemo, useState } from "react"
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Link } from "react-router-dom"

import { EmptyState } from "@/components/common/EmptyState"
import { ErrorState } from "@/components/common/ErrorState"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { capitalizeFirst } from "@/lib/utils"
import { CalendarGrid, dayKey } from "@/features/calendar/components/CalendarGrid"
import { CalendarWeekGrid } from "@/features/calendar/components/CalendarWeekGrid"
import { EventCard } from "@/features/calendar/components/EventCard"
import { useEvents } from "@/features/calendar/hooks/useEvents"
import type { CalendarEvent } from "@/features/calendar/types/event"
import {
  addDays,
  addMonths,
  eachDateInRange,
  getMonthGridDays,
  getWeekDays,
  isSameDay,
  startOfDay,
} from "@/features/calendar/utils/calendarGrid"
import { routes } from "@/routes/routes"
import { USER_ROLES } from "@/types/user"

const CALENDAR_VIEWS = { MONTH: "month", WEEK: "week" } as const
type CalendarView = (typeof CALENDAR_VIEWS)[keyof typeof CALENDAR_VIEWS]

const monthLabelFormatter = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" })
const dayLabelFormatter = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short" })

function groupEventsByDay(events: CalendarEvent[]) {
  const map = new Map<string, CalendarEvent[]>()
  for (const event of events) {
    const days = eachDateInRange(event.startDate.toDate(), event.endDate.toDate())
    for (const day of days) {
      const key = dayKey(day)
      map.set(key, [...(map.get(key) ?? []), event])
    }
  }
  return map
}

export function EventsListPage() {
  const { profile } = useAuth()
  const isCoordinator =
    profile?.role === USER_ROLES.COORDINATOR || profile?.role === USER_ROLES.ADMIN
  const { data: events, isLoading, isError } = useEvents()

  const [view, setView] = useState<CalendarView>(CALENDAR_VIEWS.MONTH)
  const [anchorDate, setAnchorDate] = useState(() => startOfDay(new Date()))
  const [selectedDay, setSelectedDay] = useState(() => startOfDay(new Date()))

  const eventsByDay = useMemo(() => groupEventsByDay(events ?? []), [events])

  const days = useMemo(
    () =>
      view === CALENDAR_VIEWS.MONTH ? getMonthGridDays(anchorDate) : getWeekDays(anchorDate),
    [view, anchorDate]
  )

  const selectedDayEvents = (eventsByDay.get(dayKey(selectedDay)) ?? []).sort(
    (a, b) => a.startDate.toMillis() - b.startDate.toMillis()
  )

  function goToPrevious() {
    setAnchorDate((current) =>
      view === CALENDAR_VIEWS.MONTH ? addMonths(current, -1) : addDays(current, -7)
    )
  }

  function goToNext() {
    setAnchorDate((current) =>
      view === CALENDAR_VIEWS.MONTH ? addMonths(current, 1) : addDays(current, 7)
    )
  }

  function goToToday() {
    const today = startOfDay(new Date())
    setAnchorDate(today)
    setSelectedDay(today)
  }

  const rangeLabel = capitalizeFirst(
    view === CALENDAR_VIEWS.MONTH
      ? monthLabelFormatter.format(anchorDate)
      : `${dayLabelFormatter.format(days[0])} – ${dayLabelFormatter.format(days[6])}`
  )

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-semibold">Calendario</h1>
        {isCoordinator && (
          <Button render={<Link to={routes.eventNew} />} size="sm" className="gap-1.5">
            <Plus className="size-4" />
            Nueva
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1 rounded-md border p-1">
        <Button
          type="button"
          variant={view === CALENDAR_VIEWS.MONTH ? "default" : "ghost"}
          size="sm"
          className="flex-1"
          onClick={() => setView(CALENDAR_VIEWS.MONTH)}
        >
          Mes
        </Button>
        <Button
          type="button"
          variant={view === CALENDAR_VIEWS.WEEK ? "default" : "ghost"}
          size="sm"
          className="flex-1"
          onClick={() => setView(CALENDAR_VIEWS.WEEK)}
        >
          Semana
        </Button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button type="button" variant="ghost" size="icon" aria-label="Anterior" onClick={goToPrevious}>
          <ChevronLeft className="size-4" />
        </Button>
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium">{rangeLabel}</span>
          <button type="button" onClick={goToToday} className="text-primary text-xs">
            Hoy
          </button>
        </div>
        <Button type="button" variant="ghost" size="icon" aria-label="Siguiente" onClick={goToNext}>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {!isLoading && isError && <ErrorState />}

      {!isLoading && !isError && view === CALENDAR_VIEWS.MONTH && (
        <>
          <CalendarGrid
            days={days}
            anchorMonth={anchorDate}
            eventsByDay={eventsByDay}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />

          <div className="flex flex-col gap-2">
            <h2 className="text-muted-foreground text-sm font-medium">
              {isSameDay(selectedDay, new Date()) ? "Hoy" : dayLabelFormatter.format(selectedDay)}
            </h2>

            {selectedDayEvents.length === 0 && (
              <EmptyState icon={CalendarDays} title="No hay actividades este día" />
            )}

            {selectedDayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}

      {!isLoading && !isError && view === CALENDAR_VIEWS.WEEK && (
        <CalendarWeekGrid days={days} events={events ?? []} />
      )}
    </div>
  )
}
