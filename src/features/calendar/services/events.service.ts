import {
  addDoc,
  collection,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  getDocs,
} from "firebase/firestore"

import { COLLECTIONS } from "@/lib/collections"
import { db } from "@/lib/firebase"
import { EVENT_TYPES, type CalendarEvent, type EventType } from "@/features/calendar/types/event"

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

export interface CreateEventInput {
  title: string
  description: string
  location: string
  startDate: Date
  endDate: Date
  type?: EventType
  createdBy: string
}

export async function createEvent(input: CreateEventInput): Promise<string> {
  const eventsRef = collection(db, COLLECTIONS.EVENTS)

  const docRef = await addDoc(eventsRef, {
    title: input.title,
    description: input.description,
    location: input.location,
    startDate: Timestamp.fromDate(input.startDate),
    endDate: Timestamp.fromDate(input.endDate),
    type: input.type ?? EVENT_TYPES.OTHER,
    responsibleUsers: [input.createdBy],
    participants: [],
    status: "confirmed",
    createdBy: input.createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return docRef.id
}
