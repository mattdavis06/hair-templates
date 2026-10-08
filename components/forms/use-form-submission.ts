"use client"

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react"
import type * as z from "zod/mini"
import {
  ELAPSED_FIELD,
  readFields,
  validate,
  type FieldErrors,
  type FormState,
} from "@/lib/forms/schemas"

type FormAction<F extends string> = (
  prev: FormState<F>,
  formData: FormData
) => Promise<FormState<F>>

const IDLE = { status: "idle" } as const

/**
 * Validates on the client for instant feedback, then submits to the server
 * action. Forms keep `action={formAction}` so they still post without JS.
 */
export function useFormSubmission<F extends string, T>({
  action,
  schema,
  fields,
}: {
  action: FormAction<F>
  schema: z.ZodMiniType<T>
  fields: readonly F[]
}) {
  const [serverState, formAction, isPending] = useActionState<
    FormState<F>,
    FormData
  >(action, IDLE)
  const [clientErrors, setClientErrors] = useState<FieldErrors<F> | null>(null)
  // A server result the visitor has moved past (edited a field, or chose "send another").
  const [dismissed, setDismissed] = useState<FormState<F> | null>(null)
  const mountedAt = useRef(0)

  useEffect(() => {
    mountedAt.current = performance.now()
  }, [])

  const state: FormState<F> = serverState === dismissed ? IDLE : serverState
  const fieldErrors: FieldErrors<F> =
    clientErrors ?? (state.status === "invalid" ? state.fieldErrors : {})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const result = validate(schema, readFields(formData, fields))
    if (!result.success) {
      setClientErrors(result.fieldErrors)
      const firstInvalid = fields.find((field) => result.fieldErrors[field])
      const element = firstInvalid && form.elements.namedItem(firstInvalid)
      if (element instanceof HTMLElement) element.focus()
      return
    }

    setClientErrors(null)
    formData.set(
      ELAPSED_FIELD,
      String(Math.round(performance.now() - mountedAt.current))
    )
    startTransition(() => formAction(formData))
  }

  function clearErrors() {
    if (clientErrors) setClientErrors(null)
    if (serverState.status !== "idle") setDismissed(serverState)
  }

  function reset() {
    setClientErrors(null)
    setDismissed(serverState)
    mountedAt.current = performance.now()
  }

  return {
    formAction,
    handleSubmit,
    clearErrors,
    reset,
    isPending,
    isSuccess: state.status === "success",
    isFailed: state.status === "failed",
    fieldErrors,
  }
}
