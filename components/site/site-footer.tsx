import Link from "next/link"
import { BrandMark } from "@/components/site/brand-mark"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { navLinks, type Brand } from "@/lib/brands"
import { groupOpeningHours } from "@/lib/opening-hours"

export function SiteFooter({ brand }: { brand: Brand }) {
  const { name, tagline, address, phone, email, booking, socials } =
    brand.content
  const links = navLinks(brand)

  return (
    <footer className="border-t bg-muted text-sm">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <BrandMark name={name} monogram={brand.site.monogram} />
          <p className="max-w-xs text-pretty text-muted-foreground">
            {tagline}
          </p>
          {socials.length > 0 ? (
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {socials.map((social) => (
                <li key={social.url}>
                  <a
                    href={social.url}
                    className="underline-offset-4 hover:underline"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg">Visit</h2>
          <address className="flex flex-col gap-1 text-muted-foreground not-italic">
            <span>{address.street}</span>
            <span>
              {address.city} {address.postcode}
            </span>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="mt-2 text-foreground underline-offset-4 hover:underline"
            >
              {phone}
            </a>
            <a
              href={`mailto:${email}`}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {email}
            </a>
          </address>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg">Opening hours</h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            {groupOpeningHours(brand.content.openingHours).map((group) => (
              <div key={group.days} className="contents">
                <dt className="text-muted-foreground">{group.days}</dt>
                <dd className="tabular-nums">{group.hours}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg">Explore</h2>
          <nav aria-label="Footer">
            <ul className="flex flex-col gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href={booking.url}
            className={buttonVariants({ className: "mt-2 self-start" })}
          >
            {booking.label}
          </a>
        </div>
      </div>

      <Separator />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>{name} is a demo brand. Details, prices and reviews are made up.</p>
        <p>
          Website by{" "}
          <a
            href="https://mdavis.dev"
            className="text-foreground underline-offset-4 hover:underline"
          >
            mdavis.dev
          </a>
        </p>
      </div>
    </footer>
  )
}
