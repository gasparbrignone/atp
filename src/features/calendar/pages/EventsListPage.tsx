import { CalendarDays, Plus } from "lucide-react"
import { Link } from "react-router-dom"

import { EmptyState } from "@/components/common/EmptyState"
import { ErrorState } from "@/components/common/ErrorState"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { EventCard } from "@/features/calendar/components/EventCard"
import { useEvents } from "@/features/calendar/hooks/useEvents"
import { routes } from "@/routes/routes"
import { USER_ROLES } from "@/types/user"

export function EventsListPage() {
  const { profile } = useAuth()
  const isCoordinator =
    profile?.role === USER_ROLES.COORDINATOR || profile?.role === USER_ROLES.ADMIN
  const { data: events, isLoading, isError } = useEvents()

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-semibold">Calendario</h1>
        {isCoordinator && (
          <Button render={<Link to={routes.eventNew} />} size="sm" className="gap-1.5">
            <Plus className="size-4" />
            Nueva
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {!isLoading && isError && <ErrorState />}

      {!isLoading && !isError && events?.length === 0 && (
        <EmptyState icon={CalendarDays} title="No hay actividades cargadas" />
      )}

      {!isLoading && !isError && events && events.length > 0 && (
        <div className="flex flex-col gap-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
