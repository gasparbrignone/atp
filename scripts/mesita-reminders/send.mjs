import { cert, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const {
  FIREBASE_SERVICE_ACCOUNT_KEY,
  WHATSAPP_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_TEMPLATE_NAME = "mesita_reminder",
} = process.env

if (!FIREBASE_SERVICE_ACCOUNT_KEY || !WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
  throw new Error(
    "Faltan variables de entorno: FIREBASE_SERVICE_ACCOUNT_KEY, WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID"
  )
}

initializeApp({ credential: cert(JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY)) })
const db = getFirestore()

// --- Duplicado intencional de src/features/mesita/utils/weekId.ts ---
// Este script corre fuera del proyecto Vite (Node plano en GitHub Actions),
// no puede importar los módulos TypeScript de la app directamente.
function getWeekId(date) {
  const target = new Date(date.valueOf())
  const dayNumber = (date.getDay() + 6) % 7 // lunes = 0
  target.setDate(target.getDate() - dayNumber + 3)

  const firstThursday = new Date(target.getFullYear(), 0, 4)
  const firstDayNumber = (firstThursday.getDay() + 6) % 7
  firstThursday.setDate(firstThursday.getDate() - firstDayNumber + 3)

  const weekNumber =
    1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000))

  return `${target.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`
}

const DAY_LABELS = { 1: "lunes", 2: "martes", 3: "miércoles", 4: "jueves", 5: "viernes" }

async function sendWhatsAppReminder(phone, firstName, dayLabel) {
  const to = phone.replace("+", "")

  const response = await fetch(
    `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: WHATSAPP_TEMPLATE_NAME,
          language: { code: "es_AR" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: firstName },
                { type: "text", text: dayLabel },
              ],
            },
          ],
        },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`WhatsApp API ${response.status}: ${await response.text()}`)
  }
}

async function main() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const isoWeekday = tomorrow.getDay() === 0 ? 7 : tomorrow.getDay() // 1=lunes ... 7=domingo

  if (isoWeekday > 5) {
    console.log("Mañana es fin de semana, no hay Mesita. No se envían recordatorios.")
    return
  }

  const weekId = getWeekId(tomorrow)
  const dayLabel = DAY_LABELS[isoWeekday]

  const slotsSnapshot = await db
    .collection("mesitaWeeks")
    .doc(weekId)
    .collection("slots")
    .where("day", "==", isoWeekday)
    .get()

  const uids = new Set()
  slotsSnapshot.forEach((doc) => {
    const slot = doc.data()
    if (!slot.blocked) {
      for (const uid of slot.assignedUsers ?? []) uids.add(uid)
    }
  })

  if (uids.size === 0) {
    console.log(`Nadie anotado para mañana (${dayLabel}). No se envían recordatorios.`)
    return
  }

  console.log(`Mañana es ${dayLabel}: ${uids.size} persona(s) anotada(s). Enviando recordatorios...`)

  for (const uid of uids) {
    const userDoc = await db.collection("users").doc(uid).get()
    if (!userDoc.exists) continue
    const user = userDoc.data()
    const label = user.displayName ?? uid

    if (!user.phone) {
      console.log(`- ${label}: sin teléfono cargado en su perfil, se salta.`)
      continue
    }

    try {
      await sendWhatsAppReminder(user.phone, user.firstName ?? label, dayLabel)
      console.log(`- ${label}: recordatorio enviado.`)
    } catch (error) {
      console.error(`- ${label}: error al enviar ->`, error.message)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
