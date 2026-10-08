import * as z from "zod/mini"
import type { Content, EnquiryKind } from "@/content/schema"

/** Which enquiry form was sent; checked against ENQUIRY_KINDS on the server. */
export const ENQUIRY_FIELD = "enquiry"

export type EnquiryField = {
  name: string
  label: string
  /** Shorter label for emails, e.g. "Patch test". */
  short?: string
  type:
    | "text"
    | "email"
    | "tel"
    | "date"
    | "number"
    | "select"
    | "textarea"
    | "checkbox"
  /** The message shown when a required field is left empty. */
  required?: string
  description?: string
  placeholder?: string
  autoComplete?: string
  options?: string[]
  /** Replaced with the brand's team names (after "No preference") when the form is built. */
  teamOptions?: boolean
  /** Sits beside another half-width field on wider screens. */
  half?: boolean
  min?: number
  max?: number
}

const FIELDS: Record<EnquiryKind, EnquiryField[]> = {
  consultation: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: "Add your name",
      autoComplete: "name",
      half: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: "Add your email",
      autoComplete: "email",
      half: true,
    },
    {
      name: "phone",
      label: "Phone (optional)",
      short: "Phone",
      type: "tel",
      autoComplete: "tel",
      half: true,
    },
    {
      name: "stylist",
      label: "Preferred stylist",
      short: "Stylist",
      type: "select",
      teamOptions: true,
      half: true,
    },
    {
      name: "hairNow",
      label: "Your hair now",
      short: "Hair now",
      type: "select",
      required: "Choose what your hair is like now",
      options: [
        "Natural, never coloured",
        "Coloured at home (box dye)",
        "Coloured in a salon",
        "Lightened or bleached",
        "A mix, or not sure",
      ],
      half: true,
    },
    {
      name: "lastColoured",
      label: "Last coloured",
      type: "select",
      required: "Choose when it was last coloured",
      options: [
        "Never",
        "In the last 3 months",
        "3 to 12 months ago",
        "Over a year ago",
      ],
      half: true,
    },
    {
      name: "goal",
      label: "What would you love?",
      short: "Their goal",
      type: "textarea",
      required: "Tell us a little about the colour you'd like",
      description:
        "The shade you're dreaming of, how much upkeep suits you, any photos you've saved.",
      max: 2000,
    },
    {
      name: "days",
      label: "Best days and times (optional)",
      short: "Availability",
      type: "text",
      placeholder: "e.g. Thursday evenings or Saturday mornings",
    },
    {
      name: "patchTest",
      label:
        "I understand I'll need a patch test at least 48 hours before any new colour.",
      short: "Patch test",
      type: "checkbox",
      required: "Please confirm you're happy to have a patch test",
    },
  ],
  events: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: "Add your name",
      autoComplete: "name",
      half: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: "Add your email",
      autoComplete: "email",
      half: true,
    },
    {
      name: "phone",
      label: "Phone",
      type: "tel",
      required: "Add a phone number so we can talk details",
      autoComplete: "tel",
      half: true,
    },
    {
      name: "date",
      label: "Event date",
      short: "Date",
      type: "date",
      required: "Choose the date of your event",
      half: true,
    },
    {
      name: "occasion",
      label: "Occasion",
      type: "select",
      required: "Choose the occasion",
      options: [
        "Wedding",
        "Prom or formal",
        "Party or celebration",
        "Photoshoot",
        "Something else",
      ],
      half: true,
    },
    {
      name: "people",
      label: "People having hair done",
      short: "People",
      type: "number",
      required: "Add how many people need styling",
      min: 1,
      max: 12,
      half: true,
    },
    {
      name: "location",
      label: "Where",
      type: "select",
      required: "Choose where you'd like us",
      options: ["In the salon", "On location (within 15 miles)"],
    },
    {
      name: "message",
      label: "Anything else? (optional)",
      short: "Notes",
      type: "textarea",
      description: "Start times, trial dates, the look you're after.",
      max: 2000,
    },
  ],
}

export const NO_PREFERENCE = "No preference"

/** The form's fields with the brand's team filled into any stylist picker. */
export function enquiryFields(
  kind: EnquiryKind,
  { team }: Pick<Content, "team">
): EnquiryField[] {
  const names = team?.members.map((member) => member.name) ?? []
  return FIELDS[kind].map((field) =>
    field.teamOptions ? { ...field, options: [NO_PREFERENCE, ...names] } : field
  )
}

const PHONE = /^[0-9+()\s-]{7,20}$/

/** Today in ISO form; a day either side of the visitor's zone doesn't matter here. */
const today = () => new Date().toISOString().slice(0, 10)

function fieldSchema(field: EnquiryField): z.ZodMiniType<string> {
  if (field.type === "email") {
    return z
      .string()
      .check(
        z.trim(),
        z.minLength(1, field.required ?? "Add your email"),
        z.maxLength(254, "That email looks too long"),
        z.email("Enter a valid email")
      )
  }
  if (field.type === "checkbox") {
    return z
      .string()
      .check(
        z.refine(
          (value) => !field.required || value === "on",
          field.required ?? ""
        )
      )
  }

  const max = field.max ?? 200
  return z.string().check(
    z.trim(),
    z.refine((value) => !field.required || value !== "", field.required),
    z.maxLength(
      max,
      `Keep this under ${max.toLocaleString("en-GB")} characters`
    ),
    z.refine(
      (value) => value === "" || isValid(field, value),
      invalidMessage(field)
    )
  )
}

function isValid(field: EnquiryField, value: string): boolean {
  switch (field.type) {
    case "tel":
      return PHONE.test(value)
    case "date":
      return /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= today()
    case "number": {
      const n = Number(value)
      return (
        Number.isInteger(n) &&
        n >= (field.min ?? 0) &&
        n <= (field.max ?? Number.MAX_SAFE_INTEGER)
      )
    }
    case "select":
      return field.options?.includes(value) ?? false
    default:
      return true
  }
}

function invalidMessage(field: EnquiryField): string {
  switch (field.type) {
    case "tel":
      return "Enter a valid phone number"
    case "date":
      return "Choose a date from today onwards"
    case "number":
      return `Enter a number from ${field.min ?? 0} to ${field.max}`
    default:
      return "Choose one of the options"
  }
}

export function enquirySchema(fields: EnquiryField[]) {
  return z.object(
    Object.fromEntries(fields.map((field) => [field.name, fieldSchema(field)]))
  )
}

export type EnquiryValues = Record<string, string>

/** Label/value pairs for emails, skipping empty answers. */
export function enquiryRows(fields: EnquiryField[], values: EnquiryValues) {
  return fields.flatMap((field) => {
    const value = values[field.name]
    if (!value) return []
    return [
      {
        name: field.name,
        label: field.short ?? field.label,
        value: field.type === "checkbox" ? "Confirmed" : value,
        long: field.type === "textarea",
      },
    ]
  })
}

export type EnquiryRow = ReturnType<typeof enquiryRows>[number]
