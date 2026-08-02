import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Copy, ExternalLink, UserPlus } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  createUserSchema,
  type CreateUserFormValues,
} from "@/features/admin/validations/createUser.schema"
import { USER_ROLES } from "@/types/user"

const ROLE_LABELS: Record<string, string> = {
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.COORDINATOR]: "Coordinador",
  [USER_ROLES.MEMBER]: "Integrante",
}

const AUTH_CONSOLE_URL = "https://console.firebase.google.com/project/portal-atp/authentication/users"
const FIRESTORE_CONSOLE_URL = "https://console.firebase.google.com/project/portal-atp/firestore/data"

async function copyToClipboard(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copiado.`)
  } catch {
    toast.error("No se pudo copiar. Copialo manualmente.")
  }
}

interface CreateUserDialogProps {
  onCreated: () => void
}

// No hay Cloud Function para crear usuarios (requiere plan Blaze de Firebase,
// que este proyecto no usa). Este diálogo arma los datos y los deja listos
// para copiar y pegar en Firebase Console, en dos pasos: crear la cuenta en
// Authentication y despues el perfil en Firestore con el UID que devuelve.
export function CreateUserDialog({ onCreated }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<CreateUserFormValues | null>(null)
  const [uid, setUid] = useState("")

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: USER_ROLES.MEMBER },
  })

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setValues(null)
      setUid("")
      reset({ role: USER_ROLES.MEMBER, firstName: "", lastName: "", email: "" })
    }
  }

  function onSubmit(formValues: CreateUserFormValues) {
    setValues(formValues)
  }

  function handleDone() {
    onCreated()
    handleOpenChange(false)
  }

  const firestoreDoc = values
    ? JSON.stringify(
        {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          displayName: `${values.firstName.trim()} ${values.lastName.trim()}`,
          email: values.email.trim().toLowerCase(),
          photoURL: null,
          role: values.role,
          status: "active",
          phone: null,
          createdAt: "(usar el botón de servidor/timestamp de Firestore)",
          updatedAt: "(usar el botón de servidor/timestamp de Firestore)",
          lastLogin: null,
        },
        null,
        2
      )
    : ""

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button type="button" size="sm" className="gap-1.5">
            <UserPlus className="size-4" />
            Nuevo usuario
          </Button>
        }
      />
      <DialogContent>
        {!values ? (
          <>
            <DialogHeader>
              <DialogTitle>Nuevo usuario</DialogTitle>
              <DialogDescription>
                Completá los datos. Como el proyecto no usa Cloud Functions, el
                siguiente paso te va a dar todo listo para pegar en Firebase Console.
              </DialogDescription>
            </DialogHeader>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Rol</Label>
                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <Select items={ROLE_LABELS} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(USER_ROLES).map((role) => (
                          <SelectItem key={role} value={role}>
                            {ROLE_LABELS[role]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit">Continuar</Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Crear en Firebase Console</DialogTitle>
              <DialogDescription>Seguí estos dos pasos en orden.</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 rounded-xl border p-3">
                <p className="text-sm font-medium">1. Creá la cuenta en Authentication</p>
                <p className="text-muted-foreground text-xs">
                  "Add user" con este correo. La consola de Firebase pide una
                  contraseña: poné una provisoria cualquiera (mínimo 6
                  caracteres) — el usuario la va a poder cambiar después con
                  "olvidé mi contraseña" en el login.
                </p>
                <div className="flex items-center gap-2">
                  <Input readOnly value={values.email.trim().toLowerCase()} />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Copiar correo"
                    onClick={() => copyToClipboard(values.email.trim().toLowerCase(), "Correo")}
                  >
                    <Copy />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit gap-1.5"
                  render={<a href={AUTH_CONSOLE_URL} target="_blank" rel="noreferrer" />}
                >
                  <ExternalLink className="size-4" />
                  Abrir Authentication
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="generated-uid">
                  UID generado (pegalo acá después de crear la cuenta)
                </Label>
                <Input
                  id="generated-uid"
                  value={uid}
                  onChange={(event) => setUid(event.target.value)}
                  placeholder="Ej: 8kX3f..."
                />
              </div>

              {uid.trim() && (
                <div className="flex flex-col gap-2 rounded-xl border p-3">
                  <p className="text-sm font-medium">2. Creá el documento en Firestore</p>
                  <p className="text-muted-foreground text-xs">
                    Colección <span className="font-mono">users</span>, documento con ID{" "}
                    <span className="font-mono">{uid.trim()}</span>. En{" "}
                    <span className="font-mono">createdAt</span> y{" "}
                    <span className="font-mono">updatedAt</span> usá el tipo "timestamp" del
                    servidor que ofrece la consola.
                  </p>
                  <Textarea readOnly value={firestoreDoc} className="font-mono text-xs" rows={10} />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-fit gap-1.5"
                    onClick={() => copyToClipboard(firestoreDoc, "JSON")}
                  >
                    <Copy className="size-4" />
                    Copiar JSON
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-fit gap-1.5"
                    render={<a href={FIRESTORE_CONSOLE_URL} target="_blank" rel="noreferrer" />}
                  >
                    <ExternalLink className="size-4" />
                    Abrir Firestore
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setValues(null)}>
                Volver
              </Button>
              <Button type="button" onClick={handleDone}>
                Listo
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
