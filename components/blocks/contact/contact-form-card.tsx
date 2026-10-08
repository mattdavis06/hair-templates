import { ContactForm } from "@/components/blocks/contact/contact-form"
import type { SectionProps } from "@/components/blocks/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/** Just the contact form, for pages that already show the address and hours elsewhere. */
export function ContactFormCard({ brand, id }: SectionProps) {
  const { forms } = brand.content

  return (
    <section id={id} className="mx-auto w-full max-w-2xl px-6 py-20">
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-3xl">{forms.contact.title}</h2>
          </CardTitle>
          <CardDescription>{forms.contact.intro}</CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm
            brandId={brand.id}
            copy={forms.contact}
            failed={forms.failed}
          />
        </CardContent>
      </Card>
    </section>
  )
}
