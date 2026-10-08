import { InfoIcon } from "lucide-react"
import type { SectionProps } from "@/components/blocks/types"
import { contentHref } from "@/lib/brands"

/** Something visitors must know before booking, e.g. the patch-test rule. */
export function NoticeBanner({ brand, id }: SectionProps) {
  const { notice } = brand.content
  if (!notice) return null

  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-6 py-6">
      <div className="flex gap-4 rounded-lg border border-l-4 border-l-primary bg-card p-5 md:p-6">
        <InfoIcon aria-hidden className="mt-1 size-5 shrink-0 text-highlight" />
        <div className="flex flex-col gap-1.5">
          <h2 className="font-sans text-lg font-semibold normal-case">
            {notice.title}
          </h2>
          <p className="text-pretty text-muted-foreground">{notice.body}</p>
          {notice.link ? (
            <a
              href={contentHref(brand, notice.link.href)}
              className="self-start font-medium text-highlight underline underline-offset-4"
            >
              {notice.link.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}
