import { cn } from '@/lib/utils'
import type { CSSProperties } from 'react'

const PRIMARY = 'var(--primary)'
const SECONDARY = 'var(--secondary)'
const ACCENT = 'var(--accent)'

/**
 * A 3×3 grid of blobs across the screen, no two neighbours the same colour.
 * `x` / `y` are where each blob's centre sits on screen.
 */
const BLOBS = [
  // top row
  {
    x: '15vw',
    y: '12vh',
    color: PRIMARY,
    strength: '45%',
    animate: 'animate-drift-a',
  },
  {
    x: '50vw',
    y: '8vh',
    color: SECONDARY,
    strength: '65%',
    animate: 'animate-drift-b [animation-delay:-20s]',
  },
  {
    x: '85vw',
    y: '15vh',
    color: ACCENT,
    strength: '50%',
    animate: 'animate-drift-c',
  },
  // middle row
  {
    x: '18vw',
    y: '50vh',
    color: ACCENT,
    strength: '50%',
    animate: 'animate-drift-b',
  },
  {
    x: '50vw',
    y: '50vh',
    color: PRIMARY,
    strength: '30%',
    animate: 'animate-drift-c [animation-delay:-25s]',
  },
  {
    x: '82vw',
    y: '52vh',
    color: SECONDARY,
    strength: '65%',
    animate: 'animate-drift-a [animation-delay:-15s]',
  },
  // bottom row
  {
    x: '15vw',
    y: '88vh',
    color: SECONDARY,
    strength: '65%',
    animate: 'animate-drift-c [animation-delay:-10s]',
  },
  {
    x: '50vw',
    y: '92vh',
    color: ACCENT,
    strength: '50%',
    animate: 'animate-drift-a [animation-delay:-30s]',
  },
  {
    x: '85vw',
    y: '88vh',
    color: PRIMARY,
    strength: '45%',
    animate: 'animate-drift-b [animation-delay:-40s]',
  },
]

/** Blob diameter. Each blob is offset by half of this so `x` / `y` is its centre. */
const SIZE = '56vmax'

/**
 * Each blob is a radial gradient that already fades to transparent, so no
 * blur filter is needed (filters on a fixed full-screen layer make scrolling janky).
 */
const blob = (
  x: string,
  y: string,
  color: string,
  strength: string
): CSSProperties => ({
  width: SIZE,
  height: SIZE,
  left: `calc(${x} - ${SIZE} / 2)`,
  top: `calc(${y} - ${SIZE} / 2)`,
  background: `radial-gradient(circle at center, color-mix(in srgb, ${color} ${strength}, transparent) 0%, transparent 50%)`,
})

/** Faint brand-coloured blobs fixed behind the page; content scrolls over them. */
export function BrandBackdrop() {
  return (
    <div
      aria-hidden
      className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'
    >
      {BLOBS.map(({ x, y, color, strength, animate }) => (
        <div
          key={`${x}-${y}`}
          style={blob(x, y, color, strength)}
          className={cn(
            'absolute rounded-full motion-reduce:animate-none',
            animate
          )}
        />
      ))}
    </div>
  )
}
