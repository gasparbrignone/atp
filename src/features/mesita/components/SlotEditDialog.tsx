import { useState } from "react"
import { Settings } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { updateSlotByCoordinator } from "@/features/mesita/services/mesita.service"
import { getMesitaErrorMessage } from "@/features/mesita/utils/mesitaErrors"
import type { MesitaSlot } from "@/features/mesita/types/mesitaWeek"

interface SlotEditDialogProps {
  weekId: string
  slot: MesitaSlot
}

export function SlotEditDialog({ weekId, slot }: SlotEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [capacity, setCapacity] = useState(slot.capacity)
  const [blocked, setBlocked] = useState(slot.blocked)
  const [notes, setNotes] = useState(slot.notes ?? "")
  const [isSaving, setIsSaving] = useState(false)

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setCapacity(slot.capacity)
      setBlocked(slot.blocked)
      setNotes(slot.notes ?? "")
    }
    setOpen(nextOpen)
  }

  async function handleSave() {
    if (!Number.isInteger(capacity) || capacity < 1) {
      toast.error("La capacidad debe ser un número entero mayor a 0.")
      return
    }

    setIsSaving(true)

    try {
      await updateSlotByCoordinator(weekId, slot.day, slot.startHour, slot.endHour, {
        capacity,
        blocked,
        notes: notes.trim() || null,
      })
      toast.success("Horario actualizado.")
      setOpen(false)
    } catch (error) {
      toast.error(getMesitaErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Editar horario">
            <Settings />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {String(slot.startHour).padStart(2, "0")}:00 - {String(slot.endHour).padStart(2, "0")}:00
          </DialogTitle>
          <DialogDescription>
            Estos cambios se aplican solo a este horario de la semana actual.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="capacity">Capacidad</Label>
            <Input
              id="capacity"
              type="number"
              min={1}
              value={capacity}
              onChange={(event) => setCapacity(Number(event.target.value))}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="blocked">Bloquear horario</Label>
            <Switch id="blocked" checked={blocked} onCheckedChange={setBlocked} />
          </div>

          {blocked && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="notes">Motivo</Label>
              <Textarea
                id="notes"
                placeholder="Ej: Asamblea general"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
