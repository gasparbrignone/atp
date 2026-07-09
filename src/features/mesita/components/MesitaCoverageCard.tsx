import { Link } from "react-router-dom"

import { ErrorState } from "@/components/common/ErrorState"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useWeekSlots } from "@/features/mesita/hooks/useWeekSlots"
import { getCurrentWeekId } from "@/features/mesita/utils/weekId"
import { computeWeekCoverage } from "@/features/mesita/utils/weekGrid"
import { routes } from "@/routes/routes"

export function MesitaCoverageCard() {
  const weekId = getCurrentWeekId()
  const { slots, isLoading, isError } = useWeekSlots(weekId)
  const { coveragePercentage, gapCount } = computeWeekCoverage(slots)

  return (
    <Link to={routes.mesita} className="block">
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Cobertura de Mesita</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <Skeleton className="h-8 w-24" />}

          {!isLoading && isError && <ErrorState />}

          {!isLoading && !isError && (
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold">{coveragePercentage}%</p>
              {gapCount > 0 && (
                <p className="text-muted-foreground text-sm">
                  {gapCount} {gapCount === 1 ? "bache" : "baches"} esta semana
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
