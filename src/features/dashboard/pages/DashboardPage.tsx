import { CalendarClock, LayoutGrid } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { UpcomingEventsCard } from "@/features/calendar/components/UpcomingEventsCard"
import { MesitaCoverageCard } from "@/features/mesita/components/MesitaCoverageCard"
import { RecentNotificationsCard } from "@/features/notifications/components/RecentNotificationsCard"
import { UpcomingTasksCard } from "@/features/tasks/components/UpcomingTasksCard"
import { routes } from "@/routes/routes"
import { USER_ROLES } from "@/types/user"

export function DashboardPage() {
  const { profile, firebaseUser } = useAuth()
  const firstName = profile?.firstName ?? firebaseUser?.email ?? ""
  const isCoordinator =
    profile?.role === USER_ROLES.COORDINATOR || profile?.role === USER_ROLES.ADMIN

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-xl font-semibold">Hola, {firstName}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Bienvenido al Portal ATP.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        <Button render={<Link to={routes.mesita} />} variant="outline" size="sm" className="gap-1.5">
          <LayoutGrid className="size-4" />
          Anotarme en Mesita
        </Button>

        {isCoordinator && (
          <Button
            render={<Link to={routes.meetingNew} />}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <CalendarClock className="size-4" />
            Nueva reunión
          </Button>
        )}
      </div>

      <MesitaCoverageCard />
      <UpcomingTasksCard />
      <UpcomingEventsCard />
      <RecentNotificationsCard />
    </div>
  )
}
