import { collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore"

import { COLLECTIONS } from "@/lib/collections"
import { db } from "@/lib/firebase"
import { getAllEvents } from "@/features/calendar/services/events.service"
import { getMeetings } from "@/features/meetings/services/meetings.service"
import { getAllTasks } from "@/features/tasks/services/tasks.service"
import { TASK_STATUSES } from "@/features/tasks/types/task"
import { USER_STATUSES, type UserProfile, type UserRole, type UserStatus } from "@/types/user"

export async function getAllUsers(): Promise<UserProfile[]> {
  const usersRef = collection(db, COLLECTIONS.USERS)
  const q = query(usersRef, orderBy("displayName", "asc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(
    (docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as UserProfile
  )
}

export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    role,
    updatedAt: serverTimestamp(),
  })
}

export async function updateUserStatus(uid: string, status: UserStatus): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    status,
    updatedAt: serverTimestamp(),
  })
}

export interface AdminStats {
  activeUsers: number
  pendingUsers: number
  totalUsers: number
  pendingTasks: number
  totalTasks: number
  upcomingEvents: number
  totalMeetings: number
}

export async function getAdminStats(): Promise<AdminStats> {
  const [users, tasks, events, meetings] = await Promise.all([
    getAllUsers(),
    getAllTasks(),
    getAllEvents(),
    getMeetings(),
  ])

  const now = Date.now()

  return {
    activeUsers: users.filter((user) => user.status === USER_STATUSES.ACTIVE).length,
    pendingUsers: users.filter((user) => user.status === USER_STATUSES.PENDING).length,
    totalUsers: users.length,
    pendingTasks: tasks.filter(
      (task) =>
        task.status === TASK_STATUSES.PENDING || task.status === TASK_STATUSES.IN_PROGRESS
    ).length,
    totalTasks: tasks.length,
    upcomingEvents: events.filter((event) => event.startDate.toMillis() >= now).length,
    totalMeetings: meetings.length,
  }
}
