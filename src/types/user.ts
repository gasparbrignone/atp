import type { Timestamp } from "firebase/firestore"

export const USER_ROLES = {
  ADMIN: "admin",
  COORDINATOR: "coordinator",
  MEMBER: "member",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const USER_STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
} as const

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES]

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  displayName: string
  email: string
  photoURL: string | null
  role: UserRole
  status: UserStatus
  phone: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
  lastLogin: Timestamp | null
}
