import { CalendarClock, Home, LayoutGrid } from "lucide-react"
import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"
import { routes } from "@/routes/routes"

const navItems = [
  { to: routes.dashboard, label: "Inicio", icon: Home, end: true },
  { to: routes.mesita, label: "Mesita", icon: LayoutGrid, end: true },
  { to: routes.meetings, label: "Reuniones", icon: CalendarClock, end: false },
]

export function BottomNavigation() {
  return (
    <nav className="bg-background sticky bottom-0 z-10 flex h-14 items-center border-t md:hidden">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "text-muted-foreground flex flex-1 flex-col items-center justify-center gap-0.5 text-xs",
              isActive && "text-foreground"
            )
          }
        >
          <Icon className="size-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
