import type { Timestamp } from "firebase/firestore"

export const TASK_STATUSES = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const

export type TaskStatus = (typeof TASK_STATUSES)[keyof typeof TASK_STATUSES]

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pendiente",
  in_progress: "En progreso",
  completed: "Finalizada",
  cancelled: "Cancelada",
}

export const TASK_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const

export type TaskPriority =
  (typeof TASK_PRIORITIES)[keyof typeof TASK_PRIORITIES]

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
}

export interface Task {
  id: string
  title: string
  description: string
  notes: string
  status: TaskStatus
  priority: TaskPriority
  assignedUsers: string[]
  dueDate: Timestamp | null
  completedAt: Timestamp | null
  // Reunión en la que se repartió esta tarea (FEATURES.md: "tareas
  // asignadas" es parte de la información de una reunión). No está en
  // DATABASE.md; permite mostrar la tarea tanto en el módulo de Tareas
  // como en el acta de la reunión donde se creó.
  meetingId: string | null
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface TaskComment {
  id: string
  authorId: string
  message: string
  createdAt: Timestamp
}
