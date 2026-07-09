import { AlertTriangle } from "lucide-react"

interface ErrorStateProps {
  message?: string
}

export function ErrorState({
  message = "No se pudo cargar la información. Intentá nuevamente.",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center">
      <AlertTriangle className="text-destructive size-6" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  )
}
