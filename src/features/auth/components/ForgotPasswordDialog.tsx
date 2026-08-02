import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword } from "@/features/auth/services/auth.service"
import { getForgotPasswordErrorMessage } from "@/features/auth/utils/authErrors"
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/validations/forgotPassword.schema"

interface ForgotPasswordDialogProps {
  defaultEmail?: string
}

export function ForgotPasswordDialog({ defaultEmail }: ForgotPasswordDialogProps) {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: defaultEmail ?? "" },
  })

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen) reset({ email: defaultEmail ?? "" })
  }

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      await resetPassword(values.email)
      toast.success("Te enviamos un correo para restablecer tu contraseña.")
      setOpen(false)
    } catch (error) {
      toast.error(getForgotPasswordErrorMessage(error))
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="text-primary text-sm underline-offset-4 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restablecer contraseña</DialogTitle>
          <DialogDescription>
            Te enviamos un correo con un enlace para elegir una nueva contraseña.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor="forgot-email">Correo electrónico</Label>
            <Input
              id="forgot-email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              Enviar correo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
