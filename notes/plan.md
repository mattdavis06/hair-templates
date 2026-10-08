# Brief: hair-templates

New Next.js 16 multi-brand demo repo (sister to my `hospitality-templates` repo at
`~/Desktop/mdavis.dev/projects/hospitality-templates`). Used to sell websites to barbers and salons.
Set up with shadcn: `base-nova` (Base UI, so custom triggers use the `render` prop, not `asChild`), Tailwind 4, Lucide icons, pnpm.

## Rules for you

- Only touch files in this project. Ask me first before installing packages, touching anything outside this
  project (including reading or copying from hospitality-templates), starting or stopping servers, using the browser,
  or any git/GitHub/Vercel/Resend action. I do commits and merges. You can create branches when I ask.
- Never put secrets in tracked files (`.env.local` is git-ignored). `notes/` is git-ignored and private.
- Ask questions in plain text, not forms.
- You can run type-check, lint, Prettier, react-doctor and build. Run them with full permissions (sandbox hits a corepack EPERM).
- The shadcn CLI sometimes writes `import { cn } from "cn"`. Always change it to `@/lib/utils`.
- Read `node_modules/next/dist/docs/` before using Next APIs. This Next version has breaking changes.

## Brands (switched with `?theme=`)

1. **Northside Barbers** (`northside`): local, friendly neighbourhood barbers. Single page.
   Charcoal and off-white with a barber-pole red accent, condensed headings, square corners, subtle texture.
   Sections: hero with "Open now" and Book button; walk-in wait-time strip; services and prices (cuts, fades,
   beard and shave, kids and seniors); team with "Book with…" per barber; gallery; reviews; products; loyalty card;
   FAQs and policies; hours and map; booking handover to Fresha or Booksy; contact; newsletter.
2. **The Colour Room** (`colour-room`): premium salon known for colour work. Multi-page: Home, Services,
   Colour, Team, Gallery, Book. Warm neutral base with a terracotta accent, serif headings, soft corners.
   Extras: price matrix by stylist level (junior, senior, director); colour services with "from" prices and
   consultation tags; colour consultation enquiry form (signature feature); before and after slider;
   patch-test notice and policy; new-client offer; gift vouchers; bridal and events enquiry.

## Architecture (the important part)

- Keep brands separate from designs. A brand is ONLY data: a content JSON file, a CSS colour and font block, a logo,
  and a page config listing sections, their order and their variant. No per-brand component files.
  (Hospitality made that mistake: brand ids are hard-wired into ~28 files.)
- Sections in `components/blocks/<section>/` are brand-neutral, have a few variants, and use theme tokens only.
- Content is validated with a zod schema in `content/schema.ts`. A CMS will edit the same files later.
- shadcn primitives in `components/ui/` are never edited. They're styled only through theme tokens.
  We restyle shadcn blocks and pages into our own sections.
- Keep a `registry.json` from the start. Finished sections become my own shadcn registry (`@mdavis/...`),
  hosted from my mdavis.dev site later. A section joins the library once a second project needs it.
- Structured data: schema.org `HairSalon`.

## Phases

0. Foundations: bring over from hospitality-templates (made brand-neutral): `?theme=` brand switching
   (proxy) and the theme switcher, contact and newsletter forms with validation, BotID and Resend emails, SEO
   (metadata, per-brand share images at `/og/{theme}`, JSON-LD, sitemap), opening hours with "Open now",
   analytics, Prettier, ESLint, react-doctor, `.env.example`. Then the content schema and an empty registry.
1. Northside Barbers end to end.
2. The Colour Room (mostly new variants of Phase 1 sections, plus its extras).
3. Launch: Vercel on `hair.mdavis.dev`, a Resend sender per brand on `demo.mdavis.dev`, checks.
4. Later: publish the registry and a `mdavis.dev/ui` library page.

Start with Phase 0. Look at the repo, then propose the exact steps before making changes.
