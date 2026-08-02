import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

const SLOW_THRESHOLD_MS = 8000

// Sin el aviso de "está tardando", una carga que nunca resuelve (conexión
// mala, listener de Firestore que se cuelga) deja este spinner girando para
// siempre, sin ninguna salida para el usuario salvo cerrar la app a la fuerza.
export function LoadingState() {
  const [isSlow, setIsSlow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsSlow(true), SLOW_THRESHOLD_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-3 p-4 text-center">
      <Loader2 className="text-muted-foreground size-6 animate-spin" />
      {isSlow && (
        <>
          <p className="text-muted-foreground text-sm">Esto está tardando más de lo normal.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => window.location.reload()}>
            Recargar
          </Button>
        </>
      )}
    </div>
  )
}
