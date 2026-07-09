import { z } from "zod"

import { TASK_PRIORITIES } from "@/features/tasks/types/task"

export const taskSchema = z.object({
  title: z.string().min(1, "Ingresá un título"),
  description: z.string(),
  notes: z.string(),
  priority: z.enum([
    TASK_PRIORITIES.LOW,
    TASK_PRIORITIES.MEDIUM,
    TASK_PRIORITIES.HIGH,
    TASK_PRIORITIES.URGENT,
  ]),
  assignedUsers: z.array(z.string()).min(1, "Asigná al menos un responsable"),
  dueDate: z.string(),
})

export type TaskFormValues = z.infer<typeof taskSchema>
