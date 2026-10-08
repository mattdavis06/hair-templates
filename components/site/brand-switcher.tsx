"use client"

import { PanelsTopLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { brandHref, type BrandId } from "@/lib/brands/ids"

export type BrandOption = {
  id: BrandId
  name: string
  summary: string
  paths: string[]
}

/** Demo-only control for flicking between brands on the same page. */
export function BrandSwitcher({
  brands,
  current,
}: {
  brands: BrandOption[]
  current: BrandId
}) {
  const currentBrand = brands.find((brand) => brand.id === current)

  function switchTo(value: BrandId) {
    const target = brands.find((brand) => brand.id === value)
    if (!target || value === current) return
    const { pathname } = window.location
    // Brands have different pages, so fall back to home when this one is missing.
    const path = target.paths.includes(pathname) ? pathname : "/"
    window.location.assign(brandHref(value, path))
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="secondary" size="lg" className="shadow-lg" />
          }
        >
          <PanelsTopLeftIcon data-icon="inline-start" />
          {currentBrand?.name ?? "Switch brand"}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="w-64">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Demo brand</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={current}
              onValueChange={(value: BrandId) => switchTo(value)}
            >
              {brands.map((brand) => (
                <DropdownMenuRadioItem key={brand.id} value={brand.id}>
                  <span className="flex flex-col">
                    <span className="font-medium">{brand.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {brand.summary}
                    </span>
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
