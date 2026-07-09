import { doc, getDoc } from "firebase/firestore"

import { COLLECTIONS } from "@/lib/collections"
import { db } from "@/lib/firebase"
import type { MesitaWeek } from "@/features/mesita/types/mesitaWeek"

export async function getMesitaWeek(weekId: string): Promise<MesitaWeek | null> {
  const ref = doc(db, COLLECTIONS.MESITA_WEEKS, weekId)
  const snapshot = await getDoc(ref)

  if (!snapshot.exists()) {
    return null
  }

  return { id: snapshot.id, ...snapshot.data() } as MesitaWeek
}
