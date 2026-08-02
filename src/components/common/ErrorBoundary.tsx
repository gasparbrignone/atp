import { Component, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

// Sin esto, un error de render (incluido un chunk de JS que no carga tras un
// deploy nuevo, si el navegador tenía la página vieja cacheada) deja la
// pantalla completamente en blanco y sin ninguna pista para el usuario.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-4 text-center">
          <AlertTriangle className="text-destructive size-8" />
          <p className="text-base font-medium">Ocurrió un problema al cargar la página.</p>
          <p className="text-muted-foreground text-sm">
            Puede deberse a una actualización reciente de la app.
          </p>
          <Button type="button" onClick={this.handleReload}>
            Recargar
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
