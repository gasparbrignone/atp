import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Toaster } from "@/components/ui/sonner"
import { LoginPage } from "@/features/auth/pages/LoginPage"
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage"
import { MesitaPage } from "@/features/mesita/pages/MesitaPage"
import { AppShell } from "@/components/layout/AppShell"
import { AuthProvider } from "@/providers/AuthProvider"
import { ProtectedRoute } from "@/routes/ProtectedRoute"
import { routes } from "@/routes/routes"

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path={routes.login} element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path={routes.dashboard} element={<DashboardPage />} />
                <Route path={routes.mesita} element={<MesitaPage />} />
              </Route>
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
