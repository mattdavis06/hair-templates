import { ScissorsIcon } from "lucide-react"
import type { SectionProps } from "@/components/blocks/types"
import { Card } from "@/components/ui/card"

/** A picture of the shop's stamp card next to how it works. */
export function LoyaltyCard({ brand, id }: SectionProps) {
  const { loyalty } = brand.content
  if (!loyalty) return null
  const boxes = Array.from({ length: loyalty.stamps }, (_, i) => i + 1)

  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-6 py-20">
      <Card className="grid gap-10 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
        <div className="flex max-w-md flex-col gap-3">
          <h2 className="text-5xl">{loyalty.title}</h2>
          <p className="text-lg text-pretty text-muted-foreground">
            {loyalty.description}
          </p>
          {loyalty.terms ? (
            <p className="text-sm text-pretty text-muted-foreground">
              {loyalty.terms}
            </p>
          ) : null}
        </div>

        <ol
          role="img"
          aria-label={`Stamp card with ${loyalty.stamps} boxes; the last one is a ${loyalty.reward.toLowerCase()}`}
          className="grid grid-cols-5 gap-3"
        >
          {boxes.map((box) =>
            box === loyalty.stamps ? (
              <li
                key={box}
                className="flex size-14 items-center justify-center rounded-full bg-primary p-1 text-center text-[0.65rem] leading-tight font-semibold text-primary-foreground uppercase"
              >
                {loyalty.reward}
              </li>
            ) : (
              <li
                key={box}
                className="flex size-14 items-center justify-center rounded-full border-2 border-dashed text-muted-foreground"
              >
                <ScissorsIcon className="size-5" />
              </li>
            )
          )}
        </ol>
      </Card>
    </section>
  )
}
