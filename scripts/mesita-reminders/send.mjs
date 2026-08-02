import { cert, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

import { getTomorrowAssignees } from "./tomorrowAssignees.mjs"

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
  const { dayLabel, users } = await getTomorrowAssignees(db)

  if (!dayLabel) {
    console.log("Mañana es fin de semana, no hay Mesita. No se envían recordatorios.")
    return
  }

  if (users.length === 0) {
    console.log(`Nadie anotado para mañana (${dayLabel}). No se envían recordatorios.`)
    return
  }

  console.log(`Mañana es ${dayLabel}: ${users.length} persona(s) anotada(s). Enviando recordatorios...`)

  for (const user of users) {
    const label = user.displayName ?? user.id

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
