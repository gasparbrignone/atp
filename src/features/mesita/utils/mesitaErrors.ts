export function getMesitaErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message === "slot-full") {
      return "Ese horario ya está completo."
    }
    if (error.message === "slot-blocked") {
      return "Ese horario está bloqueado por una actividad de ATP."
    }
  }

  return "No se pudo actualizar el horario. Intentá nuevamente."
}
