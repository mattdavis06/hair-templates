import type { Content } from "@/content/schema"

function addressQuery({ address }: Content): string {
  return `${address.street}, ${address.city} ${address.postcode}`
}

/** Opens Google Maps directions to the shop on any device. */
export function directionsUrl(content: Content): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressQuery(content))}`
}

/** The brand's own "Embed a map" link, or a keyless map built from the address. */
export function mapEmbedUrl(content: Content): string {
  const query = encodeURIComponent(addressQuery(content)).replace(/%20/g, "+")
  return (
    content.visit?.mapEmbedUrl ??
    `https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1s${query}`
  )
}
