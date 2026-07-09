import {
  arrayRemove,
  collection,
  doc,
  onSnapshot,
  runTransaction,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore"

import { COLLECTIONS } from "@/lib/collections"
import { db } from "@/lib/firebase"
import {
  DEFAULT_SLOT_CAPACITY,
  getSlotId,
  type MesitaDay,
  type MesitaSlot,
} from "@/features/mesita/types/mesitaWeek"

function slotsCollection(weekId: string) {
  return collection(db, COLLECTIONS.MESITA_WEEKS, weekId, "slots")
}

function slotRef(weekId: string, day: MesitaDay, startHour: number) {
  return doc(slotsCollection(weekId), getSlotId(day, startHour))
}

export function subscribeToWeekSlots(
  weekId: string,
  onChange: (slots: MesitaSlot[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    slotsCollection(weekId),
    (snapshot) => {
      const slots = snapshot.docs.map(
        (docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as MesitaSlot
      )
      onChange(slots)
    },
    onError
  )
}

export async function joinSlot(
  weekId: string,
  day: MesitaDay,
  startHour: number,
  endHour: number,
  uid: string
): Promise<void> {
  const ref = slotRef(weekId, day, startHour)

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref)

    if (!snapshot.exists()) {
      transaction.set(ref, {
        day,
        startHour,
        endHour,
        assignedUsers: [uid],
        capacity: DEFAULT_SLOT_CAPACITY,
        blocked: false,
        notes: null,
      })
      return
    }

    const slot = snapshot.data() as MesitaSlot

    if (slot.blocked) {
      throw new Error("slot-blocked")
    }

    if (slot.assignedUsers.includes(uid)) {
      return
    }

    if (slot.assignedUsers.length >= slot.capacity) {
      throw new Error("slot-full")
    }

    transaction.update(ref, {
      assignedUsers: [...slot.assignedUsers, uid],
    })
  })
}

export async function leaveSlot(
  weekId: string,
  day: MesitaDay,
  startHour: number,
  uid: string
): Promise<void> {
  const ref = slotRef(weekId, day, startHour)

  try {
    await updateDoc(ref, { assignedUsers: arrayRemove(uid) })
  } catch {
    // El slot ya no existe o no tenía al usuario asignado: no hay nada que hacer.
  }
}
