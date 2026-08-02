import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { EVENT_COLORS, type EventColor } from "@/features/calendar/types/event"
import { EVENT_COLOR_LABELS, EVENT_COLOR_VALUES } from "@/features/calendar/utils/eventColors"

interface EventColorPickerProps {
  value: EventColor
  onChange: (color: EventColor) => void
}

export function EventColorPicker({ value, onChange }: EventColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.values(EVENT_COLORS).map((color) => {
        const isSelected = color === value

        return (
          <button
            key={color}
            type="button"
            aria-label={EVENT_COLOR_LABELS[color]}
            aria-pressed={isSelected}
            onClick={() => onChange(color)}
            className={cn(
              "flex size-9 items-center justify-center rounded-full border-2 transition-colors",
              isSelected ? "border-foreground" : "border-transparent"
            )}
            style={{ backgroundColor: EVENT_COLOR_VALUES[color] }}
          >
            {isSelected && <Check className="size-4 text-white drop-shadow" />}
          </button>
        )
      })}
    </div>
  )
}
