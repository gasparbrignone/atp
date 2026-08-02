import { EVENT_COLORS, type EventColor } from "@/features/calendar/types/event"

// Un solo valor por color (no par claro/oscuro): se usan como acento sólido
// (punto, barra lateral, franja) sobre fondos claros u oscuros por igual.
export const EVENT_COLOR_VALUES: Record<EventColor, string> = {
  [EVENT_COLORS.BLUE]: "oklch(0.6 0.16 258)",
  [EVENT_COLORS.GREEN]: "oklch(0.6 0.15 150)",
  [EVENT_COLORS.AMBER]: "oklch(0.75 0.15 80)",
  [EVENT_COLORS.RED]: "oklch(0.62 0.21 25)",
  [EVENT_COLORS.PURPLE]: "oklch(0.58 0.18 300)",
  [EVENT_COLORS.PINK]: "oklch(0.65 0.18 350)",
  [EVENT_COLORS.TEAL]: "oklch(0.6 0.13 200)",
  [EVENT_COLORS.GRAY]: "oklch(0.55 0.01 258)",
}

export const EVENT_COLOR_LABELS: Record<EventColor, string> = {
  [EVENT_COLORS.BLUE]: "Azul",
  [EVENT_COLORS.GREEN]: "Verde",
  [EVENT_COLORS.AMBER]: "Ámbar",
  [EVENT_COLORS.RED]: "Rojo",
  [EVENT_COLORS.PURPLE]: "Violeta",
  [EVENT_COLORS.PINK]: "Rosa",
  [EVENT_COLORS.TEAL]: "Verde azulado",
  [EVENT_COLORS.GRAY]: "Gris",
}
