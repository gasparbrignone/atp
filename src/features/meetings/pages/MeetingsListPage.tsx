import { useState } from "react"
import { Plus, Users } from "lucide-react"
import { Link } from "react-router-dom"

import { EmptyState } from "@/components/common/EmptyState"
import { ErrorState } from "@/components/common/ErrorState"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { MeetingCard } from "@/features/meetings/components/MeetingCard"
import { useMeetings } from "@/features/meetings/hooks/useMeetings"
import { routes } from "@/routes/routes"
import { USER_ROLES } from "@/types/user"

export function MeetingsListPage() {
  const { profile } = useAuth()
  const isCoordinator =
    profile?.role === USER_ROLES.COORDINATOR || profile?.role === USER_ROLES.ADMIN
  const { data: meetings, isLoading, isError } = useMeetings()
  const [search, setSearch] = useState("")

  const filteredMeetings = (meetings ?? []).filter((meeting) =>
    meeting.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-semibold">Reuniones</h1>
        {isCoordinator && (
          <Button render={<Link to={routes.meetingNew} />} size="sm" className="gap-1.5">
            <Plus className="size-4" />
            Nueva
          </Button>
        )}
      </div>

      <Input
        placeholder="Buscar por título..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {!isLoading && isError && <ErrorState />}

      {!isLoading && !isError && filteredMeetings.length === 0 && (
        <EmptyState icon={Users} title="No hay reuniones registradas" />
      )}

      {!isLoading && !isError && filteredMeetings.length > 0 && (
        <div className="flex flex-col gap-2">
          {filteredMeetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}
    </div>
  )
}
