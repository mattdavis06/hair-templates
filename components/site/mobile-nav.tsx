'use client'

import { BrandMark } from '@/components/site/brand-mark'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { Site } from '@/content/schema'
import type { NavLink } from '@/lib/brands'
import { MenuIcon, PhoneIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function MobileNav({
  name,
  monogram,
  logo,
  links,
  phone,
  booking,
}: {
  name: string
  monogram: string
  logo?: Site['logo']
  links: NavLink[]
  phone: string
  booking: { url: string; label: string }
}) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant='ghost' size='icon' className='lg:hidden' />}
      >
        <MenuIcon />
        <span className='sr-only'>Open menu</span>
      </SheetTrigger>
      <SheetContent side='left' showCloseButton={false}>
        <SheetHeader className='flex-row items-center justify-between gap-4 border-b p-6'>
          <SheetTitle>
            <BrandMark
              name={name}
              monogram={monogram}
              logo={logo}
              logoClassName='h-12'
            />
          </SheetTitle>
          <SheetClose
            render={
              <Button
                variant='ghost'
                size='icon'
                className='shrink-0 cursor-pointer transition-colors hover:text-primary'
              />
            }
          >
            <XIcon />
            <span className='sr-only'>Close menu</span>
          </SheetClose>
        </SheetHeader>
        <nav aria-label='Main' className='px-6'>
          <ul className='flex flex-col'>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className='block border-b py-4 font-heading text-2xl transition-colors hover:text-primary'
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SheetFooter className='p-6'>
          <a
            href={booking.url}
            className={buttonVariants({
              variant: 'default',
              className: 'capitalize',
            })}
          >
            {booking.label}
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, '')}`}
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            <PhoneIcon data-icon='inline-start' />
            Call {phone}
          </a>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
