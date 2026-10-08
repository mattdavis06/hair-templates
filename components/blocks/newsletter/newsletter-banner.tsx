import { NewsletterForm } from "@/components/blocks/newsletter/newsletter-form"
import type { SectionProps } from "@/components/blocks/types"

export function NewsletterBanner({ brand, id }: SectionProps) {
  const { forms } = brand.content

  return (
    <section id={id} className="bg-muted">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
        <div className="flex max-w-md flex-col gap-2">
          <h2 className="text-3xl">{forms.newsletter.title}</h2>
          <p className="text-pretty text-muted-foreground">
            {forms.newsletter.intro}
          </p>
        </div>
        <div className="w-full md:max-w-md">
          <NewsletterForm
            brandId={brand.id}
            copy={forms.newsletter}
            failed={forms.failed}
          />
        </div>
      </div>
    </section>
  )
}
