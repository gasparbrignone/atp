import { z } from "zod"

import { EVENT_TYPES } from "@/features/calendar/types/event"

export const eventSchema = z
  .object({
    title: z.string().min(1, "Ingresá un título"),
    description: z.string(),
    location: z.string(),
    date: z.string().min(1, "Seleccioná una fecha"),
    startTime: z.string().min(1, "Seleccioná la hora de inicio"),
    endTime: z.string().min(1, "Seleccioná la hora de fin"),
    type: z.enum([
      EVENT_TYPES.MEETING,
      EVENT_TYPES.CAMPAIGN,
      EVENT_TYPES.TRAINING,
      EVENT_TYPES.ACADEMIC,
      EVENT_TYPES.OTHER,
    ]),
    responsibleUsers: z.array(z.string()).min(1, "Seleccioná al menos un responsable"),
  })
  .refine((values) => values.endTime > values.startTime, {
    message: "El horario de fin debe ser posterior al de inicio",
    path: ["endTime"],
  })

export type EventFormValues = z.infer<typeof eventSchema>
