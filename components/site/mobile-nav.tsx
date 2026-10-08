"use client"

import { useState } from "react"
import Link from "next/link"
import { MenuIcon, PhoneIcon } from "lucide-react"
import { BrandMark } from "@/components/site/brand-mark"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { NavLink } from "@/lib/brands"

export function MobileNav({
  name,
  monogram,
  links,
  phone,
}: {
  name: string
  monogram: string
  links: NavLink[]
  phone: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" />}
      >
        <MenuIcon />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader className="border-b p-6">
          <SheetTitle>
            <BrandMark name={name} monogram={monogram} />
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Main" className="px-6">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b py-4 font-heading text-2xl"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SheetFooter className="p-6">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <PhoneIcon data-icon="inline-start" />
            Call {phone}
          </a>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
