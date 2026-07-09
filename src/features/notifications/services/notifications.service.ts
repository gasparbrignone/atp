import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore"

import { COLLECTIONS } from "@/lib/collections"
import { db } from "@/lib/firebase"
import type {
  Notification,
  NotificationType,
} from "@/features/notifications/types/notification"

function notificationsCollection() {
  return collection(db, COLLECTIONS.NOTIFICATIONS)
}

async function getNotificationsForUser(uid: string): Promise<Notification[]> {
  const q = query(notificationsCollection(), where("userId", "==", uid))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(
    (docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as Notification
  )
}

// El orden por fecha se resuelve en el cliente para evitar depender de un
// índice compuesto de Firestore (userId + createdAt) que aún no existe.
export async function getRecentNotifications(
  uid: string,
  maxResults = 5
): Promise<Notification[]> {
  const notifications = await getNotificationsForUser(uid)

  return notifications
    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
    .slice(0, maxResults)
}

export async function getAllNotificationsForUser(uid: string): Promise<Notification[]> {
  const notifications = await getNotificationsForUser(uid)
  return notifications.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
}

interface NewNotificationInput {
  title: string
  message: string
  type: NotificationType
  relatedId?: string | null
}

// Crea la misma notificación para varios usuarios a la vez (ej: todos los
// responsables de una reunión nueva). Se usa al crear tareas, reuniones y
// actividades; si falla no debe interrumpir la operación principal (el
// llamador debe envolver esto en try/catch y tratarlo como best-effort).
export async function notifyUsers(
  uids: string[],
  input: NewNotificationInput
): Promise<void> {
  const uniqueUids = [...new Set(uids)]
  if (uniqueUids.length === 0) return

  const batch = writeBatch(db)

  uniqueUids.forEach((uid) => {
    const ref = doc(notificationsCollection())
    batch.set(ref, {
      title: input.title,
      message: input.message,
      userId: uid,
      type: input.type,
      relatedId: input.relatedId ?? null,
      read: false,
      createdAt: serverTimestamp(),
      readAt: null,
    })
  })

  await batch.commit()
}

export async function markAsRead(id: string): Promise<void> {
  await updateDoc(doc(notificationsCollection(), id), {
    read: true,
    readAt: serverTimestamp(),
  })
}

export async function markAllAsRead(notifications: Notification[]): Promise<void> {
  const unread = notifications.filter((n) => !n.read)
  if (unread.length === 0) return

  const batch = writeBatch(db)
  unread.forEach((notification) => {
    batch.update(doc(notificationsCollection(), notification.id), {
      read: true,
      readAt: serverTimestamp(),
    })
  })

  await batch.commit()
}
