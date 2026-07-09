import { useAuth } from "@/features/auth/hooks/useAuth"
import { UpcomingEventsCard } from "@/features/calendar/components/UpcomingEventsCard"
import { MesitaCoverageCard } from "@/features/mesita/components/MesitaCoverageCard"
import { RecentNotificationsCard } from "@/features/notifications/components/RecentNotificationsCard"
import { UpcomingTasksCard } from "@/features/tasks/components/UpcomingTasksCard"

export function DashboardPage() {
  const { profile, firebaseUser } = useAuth()
  const firstName = profile?.firstName ?? firebaseUser?.email ?? ""

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-xl font-semibold">Hola, {firstName}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Bienvenido al Portal ATP.
        </p>
      </div>

      <MesitaCoverageCard />
      <UpcomingTasksCard />
      <UpcomingEventsCard />
      <RecentNotificationsCard />
    </div>
  )
}
