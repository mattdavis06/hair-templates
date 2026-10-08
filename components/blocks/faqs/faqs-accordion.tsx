import type { SectionProps } from "@/components/blocks/types"
import { JsonLd } from "@/components/seo/json-ld"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqJsonLd } from "@/lib/seo/structured-data"

/** Heading on the left, questions on the right; adds FAQPage structured data. */
export function FaqsAccordion({ brand, id }: SectionProps) {
  const { faqs } = brand.content
  if (!faqs) return null

  return (
    <section
      id={id}
      className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1fr_2fr] md:gap-16"
    >
      <JsonLd data={faqJsonLd(faqs)} />
      <div className="flex flex-col gap-3">
        <h2 className="text-5xl">{faqs.title}</h2>
        {faqs.intro ? (
          <p className="text-pretty text-muted-foreground">{faqs.intro}</p>
        ) : null}
      </div>
      <Accordion className="border-y">
        {faqs.items.map((item) => (
          <AccordionItem key={item.question}>
            <AccordionTrigger className="py-4 text-base">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-base text-pretty text-muted-foreground">
              <p>{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
