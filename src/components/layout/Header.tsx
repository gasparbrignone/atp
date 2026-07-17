import { Bell, LogOut, Shield, User } from "lucide-react"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { signOutUser } from "@/features/auth/services/auth.service"
import { useNotifications } from "@/features/notifications/hooks/useNotifications"
import { routes } from "@/routes/routes"
import { USER_ROLES } from "@/types/user"

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
  const isAdmin = profile?.role === USER_ROLES.ADMIN
  const { data: notifications } = useNotifications(firebaseUser?.uid)
  const unreadCount = (notifications ?? []).filter((n) => !n.read).length

  return (
    <header
      className="bg-background sticky top-0 z-10 flex min-h-14 items-center justify-between border-b px-4"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <Link to={routes.dashboard} className="text-base font-semibold">
        Portal ATP
      </Link>

      <div className="flex items-center gap-3">
        <Button
          render={<Link to={routes.notifications} />}
          variant="ghost"
          size="icon"
          aria-label="Notificaciones"
          className="relative hidden md:inline-flex"
        >
          <Bell />
          {unreadCount > 0 && (
            <span className="bg-destructive absolute top-1 right-1 size-2 rounded-full" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button type="button" aria-label="Menú de usuario">
                <Avatar className="size-8">
                  <AvatarFallback>{getInitials(displayName) || "?"}</AvatarFallback>
                </Avatar>
              </button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link to={routes.profile} />}>
              <User />
              Mi perfil
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem render={<Link to={routes.admin} />}>
                <Shield />
                Administración
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => void signOutUser()}>
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
