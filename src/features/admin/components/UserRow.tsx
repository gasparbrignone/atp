import { useState } from "react"
import { Check, X } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateUserRole, updateUserStatus } from "@/features/admin/services/admin.service"
import { USER_ROLES, USER_STATUSES, type UserProfile } from "@/types/user"

const ROLE_LABELS: Record<string, string> = {
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.COORDINATOR]: "Coordinador",
  [USER_ROLES.MEMBER]: "Integrante",
}

const STATUS_LABELS: Record<string, string> = {
  [USER_STATUSES.PENDING]: "Pendiente",
  [USER_STATUSES.ACTIVE]: "Activo",
  [USER_STATUSES.INACTIVE]: "Inactivo",
  [USER_STATUSES.SUSPENDED]: "Suspendido",
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

interface UserRowProps {
  user: UserProfile
  currentUserId: string
  onChanged: () => void
}

export function UserRow({ user, currentUserId, onChanged }: UserRowProps) {
  const [isSaving, setIsSaving] = useState(false)
  const isSelf = user.id === currentUserId
  const isPending = user.status === USER_STATUSES.PENDING

  async function handleRoleChange(role: string | null) {
    if (!role) return
    setIsSaving(true)
    try {
      await updateUserRole(user.id, role as UserProfile["role"])
      onChanged()
    } catch {
      toast.error("No se pudo actualizar el rol.")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleStatusChange(status: string | null) {
    if (!status) return
    setIsSaving(true)
    try {
      await updateUserStatus(user.id, status as UserProfile["status"])
      onChanged()
    } catch {
      toast.error("No se pudo actualizar el estado.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className={
        "flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between" +
        (isPending ? " border-warning/50 bg-warning/5" : "")
      }
    >
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback>{getInitials(user.displayName ?? "") || "?"}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium">{user.displayName || user.email}</p>
            {isPending && <Badge variant="warning">Pendiente</Badge>}
          </div>
          <p className="text-muted-foreground text-xs">{user.email}</p>
        </div>
      </div>

      {isPending ? (
        <div className="flex items-center gap-2">
          <Select
            items={ROLE_LABELS}
            value={user.role}
            onValueChange={handleRoleChange}
            disabled={isSaving || isSelf}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(USER_ROLES).map((role) => (
                <SelectItem key={role} value={role}>
                  {ROLE_LABELS[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            size="sm"
            className="gap-1.5"
            disabled={isSaving || isSelf}
            onClick={() => handleStatusChange(USER_STATUSES.ACTIVE)}
          >
            <Check className="size-4" />
            Aprobar
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={isSaving || isSelf}
            onClick={() => handleStatusChange(USER_STATUSES.SUSPENDED)}
          >
            <X className="size-4" />
            Rechazar
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Select
            items={ROLE_LABELS}
            value={user.role}
            onValueChange={handleRoleChange}
            disabled={isSaving || isSelf}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(USER_ROLES).map((role) => (
                <SelectItem key={role} value={role}>
                  {ROLE_LABELS[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            items={STATUS_LABELS}
            value={user.status}
            onValueChange={handleStatusChange}
            disabled={isSaving || isSelf}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(USER_STATUSES).map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
