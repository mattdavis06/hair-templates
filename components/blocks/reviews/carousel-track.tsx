"use client"

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

type Edges = { start: boolean; end: boolean }

/**
 * A row that scrolls sideways with snap points: swipe on touch, arrow buttons
 * elsewhere. Children must be `<li>`s; without JS it's still a scrollable list.
 */
export function CarouselTrack({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState<Edges>({ start: true, end: false })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0

    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = track.scrollWidth - track.clientWidth
        const next = {
          start: track.scrollLeft <= 1,
          end: track.scrollLeft >= max - 1,
        }
        setEdges((prev) =>
          prev.start === next.start && prev.end === next.end ? prev : next
        )
      })
    }

    update()
    track.addEventListener("scroll", update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(track)
    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener("scroll", update)
      observer.disconnect()
    }
  }, [])

  function scrollByPage(direction: 1 | -1) {
    const track = trackRef.current
    if (!track) return
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    track.scrollBy({
      left: direction * track.clientWidth * 0.9,
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <ul
        ref={trackRef}
        aria-label={label}
        // Focusable so keyboard users can scroll it with the arrow keys.
        tabIndex={0}
        className="-mx-6 flex snap-x snap-mandatory scroll-px-6 [scrollbar-width:none] gap-6 overflow-x-auto px-6 pb-2 outline-offset-4 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="icon-lg"
          onClick={() => scrollByPage(-1)}
          disabled={edges.start}
          aria-label="Previous reviews"
        >
          <ArrowLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon-lg"
          onClick={() => scrollByPage(1)}
          disabled={edges.end}
          aria-label="Next reviews"
        >
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  )
}
