import { ListTodo } from "lucide-react"
import { Link } from "react-router-dom"

import { EmptyState } from "@/components/common/EmptyState"
import { ErrorState } from "@/components/common/ErrorState"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { usePendingTasks } from "@/features/tasks/hooks/usePendingTasks"
import { TASK_PRIORITY_LABELS } from "@/features/tasks/types/task"
import { routes } from "@/routes/routes"

const dueDateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
})

export function UpcomingTasksCard() {
  const { firebaseUser } = useAuth()
  const { data: tasks, isLoading, isError } = usePendingTasks(firebaseUser?.uid)

  return (
    <Link to={routes.tasks} className="block">
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">Tareas pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          )}

          {!isLoading && isError && <ErrorState />}

          {!isLoading && !isError && tasks?.length === 0 && (
            <EmptyState icon={ListTodo} title="No tenés tareas pendientes" />
          )}

          {!isLoading && !isError && tasks && tasks.length > 0 && (
            <ul className="flex flex-col gap-3">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between gap-2">
                  <span className="text-sm">{task.title}</span>
                  <div className="flex items-center gap-2">
                    {task.dueDate && (
                      <span className="text-muted-foreground text-xs">
                        {dueDateFormatter.format(task.dueDate.toDate())}
                      </span>
                    )}
                    <Badge variant="secondary">
                      {TASK_PRIORITY_LABELS[task.priority]}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
