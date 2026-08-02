import { z } from "zod"

import { USER_ROLES } from "@/types/user"

export const createUserSchema = z.object({
  firstName: z.string().min(1, "Ingresá el nombre"),
  lastName: z.string().min(1, "Ingresá el apellido"),
  email: z.string().min(1, "Ingresá el correo electrónico").email("Correo electrónico inválido"),
  role: z.enum([USER_ROLES.ADMIN, USER_ROLES.COORDINATOR, USER_ROLES.MEMBER]),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
