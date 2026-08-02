import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore"

import { COLLECTIONS } from "@/lib/collections"
import { db } from "@/lib/firebase"
import { USER_ROLES, USER_STATUSES, type UserProfile } from "@/types/user"

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

// Suscripción en tiempo real al perfil propio. Se usa en vez de un fetch
// único porque, justo después de registrarse, el documento puede tardar un
// instante en existir; con onSnapshot el perfil aparece solo cuando el
// create() de createOwnProfile termina, sin condición de carrera. También
// refleja al instante cuando un admin aprueba la cuenta o cambia el rol.
export function subscribeToUserProfile(
  uid: string,
  callback: (profile: UserProfile | null) => void,
  onError: (error: Error) => void
) {
  const ref = doc(db, COLLECTIONS.USERS, uid)
  return onSnapshot(
    ref,
    (snapshot) => {
      callback(snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as UserProfile) : null)
    },
    onError
  )
}

interface CreateOwnProfileInput {
  firstName: string
  lastName: string
  email: string
}

// Autoregistro: crea el propio perfil con role/status fijos en el cliente
// (member/pending). Un admin lo aprueba y asigna el rol final después.
export async function createOwnProfile(
  uid: string,
  input: CreateOwnProfileInput
): Promise<void> {
  const ref = doc(db, COLLECTIONS.USERS, uid)
  await setDoc(ref, {
    firstName: input.firstName,
    lastName: input.lastName,
    displayName: `${input.firstName} ${input.lastName}`.trim(),
    email: input.email,
    photoURL: null,
    role: USER_ROLES.MEMBER,
    status: USER_STATUSES.PENDING,
    phone: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLogin: null,
  })
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
