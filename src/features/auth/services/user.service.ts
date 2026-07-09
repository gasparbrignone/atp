import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"

import { COLLECTIONS } from "@/lib/collections"
import { db } from "@/lib/firebase"
import { USER_STATUSES, type UserProfile } from "@/types/user"

export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  const ref = doc(db, COLLECTIONS.USERS, uid)
  const snapshot = await getDoc(ref)

  if (!snapshot.exists()) {
    return null
  }

  return { id: snapshot.id, ...snapshot.data() } as UserProfile
}

export async function updateLastLogin(uid: string): Promise<void> {
  const ref = doc(db, COLLECTIONS.USERS, uid)
  await updateDoc(ref, { lastLogin: serverTimestamp() })
}

export async function getUserProfiles(
  uids: string[]
): Promise<Map<string, UserProfile>> {
  const uniqueUids = [...new Set(uids)]
  const profiles = await Promise.all(uniqueUids.map(getUserProfile))

  const profilesById = new Map<string, UserProfile>()
  uniqueUids.forEach((uid, index) => {
    const profile = profiles[index]
    if (profile) {
      profilesById.set(uid, profile)
    }
  })

  return profilesById
}

// El filtro por status se resuelve en el cliente para evitar depender de un
// índice compuesto de Firestore (status + displayName) que aún no existe.
export async function getAllActiveUsers(): Promise<UserProfile[]> {
  const usersRef = collection(db, COLLECTIONS.USERS)
  const q = query(usersRef, orderBy("displayName", "asc"))
  const snapshot = await getDocs(q)

  return snapshot.docs
    .map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as UserProfile)
    .filter((user) => user.status === USER_STATUSES.ACTIVE)
}
