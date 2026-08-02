import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { LoadingState } from "@/components/common/LoadingState"
import { UserMultiSelect } from "@/components/common/UserMultiSelect"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { notifyUsers } from "@/features/notifications/services/notifications.service"
import { NOTIFICATION_TYPES } from "@/features/notifications/types/notification"
import { useTask } from "@/features/tasks/hooks/useTask"
import { createTask, updateTask } from "@/features/tasks/services/tasks.service"
import { TASK_PRIORITIES, TASK_PRIORITY_LABELS } from "@/features/tasks/types/task"
import {
  taskSchema,
  type TaskFormValues,
} from "@/features/tasks/validations/task.schema"
import { routes } from "@/routes/routes"

function toDateInputValue(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10)
}

const emptyValues: TaskFormValues = {
  title: "",
  description: "",
  notes: "",
  priority: TASK_PRIORITIES.MEDIUM,
  assignedUsers: [],
  dueDate: "",
}

export function TaskFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id
  const navigate = useNavigate()
  const { firebaseUser } = useAuth()
  const { data: task, isLoading } = useTask(id)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        notes: task.notes,
        priority: task.priority,
        assignedUsers: task.assignedUsers,
        dueDate: task.dueDate ? toDateInputValue(task.dueDate.toDate()) : "",
      })
    }
  }, [task, reset])

  async function onSubmit(values: TaskFormValues) {
    if (!firebaseUser) return

    const input = {
      title: values.title,
      description: values.description,
      notes: values.notes,
      priority: values.priority,
      assignedUsers: values.assignedUsers,
      dueDate: values.dueDate ? new Date(values.dueDate) : null,
    }

    try {
      if (isEditing && id) {
        await updateTask(id, input)
        toast.success("Tarea actualizada.")
        navigate(routes.taskDetail(id))
      } else {
        const newId = await createTask(input, firebaseUser.uid)
        toast.success("Tarea creada.")
        navigate(routes.taskDetail(newId))

        const usersToNotify = input.assignedUsers.filter((uid) => uid !== firebaseUser.uid)
        notifyUsers(usersToNotify, {
          title: "Nueva tarea asignada",
          message: input.title,
          type: NOTIFICATION_TYPES.TASK,
          relatedId: newId,
        }).catch(() => {
          // Best-effort: si falla la notificación no afecta la creación de la tarea.
        })
      }
    } catch {
      toast.error("No se pudo guardar la tarea. Intentá nuevamente.")
    }
  }

  if (isEditing && isLoading) {
    return <LoadingState />
  }

  return (
    <form className="flex flex-col gap-6 p-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className="text-xl font-semibold">{isEditing ? "Editar tarea" : "Nueva tarea"}</h1>

      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" placeholder="Ej: Armar cronograma de campaña" {...register("title")} />
        {errors.title && (
          <p className="text-destructive text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Prioridad</Label>
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Select items={TASK_PRIORITY_LABELS} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TASK_PRIORITIES).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {TASK_PRIORITY_LABELS[priority]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dueDate">Fecha límite</Label>
          <Input id="dueDate" type="date" {...register("dueDate")} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Responsables</Label>
        <Controller
          control={control}
          name="assignedUsers"
          render={({ field }) => (
            <UserMultiSelect
              value={field.value}
              onChange={field.onChange}
              placeholder="Buscar responsable..."
            />
          )}
        />
        {errors.assignedUsers && (
          <p className="text-destructive text-sm">{errors.assignedUsers.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Observaciones</Label>
        <Textarea id="notes" {...register("notes")} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isEditing ? "Guardar cambios" : "Crear tarea"}
      </Button>
    </form>
  )
}
