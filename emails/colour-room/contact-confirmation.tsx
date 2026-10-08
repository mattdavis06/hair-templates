import { getEmailBrand } from "@/lib/email/brand"
import { ContactConfirmation } from "@/lib/email/templates/contact-confirmation"
import { sampleContact } from "../_preview/samples"

const brand = getEmailBrand("colour-room")

export default function ColourRoomContactConfirmation() {
  return <ContactConfirmation brand={brand} {...sampleContact["colour-room"]} />
}
