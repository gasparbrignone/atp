import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"

import { COLLECTIONS } from "@/lib/collections"
import { db } from "@/lib/firebase"
import { SETTINGS_DOC_ID, type AppSettings } from "@/features/admin/types/settings"

const DEFAULT_SETTINGS: AppSettings = {
  organizationName: "ATP",
  minUsersPerSlot: 2,
  reminderHour: "09:00",
  senderEmail: "",
  updatedAt: null,
}

function settingsRef() {
  return doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID)
}

export async function getSettings(): Promise<AppSettings> {
  const snapshot = await getDoc(settingsRef())

  if (!snapshot.exists()) {
    return DEFAULT_SETTINGS
  }

  return { ...DEFAULT_SETTINGS, ...snapshot.data() } as AppSettings
}

export async function updateSettings(
  input: Omit<AppSettings, "updatedAt">
): Promise<void> {
  await setDoc(settingsRef(), {
    ...input,
    updatedAt: serverTimestamp(),
  })
}
