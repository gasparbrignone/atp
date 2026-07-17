import { Outlet } from "react-router-dom"

import { BottomNavigation } from "@/components/layout/BottomNavigation"
import { Header } from "@/components/layout/Header"

export function AppShell() {
  return (
    <div className="flex min-h-svh flex-col">
      <div className="print:hidden">
        <Header />
      </div>
      <main className="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom)+16px)] md:pb-4">
        <Outlet />
      </main>
      <div className="print:hidden">
        <BottomNavigation />
      </div>
    </div>
  )
}
