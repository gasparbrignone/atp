import { lazy, Suspense } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { LoadingState } from "@/components/common/LoadingState"
import { Toaster } from "@/components/ui/sonner"
import { AppShell } from "@/components/layout/AppShell"
import { AuthProvider } from "@/providers/AuthProvider"
import { AdminRoute } from "@/routes/AdminRoute"
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
const EventsListPage = lazy(() =>
  import("@/features/calendar/pages/EventsListPage").then((m) => ({
    default: m.EventsListPage,
  }))
)
const EventFormPage = lazy(() =>
  import("@/features/calendar/pages/EventFormPage").then((m) => ({
    default: m.EventFormPage,
  }))
)
const EventDetailPage = lazy(() =>
  import("@/features/calendar/pages/EventDetailPage").then((m) => ({
    default: m.EventDetailPage,
  }))
)
const TasksListPage = lazy(() =>
  import("@/features/tasks/pages/TasksListPage").then((m) => ({
    default: m.TasksListPage,
  }))
)
const TaskFormPage = lazy(() =>
  import("@/features/tasks/pages/TaskFormPage").then((m) => ({
    default: m.TaskFormPage,
  }))
)
const TaskDetailPage = lazy(() =>
  import("@/features/tasks/pages/TaskDetailPage").then((m) => ({
    default: m.TaskDetailPage,
  }))
)
const NotificationsListPage = lazy(() =>
  import("@/features/notifications/pages/NotificationsListPage").then((m) => ({
    default: m.NotificationsListPage,
  }))
)
const AdminPage = lazy(() =>
  import("@/features/admin/pages/AdminPage").then((m) => ({ default: m.AdminPage }))
)
const ProfilePage = lazy(() =>
  import("@/features/profile/pages/ProfilePage").then((m) => ({ default: m.ProfilePage }))
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
                  <Route path={routes.calendar} element={<EventsListPage />} />
                  <Route path={routes.eventNew} element={<EventFormPage />} />
                  <Route path={routePatterns.eventDetail} element={<EventDetailPage />} />
                  <Route path={routePatterns.eventEdit} element={<EventFormPage />} />
                  <Route path={routes.tasks} element={<TasksListPage />} />
                  <Route path={routes.taskNew} element={<TaskFormPage />} />
                  <Route path={routePatterns.taskDetail} element={<TaskDetailPage />} />
                  <Route path={routePatterns.taskEdit} element={<TaskFormPage />} />
                  <Route path={routes.notifications} element={<NotificationsListPage />} />
                  <Route path={routes.profile} element={<ProfilePage />} />

                  <Route element={<AdminRoute />}>
                    <Route path={routes.admin} element={<AdminPage />} />
                  </Route>
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
