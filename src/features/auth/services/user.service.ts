import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"

import { COLLECTIONS } from "@/lib/collections"
import { db } from "@/lib/firebase"
import type { UserProfile } from "@/types/user"

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
