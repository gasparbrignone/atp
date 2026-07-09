import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore"

import { COLLECTIONS } from "@/lib/collections"
import { db } from "@/lib/firebase"
import type { Meeting } from "@/features/meetings/types/meeting"
import type { MeetingFormValues } from "@/features/meetings/validations/meeting.schema"

function meetingsCollection() {
  return collection(db, COLLECTIONS.MEETINGS)
}

function toTopics(values: MeetingFormValues["topics"]) {
  return values.map((topic, index) => ({ ...topic, order: index }))
}

// El filtro de "deleted" se resuelve en el cliente para evitar depender de
// un índice compuesto de Firestore (deleted + date) que aún no existe.
export async function getMeetings(): Promise<Meeting[]> {
  const q = query(meetingsCollection(), orderBy("date", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs
    .map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as Meeting)
    .filter((meeting) => !meeting.deleted)
}

export async function getMeetingById(id: string): Promise<Meeting | null> {
  const snapshot = await getDoc(doc(meetingsCollection(), id))

  if (!snapshot.exists()) {
    return null
  }

  return { id: snapshot.id, ...snapshot.data() } as Meeting
}

export async function createMeeting(
  values: MeetingFormValues,
  createdBy: string
): Promise<string> {
  const docRef = await addDoc(meetingsCollection(), {
    date: Timestamp.fromDate(new Date(values.date)),
    title: values.title,
    summary: values.summary,
    weeklyBalance: values.weeklyBalance,
    attendees: values.attendees,
    topics: toTopics(values.topics),
    decisions: values.decisions,
    createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    deleted: false,
    deletedAt: null,
    deletedBy: null,
  })

  return docRef.id
}

export async function updateMeeting(
  id: string,
  values: MeetingFormValues
): Promise<void> {
  await updateDoc(doc(meetingsCollection(), id), {
    date: Timestamp.fromDate(new Date(values.date)),
    title: values.title,
    summary: values.summary,
    weeklyBalance: values.weeklyBalance,
    attendees: values.attendees,
    topics: toTopics(values.topics),
    decisions: values.decisions,
    updatedAt: serverTimestamp(),
  })
}

export async function softDeleteMeeting(
  id: string,
  deletedBy: string
): Promise<void> {
  await updateDoc(doc(meetingsCollection(), id), {
    deleted: true,
    deletedAt: serverTimestamp(),
    deletedBy,
    updatedAt: serverTimestamp(),
  })
}

export async function duplicateMeeting(
  meeting: Meeting,
  createdBy: string
): Promise<string> {
  const docRef = await addDoc(meetingsCollection(), {
    date: Timestamp.now(),
    title: `${meeting.title} (copia)`,
    summary: meeting.summary,
    weeklyBalance: meeting.weeklyBalance,
    attendees: meeting.attendees,
    topics: meeting.topics,
    decisions: meeting.decisions,
    createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    deleted: false,
    deletedAt: null,
    deletedBy: null,
  })

  return docRef.id
}
