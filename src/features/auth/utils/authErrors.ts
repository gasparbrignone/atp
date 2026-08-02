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

export function getForgotPasswordErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-email":
        return "Correo electrónico inválido."
      case "auth/too-many-requests":
        return "Demasiados intentos. Probá nuevamente en unos minutos."
      case "auth/network-request-failed":
        return "Problema de conexión. Revisá tu internet e intentá de nuevo."
      default:
        return "No se pudo enviar el correo. Intentá nuevamente."
    }
  }

  return "No se pudo enviar el correo. Intentá nuevamente."
}

export function getSignupErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Ya existe una cuenta con ese correo. Iniciá sesión."
      case "auth/invalid-email":
        return "Correo electrónico inválido."
      case "auth/weak-password":
        return "La contraseña es demasiado débil."
      case "auth/network-request-failed":
        return "Problema de conexión. Revisá tu internet e intentá de nuevo."
      default:
        return "No se pudo crear la cuenta. Intentá nuevamente."
    }
  }

  return "No se pudo crear la cuenta. Intentá nuevamente."
}
