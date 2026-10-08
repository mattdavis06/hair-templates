"use client"

import { useMemo } from "react"
import {
  FormAlert,
  HiddenFields,
  SubmitButton,
} from "@/components/forms/form-parts"
import { NativeSelect } from "@/components/forms/native-select"
import { useFormSubmission } from "@/components/forms/use-form-submission"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Content, EnquiryCopy, EnquiryKind } from "@/content/schema"
import type { BrandId } from "@/lib/brands/ids"
import { submitEnquiry } from "@/lib/forms/actions"
import {
  ENQUIRY_FIELD,
  enquirySchema,
  type EnquiryField,
} from "@/lib/forms/enquiries"
import { cn } from "@/lib/utils"

type EnquiryFormProps = {
  brandId: BrandId
  kind: EnquiryKind
  fields: EnquiryField[]
  copy: Pick<EnquiryCopy, "submit" | "success">
  failed: Content["forms"]["failed"]
}

/** Draws any enquiry form from its field list; see `lib/forms/enquiries.ts`. */
export function EnquiryForm({
  brandId,
  kind,
  fields,
  copy,
  failed,
}: EnquiryFormProps) {
  const schema = useMemo(() => enquirySchema(fields), [fields])
  const names = useMemo(() => fields.map((field) => field.name), [fields])
  const {
    formAction,
    handleSubmit,
    clearErrors,
    reset,
    isPending,
    isSuccess,
    isFailed,
    fieldErrors,
  } = useFormSubmission({ action: submitEnquiry, schema, fields: names })

  if (isSuccess) {
    return (
      <FormAlert variant="success" {...copy.success}>
        <Button variant="link" className="px-0" onClick={reset}>
          Send another request
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
      <input type="hidden" name={ENQUIRY_FIELD} value={kind} />
      <FieldGroup className="grid sm:grid-cols-2">
        {fields.map((field) => {
          const id = `${kind}-${field.name}`
          const error = fieldErrors[field.name]
          const describedBy =
            [
              field.description ? `${id}-description` : null,
              error ? `${id}-error` : null,
            ]
              .filter(Boolean)
              .join(" ") || undefined

          return (
            <Field
              key={field.name}
              data-invalid={Boolean(error)}
              orientation={
                field.type === "checkbox" ? "horizontal" : "vertical"
              }
              className={cn(
                !field.half && "sm:col-span-2",
                field.type === "checkbox" && "flex-wrap items-start"
              )}
            >
              {field.type === "checkbox" ? (
                <Control
                  field={field}
                  id={id}
                  invalid={Boolean(error)}
                  describedBy={describedBy}
                />
              ) : null}
              <FieldLabel
                htmlFor={id}
                className={cn(
                  field.type === "checkbox" && "flex-1 font-normal"
                )}
              >
                {field.label}
              </FieldLabel>
              {field.type === "checkbox" ? null : (
                <Control
                  field={field}
                  id={id}
                  invalid={Boolean(error)}
                  describedBy={describedBy}
                />
              )}
              {field.description ? (
                <FieldDescription id={`${id}-description`}>
                  {field.description}
                </FieldDescription>
              ) : null}
              <FieldError id={`${id}-error`} className="basis-full">
                {error}
              </FieldError>
            </Field>
          )
        })}
        {isFailed ? (
          <div className="sm:col-span-2">
            <FormAlert variant="error" {...failed} />
          </div>
        ) : null}
        <Field orientation="horizontal" className="sm:col-span-2">
          <SubmitButton isPending={isPending} size="lg">
            {copy.submit}
          </SubmitButton>
        </Field>
      </FieldGroup>
    </form>
  )
}

function Control({
  field,
  id,
  invalid,
  describedBy,
}: {
  field: EnquiryField
  id: string
  invalid: boolean
  describedBy?: string
}) {
  const shared = {
    id,
    name: field.name,
    required: Boolean(field.required),
    "aria-invalid": invalid,
    "aria-describedby": describedBy,
  }

  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          {...shared}
          rows={4}
          maxLength={field.max}
          placeholder={field.placeholder}
        />
      )
    case "select":
      return (
        <NativeSelect
          {...shared}
          defaultValue={field.required ? "" : field.options?.[0]}
        >
          {field.required ? (
            <option value="" disabled>
              Choose…
            </option>
          ) : null}
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </NativeSelect>
      )
    case "checkbox":
      return (
        <input
          {...shared}
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 accent-primary"
        />
      )
    case "number":
      return (
        <Input
          {...shared}
          type="number"
          inputMode="numeric"
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
        />
      )
    default:
      return (
        <Input
          {...shared}
          type={field.type}
          autoComplete={field.autoComplete}
          placeholder={field.placeholder}
        />
      )
  }
}
