import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore"

import { COLLECTIONS } from "@/lib/collections"
import { db } from "@/lib/firebase"
import {
  EVENT_STATUSES,
  EVENT_TYPES,
  type CalendarEvent,
  type EventType,
  type RsvpStatus,
} from "@/features/calendar/types/event"

function eventsCollection() {
  return collection(db, COLLECTIONS.EVENTS)
}

export async function getUpcomingEvents(
  maxResults = 5
): Promise<CalendarEvent[]> {
  const q = query(
    eventsCollection(),
    where("startDate", ">=", Timestamp.now()),
    orderBy("startDate", "asc"),
    limit(maxResults)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs
    .map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as CalendarEvent)
    .filter((event) => !event.deleted)
}

// El filtro de "deleted" se resuelve en el cliente para evitar depender de
// un índice compuesto de Firestore (deleted + startDate) que aún no existe.
export async function getAllEvents(): Promise<CalendarEvent[]> {
  const q = query(eventsCollection(), orderBy("startDate", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs
    .map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as CalendarEvent)
    .filter((event) => !event.deleted)
}

export async function getEventById(id: string): Promise<CalendarEvent | null> {
  const snapshot = await getDoc(doc(eventsCollection(), id))

  if (!snapshot.exists()) {
    return null
  }

  return { id: snapshot.id, ...snapshot.data() } as CalendarEvent
}

export interface EventFormInput {
  title: string
  description: string
  location: string
  startDate: Date
  endDate: Date
  type: EventType
  responsibleUsers: string[]
}

export async function createEvent(
  input: EventFormInput,
  createdBy: string
): Promise<string> {
  const docRef = await addDoc(eventsCollection(), {
    title: input.title,
    description: input.description,
    location: input.location,
    startDate: Timestamp.fromDate(input.startDate),
    endDate: Timestamp.fromDate(input.endDate),
    type: input.type ?? EVENT_TYPES.OTHER,
    responsibleUsers: input.responsibleUsers,
    attendance: {},
    status: EVENT_STATUSES.CONFIRMED,
    createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    deleted: false,
    deletedAt: null,
    deletedBy: null,
  })

  return docRef.id
}

export async function updateEvent(
  id: string,
  input: EventFormInput
): Promise<void> {
  await updateDoc(doc(eventsCollection(), id), {
    title: input.title,
    description: input.description,
    location: input.location,
    startDate: Timestamp.fromDate(input.startDate),
    endDate: Timestamp.fromDate(input.endDate),
    type: input.type,
    responsibleUsers: input.responsibleUsers,
    updatedAt: serverTimestamp(),
  })
}

export async function softDeleteEvent(id: string, deletedBy: string): Promise<void> {
  await updateDoc(doc(eventsCollection(), id), {
    deleted: true,
    deletedAt: serverTimestamp(),
    deletedBy,
    updatedAt: serverTimestamp(),
  })
}

export async function setRsvp(
  eventId: string,
  uid: string,
  status: RsvpStatus
): Promise<void> {
  await updateDoc(doc(eventsCollection(), eventId), {
    [`attendance.${uid}`]: status,
    updatedAt: serverTimestamp(),
  })
}
