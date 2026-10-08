import { StarRating } from "@/components/blocks/reviews/star-rating"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Content } from "@/content/schema"
import { formatMonthYear } from "@/lib/format"

type Reviews = NonNullable<Content["reviews"]>

export function ReviewCard({ review }: { review: Reviews["items"][number] }) {
  return (
    <Card className="flex-1">
      <CardContent className="flex flex-1 flex-col gap-4">
        <StarRating rating={review.rating} />
        <blockquote className="text-pretty">“{review.text}”</blockquote>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-0.5 text-sm">
        <span className="font-medium">{review.author}</span>
        <span className="text-muted-foreground">
          {review.service ? `${review.service} · ` : null}
          <time dateTime={review.date}>{formatMonthYear(review.date)}</time>
        </span>
      </CardFooter>
    </Card>
  )
}

/** The big average score with a link to every review at the source. */
export function RatingSummary({ reviews }: { reviews: Reviews }) {
  const { rating, source } = reviews
  return (
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
  )
}
