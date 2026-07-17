import { useState } from "react"
import { ListTodo, Plus } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"

import { EmptyState } from "@/components/common/EmptyState"
import { ErrorState } from "@/components/common/ErrorState"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { TaskCard } from "@/features/tasks/components/TaskCard"
import { useTasks } from "@/features/tasks/hooks/useTasks"
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
} from "@/features/tasks/types/task"
import { routes } from "@/routes/routes"
import { USER_ROLES } from "@/types/user"

const ALL = "all"

export function TasksListPage() {
  const { firebaseUser, profile } = useAuth()
  const isCoordinator =
    profile?.role === USER_ROLES.COORDINATOR || profile?.role === USER_ROLES.ADMIN
  const { data: tasks, isLoading, isError } = useTasks()
  const [searchParams] = useSearchParams()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState(ALL)
  const [priorityFilter, setPriorityFilter] = useState(ALL)
  const [onlyMine, setOnlyMine] = useState(searchParams.get("mine") === "1")

  const filteredTasks = (tasks ?? []).filter((task) => {
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== ALL && task.status !== statusFilter) return false
    if (priorityFilter !== ALL && task.priority !== priorityFilter) return false
    if (onlyMine && firebaseUser && !task.assignedUsers.includes(firebaseUser.uid)) return false
    return true
  })

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-semibold">Tareas</h1>
        {isCoordinator && (
          <Button render={<Link to={routes.taskNew} />} size="sm" className="gap-1.5">
            <Plus className="size-4" />
            Nueva
          </Button>
        )}
      </div>

      <Input
        placeholder="Buscar por título..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? ALL)}>
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos los estados</SelectItem>
            {Object.values(TASK_STATUSES).map((status) => (
              <SelectItem key={status} value={status}>
                {TASK_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value ?? ALL)}>
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas las prioridades</SelectItem>
            {Object.values(TASK_PRIORITIES).map((priority) => (
              <SelectItem key={priority} value={priority}>
                {TASK_PRIORITY_LABELS[priority]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <label className="flex items-center gap-2 text-sm">
          <Switch checked={onlyMine} onCheckedChange={setOnlyMine} />
          Asignadas a mí
        </label>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {!isLoading && isError && <ErrorState />}

      {!isLoading && !isError && filteredTasks.length === 0 && (
        <EmptyState icon={ListTodo} title="No hay tareas que coincidan" />
      )}

      {!isLoading && !isError && filteredTasks.length > 0 && (
        <div className="flex flex-col gap-2">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}
