import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
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
import { useAuth } from "@/features/auth/hooks/useAuth"
import { signUp } from "@/features/auth/services/auth.service"
import { createOwnProfile } from "@/features/auth/services/user.service"
import { getSignupErrorMessage } from "@/features/auth/utils/authErrors"
import {
  signupSchema,
  type SignupFormValues,
} from "@/features/auth/validations/signup.schema"
import { routes } from "@/routes/routes"

export function SignUpPage() {
  const { firebaseUser, isLoading: isAuthLoading } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  if (!isAuthLoading && firebaseUser) {
    return <Navigate to={routes.dashboard} replace />
  }

  async function onSubmit(values: SignupFormValues) {
    setFormError(null)

    try {
      const credential = await signUp(values.email, values.password)
      await createOwnProfile(credential.user.uid, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      })
      navigate(routes.dashboard, { replace: true })
    } catch (error) {
      setFormError(getSignupErrorMessage(error))
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Portal ATP</CardTitle>
          <CardDescription>
            Creá tu cuenta. Un administrador la va a aprobar antes de que puedas usarla.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  aria-invalid={!!errors.firstName}
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-destructive text-sm">{errors.firstName.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  aria-invalid={!!errors.lastName}
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-destructive text-sm">{errors.lastName.message}</p>
                )}
              </div>
            </div>

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
                <p className="text-destructive text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>

            {formError && (
              <p className="text-destructive text-sm" role="alert">
                {formError}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} className="mt-2">
              {isSubmitting && <Loader2 className="animate-spin" />}
              Crear cuenta
            </Button>
          </form>

          <p className="text-muted-foreground mt-4 text-center text-sm">
            ¿Ya tenés cuenta?{" "}
            <Link to={routes.login} className="text-primary underline-offset-4 hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
