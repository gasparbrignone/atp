import { z } from "zod"

export const meetingTopicSchema = z.object({
  title: z.string().min(1, "Ingresá un título para el tema"),
  discussion: z.string(),
  decision: z.string(),
})

export const meetingSchema = z.object({
  date: z.string().min(1, "Seleccioná una fecha"),
  title: z.string().min(1, "Ingresá un título para la reunión"),
  summary: z.string(),
  weeklyBalance: z.string(),
  attendees: z.array(z.string()).min(1, "Seleccioná al menos un asistente"),
  topics: z.array(meetingTopicSchema),
  decisions: z.array(z.string().min(1, "La decisión no puede estar vacía")),
})

export type MeetingFormValues = z.infer<typeof meetingSchema>
