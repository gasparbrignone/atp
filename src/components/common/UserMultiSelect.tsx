import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useActiveUsers } from "@/features/auth/hooks/useActiveUsers"

interface UserMultiSelectProps {
  value: string[]
  onChange: (uids: string[]) => void
  placeholder?: string
}

export function UserMultiSelect({
  value,
  onChange,
  placeholder = "Buscar integrante...",
}: UserMultiSelectProps) {
  const { data: users, isLoading } = useActiveUsers()
  const [search, setSearch] = useState("")

  const filteredUsers = (users ?? []).filter((user) =>
    (user.displayName ?? "").toLowerCase().includes(search.toLowerCase())
  )

  function toggle(uid: string) {
    if (value.includes(uid)) {
      onChange(value.filter((id) => id !== uid))
    } else {
      onChange([...value, uid])
    }
  }

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((uid) => {
            const user = users?.find((u) => u.id === uid)
            return (
              <Badge key={uid} variant="secondary">
                {user?.displayName ?? "..."}
              </Badge>
            )
          })}
        </div>
      )}

      <Input
        placeholder={placeholder}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="flex max-h-48 flex-col gap-1 overflow-y-auto rounded-lg border p-2">
        {filteredUsers.length === 0 && (
          <p className="text-muted-foreground p-2 text-sm">
            No se encontraron integrantes.
          </p>
        )}

        {filteredUsers.map((user) => (
          <label
            key={user.id}
            className="hover:bg-muted flex items-center gap-2 rounded-md p-2 text-sm"
          >
            <Checkbox
              checked={value.includes(user.id)}
              onCheckedChange={() => toggle(user.id)}
            />
            {user.displayName}
          </label>
        ))}
      </div>
    </div>
  )
}
