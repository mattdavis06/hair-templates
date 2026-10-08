import { CheckIcon } from "lucide-react"
import { EnquiryForm } from "@/components/blocks/enquiry/enquiry-form"
import type { SectionWithOptions } from "@/components/blocks/types"
import { BrandImage } from "@/components/site/brand-image"
import { Card, CardContent } from "@/components/ui/card"
import { enquiryFields } from "@/lib/forms/enquiries"

/** Why to get in touch on one side, the enquiry form named by `form` on the other. */
export function EnquirySplit({
  brand,
  section,
  id,
}: SectionWithOptions<"enquiry">) {
  const copy = brand.content.enquiries?.[section.form]
  if (!copy) return null

  return (
    <section
      id={id}
      className="mx-auto grid w-full max-w-6xl items-start gap-12 px-6 py-20 lg:grid-cols-[2fr_3fr]"
    >
      <div className="flex flex-col gap-8 lg:sticky lg:top-24">
        <div className="flex flex-col gap-3">
          <h2 className="text-5xl text-balance">{copy.title}</h2>
          <p className="text-lg text-pretty text-muted-foreground">
            {copy.intro}
          </p>
        </div>
        {copy.points.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {copy.points.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground">
                  <CheckIcon aria-hidden className="size-3.5" />
                </span>
                <span className="text-pretty">{point}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {copy.image ? (
          <div className="relative hidden aspect-4/3 overflow-hidden rounded-lg bg-muted lg:block">
            <BrandImage image={copy.image} sizes="420px" />
          </div>
        ) : null}
      </div>

      <Card>
        <CardContent>
          <EnquiryForm
            brandId={brand.id}
            kind={section.form}
            fields={enquiryFields(section.form, brand.content)}
            copy={{ submit: copy.submit, success: copy.success }}
            failed={brand.content.forms.failed}
          />
        </CardContent>
      </Card>
    </section>
  )
}
