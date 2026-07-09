import { collection, query, where, getDocs } from "firebase/firestore"

import { COLLECTIONS } from "@/lib/collections"
import { db } from "@/lib/firebase"
import { TASK_STATUSES, type Task } from "@/features/tasks/types/task"

// El filtro por estado y el orden por dueDate se resuelven en el cliente
// para evitar depender de índices compuestos de Firestore que aún no existen.
export async function getPendingTasksForUser(uid: string): Promise<Task[]> {
  const tasksRef = collection(db, COLLECTIONS.TASKS)
  const q = query(tasksRef, where("assignedUsers", "array-contains", uid))

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
