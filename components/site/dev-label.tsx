import type { ReactNode } from 'react'

/** Dev-only labels marking UI more than one brand uses. */
export const showDevLabels = process.env.NODE_ENV === 'development'

/** Marks shared UI: restyling it changes every brand that uses it. */
export function DevLabel({ children }: { children: ReactNode }) {
  if (!showDevLabels) return null
  return (
    <p className='mx-auto w-full max-w-6xl px-6 pt-4'>
      <span className='inline-block bg-red-600 px-2 py-0.5 font-mono text-xs text-white'>
        {children}
      </span>
    </p>
  )
}
