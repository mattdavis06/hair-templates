"use client"

import { useState } from "react"
import { MapPinIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Click-to-load Google map. Nothing is fetched from Google (and no cookies are
 * set) until the visitor asks for the map, which also keeps the page fast.
 */
export function MapEmbed({
  src,
  title,
  address,
  className,
}: {
  src: string
  title: string
  address: string
  className?: string
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={cn(
        "relative min-h-80 overflow-hidden rounded-lg border bg-muted",
        className
      )}
    >
      {loaded ? (
        // react-doctor-disable-next-line react-doctor/iframe-missing-sandbox -- cross-origin (google.com), so allow-same-origin can't reach this page; Maps needs scripts + its own storage
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 size-full"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[20px_20px] p-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MapPinIcon aria-hidden />
          </span>
          <p className="max-w-xs font-medium text-pretty">{address}</p>
          <Button variant="outline" onClick={() => setLoaded(true)}>
            Show map
          </Button>
          <p className="max-w-xs text-xs text-pretty text-muted-foreground">
            Loads Google Maps, which may set cookies.
          </p>
        </div>
      )}
    </div>
  )
}
