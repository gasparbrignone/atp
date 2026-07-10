import { useState } from "react"
import { Copy, Download, Pencil, Trash2 } from "lucide-react"
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
import { useMeeting } from "@/features/meetings/hooks/useMeeting"
import {
  duplicateMeeting,
  softDeleteMeeting,
} from "@/features/meetings/services/meetings.service"
import { TaskCard } from "@/features/tasks/components/TaskCard"
import { useMeetingTasks } from "@/features/tasks/hooks/useMeetingTasks"
import { routes } from "@/routes/routes"
import { USER_ROLES } from "@/types/user"

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
})

export function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { firebaseUser, profile } = useAuth()
  const isCoordinator =
    profile?.role === USER_ROLES.COORDINATOR || profile?.role === USER_ROLES.ADMIN
  const { data: meeting, isLoading, isError } = useMeeting(id)
  const { data: attendeeProfiles } = useUserProfiles(meeting?.attendees ?? [])
  const { data: meetingTasks } = useMeetingTasks(id)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isWorking, setIsWorking] = useState(false)

  async function handleDuplicate() {
    if (!meeting || !firebaseUser) return

    setIsWorking(true)
    try {
      const newId = await duplicateMeeting(meeting, firebaseUser.uid)
      toast.success("Reunión duplicada.")
      navigate(routes.meetingDetail(newId))
    } catch {
      toast.error("No se pudo duplicar la reunión.")
    } finally {
      setIsWorking(false)
    }
  }

  async function handleDelete() {
    if (!meeting || !firebaseUser) return

    setIsWorking(true)
    try {
      await softDeleteMeeting(meeting.id, firebaseUser.uid)
      toast.success("Reunión eliminada.")
      navigate(routes.meetings)
    } catch {
      toast.error("No se pudo eliminar la reunión.")
    } finally {
      setIsWorking(false)
      setIsDeleteOpen(false)
    }
  }

  if (isLoading) return <LoadingState />
  if (isError || !meeting) return <ErrorState />

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-xl font-semibold">{meeting.title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {dateFormatter.format(meeting.date.toDate())}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Descargar / exportar PDF"
            onClick={() => window.print()}
          >
            <Download />
          </Button>

          {isCoordinator && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Duplicar reunión"
                disabled={isWorking}
                onClick={handleDuplicate}
              >
                <Copy />
              </Button>
              <Button
                render={<Link to={routes.meetingEdit(meeting.id)} />}
                variant="ghost"
                size="icon-sm"
                aria-label="Editar reunión"
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
                      aria-label="Eliminar reunión"
                    >
                      <Trash2 />
                    </Button>
                  }
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>¿Eliminar esta reunión?</DialogTitle>
                    <DialogDescription>
                      La reunión "{meeting.title}" se va a eliminar. Esta acción no
                      se puede deshacer desde la interfaz.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={isWorking}
                      onClick={handleDelete}
                    >
                      Eliminar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      <div className="hidden print:block">
        <h1 className="text-xl font-semibold">{meeting.title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {dateFormatter.format(meeting.date.toDate())}
        </p>
      </div>

      {meeting.summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumen</CardTitle>
          </CardHeader>
          <CardContent className="text-sm whitespace-pre-wrap">
            {meeting.summary}
          </CardContent>
        </Card>
      )}

      {meeting.weeklyBalance && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Balance semanal</CardTitle>
          </CardHeader>
          <CardContent className="text-sm whitespace-pre-wrap">
            {meeting.weeklyBalance}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Asistentes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1.5">
          {meeting.attendees.length === 0 && (
            <p className="text-muted-foreground text-sm">Sin asistentes registrados.</p>
          )}
          {meeting.attendees.map((uid) => (
            <Badge key={uid} variant="secondary">
              {attendeeProfiles?.get(uid)?.displayName ?? "..."}
            </Badge>
          ))}
        </CardContent>
      </Card>

      {meeting.topics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Temas tratados</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {meeting.topics.map((topic, index) => (
              <div key={index} className="flex flex-col gap-1 text-sm">
                <p className="font-medium">{topic.title}</p>
                {topic.discussion && (
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {topic.discussion}
                  </p>
                )}
                {topic.decision && (
                  <p className="whitespace-pre-wrap">
                    <span className="font-medium">Decisión: </span>
                    {topic.decision}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {meeting.decisions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Decisiones</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 text-sm">
              {meeting.decisions.map((decision, index) => (
                <li key={index}>{decision}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {meetingTasks && meetingTasks.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold">Tareas repartidas en esta reunión</h2>
          {meetingTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}
