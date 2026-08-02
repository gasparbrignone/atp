import { useEffect, useState, type ReactNode } from "react"
import type { User as FirebaseUser } from "firebase/auth"

import { subscribeToAuthChanges } from "@/features/auth/services/auth.service"
import {
  subscribeToUserProfile,
  updateLastLogin,
} from "@/features/auth/services/user.service"
import { AuthContext } from "@/providers/AuthContext"
import type { UserProfile } from "@/types/user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined

    const unsubscribeAuth = subscribeToAuthChanges((user) => {
      unsubscribeProfile?.()
      setFirebaseUser(user)

      if (user) {
        setIsLoading(true)
        // Best-effort: falla silenciosamente para una cuenta recién
        // registrada, cuyo documento de perfil todavía no existe.
        updateLastLogin(user.uid).catch(() => {})
        unsubscribeProfile = subscribeToUserProfile(
          user.uid,
          (userProfile) => {
            setProfile(userProfile)
            setIsLoading(false)
          },
          () => {
            // Si el listener falla (token vencido, red inestable) no debe
            // dejar el spinner de carga girando para siempre.
            setProfile(null)
            setIsLoading(false)
          }
        )
      } else {
        setProfile(null)
        setIsLoading(false)
      }
    })

    return () => {
      unsubscribeProfile?.()
      unsubscribeAuth()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ firebaseUser, profile, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
