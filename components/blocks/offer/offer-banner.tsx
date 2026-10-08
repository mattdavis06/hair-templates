import type { SectionProps } from "@/components/blocks/types"
import { buttonVariants } from "@/components/ui/button"
import { contentHref } from "@/lib/brands"

/** A coloured panel for one promotion, e.g. a new-client discount. */
export function OfferBanner({ brand, id }: SectionProps) {
  const { offer } = brand.content
  if (!offer) return null

  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="relative isolate overflow-hidden rounded-[calc(var(--radius)*2)] bg-secondary px-6 py-10 text-secondary-foreground md:px-12 md:py-14">
        <div
          aria-hidden
          className="absolute -top-24 -right-16 -z-10 size-72 rounded-full bg-accent/60 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-28 left-1/3 -z-10 size-72 rounded-full bg-primary/25 blur-3xl"
        />
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="font-accent text-3xl">{offer.eyebrow}</p>
            <h2 className="text-4xl text-balance md:text-5xl">{offer.title}</h2>
            <p className="text-lg text-pretty">{offer.body}</p>
            {offer.terms ? (
              <p className="text-sm text-secondary-foreground/75">
                {offer.terms}
              </p>
            ) : null}
          </div>
          <a
            href={contentHref(brand, offer.link.href)}
            className={buttonVariants({ size: "lg", className: "self-start" })}
          >
            {offer.link.label}
          </a>
        </div>
      </div>
    </section>
  )
}
