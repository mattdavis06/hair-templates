"use client"

import {
  FormAlert,
  HiddenFields,
  SubmitButton,
} from "@/components/forms/form-parts"
import { useFormSubmission } from "@/components/forms/use-form-submission"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Content } from "@/content/schema"
import type { BrandId } from "@/lib/brands/ids"
import { submitContact } from "@/lib/forms/actions"
import { CONTACT_FIELDS, contactSchema } from "@/lib/forms/schemas"

type ContactFormProps = {
  brandId: BrandId
  copy: Content["forms"]["contact"]
  failed: Content["forms"]["failed"]
}

export function ContactForm({ brandId, copy, failed }: ContactFormProps) {
  const {
    formAction,
    handleSubmit,
    clearErrors,
    reset,
    isPending,
    isSuccess,
    isFailed,
    fieldErrors,
  } = useFormSubmission({
    action: submitContact,
    schema: contactSchema,
    fields: CONTACT_FIELDS,
  })

  if (isSuccess) {
    return (
      <FormAlert variant="success" {...copy.success}>
        <Button variant="link" className="px-0" onClick={reset}>
          Send another message
        </Button>
      </FormAlert>
    )
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      onChange={clearErrors}
      className="relative"
      noValidate
    >
      <HiddenFields brandId={brandId} />
      <FieldGroup>
        <Field data-invalid={Boolean(fieldErrors.name)}>
          <FieldLabel htmlFor="contact-name">Name</FieldLabel>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={
              fieldErrors.name ? "contact-name-error" : undefined
            }
          />
          <FieldError id="contact-name-error">{fieldErrors.name}</FieldError>
        </Field>
        <Field data-invalid={Boolean(fieldErrors.email)}>
          <FieldLabel htmlFor="contact-email">Email</FieldLabel>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={
              fieldErrors.email ? "contact-email-error" : undefined
            }
          />
          <FieldError id="contact-email-error">{fieldErrors.email}</FieldError>
        </Field>
        <Field data-invalid={Boolean(fieldErrors.message)}>
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
          <Textarea
            id="contact-message"
            name="message"
            rows={5}
            maxLength={2000}
            required
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={
              fieldErrors.message ? "contact-message-error" : undefined
            }
          />
          <FieldError id="contact-message-error">
            {fieldErrors.message}
          </FieldError>
        </Field>
        {isFailed ? <FormAlert variant="error" {...failed} /> : null}
        <Field orientation="horizontal">
          <SubmitButton isPending={isPending} size="lg">
            {copy.submit}
          </SubmitButton>
        </Field>
      </FieldGroup>
    </form>
  )
}
