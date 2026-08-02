import { z } from "zod"

import { EVENT_COLORS } from "@/features/calendar/types/event"

export const eventSchema = z
  .object({
    title: z.string().min(1, "Ingresá un título"),
    description: z.string(),
    location: z.string(),
    allDay: z.boolean(),
    startDate: z.string().min(1, "Seleccioná una fecha de inicio"),
    startTime: z.string(),
    endDate: z.string().min(1, "Seleccioná una fecha de fin"),
    endTime: z.string(),
    color: z.enum([
      EVENT_COLORS.BLUE,
      EVENT_COLORS.GREEN,
      EVENT_COLORS.AMBER,
      EVENT_COLORS.RED,
      EVENT_COLORS.PURPLE,
      EVENT_COLORS.PINK,
      EVENT_COLORS.TEAL,
      EVENT_COLORS.GRAY,
    ]),
    responsibleUsers: z.array(z.string()).min(1, "Seleccioná al menos un responsable"),
  })
  .refine(
    (values) => {
      const start = values.allDay ? values.startDate : `${values.startDate}T${values.startTime}`
      const end = values.allDay ? values.endDate : `${values.endDate}T${values.endTime}`
      return end >= start
    },
    {
      message: "La fecha de fin debe ser igual o posterior a la de inicio",
      path: ["endDate"],
    }
  )

export type EventFormValues = z.infer<typeof eventSchema>
