import { getEmailBrand } from "@/lib/email/brand"
import { NewsletterWelcome } from "@/lib/email/templates/newsletter-welcome"

const brand = getEmailBrand("colour-room")

export default function ColourRoomNewsletterWelcome() {
  return <NewsletterWelcome brand={brand} />
}
