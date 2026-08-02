import { z } from "zod"

export const profileSchema = z.object({
  firstName: z.string().min(1, "Ingresá tu nombre"),
  lastName: z.string().min(1, "Ingresá tu apellido"),
  // Formato internacional (+549...): lo necesitan los recordatorios por
  // WhatsApp para identificar el número. Vacío se permite (todavía no todos
  // lo cargaron), pero si se completa tiene que tener el formato correcto.
  phone: z
    .string()
    .refine((value) => value === "" || /^\+\d{8,15}$/.test(value), {
      message: "Usá el formato internacional, ej: +5493411234567",
    }),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Ingresá tu contraseña actual"),
    newPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirmá la nueva contraseña"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export type PasswordFormValues = z.infer<typeof passwordSchema>
