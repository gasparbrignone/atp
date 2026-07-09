import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "Ingresá tu correo electrónico").email("Correo electrónico inválido"),
  password: z.string().min(1, "Ingresá tu contraseña"),
})

export type LoginFormValues = z.infer<typeof loginSchema>
