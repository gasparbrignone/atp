import { LayoutGrid } from "lucide-react"

import { EmptyState } from "@/components/common/EmptyState"
import { ErrorState } from "@/components/common/ErrorState"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrentWeekMesita } from "@/features/mesita/hooks/useCurrentWeekMesita"

export function MesitaCoverageCard() {
  const { data: week, isLoading, isError } = useCurrentWeekMesita()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cobertura de Mesita</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-8 w-24" />}

        {!isLoading && isError && <ErrorState />}

        {!isLoading && !isError && !week && (
          <EmptyState
            icon={LayoutGrid}
            title="Todavía no hay una semana configurada"
          />
        )}

        {!isLoading && !isError && week && (
          <p className="text-2xl font-semibold">{week.coverage}%</p>
        )}
      </CardContent>
    </Card>
  )
}
