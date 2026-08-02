import { useMemo, useState } from "react"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { ErrorState } from "@/components/common/ErrorState"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useUserProfiles } from "@/features/auth/hooks/useUserProfiles"
import { AddActivityDialog } from "@/features/mesita/components/AddActivityDialog"
import { SlotCard } from "@/features/mesita/components/SlotCard"
import { useWeekSlots } from "@/features/mesita/hooks/useWeekSlots"
import { joinSlot, leaveSlot } from "@/features/mesita/services/mesita.service"
import {
  MESITA_DAYS,
  MESITA_DAY_LABELS,
  getSlotId,
  type MesitaDay,
} from "@/features/mesita/types/mesitaWeek"
import { getMesitaErrorMessage } from "@/features/mesita/utils/mesitaErrors"
import { getCurrentWeekId } from "@/features/mesita/utils/weekId"
import { getEffectiveMesitaDate } from "@/features/mesita/utils/weekCutoff"
import { formatWeekRange, getWeekRange } from "@/features/mesita/utils/weekRange"
import { buildWeekGrid, computeWeekCoverage } from "@/features/mesita/utils/weekGrid"
import { Skeleton } from "@/components/ui/skeleton"
import { USER_ROLES } from "@/types/user"

export function MesitaPage() {
  const { firebaseUser, profile } = useAuth()
  const isCoordinator =
    profile?.role === USER_ROLES.COORDINATOR || profile?.role === USER_ROLES.ADMIN
  const effectiveNow = getEffectiveMesitaDate()
  const weekId = getCurrentWeekId(effectiveNow)
  const { monday, friday } = getWeekRange(effectiveNow)
  const { slots, isLoading, isError } = useWeekSlots(weekId)
  const [activeDay, setActiveDay] = useState<MesitaDay>(1)
  const [pendingSlotId, setPendingSlotId] = useState<string | null>(null)

  const grid = useMemo(() => buildWeekGrid(slots), [slots])
  const { coveragePercentage, idealCount, gapCount, totalSlots } = useMemo(
    () => computeWeekCoverage(slots),
    [slots]
  )

  const allAssignedUids = useMemo(
    () => grid.flatMap((slot) => slot.assignedUsers),
    [grid]
  )
  const { data: userProfiles } = useUserProfiles(allAssignedUids)

  const dayGrid = grid.filter((slot) => slot.day === activeDay)

  async function handleJoin(day: MesitaDay, startHour: number, endHour: number) {
    if (!firebaseUser) return

    const slotId = getSlotId(day, startHour)
    setPendingSlotId(slotId)

    try {
      await joinSlot(weekId, day, startHour, endHour, firebaseUser.uid)
    } catch (error) {
      toast.error(getMesitaErrorMessage(error))
    } finally {
      setPendingSlotId(null)
    }
  }

  async function handleLeave(day: MesitaDay, startHour: number) {
    if (!firebaseUser) return

    const slotId = getSlotId(day, startHour)
    setPendingSlotId(slotId)

    try {
      await leaveSlot(weekId, day, startHour, firebaseUser.uid)
    } catch (error) {
      toast.error(getMesitaErrorMessage(error))
    } finally {
      setPendingSlotId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Mesita ATP</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {formatWeekRange(monday, friday)}
          </p>
        </div>

        {isCoordinator && <AddActivityDialog weekId={weekId} monday={monday} />}
      </div>

      {isError && <ErrorState />}

      {!isError && (
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="flex flex-col items-center gap-1 p-3 text-center">
              <span className="text-muted-foreground text-xs font-medium">
                Cobertura
              </span>
              <span className="text-xl font-bold">{coveragePercentage}%</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center gap-1 p-3 text-center">
              <span className="text-muted-foreground text-xs font-medium">
                Ideales
              </span>
              <span className="text-xl font-bold">
                {idealCount}/{totalSlots}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center gap-1 p-3 text-center">
              <span className="text-muted-foreground text-xs font-medium">
                Baches
              </span>
              <span className="text-xl font-bold">{gapCount}</span>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex gap-1 overflow-x-auto rounded-xl bg-muted p-1">
        {MESITA_DAYS.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setActiveDay(day)}
            className={
              "flex-1 rounded-lg px-2 py-2 text-xs font-semibold whitespace-nowrap transition " +
              (activeDay === day
                ? "bg-background shadow-sm"
                : "text-muted-foreground")
            }
          >
            {MESITA_DAY_LABELS[day]}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {!isLoading && !isError && firebaseUser && (
        <div className="flex flex-col gap-2">
          {dayGrid.map((slot) => (
            <SlotCard
              key={slot.id}
              weekId={weekId}
              slot={slot}
              currentUserId={firebaseUser.uid}
              userProfiles={userProfiles ?? new Map()}
              isPending={pendingSlotId === slot.id}
              isCoordinator={isCoordinator}
              onJoin={() => handleJoin(slot.day, slot.startHour, slot.endHour)}
              onLeave={() => handleLeave(slot.day, slot.startHour)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
