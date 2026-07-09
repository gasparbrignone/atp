import { LogOut } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { signOutUser } from "@/features/auth/services/auth.service"

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function Header() {
  const { profile, firebaseUser } = useAuth()
  const displayName = profile?.displayName ?? firebaseUser?.email ?? ""

  return (
    <header className="bg-background sticky top-0 z-10 flex h-14 items-center justify-between border-b px-4">
      <span className="text-base font-semibold">Portal ATP</span>

      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarFallback>{getInitials(displayName) || "?"}</AvatarFallback>
        </Avatar>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Cerrar sesión"
          onClick={() => void signOutUser()}
        >
          <LogOut />
        </Button>
      </div>
    </header>
  )
}
