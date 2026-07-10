import { Plus, Trash2 } from "lucide-react"

import { UserMultiSelect } from "@/components/common/UserMultiSelect"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface DraftMeetingTask {
  title: string
  description: string
  assignedUsers: string[]
  dueDate: string
}

const emptyDraftTask: DraftMeetingTask = {
  title: "",
  description: "",
  assignedUsers: [],
  dueDate: "",
}

interface MeetingTasksSectionProps {
  tasks: DraftMeetingTask[]
  onChange: (tasks: DraftMeetingTask[]) => void
}

export function MeetingTasksSection({ tasks, onChange }: MeetingTasksSectionProps) {
  function updateAt(index: number, patch: Partial<DraftMeetingTask>) {
    onChange(tasks.map((task, i) => (i === index ? { ...task, ...patch } : task)))
  }

  function removeAt(index: number) {
    onChange(tasks.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task, index) => (
        <div key={index} className="flex flex-col gap-2 rounded-xl border p-3">
          <div className="flex items-center justify-between gap-2">
            <Label>Tarea {index + 1}</Label>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Quitar tarea"
              onClick={() => removeAt(index)}
            >
              <Trash2 />
            </Button>
          </div>

          <Input
            placeholder="Título de la tarea"
            value={task.title}
            onChange={(event) => updateAt(index, { title: event.target.value })}
          />

          <Textarea
            placeholder="Descripción (opcional)"
            value={task.description}
            onChange={(event) => updateAt(index, { description: event.target.value })}
          />

          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs">Responsable(s)</Label>
            <UserMultiSelect
              value={task.assignedUsers}
              onChange={(assignedUsers) => updateAt(index, { assignedUsers })}
              placeholder="Buscar integrante..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground text-xs">Fecha límite</Label>
            <Input
              type="date"
              value={task.dueDate}
              onChange={(event) => updateAt(index, { dueDate: event.target.value })}
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5 self-start"
        onClick={() => onChange([...tasks, emptyDraftTask])}
      >
        <Plus className="size-4" />
        Agregar tarea
      </Button>
    </div>
  )
}
