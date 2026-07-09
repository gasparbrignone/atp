import { Plus, Trash2 } from "lucide-react"
import {
  useFieldArray,
  type Control,
  type UseFormRegister,
} from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { MeetingFormValues } from "@/features/meetings/validations/meeting.schema"

interface TopicFieldArrayProps {
  control: Control<MeetingFormValues>
  register: UseFormRegister<MeetingFormValues>
}

export function TopicFieldArray({ control, register }: TopicFieldArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "topics",
  })

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col gap-2 rounded-xl border p-3">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor={`topics.${index}.title`}>Tema {index + 1}</Label>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Quitar tema"
              onClick={() => remove(index)}
            >
              <Trash2 />
            </Button>
          </div>

          <Input
            id={`topics.${index}.title`}
            placeholder="Título del tema"
            {...register(`topics.${index}.title`)}
          />
          <Textarea
            placeholder="Qué se discutió"
            {...register(`topics.${index}.discussion`)}
          />
          <Textarea
            placeholder="Decisión tomada sobre este tema"
            {...register(`topics.${index}.decision`)}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5 self-start"
        onClick={() => append({ title: "", discussion: "", decision: "" })}
      >
        <Plus className="size-4" />
        Agregar tema
      </Button>
    </div>
  )
}
