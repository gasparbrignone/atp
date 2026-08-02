import { cn } from "@/lib/utils"
import { isSameDay, isSameMonth, WEEKDAY_LABELS } from "@/features/calendar/utils/calendarGrid"
import { EVENT_COLOR_VALUES } from "@/features/calendar/utils/eventColors"
import type { CalendarEvent } from "@/features/calendar/types/event"

const MAX_DOTS = 3

interface CalendarGridProps {
  days: Date[]
  anchorMonth: Date
  eventsByDay: Map<string, CalendarEvent[]>
  selectedDay: Date
  onSelectDay: (day: Date) => void
}

export function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function CalendarGrid({
  days,
  anchorMonth,
  eventsByDay,
  selectedDay,
  onSelectDay,
}: CalendarGridProps) {
  const today = new Date()

  return (
    <div className="flex flex-col gap-1">
      <div className="text-muted-foreground grid grid-cols-7 text-center text-xs font-medium">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayEvents = eventsByDay.get(dayKey(day)) ?? []
          const outsideMonth = !isSameMonth(day, anchorMonth)
          const isToday = isSameDay(day, today)
          const isSelected = isSameDay(day, selectedDay)

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDay(day)}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-0.5 rounded-md text-sm transition-colors",
                outsideMonth && "text-muted-foreground/40",
                !outsideMonth && !isSelected && "text-foreground hover:bg-muted",
                isSelected && "bg-primary text-primary-foreground",
                isToday && !isSelected && "border-primary text-primary border"
              )}
            >
              {day.getDate()}
              <span className="flex h-1 items-center gap-0.5">
                {dayEvents.slice(0, MAX_DOTS).map((event, index) => (
                  <span
                    key={`${event.id}-${index}`}
                    className="size-1 rounded-full"
                    style={{
                      backgroundColor: isSelected
                        ? "currentColor"
                        : EVENT_COLOR_VALUES[event.color],
                    }}
                  />
                ))}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
