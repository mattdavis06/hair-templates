import type { SectionProps } from "@/components/blocks/types"

/** Short house rules in a compact grid: cancellations, late arrivals, payment… */
export function PoliciesList({ brand, id }: SectionProps) {
  const { policies } = brand.content
  if (!policies) return null

  return (
    <section id={id} className="border-y bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="flex max-w-2xl flex-col gap-2">
          <h2 className="text-3xl">{policies.title}</h2>
          {policies.intro ? (
            <p className="text-pretty text-muted-foreground">
              {policies.intro}
            </p>
          ) : null}
        </div>
        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {policies.items.map((policy) => (
            <div key={policy.title} className="flex flex-col gap-1">
              <dt className="font-medium">{policy.title}</dt>
              <dd className="text-sm text-pretty text-muted-foreground">
                {policy.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
