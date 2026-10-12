# hair-templates

One Next.js site that can be any number of hair salons and barbers. Each business is described by two JSON files: what it says, and how it looks. Every component is shared, so adding a new business means writing data, not code.

**Live demo:** [hair.mdavis.dev](https://hair.mdavis.dev)

| Brand             | Demo                                                                             | Style                                       | Pages                                       |
| ----------------- | -------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------- |
| Northside Barbers | [hair.mdavis.dev](https://hair.mdavis.dev)                                       | Dark, oxblood, square corners, walk-ins     | One long page                               |
| The Colour Room   | [hair.mdavis.dev/?theme=colour-room](https://hair.mdavis.dev/?theme=colour-room) | Light, lilac, rounded corners, appointments | Home, Services, Colour, Team, Gallery, Book |

Use the brand switcher in the bottom-right corner to flip between them on any page.

## Features

- **Brands as data.** Copy, prices, opening hours, colours, fonts, corner radius, light or dark mode, logo, page list and section order all come from `content/brands/<id>/`.
- **A shared section library.** Hero, services (list or price-per-stylist-level matrix), team, gallery, before-and-after slider, reviews, FAQs, policies, offers, vouchers, products, loyalty card, map and opening hours, booking call-to-action, enquiry forms, contact and newsletter. Each section has one or more layouts (variants) a brand can choose from.
- **Checked content.** Every brand is validated against a zod schema at build time, including links between sections, so a typo in the JSON fails the build instead of the page.
- **Forms that send real email.** Contact, colour consultation, events and newsletter forms, with branded confirmation emails for the visitor and a copy for the shop, built with React Email and sent through Resend. Spam is filtered with a honeypot, a minimum fill time and Vercel BotID.
- **Fully static pages.** Every brand and page is prerendered at build time. Opening-hours status ("Open now") and walk-in waits update in the browser.
- **SEO per brand.** Metadata, canonical URLs, sitemap, robots, generated share images and favicons, and structured data (local business, services, reviews, FAQs).
- **Small touches.** Optional page transitions (React View Transitions), smooth scrolling to sections, a drifting gradient backdrop, and respect for "reduce motion".
- **Vercel Analytics and Speed Insights** on every page.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) and React 19
- [Tailwind CSS v4](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com) (Base UI)
- [zod](https://zod.dev) for the content schema and form validation
- [React Email](https://react.email) and [Resend](https://resend.com) for email
- [Vercel](https://vercel.com) hosting, [Analytics](https://vercel.com/docs/analytics), [Speed Insights](https://vercel.com/docs/speed-insights) and [BotID](https://vercel.com/docs/botid)
- [Simple Icons](https://simpleicons.org) and [Lucide](https://lucide.dev) for icons

## Getting started

You need Node.js 22 and [pnpm](https://pnpm.io).

```bash
pnpm install
cp .env.example .env.local   # optional: only needed to send email
pnpm dev
```

Open [localhost:3000](http://localhost:3000) for Northside, or [localhost:3000/?theme=colour-room](http://localhost:3000/?theme=colour-room) for The Colour Room.

Without any environment variables everything works, except that forms don't send email. They still succeed, and in development the terminal logs what would have been sent.

### Environment variables

Copy `.env.example` to `.env.local` locally, and set the same keys in Vercel under Settings → Environment Variables.

| Variable                     | Required      | What it does                                                                                                                                                                                                     |
| ---------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`             | To send email | Resend API key with sending access.                                                                                                                                                                              |
| `EMAIL_FROM_DOMAIN`          | To send email | A domain verified in Resend. Each brand sends from `<brand-id>@<domain>`, e.g. `colour-room@demo.example.com`.                                                                                                   |
| `CONTACT_INBOX`              | No            | Receives a copy of every enquiry, with reply-to set to the visitor. Without it only the visitor is emailed.                                                                                                      |
| `NEXT_PUBLIC_SITE_URL`       | In production | The public address of the site. Used for canonical URLs, share images, the sitemap and links in emails. Leave it unset locally.                                                                                  |
| `EMAIL_ASSET_URL`            | No            | Public site that serves images in emails (logos, social icons). Defaults to `NEXT_PUBLIC_SITE_URL`, then the Vercel production URL. Mail apps can't load images from localhost or protected preview deployments. |
| `NEXT_PUBLIC_ALLOW_INDEXING` | No            | Set to `true` to let search engines index the site. Demos stay `noindex` by default.                                                                                                                             |

## Scripts

| Command                | What it does                                            |
| ---------------------- | ------------------------------------------------------- |
| `pnpm dev`             | Development server on port 3000                         |
| `pnpm build`           | Production build. Also validates every brand's JSON.    |
| `pnpm start`           | Serve the production build                              |
| `pnpm email`           | Preview every email template on port 3001               |
| `pnpm typecheck`       | Generate Next route types, then run TypeScript          |
| `pnpm lint`            | ESLint                                                  |
| `pnpm format`          | Prettier (`pnpm format:check` to check without writing) |
| `CI=1 pnpm run doctor` | [React Doctor](https://react.doctor) code health report |

Run `typecheck`, `lint`, `format:check`, `doctor` and `build` before opening a pull request.

## How it works

### A brand is two JSON files

```
content/brands/northside/
├── content.json   what the site says: name, phone, address, hours, services, team, reviews, email wording…
└── site.json      how it looks: palette, fonts, radius, light/dark, logo, nav, and the pages
```

A page in `site.json` is just an ordered list of sections, each with a type and a variant:

```json
{
  "slug": "",
  "title": "Home",
  "sections": [
    { "type": "hero", "variant": "centered" },
    { "type": "services", "variant": "list", "id": "services" },
    { "type": "contact", "variant": "split", "id": "contact" }
  ]
}
```

Reorder the list and the page reorders. `content/schema.ts` describes both files, and `components/blocks/registry.ts` maps each type and variant to its component.

### Styling comes from the brand

The layout turns the brand's palette, fonts and radius into CSS variables on `<html>`. Components only use roles like `bg-primary` or `text-muted-foreground`, never fixed colours, so the same component looks right in every brand. Emails use the same palette, converted to plain hex values.

### Brands in the URL

Visitors see clean URLs with an optional `?theme=` parameter, for example `/book?theme=colour-room`. `proxy.ts` rewrites that to `/colour-room/book` behind the scenes, which is how Next.js prerenders every brand's pages at build time. Build internal links with `brandHref()` so the brand is kept.

## Project structure

```
app/
├── [brand]/              layout, home page, sub-pages and 404 for each brand
├── icons/                favicons and email social icons, generated per brand
├── og/                   share images, generated per brand
├── robots.ts, sitemap.ts
└── globals.css           Tailwind, theme tokens, animations
components/
├── blocks/               the section library, one folder per section type
├── site/                 header, mobile menu, footer, backdrop, page transition
├── forms/                shared form parts
└── ui/                   shadcn/ui components
content/
├── schema.ts             zod schema for content.json and site.json
└── brands/<id>/          content.json and site.json for each brand
emails/                   React Email previews for each brand (pnpm email)
lib/
├── brands/               loading, validating and linking brands
├── email/                email theme, templates and sending
├── forms/                server actions, validation, enquiry fields
└── seo/                  metadata, structured data, share images
public/brands/<id>/       logos
proxy.ts                  ?theme= to /<brand>/ rewrites
```

## Adding a brand

1. Add the id to `BRAND_IDS` in `lib/brands/ids.ts`.
2. Create `content/brands/<id>/content.json` and `site.json`. Copying an existing brand is the quickest start.
3. Import the two files in `lib/brands/index.ts`.
4. Run `pnpm build`. The schema check lists anything missing or misspelt.

## Adding a section

1. Describe its content in `content/schema.ts` and register the type and its variants in `SECTION_VARIANTS`.
2. Build the component in `components/blocks/<type>/`. It receives the brand and the section's options.
3. Register it in `components/blocks/registry.ts`. TypeScript complains until the schema and registry match.
4. Add the content to a brand's `content.json` and the section to a page in its `site.json`.

If you're about to write `if (brand.id === 'northside')`, make it a setting in the JSON instead, so any brand can use it.

## Deploying

The site is built for [Vercel](https://vercel.com). Import the repository, add the environment variables above, and every push to `main` deploys to production.

- **Analytics and Speed Insights** are already in the code (`app/[brand]/layout.tsx`). Turn them on once in the Vercel project, under the Analytics and Speed Insights tabs. Data appears after the next deployment.
- **Email** needs a domain verified in Resend (its DNS records added), plus the email variables set for Production. Preview deployments sit behind Vercel's login, so set `EMAIL_ASSET_URL` to the production address there.
- **Custom domain:** add it under Settings → Domains and create the record Vercel shows at your DNS provider. On Cloudflare, set the record to "DNS only" rather than proxied.

## Photos

Demo photos come from [Unsplash](https://unsplash.com) and [Pexels](https://www.pexels.com), loaded straight from their image CDNs. The businesses, people, reviews and contact details are made up.
