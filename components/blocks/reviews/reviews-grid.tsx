import {
  RatingSummary,
  ReviewCard,
} from '@/components/blocks/reviews/review-card'
import { SectionHeading } from '@/components/blocks/section-heading'
import type { SectionProps } from '@/components/blocks/types'

/** Rating summary beside the heading, then review cards. */
export function ReviewsGrid({ brand, id }: SectionProps) {
  const { reviews } = brand.content
  if (!reviews) return null

  return (
    <section
      id={id}
      className='mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20'
    >
      <SectionHeading title={reviews.title} intro={reviews.intro}>
        <RatingSummary reviews={reviews} />
      </SectionHeading>

      <ul className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {reviews.items.map((review) => (
          <li key={`${review.author}-${review.date}`} className='flex'>
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
    </section>
  )
}
