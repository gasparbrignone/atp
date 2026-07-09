import { FirebaseError } from "firebase/app"

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Correo electrónico o contraseña incorrectos."
      case "auth/user-disabled":
        return "Esta cuenta se encuentra deshabilitada."
      case "auth/too-many-requests":
        return "Demasiados intentos. Probá nuevamente en unos minutos."
      case "auth/network-request-failed":
        return "Problema de conexión. Revisá tu internet e intentá de nuevo."
      default:
        return "No se pudo iniciar sesión. Intentá nuevamente."
    }
  }

  return "No se pudo iniciar sesión. Intentá nuevamente."
}
