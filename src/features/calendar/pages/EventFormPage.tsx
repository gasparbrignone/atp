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
import { useEvent } from "@/features/calendar/hooks/useEvent"
import { createEvent, updateEvent } from "@/features/calendar/services/events.service"
import { EVENT_TYPE_LABELS, EVENT_TYPES } from "@/features/calendar/types/event"
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
  date: toDateInputValue(new Date()),
  startTime: "09:00",
  endTime: "10:00",
  type: EVENT_TYPES.OTHER,
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
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        location: event.location,
        date: toDateInputValue(event.startDate.toDate()),
        startTime: toTimeInputValue(event.startDate.toDate()),
        endTime: toTimeInputValue(event.endDate.toDate()),
        type: event.type,
        responsibleUsers: event.responsibleUsers,
      })
    }
  }, [event, reset])

  async function onSubmit(values: EventFormValues) {
    if (!firebaseUser) return

    const startDate = new Date(`${values.date}T${values.startTime}`)
    const endDate = new Date(`${values.date}T${values.endTime}`)

    const input = {
      title: values.title,
      description: values.description,
      location: values.location,
      startDate,
      endDate,
      type: values.type,
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

      <div className="flex flex-col gap-2">
        <Label>Tipo</Label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(EVENT_TYPES).map((type) => (
                  <SelectItem key={type} value={type}>
                    {EVENT_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="date">Fecha</Label>
          <Input id="date" type="date" {...register("date")} />
          {errors.date && (
            <p className="text-destructive text-sm">{errors.date.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="startTime">Desde</Label>
          <Input id="startTime" type="time" {...register("startTime")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="endTime">Hasta</Label>
          <Input id="endTime" type="time" {...register("endTime")} />
          {errors.endTime && (
            <p className="text-destructive text-sm">{errors.endTime.message}</p>
          )}
        </div>
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
