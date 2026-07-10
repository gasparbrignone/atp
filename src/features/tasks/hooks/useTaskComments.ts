import { useEffect, useState } from "react"

import { subscribeToTaskComments } from "@/features/tasks/services/tasks.service"
import type { TaskComment } from "@/features/tasks/types/task"

export function useTaskComments(taskId: string) {
  const [comments, setComments] = useState<TaskComment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setIsError(false)

    const unsubscribe = subscribeToTaskComments(
      taskId,
      (nextComments) => {
        setComments(nextComments)
        setIsLoading(false)
      },
      () => {
        setIsError(true)
        setIsLoading(false)
      }
    )

    return unsubscribe
  }, [taskId])

  return { comments, isLoading, isError }
}
