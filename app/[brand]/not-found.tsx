import Link from "next/link"
import { brand as brandParam } from "next/root-params"
import { buttonVariants } from "@/components/ui/button"
import { brandHref, getBrand } from "@/lib/brands"

export default async function NotFound() {
  const brand = getBrand((await brandParam()) ?? "")

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-32 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="text-4xl">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        That page doesn&apos;t exist at {brand.content.name}. Head back to the
        home page and take it from there.
      </p>
      <Link href={brandHref(brand.id)} className={buttonVariants()}>
        Back to home
      </Link>
    </section>
  )
}
