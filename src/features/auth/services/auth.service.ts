import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth"

import { auth } from "@/lib/firebase"

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function signUp(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export function signOutUser() {
  return signOut(auth)
}

export function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email)
}

export function subscribeToAuthChanges(
  callback: (user: FirebaseUser | null) => void
) {
  return onAuthStateChanged(auth, callback)
}
