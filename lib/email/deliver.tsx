import type { ReactElement } from "react"
import { render } from "react-email"
import { Resend } from "resend"
import type { Brand } from "@/lib/brands"
import { toEmailBrand } from "@/lib/email/brand"
import { ContactConfirmation } from "@/lib/email/templates/contact-confirmation"
import { ContactNotification } from "@/lib/email/templates/contact-notification"
import { NewsletterWelcome } from "@/lib/email/templates/newsletter-welcome"
import type { ContactInput, NewsletterInput } from "@/lib/forms/schemas"

/**
 * Sending needs an API key and a domain verified in Resend. Without both, forms
 * still succeed but nothing is sent, so local dev and forks work out of the box.
 */
function readConfig() {
  const apiKey = process.env.RESEND_API_KEY
  const fromDomain = process.env.EMAIL_FROM_DOMAIN
  if (!apiKey || !fromDomain) return null
  return {
    resend: new Resend(apiKey),
    fromDomain,
    /** Gets a copy of every enquiry; unset means only the visitor is emailed. */
    inbox: process.env.CONTACT_INBOX || undefined,
  }
}

const config = readConfig()

type Config = NonNullable<typeof config>

type Message = {
  kind: "contact-confirmation" | "contact-notification" | "newsletter-welcome"
  to: string
  subject: string
  replyTo?: string
  email: ReactElement
}

async function send(
  { resend, fromDomain }: Config,
  brand: Brand,
  message: Message
) {
  const [html, text] = await Promise.all([
    render(message.email),
    render(message.email, { plainText: true }),
  ])
  const { error } = await resend.emails.send({
    from: `${brand.content.name} <${brand.id}@${fromDomain}>`,
    to: message.to,
    subject: message.subject,
    replyTo: message.replyTo,
    html,
    text,
    tags: [
      { name: "brand", value: brand.id.replaceAll("-", "_") },
      { name: "type", value: message.kind.replaceAll("-", "_") },
    ],
  })
  // The SDK returns API errors instead of throwing them.
  if (error) throw new Error(`Resend ${message.kind} failed: ${error.message}`)
}

function logDemo(summary: string) {
  if (process.env.NODE_ENV === "development") {
    console.info(
      `[forms:demo] ${summary} (set RESEND_API_KEY and EMAIL_FROM_DOMAIN to send)`
    )
  }
}

/** Keeps visitor-typed names on one line in subject headers. */
const singleLine = (value: string) => value.replace(/\s+/g, " ").trim()

export async function deliverContact(brand: Brand, input: ContactInput) {
  if (!config) return logDemo(`${brand.id} contact from ${input.email}`)

  const emailBrand = toEmailBrand(brand)
  const confirmation = send(config, brand, {
    kind: "contact-confirmation",
    to: input.email,
    subject: emailBrand.copy.contact.subject,
    replyTo: config.inbox,
    email: <ContactConfirmation brand={emailBrand} {...input} />,
  })
  const notification = config.inbox
    ? send(config, brand, {
        kind: "contact-notification",
        to: config.inbox,
        subject: `New enquiry from ${singleLine(input.name)} · ${emailBrand.name}`,
        replyTo: input.email,
        email: <ContactNotification brand={emailBrand} {...input} />,
      })
    : null

  const [confirmed, notified] = await Promise.allSettled([
    confirmation,
    notification,
  ])
  // The visitor's own receipt decides success; a missed shop copy is only logged.
  if (notified.status === "rejected") {
    console.error("[forms] contact notification failed", notified.reason)
  }
  if (confirmed.status === "rejected") throw confirmed.reason
}

export async function deliverNewsletter(brand: Brand, input: NewsletterInput) {
  if (!config) return logDemo(`${brand.id} newsletter sign-up ${input.email}`)

  const emailBrand = toEmailBrand(brand)
  await send(config, brand, {
    kind: "newsletter-welcome",
    to: input.email,
    subject: emailBrand.copy.newsletter.subject,
    replyTo: config.inbox,
    email: <NewsletterWelcome brand={emailBrand} />,
  })
}
