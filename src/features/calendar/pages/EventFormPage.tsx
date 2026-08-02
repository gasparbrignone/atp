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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { EventColorPicker } from "@/features/calendar/components/EventColorPicker"
import { useEvent } from "@/features/calendar/hooks/useEvent"
import { createEvent, updateEvent } from "@/features/calendar/services/events.service"
import { EVENT_COLORS } from "@/features/calendar/types/event"
import { notifyUsers } from "@/features/notifications/services/notifications.service"
import { NOTIFICATION_TYPES } from "@/features/notifications/types/notification"
import {
  eventSchema,
  type EventFormValues,
} from "@/features/calendar/validations/event.schema"
import { routes } from "@/routes/routes"

function toDateInputValue(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10)
}

function toTimeInputValue(date: Date): string {
  return date.toTimeString().slice(0, 5)
}

const emptyValues: EventFormValues = {
  title: "",
  description: "",
  location: "",
  allDay: false,
  startDate: toDateInputValue(new Date()),
  startTime: "09:00",
  endDate: toDateInputValue(new Date()),
  endTime: "10:00",
  color: EVENT_COLORS.BLUE,
  responsibleUsers: [],
}

export function EventFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id
  const navigate = useNavigate()
  const { firebaseUser } = useAuth()
  const { data: event, isLoading } = useEvent(id)

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: emptyValues,
  })

  const allDay = watch("allDay")

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        location: event.location,
        allDay: event.allDay,
        startDate: toDateInputValue(event.startDate.toDate()),
        startTime: toTimeInputValue(event.startDate.toDate()),
        endDate: toDateInputValue(event.endDate.toDate()),
        endTime: toTimeInputValue(event.endDate.toDate()),
        color: event.color,
        responsibleUsers: event.responsibleUsers,
      })
    }
  }, [event, reset])

  async function onSubmit(values: EventFormValues) {
    if (!firebaseUser) return

    const startDate = values.allDay
      ? new Date(`${values.startDate}T00:00:00`)
      : new Date(`${values.startDate}T${values.startTime}`)
    const endDate = values.allDay
      ? new Date(`${values.endDate}T23:59:59`)
      : new Date(`${values.endDate}T${values.endTime}`)

    const input = {
      title: values.title,
      description: values.description,
      location: values.location,
      allDay: values.allDay,
      startDate,
      endDate,
      color: values.color,
      responsibleUsers: values.responsibleUsers,
    }

    try {
      if (isEditing && id) {
        await updateEvent(id, input)
        toast.success("Actividad actualizada.")
        navigate(routes.eventDetail(id))
      } else {
        const newId = await createEvent(input, firebaseUser.uid)
        toast.success("Actividad creada.")
        navigate(routes.eventDetail(newId))

        const usersToNotify = input.responsibleUsers.filter((uid) => uid !== firebaseUser.uid)
        notifyUsers(usersToNotify, {
          title: "Nueva actividad",
          message: input.title,
          type: NOTIFICATION_TYPES.CALENDAR,
          relatedId: newId,
        }).catch(() => {
          // Best-effort: si falla la notificación no afecta la creación de la actividad.
        })
      }
    } catch {
      toast.error("No se pudo guardar la actividad. Intentá nuevamente.")
    }
  }

  if (isEditing && isLoading) {
    return <LoadingState />
  }

  return (
    <form className="flex flex-col gap-6 p-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className="text-xl font-semibold">
        {isEditing ? "Editar actividad" : "Nueva actividad"}
      </h1>

      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" placeholder="Ej: Capacitación de RCP" {...register("title")} />
        {errors.title && (
          <p className="text-destructive text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="location">Lugar</Label>
        <Input id="location" placeholder="Ej: Aula 3" {...register("location")} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="allDay">Todo el día</Label>
        <Controller
          control={control}
          name="allDay"
          render={({ field }) => (
            <Switch id="allDay" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="startDate">Fecha de inicio</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
          {errors.startDate && (
            <p className="text-destructive text-sm">{errors.startDate.message}</p>
          )}
        </div>

        {!allDay && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="startTime">Hora de inicio</Label>
            <Input id="startTime" type="time" {...register("startTime")} />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="endDate">Fecha de fin</Label>
          <Input id="endDate" type="date" {...register("endDate")} />
          {errors.endDate && (
            <p className="text-destructive text-sm">{errors.endDate.message}</p>
          )}
        </div>

        {!allDay && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="endTime">Hora de fin</Label>
            <Input id="endTime" type="time" {...register("endTime")} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Color</Label>
        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <EventColorPicker value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Responsables</Label>
        <Controller
          control={control}
          name="responsibleUsers"
          render={({ field }) => (
            <UserMultiSelect
              value={field.value}
              onChange={field.onChange}
              placeholder="Buscar responsable..."
            />
          )}
        />
        {errors.responsibleUsers && (
          <p className="text-destructive text-sm">{errors.responsibleUsers.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isEditing ? "Guardar cambios" : "Crear actividad"}
      </Button>
    </form>
  )
}
