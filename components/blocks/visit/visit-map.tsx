import { HoursList } from "@/components/blocks/opening-hours/hours-list"
import { OpenStatus } from "@/components/blocks/opening-hours/open-status"
import type { SectionProps } from "@/components/blocks/types"
import { MapEmbed } from "@/components/blocks/visit/map-embed"
import { buttonVariants } from "@/components/ui/button"
import { directionsUrl, mapEmbedUrl } from "@/lib/maps"

/** Address, hours and getting-here notes beside a click-to-load Google map. */
export function VisitMap({ brand, id }: SectionProps) {
  const { content } = brand
  const { visit, address, phone, openingHours, name } = content
  if (!visit) return null
  const fullAddress = `${address.street}, ${address.city} ${address.postcode}`

  return (
    <section
      id={id}
      className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 md:grid-cols-2"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-5xl">{visit.title}</h2>
          {visit.intro ? (
            <p className="text-lg text-pretty text-muted-foreground">
              {visit.intro}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <address className="flex flex-col gap-1 not-italic">
            <span>{address.street}</span>
            <span>
              {address.city} {address.postcode}
            </span>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="mt-1 underline-offset-4 hover:underline"
            >
              {phone}
            </a>
          </address>
          <a
            href={directionsUrl(content)}
            className={buttonVariants({ className: "self-start" })}
          >
            Get directions
          </a>
        </div>

        <div className="flex max-w-sm flex-col gap-4">
          <h3 className="text-2xl">Opening hours</h3>
          <OpenStatus hours={openingHours} />
          <HoursList hours={openingHours} />
        </div>

        {visit.notes.length > 0 ? (
          <dl className="grid gap-6 sm:grid-cols-2">
            {visit.notes.map((note) => (
              <div key={note.title} className="flex flex-col gap-1">
                <dt className="font-medium">{note.title}</dt>
                <dd className="text-sm text-pretty text-muted-foreground">
                  {note.body}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      <MapEmbed
        src={mapEmbedUrl(content)}
        title={`Map showing ${name}`}
        address={fullAddress}
        className="md:h-full"
      />
    </section>
  )
}
