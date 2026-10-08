import { ContactForm } from "@/components/blocks/contact/contact-form"
import { HoursList } from "@/components/blocks/opening-hours/hours-list"
import { OpenStatus } from "@/components/blocks/opening-hours/open-status"
import type { SectionProps } from "@/components/blocks/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ContactSplit({ brand, id }: SectionProps) {
  const { address, phone, email, openingHours, forms } = brand.content

  return (
    <section
      id={id}
      className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 md:grid-cols-2"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-4xl">Visit us</h2>
          <address className="flex flex-col gap-1 not-italic">
            <span>{address.street}</span>
            <span>
              {address.city} {address.postcode}
            </span>
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="mt-2">
              {phone}
            </a>
            <a href={`mailto:${email}`}>{email}</a>
          </address>
        </div>
        <div className="flex max-w-sm flex-col gap-4">
          <h3 className="text-2xl">Opening hours</h3>
          <OpenStatus hours={openingHours} />
          <HoursList hours={openingHours} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-2xl">{forms.contact.title}</h2>
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
