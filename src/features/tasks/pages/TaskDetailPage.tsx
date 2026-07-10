import { useState } from "react"
import { Ban, Pencil } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"

import { ErrorState } from "@/components/common/ErrorState"
import { LoadingState } from "@/components/common/LoadingState"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useUserProfiles } from "@/features/auth/hooks/useUserProfiles"
import { TaskComments } from "@/features/tasks/components/TaskComments"
import { useTask } from "@/features/tasks/hooks/useTask"
import { setTaskStatus } from "@/features/tasks/services/tasks.service"
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type TaskStatus,
} from "@/features/tasks/types/task"
import { routes } from "@/routes/routes"
import { USER_ROLES } from "@/types/user"

const dueDateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
})

const STATUS_OPTIONS: { status: TaskStatus; label: string }[] = [
  { status: TASK_STATUSES.PENDING, label: "Pendiente" },
  { status: TASK_STATUSES.IN_PROGRESS, label: "En progreso" },
  { status: TASK_STATUSES.COMPLETED, label: "Finalizada" },
]

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { firebaseUser, profile } = useAuth()
  const isCoordinator =
    profile?.role === USER_ROLES.COORDINATOR || profile?.role === USER_ROLES.ADMIN
  const { data: task, isLoading, isError, refetch } = useTask(id)
  const { data: assignedProfiles } = useUserProfiles(task?.assignedUsers ?? [])
  const [isSaving, setIsSaving] = useState(false)

  const isAssignedToMe = !!(
    firebaseUser && task?.assignedUsers.includes(firebaseUser.uid)
  )
  const canChangeStatus = isCoordinator || isAssignedToMe

  async function handleStatusChange(status: TaskStatus) {
    if (!task) return

    setIsSaving(true)
    try {
      await setTaskStatus(task.id, status)
      await refetch()
    } catch {
      toast.error("No se pudo actualizar el estado de la tarea.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <LoadingState />
  if (isError || !task) return <ErrorState />

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{task.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge>{TASK_PRIORITY_LABELS[task.priority]}</Badge>
            <Badge variant="secondary">{TASK_STATUS_LABELS[task.status]}</Badge>
          </div>
        </div>

        {isCoordinator && (
          <div className="flex items-center gap-1">
            <Button
              render={<Link to={routes.taskEdit(task.id)} />}
              variant="ghost"
              size="icon-sm"
              aria-label="Editar tarea"
            >
              <Pencil />
            </Button>
            {task.status !== TASK_STATUSES.CANCELLED && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Cancelar tarea"
                disabled={isSaving}
                onClick={() => handleStatusChange(TASK_STATUSES.CANCELLED)}
              >
                <Ban />
              </Button>
            )}
          </div>
        )}
      </div>

      {task.dueDate && (
        <p className="text-muted-foreground text-sm">
          Fecha límite: {dueDateFormatter.format(task.dueDate.toDate())}
        </p>
      )}

      {task.meetingId && (
        <Link
          to={routes.meetingDetail(task.meetingId)}
          className="text-primary text-sm underline-offset-4 hover:underline"
        >
          Ver reunión donde se repartió esta tarea
        </Link>
      )}

      {canChangeStatus && task.status !== TASK_STATUSES.CANCELLED && (
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map(({ status, label }) => (
            <Button
              key={status}
              type="button"
              variant={task.status === status ? "default" : "outline"}
              size="sm"
              disabled={isSaving}
              onClick={() => handleStatusChange(status)}
            >
              {label}
            </Button>
          ))}
        </div>
      )}

      {task.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Descripción</CardTitle>
          </CardHeader>
          <CardContent className="text-sm whitespace-pre-wrap">
            {task.description}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Responsables</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1.5">
          {task.assignedUsers.map((uid) => (
            <Badge key={uid} variant="secondary">
              {assignedProfiles?.get(uid)?.displayName ?? "..."}
            </Badge>
          ))}
        </CardContent>
      </Card>

      {task.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Observaciones</CardTitle>
          </CardHeader>
          <CardContent className="text-sm whitespace-pre-wrap">{task.notes}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comentarios</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskComments taskId={task.id} />
        </CardContent>
      </Card>
    </div>
  )
}
