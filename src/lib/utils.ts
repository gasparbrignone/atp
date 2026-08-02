import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mayúscula solo en la primera letra. La clase de Tailwind "capitalize"
// aplica text-transform a cada palabra ("Julio De 2026"), lo cual está mal
// en español (los meses y días no llevan mayúscula salvo al inicio).
export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
