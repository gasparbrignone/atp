import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ForgotPasswordDialog } from "@/features/auth/components/ForgotPasswordDialog"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { signIn } from "@/features/auth/services/auth.service"
import { getAuthErrorMessage } from "@/features/auth/utils/authErrors"
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/validations/login.schema"
import { routes } from "@/routes/routes"

export function LoginPage() {
  const { firebaseUser, isLoading: isAuthLoading } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  if (!isAuthLoading && firebaseUser) {
    return <Navigate to={routes.dashboard} replace />
  }

  async function onSubmit(values: LoginFormValues) {
    setFormError(null)

    try {
      await signIn(values.email, values.password)
    } catch (error) {
      setFormError(getAuthErrorMessage(error))
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Portal ATP</CardTitle>
          <CardDescription>
            Iniciá sesión con tu cuenta de la agrupación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-destructive text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <ForgotPasswordDialog defaultEmail={watch("email")} />
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {formError && (
              <p className="text-destructive text-sm" role="alert">
                {formError}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} className="mt-2">
              {isSubmitting && <Loader2 className="animate-spin" />}
              Iniciar sesión
            </Button>
          </form>

          <p className="text-muted-foreground mt-4 text-center text-sm">
            ¿No tenés cuenta?{" "}
            <Link to={routes.signup} className="text-primary underline-offset-4 hover:underline">
              Registrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
