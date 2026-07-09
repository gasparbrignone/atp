import { useState } from "react"
import { Check, HelpCircle, Pencil, Trash2, X } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { ErrorState } from "@/components/common/ErrorState"
import { LoadingState } from "@/components/common/LoadingState"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useUserProfiles } from "@/features/auth/hooks/useUserProfiles"
import { useEvent } from "@/features/calendar/hooks/useEvent"
import { setRsvp, softDeleteEvent } from "@/features/calendar/services/events.service"
import {
  EVENT_TYPE_LABELS,
  RSVP_STATUSES,
  type RsvpStatus,
} from "@/features/calendar/types/event"
import { routes } from "@/routes/routes"
import { USER_ROLES } from "@/types/user"

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
})

const RSVP_OPTIONS: { status: RsvpStatus; label: string; icon: typeof Check }[] = [
  { status: RSVP_STATUSES.YES, label: "Asistiré", icon: Check },
  { status: RSVP_STATUSES.MAYBE, label: "Todavía no sé", icon: HelpCircle },
  { status: RSVP_STATUSES.NO, label: "No asistiré", icon: X },
]

const RSVP_LABELS: Record<RsvpStatus, string> = {
  yes: "Asistirá",
  no: "No asistirá",
  maybe: "Todavía no sabe",
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { firebaseUser, profile } = useAuth()
  const isCoordinator =
    profile?.role === USER_ROLES.COORDINATOR || profile?.role === USER_ROLES.ADMIN
  const { data: event, isLoading, isError } = useEvent(id)
  const attendanceUids = Object.keys(event?.attendance ?? {})
  const { data: attendanceProfiles } = useUserProfiles(attendanceUids)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isRsvpSaving, setIsRsvpSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const myRsvp = firebaseUser ? event?.attendance[firebaseUser.uid] : undefined

  async function handleRsvp(status: RsvpStatus) {
    if (!firebaseUser || !event) return

    setIsRsvpSaving(true)
    try {
      await setRsvp(event.id, firebaseUser.uid, status)
    } catch {
      toast.error("No se pudo guardar tu respuesta. Intentá nuevamente.")
    } finally {
      setIsRsvpSaving(false)
    }
  }

  async function handleDelete() {
    if (!event || !firebaseUser) return

    setIsDeleting(true)
    try {
      await softDeleteEvent(event.id, firebaseUser.uid)
      toast.success("Actividad eliminada.")
      navigate(routes.calendar)
    } catch {
      toast.error("No se pudo eliminar la actividad.")
    } finally {
      setIsDeleting(false)
      setIsDeleteOpen(false)
    }
  }

  if (isLoading) return <LoadingState />
  if (isError || !event) return <ErrorState />

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{event.title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {dateFormatter.format(event.startDate.toDate())}
          </p>
          <Badge variant="outline" className="mt-2">
            {EVENT_TYPE_LABELS[event.type]}
          </Badge>
        </div>

        {isCoordinator && (
          <div className="flex items-center gap-1">
            <Button
              render={<Link to={routes.eventEdit(event.id)} />}
              variant="ghost"
              size="icon-sm"
              aria-label="Editar actividad"
            >
              <Pencil />
            </Button>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Eliminar actividad"
                  >
                    <Trash2 />
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>¿Eliminar esta actividad?</DialogTitle>
                  <DialogDescription>
                    "{event.title}" se va a eliminar del calendario.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={handleDelete}
                  >
                    Eliminar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {event.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Descripción</CardTitle>
          </CardHeader>
          <CardContent className="text-sm whitespace-pre-wrap">
            {event.description}
          </CardContent>
        </Card>
      )}

      {event.location && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lugar</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{event.location}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tu participación</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {RSVP_OPTIONS.map(({ status, label, icon: Icon }) => (
            <Button
              key={status}
              type="button"
              variant={myRsvp === status ? "default" : "outline"}
              size="sm"
              disabled={isRsvpSaving}
              onClick={() => handleRsvp(status)}
              className="gap-1.5"
            >
              <Icon className="size-4" />
              {label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Asistencia</CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceUids.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Todavía nadie respondió.
            </p>
          )}

          {attendanceUids.length > 0 && (
            <ul className="flex flex-col gap-1.5 text-sm">
              {attendanceUids.map((uid) => (
                <li key={uid} className="flex items-center justify-between gap-2">
                  <span>{attendanceProfiles?.get(uid)?.displayName ?? "..."}</span>
                  <span className="text-muted-foreground text-xs">
                    {RSVP_LABELS[event.attendance[uid]]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
