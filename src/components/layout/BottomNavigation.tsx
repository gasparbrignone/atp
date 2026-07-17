import { Bell, CalendarDays, LayoutGrid, ListTodo } from "lucide-react"
import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useNotifications } from "@/features/notifications/hooks/useNotifications"
import { routes } from "@/routes/routes"

export function BottomNavigation() {
  const { firebaseUser } = useAuth()
  const { data: notifications } = useNotifications(firebaseUser?.uid)
  const unreadCount = (notifications ?? []).filter((n) => !n.read).length

  const navItems = [
    { to: routes.mesita, label: "Mesita", icon: LayoutGrid, end: true, badge: false },
    { to: routes.calendar, label: "Calendario", icon: CalendarDays, end: false, badge: false },
    { to: routes.myTasks, label: "Mis tareas", icon: ListTodo, end: false, badge: false },
    {
      to: routes.notifications,
      label: "Notificaciones",
      icon: Bell,
      end: false,
      badge: unreadCount > 0,
    },
  ]

  return (
    <nav
      className="bg-card/95 fixed inset-x-0 bottom-0 z-20 border-t shadow-[0_-6px_20px_-6px_rgba(0,0,0,0.12)] backdrop-blur supports-backdrop-filter:bg-card/80 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex h-16 max-w-md items-stretch justify-around gap-1 px-2">
        {navItems.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "relative my-1.5 flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition-colors",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground active:bg-muted"
              )
            }
          >
            <span className="relative">
              <Icon className="size-6" />
              {badge && (
                <span className="bg-destructive absolute -top-0.5 -right-0.5 size-2 rounded-full" />
              )}
            </span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
