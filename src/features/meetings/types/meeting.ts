import type { Timestamp } from "firebase/firestore"

export interface MeetingTopic {
  title: string
  discussion: string
  decision: string
  order: number
}

export interface Meeting {
  id: string
  date: Timestamp
  title: string
  summary: string
  weeklyBalance: string
  attendees: string[]
  topics: MeetingTopic[]
  decisions: string[]
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
  deleted: boolean
  deletedAt: Timestamp | null
  deletedBy: string | null
}
