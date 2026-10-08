import { getEmailBrand } from "@/lib/email/brand"
import { ContactConfirmation } from "@/lib/email/templates/contact-confirmation"
import { sampleContact } from "../_preview/samples"

const brand = getEmailBrand("northside")

export default function NorthsideContactConfirmation() {
  return <ContactConfirmation brand={brand} {...sampleContact.northside} />
}
