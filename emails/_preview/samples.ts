import type { BrandId } from "@/lib/brands/ids"

/** Example form submissions for the email preview (`pnpm email`). */
export const sampleContact: Record<
  BrandId,
  { name: string; email: string; message: string }
> = {
  northside: {
    name: "Callum Reid",
    email: "callum@example.com",
    message:
      "Alright! Can you fit three of us in on Saturday morning before a wedding? Two skin fades and a beard tidy.\n\nHappy to come in early if that helps.",
  },
  "colour-room": {
    name: "Amara Clarke",
    email: "amara@example.com",
    message:
      "Hi, I'd love to go from box-dyed dark brown to a soft copper. Is that possible in one visit, and do I need a patch test first?",
  },
}
