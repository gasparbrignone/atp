import { lazy, Suspense } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { LoadingState } from "@/components/common/LoadingState"
import { Toaster } from "@/components/ui/sonner"
import { AppShell } from "@/components/layout/AppShell"
import { AuthProvider } from "@/providers/AuthProvider"
import { ProtectedRoute } from "@/routes/ProtectedRoute"
import { routePatterns, routes } from "@/routes/routes"

const LoginPage = lazy(() =>
  import("@/features/auth/pages/LoginPage").then((m) => ({ default: m.LoginPage }))
)
const DashboardPage = lazy(() =>
  import("@/features/dashboard/pages/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  }))
)
const MesitaPage = lazy(() =>
  import("@/features/mesita/pages/MesitaPage").then((m) => ({ default: m.MesitaPage }))
)
const MeetingsListPage = lazy(() =>
  import("@/features/meetings/pages/MeetingsListPage").then((m) => ({
    default: m.MeetingsListPage,
  }))
)
const MeetingFormPage = lazy(() =>
  import("@/features/meetings/pages/MeetingFormPage").then((m) => ({
    default: m.MeetingFormPage,
  }))
)
const MeetingDetailPage = lazy(() =>
  import("@/features/meetings/pages/MeetingDetailPage").then((m) => ({
    default: m.MeetingDetailPage,
  }))
)

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<LoadingState />}>
            <Routes>
              <Route path={routes.login} element={<LoginPage />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<AppShell />}>
                  <Route path={routes.dashboard} element={<DashboardPage />} />
                  <Route path={routes.mesita} element={<MesitaPage />} />
                  <Route path={routes.meetings} element={<MeetingsListPage />} />
                  <Route path={routes.meetingNew} element={<MeetingFormPage />} />
                  <Route path={routePatterns.meetingDetail} element={<MeetingDetailPage />} />
                  <Route path={routePatterns.meetingEdit} element={<MeetingFormPage />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
