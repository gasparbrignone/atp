import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  type User as FirebaseUser,
} from "firebase/auth"
import { doc, serverTimestamp, updateDoc } from "firebase/firestore"

import { COLLECTIONS } from "@/lib/collections"
import { db } from "@/lib/firebase"
import type { ProfileFormValues } from "@/features/profile/validations/profile.schema"

export async function updateOwnProfile(
  uid: string,
  values: ProfileFormValues
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    firstName: values.firstName,
    lastName: values.lastName,
    displayName: `${values.firstName} ${values.lastName}`.trim(),
    phone: values.phone || null,
    updatedAt: serverTimestamp(),
  })
}

export async function changeOwnPassword(
  user: FirebaseUser,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  if (!user.email) {
    throw new Error("no-email")
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)
  await updatePassword(user, newPassword)
}
