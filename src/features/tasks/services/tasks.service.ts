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
  where,
} from "firebase/firestore"

import { COLLECTIONS } from "@/lib/collections"
import { db } from "@/lib/firebase"
import {
  TASK_STATUSES,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "@/features/tasks/types/task"

function tasksCollection() {
  return collection(db, COLLECTIONS.TASKS)
}

// El filtro por estado y el orden por dueDate se resuelven en el cliente
// para evitar depender de índices compuestos de Firestore que aún no existen.
export async function getPendingTasksForUser(uid: string): Promise<Task[]> {
  const q = query(tasksCollection(), where("assignedUsers", "array-contains", uid))

  const snapshot = await getDocs(q)
  const pendingStatuses: string[] = [
    TASK_STATUSES.PENDING,
    TASK_STATUSES.IN_PROGRESS,
  ]

  const tasks = snapshot.docs
    .map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as Task)
    .filter((task) => pendingStatuses.includes(task.status))

  return tasks.sort((a, b) => {
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return a.dueDate.toMillis() - b.dueDate.toMillis()
  })
}

export async function getAllTasks(): Promise<Task[]> {
  const q = query(tasksCollection(), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)

  return snapshot.docs.map(
    (docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }) as Task
  )
}

export async function getTaskById(id: string): Promise<Task | null> {
  const snapshot = await getDoc(doc(tasksCollection(), id))

  if (!snapshot.exists()) {
    return null
  }

  return { id: snapshot.id, ...snapshot.data() } as Task
}

export interface TaskFormInput {
  title: string
  description: string
  notes: string
  priority: TaskPriority
  assignedUsers: string[]
  dueDate: Date | null
}

export async function createTask(
  input: TaskFormInput,
  createdBy: string
): Promise<string> {
  const docRef = await addDoc(tasksCollection(), {
    title: input.title,
    description: input.description,
    notes: input.notes,
    status: TASK_STATUSES.PENDING,
    priority: input.priority,
    assignedUsers: input.assignedUsers,
    dueDate: input.dueDate ? Timestamp.fromDate(input.dueDate) : null,
    completedAt: null,
    createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return docRef.id
}

export async function updateTask(id: string, input: TaskFormInput): Promise<void> {
  await updateDoc(doc(tasksCollection(), id), {
    title: input.title,
    description: input.description,
    notes: input.notes,
    priority: input.priority,
    assignedUsers: input.assignedUsers,
    dueDate: input.dueDate ? Timestamp.fromDate(input.dueDate) : null,
    updatedAt: serverTimestamp(),
  })
}

export async function setTaskStatus(id: string, status: TaskStatus): Promise<void> {
  await updateDoc(doc(tasksCollection(), id), {
    status,
    completedAt: status === TASK_STATUSES.COMPLETED ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  })
}
