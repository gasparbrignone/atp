import { Loader2, Plus, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SlotEditDialog } from "@/features/mesita/components/SlotEditDialog"
import {
  SLOT_STATUSES,
  getSlotStatus,
  type MesitaSlot,
} from "@/features/mesita/types/mesitaWeek"
import type { UserProfile } from "@/types/user"

const STATUS_LABELS: Record<string, string> = {
  [SLOT_STATUSES.EMPTY]: "Vacío",
  [SLOT_STATUSES.PARTIAL]: "Falta gente",
  [SLOT_STATUSES.COMPLETE]: "Cubierto",
  [SLOT_STATUSES.BLOCKED]: "Bloqueado",
}

interface SlotCardProps {
  weekId: string
  slot: MesitaSlot
  currentUserId: string
  userProfiles: Map<string, UserProfile>
  isPending: boolean
  isCoordinator: boolean
  onJoin: () => void
  onLeave: () => void
}

export function SlotCard({
  weekId,
  slot,
  currentUserId,
  userProfiles,
  isPending,
  isCoordinator,
  onJoin,
  onLeave,
}: SlotCardProps) {
  const status = getSlotStatus(slot)
  const hasJoined = slot.assignedUsers.includes(currentUserId)
  const canJoin = status !== SLOT_STATUSES.BLOCKED && !hasJoined && status !== SLOT_STATUSES.COMPLETE

  const badgeVariant =
    status === SLOT_STATUSES.COMPLETE
      ? "success"
      : status === SLOT_STATUSES.PARTIAL
        ? "warning"
        : status === SLOT_STATUSES.BLOCKED
          ? "destructive"
          : "outline"

  return (
    <div className="flex flex-col gap-2 rounded-xl border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">
          {String(slot.startHour).padStart(2, "0")}:00 -{" "}
          {String(slot.endHour).padStart(2, "0")}:00
        </span>
        <div className="flex items-center gap-1">
          <Badge variant={badgeVariant}>{STATUS_LABELS[status]}</Badge>
          {isCoordinator && <SlotEditDialog weekId={weekId} slot={slot} />}
        </div>
      </div>

      {slot.blocked ? (
        <p className="text-muted-foreground text-xs">
          {slot.notes ?? "No se puede cubrir mesita en este horario."}
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-1.5">
          {slot.assignedUsers.length === 0 && (
            <span className="text-muted-foreground text-xs italic">
              Nadie anotado todavía
            </span>
          )}

          {slot.assignedUsers.map((uid) => {
            const isSelf = uid === currentUserId
            const label = userProfiles.get(uid)?.displayName ?? "..."

            return (
              <Button
                key={uid}
                type="button"
                variant={isSelf ? "secondary" : "outline"}
                size="sm"
                disabled={!isSelf || isPending}
                onClick={isSelf ? onLeave : undefined}
                className="h-7 gap-1 text-xs"
              >
                {label}
                {isSelf && <X className="size-3" />}
              </Button>
            )
          })}

          {canJoin && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={onJoin}
              className="h-7 gap-1 text-xs"
            >
              {isPending ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Plus className="size-3" />
              )}
              Anotarme
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
