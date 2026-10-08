import { getEmailBrand } from "@/lib/email/brand"
import { ContactNotification } from "@/lib/email/templates/contact-notification"
import { sampleContact } from "../_preview/samples"

const brand = getEmailBrand("colour-room")

export default function ColourRoomContactNotification() {
  return <ContactNotification brand={brand} {...sampleContact["colour-room"]} />
}
