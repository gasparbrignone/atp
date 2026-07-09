import { createContext } from "react"
import type { User as FirebaseUser } from "firebase/auth"

import type { UserProfile } from "@/types/user"

export interface AuthContextValue {
  firebaseUser: FirebaseUser | null
  profile: UserProfile | null
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
