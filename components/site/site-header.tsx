import Link from "next/link"
import { BrandMark } from "@/components/site/brand-mark"
import { MobileNav } from "@/components/site/mobile-nav"
import { buttonVariants } from "@/components/ui/button"
import { brandHref, navLinks, type Brand } from "@/lib/brands"

export function SiteHeader({ brand }: { brand: Brand }) {
  const { name, booking, phone } = brand.content
  const links = navLinks(brand)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-6">
        <Link href={brandHref(brand.id)} aria-label={`${name} home`}>
          <BrandMark name={name} monogram={brand.site.monogram} />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={booking.url} className={buttonVariants()}>
            {booking.label}
          </a>
          <MobileNav
            name={name}
            monogram={brand.site.monogram}
            links={links}
            phone={phone}
          />
        </div>
      </div>
    </header>
  )
}
