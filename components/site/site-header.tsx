import { BrandMark } from '@/components/site/brand-mark'
import { MobileNav } from '@/components/site/mobile-nav'
import { buttonVariants } from '@/components/ui/button'
import { brandHref, navLinks, type Brand } from '@/lib/brands'
import Link from 'next/link'

export function SiteHeader({ brand }: { brand: Brand }) {
  const { name, booking, phone } = brand.content
  const links = navLinks(brand)

  return (
    <header className='sticky top-0 z-40 border-b bg-background/75 backdrop-blur [view-transition-name:site-header] supports-backdrop-filter:bg-background/75'>
      <div className='mx-auto flex h-24 w-full max-w-6xl items-center justify-between gap-6 px-6 md:h-(--header-height)'>
        <Link
          href={brandHref(brand.id)}
          aria-label={`${name} home`}
          className='min-w-0'
        >
          <BrandMark
            name={name}
            monogram={brand.site.monogram}
            logo={brand.site.logo}
            logoClassName='h-auto max-h-[min(var(--logo-header),4rem)] max-w-full md:max-h-(--logo-header)'
          />
        </Link>

        <nav aria-label='Main' className='hidden lg:block'>
          <ul className='flex items-center gap-6 text-sm font-medium'>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className='text-muted-foreground transition-colors hover:text-foreground'
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className='flex shrink-0 items-center gap-2'>
          <a
            href={booking.url}
            className={buttonVariants({
              variant: 'default',
              className: 'capitalize',
            })}
          >
            {booking.label}
          </a>
          <MobileNav
            name={name}
            monogram={brand.site.monogram}
            logo={brand.site.logo}
            links={links}
            phone={phone}
            booking={booking}
          />
        </div>
      </div>
    </header>
  )
}
