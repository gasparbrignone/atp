import { Clock, LogOut, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signOutUser } from "@/features/auth/services/auth.service"
import { USER_STATUSES, type UserStatus } from "@/types/user"

const COPY: Record<UserStatus | "unknown", { title: string; description: string }> = {
  [USER_STATUSES.PENDING]: {
    title: "Tu cuenta está pendiente de aprobación",
    description: "Un administrador la va a revisar y activar en breve.",
  },
  [USER_STATUSES.SUSPENDED]: {
    title: "Tu cuenta fue suspendida",
    description: "Contactá a un administrador de ATP si creés que es un error.",
  },
  [USER_STATUSES.INACTIVE]: {
    title: "Tu cuenta está inactiva",
    description: "Contactá a un administrador de ATP para reactivarla.",
  },
  [USER_STATUSES.ACTIVE]: {
    title: "No encontramos tu perfil",
    description: "Contactá a un administrador de ATP.",
  },
  unknown: {
    title: "No encontramos tu perfil",
    description: "Contactá a un administrador de ATP.",
  },
}

interface PendingApprovalPageProps {
  status: UserStatus | null
}

export function PendingApprovalPage({ status }: PendingApprovalPageProps) {
  const copy = COPY[status ?? "unknown"]
  const Icon = status === USER_STATUSES.PENDING ? Clock : ShieldAlert

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <Icon className="text-muted-foreground mb-2 size-8" />
          <CardTitle>{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="w-full gap-1.5"
            onClick={() => void signOutUser()}
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
