import { cn } from "@/lib/utils"
import { isSameDay, isSameMonth, WEEKDAY_LABELS } from "@/features/calendar/utils/calendarGrid"
import type { CalendarEvent } from "@/features/calendar/types/event"

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
          const count = eventsByDay.get(dayKey(day))?.length ?? 0
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
              <span
                className={cn(
                  "size-1 rounded-full",
                  count > 0 ? (isSelected ? "bg-primary-foreground" : "bg-primary") : "bg-transparent"
                )}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
