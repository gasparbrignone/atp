import { useState } from "react"
import { Send } from "lucide-react"
import { toast } from "sonner"

import { ErrorState } from "@/components/common/ErrorState"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useUserProfiles } from "@/features/auth/hooks/useUserProfiles"
import { addTaskComment } from "@/features/tasks/services/tasks.service"
import { useTaskComments } from "@/features/tasks/hooks/useTaskComments"

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
})

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function TaskComments({ taskId }: { taskId: string }) {
  const { firebaseUser } = useAuth()
  const { comments, isLoading, isError } = useTaskComments(taskId)
  const authorIds = comments.map((comment) => comment.authorId)
  const { data: authorProfiles } = useUserProfiles(authorIds)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  async function handleSend() {
    if (!firebaseUser || !message.trim()) return

    setIsSending(true)
    try {
      await addTaskComment(taskId, firebaseUser.uid, message.trim())
      setMessage("")
    } catch {
      toast.error("No se pudo enviar el comentario.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-2/3" />
        </div>
      )}

      {!isLoading && isError && <ErrorState />}

      {!isLoading && !isError && comments.length === 0 && (
        <p className="text-muted-foreground text-sm">Todavía no hay comentarios.</p>
      )}

      {!isLoading && !isError && comments.length > 0 && (
        <ul className="flex flex-col gap-3">
          {comments.map((comment) => {
            const authorName = authorProfiles?.get(comment.authorId)?.displayName ?? "..."
            return (
              <li key={comment.id} className="flex items-start gap-2">
                <Avatar className="size-7">
                  <AvatarFallback className="text-xs">
                    {getInitials(authorName) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{authorName}</span>
                    <span className="text-muted-foreground text-xs">
                      {dateFormatter.format(comment.createdAt.toDate())}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{comment.message}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <div className="flex items-end gap-2">
        <Textarea
          placeholder="Escribí un comentario..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-16"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Enviar comentario"
          disabled={isSending || !message.trim()}
          onClick={handleSend}
        >
          <Send />
        </Button>
      </div>
    </div>
  )
}
