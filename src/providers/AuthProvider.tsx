import { useEffect, useState, type ReactNode } from "react"
import type { User as FirebaseUser } from "firebase/auth"

import { subscribeToAuthChanges } from "@/features/auth/services/auth.service"
import {
  getUserProfile,
  updateLastLogin,
} from "@/features/auth/services/user.service"
import { AuthContext } from "@/providers/AuthContext"
import type { UserProfile } from "@/types/user"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setFirebaseUser(user)

      if (user) {
        const userProfile = await getUserProfile(user.uid)
        setProfile(userProfile)
        void updateLastLogin(user.uid)
      } else {
        setProfile(null)
      }

      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ firebaseUser, profile, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
