import { z } from "zod"

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Ingresá tu correo electrónico").email("Correo electrónico inválido"),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
