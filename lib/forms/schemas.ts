import * as z from "zod/mini"

const email = z
  .string()
  .check(
    z.trim(),
    z.maxLength(254, "That email looks too long"),
    z.email("Enter a valid email")
  )

export const contactSchema = z.object({
  name: z
    .string()
    .check(
      z.trim(),
      z.minLength(1, "Add your name"),
      z.maxLength(100, "Keep your name under 100 characters")
    ),
  email,
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(1, "Add a short message"),
      z.maxLength(2000, "Keep your message under 2,000 characters")
    ),
})

export const newsletterSchema = z.object({ email })

export type ContactInput = z.infer<typeof contactSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>

export const CONTACT_FIELDS = ["name", "email", "message"] as const
export const NEWSLETTER_FIELDS = ["email"] as const

export type ContactField = (typeof CONTACT_FIELDS)[number]
export type NewsletterField = (typeof NEWSLETTER_FIELDS)[number]

export type FieldErrors<F extends string> = Partial<Record<F, string>>

export type FormState<F extends string> =
  | { status: "idle" }
  | { status: "success" }
  | { status: "invalid"; fieldErrors: FieldErrors<F> }
  | { status: "failed" }

/** Hidden from people and assistive tech; only form-filling bots complete it. */
export const HONEYPOT_FIELD = "company"
/** How long the form was open, measured on the client so clock skew can't matter. */
export const ELAPSED_FIELD = "elapsedMs"
export const BRAND_FIELD = "brand"

export function readFields<F extends string>(
  formData: FormData,
  fields: readonly F[]
): Record<F, string> {
  const values = {} as Record<F, string>
  for (const field of fields) {
    const value = formData.get(field)
    values[field] = typeof value === "string" ? value : ""
  }
  return values
}

export function validate<F extends string, T>(
  schema: z.ZodMiniType<T>,
  values: Record<F, string>
):
  { success: true; data: T } | { success: false; fieldErrors: FieldErrors<F> } {
  const result = schema.safeParse(values)
  if (result.success) return { success: true, data: result.data }

  const fieldErrors: FieldErrors<F> = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as F | undefined
    if (field && !fieldErrors[field]) fieldErrors[field] = issue.message
  }
  return { success: false, fieldErrors }
}
