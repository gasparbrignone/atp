import { useAuth } from "@/features/auth/hooks/useAuth"

export function DashboardPage() {
  const { profile, firebaseUser } = useAuth()
  const firstName = profile?.firstName ?? firebaseUser?.email ?? ""

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Hola, {firstName}</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Bienvenido al Portal ATP.
      </p>
    </div>
  )
}
