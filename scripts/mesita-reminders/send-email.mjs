import { cert, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import nodemailer from "nodemailer"

import { getTomorrowAssignees } from "./tomorrowAssignees.mjs"

const { FIREBASE_SERVICE_ACCOUNT_KEY, GMAIL_USER, GMAIL_APP_PASSWORD } = process.env

if (!FIREBASE_SERVICE_ACCOUNT_KEY || !GMAIL_USER || !GMAIL_APP_PASSWORD) {
  throw new Error(
    "Faltan variables de entorno: FIREBASE_SERVICE_ACCOUNT_KEY, GMAIL_USER, GMAIL_APP_PASSWORD"
  )
}

initializeApp({ credential: cert(JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY)) })
const db = getFirestore()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
})

async function sendReminderEmail(email, firstName, dayLabel) {
  await transporter.sendMail({
    from: `Portal ATP <${GMAIL_USER}>`,
    to: email,
    subject: `Mañana (${dayLabel}) te toca Mesita ATP`,
    text: `Hola ${firstName}, te acordamos que mañana (${dayLabel}) te toca hacer Mesita ATP. ¡No te olvides!`,
    html: `<p>Hola ${firstName},</p><p>Te acordamos que <strong>mañana (${dayLabel})</strong> te toca hacer <strong>Mesita ATP</strong>. ¡No te olvides!</p>`,
  })
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

    if (!user.email) {
      console.log(`- ${label}: sin correo, se salta.`)
      continue
    }

    try {
      await sendReminderEmail(user.email, user.firstName ?? label, dayLabel)
      console.log(`- ${label}: correo enviado a ${user.email}.`)
    } catch (error) {
      console.error(`- ${label}: error al enviar ->`, error.message)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
