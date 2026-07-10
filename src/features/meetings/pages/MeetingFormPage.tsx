import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingState } from "@/components/common/LoadingState"
import { UserMultiSelect } from "@/components/common/UserMultiSelect"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { notifyUsers } from "@/features/notifications/services/notifications.service"
import { NOTIFICATION_TYPES } from "@/features/notifications/types/notification"
import { DecisionsFieldArray } from "@/features/meetings/components/DecisionsFieldArray"
import {
  MeetingTasksSection,
  type DraftMeetingTask,
} from "@/features/meetings/components/MeetingTasksSection"
import { TopicFieldArray } from "@/features/meetings/components/TopicFieldArray"
import { useMeeting } from "@/features/meetings/hooks/useMeeting"
import {
  createMeeting,
  updateMeeting,
} from "@/features/meetings/services/meetings.service"
import {
  meetingSchema,
  type MeetingFormValues,
} from "@/features/meetings/validations/meeting.schema"
import { createTask } from "@/features/tasks/services/tasks.service"
import { TASK_PRIORITIES } from "@/features/tasks/types/task"
import { routes } from "@/routes/routes"

function toDateInputValue(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10)
}

const emptyValues: MeetingFormValues = {
  date: toDateInputValue(new Date()),
  title: "",
  summary: "",
  weeklyBalance: "",
  attendees: [],
  topics: [],
  decisions: [],
}

export function MeetingFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id
  const navigate = useNavigate()
  const { firebaseUser } = useAuth()
  const { data: meeting, isLoading } = useMeeting(id)
  const [draftTasks, setDraftTasks] = useState<DraftMeetingTask[]>([])

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (meeting) {
      reset({
        date: toDateInputValue(meeting.date.toDate()),
        title: meeting.title,
        summary: meeting.summary,
        weeklyBalance: meeting.weeklyBalance,
        attendees: meeting.attendees,
        topics: meeting.topics.map(({ title, discussion, decision }) => ({
          title,
          discussion,
          decision,
        })),
        decisions: meeting.decisions,
      })
    }
  }, [meeting, reset])

  async function createDraftTasks(meetingId: string) {
    if (!firebaseUser) return

    const tasksToCreate = draftTasks.filter((task) => task.title.trim())

    for (const task of tasksToCreate) {
      try {
        const taskId = await createTask(
          {
            title: task.title.trim(),
            description: task.description,
            notes: "",
            priority: TASK_PRIORITIES.MEDIUM,
            assignedUsers: task.assignedUsers,
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
            meetingId,
          },
          firebaseUser.uid
        )

        const usersToNotify = task.assignedUsers.filter((uid) => uid !== firebaseUser.uid)
        notifyUsers(usersToNotify, {
          title: "Nueva tarea asignada",
          message: task.title.trim(),
          type: NOTIFICATION_TYPES.TASK,
          relatedId: taskId,
        }).catch(() => {
          // Best-effort.
        })
      } catch {
        toast.error(`No se pudo crear la tarea "${task.title}".`)
      }
    }
  }

  async function onSubmit(values: MeetingFormValues) {
    if (!firebaseUser) return

    try {
      if (isEditing && id) {
        await updateMeeting(id, values)
        await createDraftTasks(id)
        toast.success("Reunión actualizada.")
        navigate(routes.meetingDetail(id))
      } else {
        const newId = await createMeeting(values, firebaseUser.uid)
        await createDraftTasks(newId)
        toast.success("Reunión creada.")
        navigate(routes.meetingDetail(newId))

        const usersToNotify = values.attendees.filter((uid) => uid !== firebaseUser.uid)
        notifyUsers(usersToNotify, {
          title: "Nueva reunión",
          message: values.title,
          type: NOTIFICATION_TYPES.MEETING,
          relatedId: newId,
        }).catch(() => {
          // Best-effort: si falla la notificación no afecta la creación de la reunión.
        })
      }
    } catch {
      toast.error("No se pudo guardar la reunión. Intentá nuevamente.")
    }
  }

  if (isEditing && isLoading) {
    return <LoadingState />
  }

  return (
    <form className="flex flex-col gap-6 p-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className="text-xl font-semibold">
        {isEditing ? "Editar reunión" : "Nueva reunión"}
      </h1>

      <div className="flex flex-col gap-2">
        <Label htmlFor="date">Fecha</Label>
        <Input id="date" type="date" {...register("date")} />
        {errors.date && (
          <p className="text-destructive text-sm">{errors.date.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" placeholder="Ej: Reunión semanal" {...register("title")} />
        {errors.title && (
          <p className="text-destructive text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="summary">Resumen</Label>
        <Textarea id="summary" placeholder="Resumen general de la reunión" {...register("summary")} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="weeklyBalance">Balance semanal</Label>
        <Textarea
          id="weeklyBalance"
          placeholder="Cómo estuvo la semana"
          {...register("weeklyBalance")}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Asistentes</Label>
        <Controller
          control={control}
          name="attendees"
          render={({ field }) => (
            <UserMultiSelect
              value={field.value}
              onChange={field.onChange}
              placeholder="Buscar asistente..."
            />
          )}
        />
        {errors.attendees && (
          <p className="text-destructive text-sm">{errors.attendees.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Temas tratados</Label>
        <TopicFieldArray control={control} register={register} />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Decisiones</Label>
        <Controller
          control={control}
          name="decisions"
          render={({ field }) => (
            <DecisionsFieldArray value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Tareas repartidas en esta reunión</Label>
        <p className="text-muted-foreground text-sm">
          Se crean como tareas normales, con responsable(s) y fecha límite, y
          quedan visibles acá y en el módulo de Tareas.
        </p>
        <MeetingTasksSection tasks={draftTasks} onChange={setDraftTasks} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isEditing ? "Guardar cambios" : "Crear reunión"}
      </Button>
    </form>
  )
}
