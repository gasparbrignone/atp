import { useEffect, useState } from "react"

import { subscribeToWeekSlots } from "@/features/mesita/services/mesita.service"
import type { MesitaSlot } from "@/features/mesita/types/mesitaWeek"

interface UseWeekSlotsResult {
  slots: MesitaSlot[]
  isLoading: boolean
  isError: boolean
}

export function useWeekSlots(weekId: string): UseWeekSlotsResult {
  const [slots, setSlots] = useState<MesitaSlot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setIsError(false)

    const unsubscribe = subscribeToWeekSlots(
      weekId,
      (nextSlots) => {
        setSlots(nextSlots)
        setIsLoading(false)
      },
      () => {
        setIsError(true)
        setIsLoading(false)
      }
    )

    return unsubscribe
  }, [weekId])

  return { slots, isLoading, isError }
}
