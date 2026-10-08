"use server"

import { checkBotId } from "botid/server"
import { ENQUIRY_KINDS, type EnquiryKind } from "@/content/schema"
import { findBrand, type Brand } from "@/lib/brands"
import {
  deliverContact,
  deliverEnquiry,
  deliverNewsletter,
} from "@/lib/email/deliver"
import { ENQUIRY_FIELD, enquiryFields, enquirySchema } from "./enquiries"
import {
  BRAND_FIELD,
  CONTACT_FIELDS,
  contactSchema,
  ELAPSED_FIELD,
  HONEYPOT_FIELD,
  NEWSLETTER_FIELDS,
  newsletterSchema,
  readFields,
  validate,
  type ContactField,
  type FormState,
  type NewsletterField,
} from "./schemas"

const MIN_FILL_MS = 1500

/** Honeypot filled, or submitted faster than a person could. Missing timing (no JS) is let through. */
function isLikelySpam(formData: FormData) {
  const honeypot = formData.get(HONEYPOT_FIELD)
  if (typeof honeypot === "string" && honeypot.trim() !== "") return true

  const elapsed = Number(formData.get(ELAPSED_FIELD))
  return Number.isFinite(elapsed) && elapsed > 0 && elapsed < MIN_FILL_MS
}

async function deliver<T>(
  formData: FormData,
  data: T,
  send: (brand: Brand, data: T) => Promise<void>
): Promise<FormState<never>> {
  const brand = findBrand(formData.get(BRAND_FIELD))
  if (!brand) return { status: "failed" }

  const verification = await checkBotId()
  if (verification.isBot) return { status: "failed" }

  try {
    await send(brand, data)
    return { status: "success" }
  } catch (error) {
    console.error(`[forms] ${brand.id} delivery failed`, error)
    return { status: "failed" }
  }
}

export async function submitContact(
  _prev: FormState<ContactField>,
  formData: FormData
): Promise<FormState<ContactField>> {
  // Spam gets a fake success so bots learn nothing from the response.
  if (isLikelySpam(formData)) return { status: "success" }

  const result = validate(contactSchema, readFields(formData, CONTACT_FIELDS))
  if (!result.success) {
    return { status: "invalid", fieldErrors: result.fieldErrors }
  }
  return deliver(formData, result.data, deliverContact)
}

const isEnquiryKind = (value: unknown): value is EnquiryKind =>
  ENQUIRY_KINDS.includes(value as EnquiryKind)

export async function submitEnquiry(
  _prev: FormState<string>,
  formData: FormData
): Promise<FormState<string>> {
  if (isLikelySpam(formData)) return { status: "success" }

  const brand = findBrand(formData.get(BRAND_FIELD))
  const kind = formData.get(ENQUIRY_FIELD)
  if (!brand || !isEnquiryKind(kind) || !brand.content.enquiries?.[kind]) {
    return { status: "failed" }
  }

  const fields = enquiryFields(kind, brand.content)
  const result = validate(
    enquirySchema(fields),
    readFields(
      formData,
      fields.map((field) => field.name)
    )
  )
  if (!result.success) {
    return { status: "invalid", fieldErrors: result.fieldErrors }
  }
  return deliver(formData, result.data, (target, values) =>
    deliverEnquiry(target, kind, fields, values)
  )
}

export async function submitNewsletter(
  _prev: FormState<NewsletterField>,
  formData: FormData
): Promise<FormState<NewsletterField>> {
  if (isLikelySpam(formData)) return { status: "success" }

  const result = validate(
    newsletterSchema,
    readFields(formData, NEWSLETTER_FIELDS)
  )
  if (!result.success) {
    return { status: "invalid", fieldErrors: result.fieldErrors }
  }
  return deliver(formData, result.data, deliverNewsletter)
}
