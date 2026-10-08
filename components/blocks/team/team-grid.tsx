import type { SectionProps } from "@/components/blocks/types"
import { BrandImage } from "@/components/site/brand-image"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"

/** Barber or stylist cards with a portrait and a "Book with…" link each. */
export function TeamGrid({ brand, id }: SectionProps) {
  const { team, booking } = brand.content
  if (!team) return null

  return (
    <section
      id={id}
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20"
    >
      <div className="flex max-w-2xl flex-col gap-3">
        <h2 className="text-5xl">{team.title}</h2>
        <p className="text-lg text-pretty text-muted-foreground">
          {team.intro}
        </p>
      </div>

      <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {team.members.map((member) => (
          <li key={member.name} className="flex flex-col gap-5">
            <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-muted">
              <BrandImage
                image={member.image}
                sizes="(min-width: 1024px) 352px, (min-width: 640px) 50vw, 100vw"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-3xl">{member.name}</h3>
              <p className="text-sm font-medium text-highlight">
                {member.role}
              </p>
              {member.bio ? (
                <p className="text-pretty text-muted-foreground">
                  {member.bio}
                </p>
              ) : null}
            </div>
            {member.specialities.length > 0 ? (
              <ul className="flex flex-wrap gap-2" aria-label="Specialities">
                {member.specialities.map((speciality) => (
                  <li key={speciality}>
                    <Badge variant="outline">{speciality}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
            <a
              href={member.bookingUrl ?? booking.url}
              className={buttonVariants({
                variant: "outline",
                className: "mt-auto self-start",
              })}
            >
              Book with {member.name.split(" ")[0]}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
