import { Loader2 } from "lucide-react"

export function LoadingState() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <Loader2 className="text-muted-foreground size-6 animate-spin" />
    </div>
  )
}
