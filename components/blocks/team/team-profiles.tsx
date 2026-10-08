import { SectionHeading } from "@/components/blocks/section-heading"
import { MemberPortrait } from "@/components/blocks/team/member-portrait"
import type { SectionProps } from "@/components/blocks/types"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** One row per person, alternating sides: for a dedicated team page. */
export function TeamProfiles({ brand, id }: SectionProps) {
  const { team, booking, services } = brand.content
  if (!team) return null
  const levelName = (levelId?: string) =>
    services?.levels?.find((level) => level.id === levelId)?.name

  return (
    <section
      id={id}
      className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-20"
    >
      <SectionHeading title={team.title} intro={team.intro} />
      <ul className="flex flex-col gap-16 md:gap-24">
        {team.members.map((member, index) => {
          const level = levelName(member.level)
          return (
            <li
              key={member.name}
              className="grid items-center gap-8 md:grid-cols-[2fr_3fr] md:gap-16"
            >
              <MemberPortrait
                member={member}
                sizes="(min-width: 1152px) 420px, (min-width: 768px) 40vw, 100vw"
                className={cn(index % 2 === 1 && "md:order-last")}
              />
              <div className="flex flex-col items-start gap-5">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-highlight">
                    {member.role}
                  </p>
                  <h3 className="text-4xl md:text-5xl">{member.name}</h3>
                  {level && level !== member.role ? (
                    <p className="text-sm text-muted-foreground">
                      Priced at {level} level
                    </p>
                  ) : null}
                </div>
                {member.bio ? (
                  <p className="max-w-xl text-lg text-pretty text-muted-foreground">
                    {member.bio}
                  </p>
                ) : null}
                {member.specialities.length > 0 ? (
                  <ul
                    className="flex flex-wrap gap-2"
                    aria-label="Specialities"
                  >
                    {member.specialities.map((speciality) => (
                      <li key={speciality}>
                        <Badge variant="secondary">{speciality}</Badge>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <a
                  href={member.bookingUrl ?? booking.url}
                  className={buttonVariants({ variant: "outline" })}
                >
                  Book with {member.name.split(" ")[0]}
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
