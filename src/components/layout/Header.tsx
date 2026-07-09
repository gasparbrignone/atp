import { Bell, LogOut } from "lucide-react"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { signOutUser } from "@/features/auth/services/auth.service"
import { useNotifications } from "@/features/notifications/hooks/useNotifications"
import { routes } from "@/routes/routes"

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function Header() {
  const { profile, firebaseUser } = useAuth()
  const displayName = profile?.displayName ?? firebaseUser?.email ?? ""
  const { data: notifications } = useNotifications(firebaseUser?.uid)
  const unreadCount = (notifications ?? []).filter((n) => !n.read).length

  return (
    <header className="bg-background sticky top-0 z-10 flex h-14 items-center justify-between border-b px-4">
      <span className="text-base font-semibold">Portal ATP</span>

      <div className="flex items-center gap-3">
        <Button
          render={<Link to={routes.notifications} />}
          variant="ghost"
          size="icon"
          aria-label="Notificaciones"
          className="relative"
        >
          <Bell />
          {unreadCount > 0 && (
            <span className="bg-destructive absolute top-1 right-1 size-2 rounded-full" />
          )}
        </Button>

        <Avatar className="size-8">
          <AvatarFallback>{getInitials(displayName) || "?"}</AvatarFallback>
        </Avatar>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Cerrar sesión"
          onClick={() => void signOutUser()}
        >
          <LogOut />
        </Button>
      </div>
    </header>
  )
}
