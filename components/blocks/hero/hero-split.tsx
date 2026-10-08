import { OpenStatus } from "@/components/blocks/opening-hours/open-status"
import { StarRating } from "@/components/blocks/reviews/star-rating"
import type { SectionProps } from "@/components/blocks/types"
import { BrandImage } from "@/components/site/brand-image"
import { buttonVariants } from "@/components/ui/button"
import { contentHref } from "@/lib/brands"

/** Words and buttons on one side, a large photo on the other; stacks on phones. */
export function HeroSplit({ brand, id }: SectionProps) {
  const { name, tagline, strapline, booking, openingHours, hero, reviews } =
    brand.content
  if (!hero) return null

  return (
    <section
      id={id}
      className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pt-10 pb-20 md:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-28"
    >
      <div className="flex flex-col items-start gap-6">
        <OpenStatus hours={openingHours} />
        <div className="flex flex-col gap-2">
          <p className="font-accent text-3xl text-highlight md:text-4xl">
            {strapline}
          </p>
          <h1 className="text-6xl text-balance md:text-7xl lg:text-8xl">
            {name}
          </h1>
        </div>
        <p className="max-w-lg text-lg text-pretty text-muted-foreground md:text-xl">
          {tagline}
        </p>
        <div className="flex flex-wrap gap-3">
          <a href={booking.url} className={buttonVariants({ size: "lg" })}>
            {booking.label}
          </a>
          {hero.secondary ? (
            <a
              href={contentHref(brand, hero.secondary.href)}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              {hero.secondary.label}
            </a>
          ) : null}
        </div>
        {reviews ? (
          <a
            href={reviews.source.url}
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
          >
            <StarRating rating={reviews.rating.average} />
            <span>
              <span className="font-medium text-foreground">
                {reviews.rating.average.toFixed(1)}
              </span>{" "}
              from {reviews.rating.count} {reviews.source.name} reviews
            </span>
          </a>
        ) : null}
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-3 translate-x-4 translate-y-4 rounded-[calc(var(--radius)*2)] bg-secondary md:-inset-4 md:translate-x-6 md:translate-y-6"
        />
        <div className="relative aspect-4/5 overflow-hidden rounded-[calc(var(--radius)*2)] bg-muted sm:aspect-4/3 lg:aspect-4/5">
          <BrandImage
            image={hero.image}
            sizes="(min-width: 1152px) 512px, (min-width: 1024px) 45vw, 100vw"
            preload
          />
        </div>
      </div>
    </section>
  )
}
