import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { ErrorState } from "@/components/common/ErrorState"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useAdminStats } from "@/features/admin/hooks/useAdminStats"
import { useAdminUsers } from "@/features/admin/hooks/useAdminUsers"
import { useSettings } from "@/features/admin/hooks/useSettings"
import { CreateUserDialog } from "@/features/admin/components/CreateUserDialog"
import { UserRow } from "@/features/admin/components/UserRow"
import { updateSettings } from "@/features/admin/services/settings.service"
import type { AppSettings } from "@/features/admin/types/settings"
import { USER_STATUSES } from "@/types/user"

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-1 p-3 text-center">
        <span className="text-muted-foreground text-xs font-medium">{label}</span>
        <span className="text-xl font-bold">{value}</span>
      </CardContent>
    </Card>
  )
}

function SettingsForm({ settings }: { settings: AppSettings }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<
    Omit<AppSettings, "updatedAt">
  >({
    defaultValues: {
      organizationName: settings.organizationName,
      minUsersPerSlot: settings.minUsersPerSlot,
      reminderHour: settings.reminderHour,
      senderEmail: settings.senderEmail,
    },
  })

  async function onSubmit(values: Omit<AppSettings, "updatedAt">) {
    try {
      await updateSettings({
        ...values,
        minUsersPerSlot: Number(values.minUsersPerSlot),
      })
      toast.success("Configuración guardada.")
    } catch {
      toast.error("No se pudo guardar la configuración.")
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="organizationName">Nombre de la agrupación</Label>
        <Input id="organizationName" {...register("organizationName")} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="minUsersPerSlot">Cantidad mínima ideal por horario de Mesita</Label>
        <Input id="minUsersPerSlot" type="number" min={1} {...register("minUsersPerSlot")} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="reminderHour">Hora de recordatorios</Label>
        <Input id="reminderHour" type="time" {...register("reminderHour")} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="senderEmail">Correo de envío</Label>
        <Input id="senderEmail" type="email" {...register("senderEmail")} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-start">
        Guardar configuración
      </Button>
    </form>
  )
}

export function AdminPage() {
  const { firebaseUser } = useAuth()
  const { data: stats, isLoading: isStatsLoading } = useAdminStats()
  const { data: users, isLoading: isUsersLoading, isError: isUsersError, refetch } =
    useAdminUsers()
  const { data: settings, isLoading: isSettingsLoading } = useSettings()
  const [search, setSearch] = useState("")

  const filteredUsers = (users ?? [])
    .filter((user) => (user.displayName ?? "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aPending = a.status === USER_STATUSES.PENDING
      const bPending = b.status === USER_STATUSES.PENDING
      if (aPending === bPending) return 0
      return aPending ? -1 : 1
    })

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-xl font-semibold">Administración</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Estadísticas</h2>
        {isStatsLoading && (
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}
        {stats && (
          <div className="grid grid-cols-3 gap-3">
            <StatTile label="Integrantes activos" value={stats.activeUsers} />
            <StatTile label="Pendientes de aprobación" value={stats.pendingUsers} />
            <StatTile label="Integrantes totales" value={stats.totalUsers} />
            <StatTile label="Tareas pendientes" value={stats.pendingTasks} />
            <StatTile label="Tareas totales" value={stats.totalTasks} />
            <StatTile label="Actividades próximas" value={stats.upcomingEvents} />
            <StatTile label="Reuniones registradas" value={stats.totalMeetings} />
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Integrantes</h2>
          <CreateUserDialog onCreated={() => refetch()} />
        </div>
        <Input
          placeholder="Buscar integrante..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        {isUsersLoading && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {!isUsersLoading && isUsersError && <ErrorState />}

        {!isUsersLoading && !isUsersError && (
          <div className="flex flex-col gap-2">
            {filteredUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                currentUserId={firebaseUser?.uid ?? ""}
                onChanged={() => refetch()}
              />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Configuración general</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Parámetros</CardTitle>
          </CardHeader>
          <CardContent>
            {isSettingsLoading && <Skeleton className="h-40 w-full" />}
            {settings && <SettingsForm settings={settings} />}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
