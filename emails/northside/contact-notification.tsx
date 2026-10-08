import { getEmailBrand } from "@/lib/email/brand"
import { ContactNotification } from "@/lib/email/templates/contact-notification"
import { sampleContact } from "../_preview/samples"

const brand = getEmailBrand("northside")

export default function NorthsideContactNotification() {
  return <ContactNotification brand={brand} {...sampleContact.northside} />
}
