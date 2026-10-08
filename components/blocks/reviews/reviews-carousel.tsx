import { CarouselTrack } from "@/components/blocks/reviews/carousel-track"
import {
  RatingSummary,
  ReviewCard,
} from "@/components/blocks/reviews/review-card"
import { SectionHeading } from "@/components/blocks/section-heading"
import type { SectionProps } from "@/components/blocks/types"

/** Rating summary, then one sideways-scrolling row of reviews. */
export function ReviewsCarousel({ brand, id }: SectionProps) {
  const { reviews } = brand.content
  if (!reviews) return null

  return (
    <section
      id={id}
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 overflow-hidden px-6 py-20"
    >
      <SectionHeading title={reviews.title} intro={reviews.intro}>
        <RatingSummary reviews={reviews} />
      </SectionHeading>
      <CarouselTrack label="Client reviews">
        {reviews.items.map((review) => (
          <li
            key={`${review.author}-${review.date}`}
            className="flex w-[85%] shrink-0 snap-start sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)]"
          >
            <ReviewCard review={review} />
          </li>
        ))}
      </CarouselTrack>
    </section>
  )
}
