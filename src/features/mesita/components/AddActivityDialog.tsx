import { useState } from "react"
import { CalendarPlus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { createEvent } from "@/features/calendar/services/events.service"
import { EVENT_COLORS } from "@/features/calendar/types/event"
import { updateSlotByCoordinator } from "@/features/mesita/services/mesita.service"
import { getMesitaErrorMessage } from "@/features/mesita/utils/mesitaErrors"
import { getDateForDay } from "@/features/mesita/utils/weekRange"
import {
  MESITA_DAYS,
  MESITA_DAY_LABELS,
  MESITA_START_HOURS,
  type MesitaDay,
} from "@/features/mesita/types/mesitaWeek"

interface AddActivityDialogProps {
  weekId: string
  monday: Date
}

const END_HOURS = [...MESITA_START_HOURS.map((h) => h + 1)]

const DAY_ITEMS = Object.fromEntries(
  MESITA_DAYS.map((d) => [String(d), MESITA_DAY_LABELS[d]])
)

function hourItems(hours: readonly number[]) {
  return Object.fromEntries(hours.map((h) => [String(h), `${String(h).padStart(2, "0")}:00`]))
}

const START_HOUR_ITEMS = hourItems(MESITA_START_HOURS)
const END_HOUR_ITEMS = hourItems(END_HOURS)

export function AddActivityDialog({ weekId, monday }: AddActivityDialogProps) {
  const { firebaseUser } = useAuth()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [day, setDay] = useState<MesitaDay>(1)
  const [startHour, setStartHour] = useState<number>(MESITA_START_HOURS[0])
  const [endHour, setEndHour] = useState<number>(MESITA_START_HOURS[0] + 1)
  const [blockMesita, setBlockMesita] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  function resetForm() {
    setTitle("")
    setDay(1)
    setStartHour(MESITA_START_HOURS[0])
    setEndHour(MESITA_START_HOURS[0] + 1)
    setBlockMesita(true)
  }

  async function handleSave() {
    if (!firebaseUser) return

    if (!title.trim()) {
      toast.error("Escribí el nombre de la actividad.")
      return
    }

    if (endHour <= startHour) {
      toast.error("El horario de fin debe ser posterior al de inicio.")
      return
    }

    setIsSaving(true)

    try {
      await createEvent(
        {
          title: title.trim(),
          description: "",
          location: "",
          allDay: false,
          startDate: getDateForDay(monday, day, startHour),
          endDate: getDateForDay(monday, day, endHour),
          color: EVENT_COLORS.GRAY,
          responsibleUsers: [firebaseUser.uid],
        },
        firebaseUser.uid
      )

      if (blockMesita) {
        const hours = Array.from(
          { length: endHour - startHour },
          (_, index) => startHour + index
        )

        await Promise.all(
          hours.map((hour) =>
            updateSlotByCoordinator(weekId, day, hour, hour + 1, {
              blocked: true,
              notes: title.trim(),
            })
          )
        )
      }

      toast.success("Actividad creada.")
      resetForm()
      setOpen(false)
    } catch (error) {
      toast.error(getMesitaErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button type="button" variant="outline" size="sm" className="gap-1.5">
            <CalendarPlus className="size-4" />
            Nueva actividad
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva actividad semanal</DialogTitle>
          <DialogDescription>
            Se agrega al calendario de ATP. Si bloqueás Mesita, nadie va a
            poder anotarse en ese horario mientras dure la actividad.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="activity-title">Nombre de la actividad</Label>
            <Input
              id="activity-title"
              placeholder="Ej: Asamblea general"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Día</Label>
            <Select
              items={DAY_ITEMS}
              value={String(day)}
              onValueChange={(value) => setDay(Number(value) as MesitaDay)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MESITA_DAYS.map((d) => (
                  <SelectItem key={d} value={String(d)}>
                    {MESITA_DAY_LABELS[d]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label>Desde</Label>
              <Select
                items={START_HOUR_ITEMS}
                value={String(startHour)}
                onValueChange={(value) => setStartHour(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESITA_START_HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {String(h).padStart(2, "0")}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Hasta</Label>
              <Select
                items={END_HOUR_ITEMS}
                value={String(endHour)}
                onValueChange={(value) => setEndHour(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {END_HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {String(h).padStart(2, "0")}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="block-mesita">Bloquear Mesita durante esta actividad</Label>
            <Switch id="block-mesita" checked={blockMesita} onCheckedChange={setBlockMesita} />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            Crear actividad
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
