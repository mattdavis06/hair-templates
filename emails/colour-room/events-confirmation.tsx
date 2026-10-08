import { EnquiryConfirmation } from "@/lib/email/templates/enquiry-confirmation"
import { sampleEnquiry } from "../_preview/samples"

const { brand, form, copy, name, rows } = sampleEnquiry("colour-room", "events")

export default function ColourRoomEventsConfirmation() {
  return (
    <EnquiryConfirmation
      brand={brand}
      form={form}
      copy={copy}
      name={name}
      rows={rows}
    />
  )
}
