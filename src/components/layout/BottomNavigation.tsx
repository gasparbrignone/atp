import { Home } from "lucide-react"
import { NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"
import { routes } from "@/routes/routes"

const navItems = [{ to: routes.dashboard, label: "Inicio", icon: Home }]

export function BottomNavigation() {
  return (
    <nav className="bg-background sticky bottom-0 z-10 flex h-14 items-center border-t md:hidden">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
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
