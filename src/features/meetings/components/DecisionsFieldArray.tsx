import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DecisionsFieldArrayProps {
  value: string[]
  onChange: (decisions: string[]) => void
}

export function DecisionsFieldArray({ value, onChange }: DecisionsFieldArrayProps) {
  function updateAt(index: number, next: string) {
    onChange(value.map((item, i) => (i === index ? next : item)))
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-2">
      {value.map((decision, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder="Decisión"
            value={decision}
            onChange={(event) => updateAt(index, event.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Quitar decisión"
            onClick={() => removeAt(index)}
          >
            <Trash2 />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5 self-start"
        onClick={() => onChange([...value, ""])}
      >
        <Plus className="size-4" />
        Agregar decisión
      </Button>
    </div>
  )
}
