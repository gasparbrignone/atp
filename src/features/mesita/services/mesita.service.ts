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

export interface SlotCoordinatorUpdate {
  capacity?: number
  blocked?: boolean
  notes?: string | null
}

// Acción de coordinador: bloquea/desbloquea el horario y/o cambia su
// capacidad. Solo permitido por firestore.rules a admin/coordinator.
// Usa una transacción para preservar assignedUsers y los campos no
// especificados en changes, en vez de pisarlos, tanto si el slot ya
// existía (gente anotada) como si se crea por primera vez.
export async function updateSlotByCoordinator(
  weekId: string,
  day: MesitaDay,
  startHour: number,
  endHour: number,
  changes: SlotCoordinatorUpdate
): Promise<void> {
  const ref = slotRef(weekId, day, startHour)

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref)
    const existing = snapshot.exists() ? (snapshot.data() as MesitaSlot) : null

    transaction.set(ref, {
      day,
      startHour,
      endHour,
      assignedUsers: existing?.assignedUsers ?? [],
      capacity: changes.capacity ?? existing?.capacity ?? DEFAULT_SLOT_CAPACITY,
      blocked: changes.blocked ?? existing?.blocked ?? false,
      notes: changes.notes !== undefined ? changes.notes : (existing?.notes ?? null),
    })
  })
}
