import { getEmailBrand } from "@/lib/email/brand"
import { NewsletterWelcome } from "@/lib/email/templates/newsletter-welcome"

const brand = getEmailBrand("northside")

export default function NorthsideNewsletterWelcome() {
  return <NewsletterWelcome brand={brand} />
}
