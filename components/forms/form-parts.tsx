import { CircleAlertIcon, CircleCheckIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { BrandId } from "@/lib/brands/ids"
import { BRAND_FIELD, HONEYPOT_FIELD } from "@/lib/forms/schemas"

/** Brand for the server action, plus an off-screen field only bots fill in. */
export function HiddenFields({ brandId }: { brandId: BrandId }) {
  return (
    <>
      <input type="hidden" name={BRAND_FIELD} value={brandId} />
      <div
        aria-hidden
        className="absolute -left-[9999px] size-px overflow-hidden"
      >
        <label>
          Company
          <input
            type="text"
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>
    </>
  )
}

export function SubmitButton({
  isPending,
  children,
  ...props
}: ComponentProps<typeof Button> & { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending} aria-busy={isPending} {...props}>
      {isPending ? <Spinner data-icon="inline-start" /> : null}
      {children}
    </Button>
  )
}

export function FormAlert({
  variant,
  title,
  description,
  children,
}: {
  variant: "success" | "error"
  title: string
  description: string
  children?: ReactNode
}) {
  const Icon = variant === "success" ? CircleCheckIcon : CircleAlertIcon
  return (
    <Alert variant={variant === "error" ? "destructive" : "default"}>
      <Icon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{description}</p>
        {children}
      </AlertDescription>
    </Alert>
  )
}
