import type { SectionWithOptions } from "@/components/blocks/types"

/** The `<h1>` for a sub-page, on a soft wash of the brand's colours. */
export function PageHeaderSimple({
  brand,
  section,
  id,
}: SectionWithOptions<"page-header">) {
  const header = brand.content.pageHeaders?.[section.name]
  if (!header) return null

  return (
    <section
      id={id}
      className="relative isolate overflow-hidden border-b bg-muted/60"
    >
      <div
        aria-hidden
        className="absolute -top-32 right-[-10%] -z-10 size-96 rounded-full bg-secondary/60 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 left-[-5%] -z-10 size-80 rounded-full bg-accent/35 blur-3xl"
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-16 md:py-24">
        {header.eyebrow ? (
          <p className="font-accent text-3xl text-highlight">
            {header.eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-5xl text-balance md:text-7xl">
          {header.title}
        </h1>
        {header.intro ? (
          <p className="max-w-2xl text-lg text-pretty text-muted-foreground md:text-xl">
            {header.intro}
          </p>
        ) : null}
      </div>
    </section>
  )
}
