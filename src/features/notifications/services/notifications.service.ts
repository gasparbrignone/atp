import { collection, query, where, getDocs } from "firebase/firestore"

import { COLLECTIONS } from "@/lib/collections"
import { db } from "@/lib/firebase"
import type { Notification } from "@/features/notifications/types/notification"

// El orden por fecha se resuelve en el cliente para evitar depender de un
// índice compuesto de Firestore (userId + createdAt) que aún no existe.
export async function getRecentNotifications(
  uid: string,
  maxResults = 5
): Promise<Notification[]> {
  const notificationsRef = collection(db, COLLECTIONS.NOTIFICATIONS)
  const q = query(notificationsRef, where("userId", "==", uid))

  const snapshot = await getDocs(q)

  const notifications = snapshot.docs.map(
    (docSnapshot) =>
      ({ id: docSnapshot.id, ...docSnapshot.data() }) as Notification
  )

  return notifications
    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
    .slice(0, maxResults)
}
