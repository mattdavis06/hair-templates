"use client"

import {
  FormAlert,
  HiddenFields,
  SubmitButton,
} from "@/components/forms/form-parts"
import { useFormSubmission } from "@/components/forms/use-form-submission"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { Content } from "@/content/schema"
import type { BrandId } from "@/lib/brands/ids"
import { submitNewsletter } from "@/lib/forms/actions"
import { NEWSLETTER_FIELDS, newsletterSchema } from "@/lib/forms/schemas"

type NewsletterFormProps = {
  brandId: BrandId
  copy: Content["forms"]["newsletter"]
  failed: Content["forms"]["failed"]
}

export function NewsletterForm({ brandId, copy, failed }: NewsletterFormProps) {
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
    action: submitNewsletter,
    schema: newsletterSchema,
    fields: NEWSLETTER_FIELDS,
  })

  if (isSuccess) {
    return (
      <FormAlert variant="success" {...copy.success}>
        <Button variant="link" className="px-0" onClick={reset}>
          Use a different email
        </Button>
      </FormAlert>
    )
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      onChange={clearErrors}
      className="relative flex flex-col gap-3"
      noValidate
    >
      <HiddenFields brandId={brandId} />
      <Field data-invalid={Boolean(fieldErrors.email)}>
        <FieldLabel htmlFor="newsletter-email" className="sr-only">
          Email address
        </FieldLabel>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={
              fieldErrors.email ? "newsletter-email-error" : undefined
            }
          />
          <SubmitButton isPending={isPending} size="lg">
            {copy.submit}
          </SubmitButton>
        </div>
        <FieldError id="newsletter-email-error">{fieldErrors.email}</FieldError>
      </Field>
      {isFailed ? <FormAlert variant="error" {...failed} /> : null}
    </form>
  )
}
