import { useQuery } from "@tanstack/react-query"

import { getMesitaWeek } from "@/features/mesita/services/mesita.service"
import { getCurrentWeekId } from "@/features/mesita/utils/weekId"

export function useCurrentWeekMesita() {
  return useQuery({
    queryKey: ["mesita", "currentWeek"],
    queryFn: () => getMesitaWeek(getCurrentWeekId()),
  })
}
