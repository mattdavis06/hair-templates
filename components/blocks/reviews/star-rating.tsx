import { StarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

/** Five stars, filled to the nearest whole star; read out as "4.9 out of 5 stars". */
export function StarRating({
  rating,
  className,
}: {
  rating: number
  className?: string
}) {
  const filled = Math.round(rating)

  return (
    <span
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className={cn("flex gap-0.5 text-highlight", className)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          aria-hidden
          className={cn(
            "size-4",
            star <= filled ? "fill-current" : "text-muted-foreground/40"
          )}
        />
      ))}
    </span>
  )
}
