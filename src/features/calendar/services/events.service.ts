import {
  collection,
  limit,
  orderBy,
  query,
  Timestamp,
  where,
  getDocs,
} from "firebase/firestore"

import { COLLECTIONS } from "@/lib/collections"
import { db } from "@/lib/firebase"
import type { CalendarEvent } from "@/features/calendar/types/event"

export async function getUpcomingEvents(
  maxResults = 5
): Promise<CalendarEvent[]> {
  const eventsRef = collection(db, COLLECTIONS.EVENTS)
  const q = query(
    eventsRef,
    where("startDate", ">=", Timestamp.now()),
    orderBy("startDate", "asc"),
    limit(maxResults)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(
    (docSnapshot) =>
      ({ id: docSnapshot.id, ...docSnapshot.data() }) as CalendarEvent
  )
}
