import type { SectionProps } from "@/components/blocks/types"
import { BrandImage } from "@/components/site/brand-image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatPrice } from "@/lib/format"

/** Products sold in the shop; photos are optional. */
export function ProductsGrid({ brand, id }: SectionProps) {
  const { products } = brand.content
  if (!products) return null

  return (
    <section
      id={id}
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="text-5xl">{products.title}</h2>
          <p className="text-lg text-pretty text-muted-foreground">
            {products.intro}
          </p>
        </div>
        {products.note ? (
          <p className="text-sm text-muted-foreground">{products.note}</p>
        ) : null}
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.items.map((product) => (
          <li key={product.name} className="flex">
            <Card className="flex-1 overflow-hidden pt-0">
              {product.image ? (
                <div className="relative aspect-square bg-muted">
                  <BrandImage
                    image={product.image}
                    sizes="(min-width: 1024px) 264px, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
              ) : null}
              <CardContent className="flex flex-1 flex-col gap-1 pt-6">
                {product.brand ? (
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {product.brand}
                  </p>
                ) : null}
                <h3 className="text-2xl">{product.name}</h3>
                {product.description ? (
                  <p className="text-sm text-pretty text-muted-foreground">
                    {product.description}
                  </p>
                ) : null}
              </CardContent>
              <CardFooter className="justify-between text-sm">
                <span className="text-muted-foreground">{product.size}</span>
                <span className="font-heading text-2xl tabular-nums">
                  {formatPrice(product.price)}
                </span>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}
