import { z } from "zod"

export const signupSchema = z
  .object({
    firstName: z.string().min(1, "Ingresá tu nombre"),
    lastName: z.string().min(1, "Ingresá tu apellido"),
    email: z.string().min(1, "Ingresá tu correo electrónico").email("Correo electrónico inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirmá tu contraseña"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type SignupFormValues = z.infer<typeof signupSchema>
