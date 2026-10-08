import { GiftIcon } from "lucide-react"
import { SectionHeading } from "@/components/blocks/section-heading"
import type { SectionProps } from "@/components/blocks/types"
import { buttonVariants } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"

/** Voucher values drawn as gift cards, with one link to where they're bought. */
export function VouchersCards({ brand, id }: SectionProps) {
  const { vouchers, name } = brand.content
  if (!vouchers) return null
  const { monogram } = brand.site

  return (
    <section
      id={id}
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20"
    >
      <SectionHeading title={vouchers.title} intro={vouchers.intro} />

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {vouchers.amounts.map((amount) => (
          <li
            key={amount}
            className="relative isolate flex aspect-8/5 flex-col justify-between overflow-hidden rounded-[calc(var(--radius)*1.5)] bg-primary p-5 text-primary-foreground shadow-sm"
          >
            <div
              aria-hidden
              className="absolute -top-10 -right-10 -z-10 size-40 rounded-full bg-secondary/50 blur-2xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-16 -left-8 -z-10 size-40 rounded-full bg-accent/40 blur-2xl"
            />
            <div className="flex items-start justify-between">
              <span
                aria-hidden
                className="font-heading text-lg tracking-widest opacity-90"
              >
                {monogram}
              </span>
              <span className="font-accent text-2xl leading-none">
                Gift voucher
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-5xl leading-none tabular-nums">
                {formatPrice(amount)}
              </span>
              <span className="text-xs opacity-80">{name}</span>
            </div>
          </li>
        ))}
        {vouchers.custom ? (
          <li className="flex aspect-8/5 flex-col items-start justify-between rounded-[calc(var(--radius)*1.5)] border-2 border-dashed border-primary/40 bg-card p-5">
            <GiftIcon aria-hidden className="size-6 text-highlight" />
            <span className="font-heading text-2xl text-balance">
              {vouchers.custom}
            </span>
          </li>
        ) : null}
      </ul>

      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        {vouchers.terms.length > 0 ? (
          <ul className="flex max-w-2xl list-disc flex-col gap-1 pl-5 text-sm text-pretty text-muted-foreground">
            {vouchers.terms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        ) : null}
        <a
          href={vouchers.url}
          className={buttonVariants({ size: "lg", className: "self-start" })}
        >
          {vouchers.label}
        </a>
      </div>
    </section>
  )
}
