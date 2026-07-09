import { Outlet } from "react-router-dom"

import { BottomNavigation } from "@/components/layout/BottomNavigation"
import { Header } from "@/components/layout/Header"

export function AppShell() {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  )
}
