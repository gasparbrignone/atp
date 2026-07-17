import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  type Task,
} from "@/features/tasks/types/task"
import { routes } from "@/routes/routes"

const dueDateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
})

const PRIORITY_VARIANT: Record<string, "outline" | "info" | "warning" | "destructive"> = {
  [TASK_PRIORITIES.LOW]: "outline",
  [TASK_PRIORITIES.MEDIUM]: "info",
  [TASK_PRIORITIES.HIGH]: "warning",
  [TASK_PRIORITIES.URGENT]: "destructive",
}

export function TaskCard({ task }: { task: Task }) {
  return (
    <Link to={routes.taskDetail(task.id)} className="block">
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">{task.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant={PRIORITY_VARIANT[task.priority]}>
              {TASK_PRIORITY_LABELS[task.priority]}
            </Badge>
            <span className="text-muted-foreground">{TASK_STATUS_LABELS[task.status]}</span>
          </div>
          {task.dueDate && (
            <span className="text-muted-foreground text-xs">
              {dueDateFormatter.format(task.dueDate.toDate())}
            </span>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
