import { useEffect } from "react"
import { FirebaseError } from "firebase/app"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/features/auth/hooks/useAuth"
import {
  changeOwnPassword,
  updateOwnProfile,
} from "@/features/profile/services/profile.service"
import {
  passwordSchema,
  profileSchema,
  type PasswordFormValues,
  type ProfileFormValues,
} from "@/features/profile/validations/profile.schema"

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function getPasswordErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
      return "La contraseña actual es incorrecta."
    }
    if (error.code === "auth/weak-password") {
      return "La nueva contraseña es demasiado débil."
    }
    if (error.code === "auth/too-many-requests") {
      return "Demasiados intentos. Probá nuevamente en unos minutos."
    }
  }
  return "No se pudo cambiar la contraseña. Intentá nuevamente."
}

export function ProfilePage() {
  const { firebaseUser, profile } = useAuth()

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "", lastName: "", phone: "" },
  })

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone ?? "",
      })
    }
  }, [profile, profileForm])

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  async function onSubmitProfile(values: ProfileFormValues) {
    if (!firebaseUser) return

    try {
      await updateOwnProfile(firebaseUser.uid, values)
      toast.success("Perfil actualizado.")
    } catch {
      toast.error("No se pudo actualizar el perfil. Intentá nuevamente.")
    }
  }

  async function onSubmitPassword(values: PasswordFormValues) {
    if (!firebaseUser) return

    try {
      await changeOwnPassword(firebaseUser, values.currentPassword, values.newPassword)
      toast.success("Contraseña actualizada.")
      passwordForm.reset()
    } catch (error) {
      toast.error(getPasswordErrorMessage(error))
    }
  }

  const displayName = profile?.displayName ?? firebaseUser?.email ?? ""

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarFallback>{getInitials(displayName) || "?"}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold">{displayName}</h1>
          <p className="text-muted-foreground text-sm">{firebaseUser?.email}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Editar perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={profileForm.handleSubmit(onSubmitProfile)}
            noValidate
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" {...profileForm.register("firstName")} />
                {profileForm.formState.errors.firstName && (
                  <p className="text-destructive text-sm">
                    {profileForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" {...profileForm.register("lastName")} />
                {profileForm.formState.errors.lastName && (
                  <p className="text-destructive text-sm">
                    {profileForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+5493411234567"
                aria-invalid={!!profileForm.formState.errors.phone}
                {...profileForm.register("phone")}
              />
              <p className="text-muted-foreground text-xs">
                Con código de país (ej: +549 para Argentina). Se usa para los recordatorios por
                WhatsApp de Mesita.
              </p>
              {profileForm.formState.errors.phone && (
                <p className="text-destructive text-sm">
                  {profileForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={profileForm.formState.isSubmitting} className="self-start">
              Guardar cambios
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cambiar contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
            noValidate
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="currentPassword">Contraseña actual</Label>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                {...passwordForm.register("currentPassword")}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-destructive text-sm">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <Input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register("newPassword")}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-destructive text-sm">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...passwordForm.register("confirmPassword")}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-destructive text-sm">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              className="self-start"
            >
              Cambiar contraseña
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
