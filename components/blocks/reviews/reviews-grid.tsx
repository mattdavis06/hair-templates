import { StarRating } from "@/components/blocks/reviews/star-rating"
import type { SectionProps } from "@/components/blocks/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatMonthYear } from "@/lib/format"

/** Rating summary beside the heading, then review cards. */
export function ReviewsGrid({ brand, id }: SectionProps) {
  const { reviews } = brand.content
  if (!reviews) return null
  const { rating, source } = reviews

  return (
    <section
      id={id}
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20"
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="text-5xl">{reviews.title}</h2>
          <p className="text-lg text-pretty text-muted-foreground">
            {reviews.intro}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="font-heading text-6xl leading-none tabular-nums">
            {rating.average.toFixed(1)}
          </p>
          <div className="flex flex-col gap-1">
            <StarRating rating={rating.average} />
            <a
              href={source.url}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {rating.count} {source.name} reviews
            </a>
          </div>
        </div>
      </div>

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.items.map((review) => (
          <li key={`${review.author}-${review.date}`} className="flex">
            <Card className="flex-1">
              <CardContent className="flex flex-1 flex-col gap-4">
                <StarRating rating={review.rating} />
                <blockquote className="text-pretty">“{review.text}”</blockquote>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-0.5 text-sm">
                <span className="font-medium">{review.author}</span>
                <span className="text-muted-foreground">
                  {review.service ? `${review.service} · ` : null}
                  <time dateTime={review.date}>
                    {formatMonthYear(review.date)}
                  </time>
                </span>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}
