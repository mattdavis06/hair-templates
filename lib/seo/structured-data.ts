import type { Brand } from "@/lib/brands"
import { absoluteUrl, brandUrl } from "@/lib/site"

/** schema.org description of the business, rendered once per page as JSON-LD. */
export function businessJsonLd({ id, content }: Brand) {
  const { address } = content

  return {
    "@context": "https://schema.org",
    "@type": content.businessType,
    "@id": brandUrl(id, "/#business"),
    name: content.name,
    description: content.description,
    url: brandUrl(id),
    image: absoluteUrl(`/og/${id}`),
    telephone: content.phone,
    email: content.email,
    ...(content.priceRange && { priceRange: content.priceRange }),
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      postalCode: address.postcode,
      addressCountry: address.country,
    },
    openingHoursSpecification: content.openingHours.flatMap((day) =>
      "closed" in day
        ? []
        : [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: `https://schema.org/${day.day}`,
              opens: day.open,
              closes: day.close,
            },
          ]
    ),
    ...(content.services && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: content.services.title,
        itemListElement: content.services.categories.map((category) => ({
          "@type": "OfferCatalog",
          name: category.name,
          itemListElement: category.items.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.name,
              ...(service.description && {
                description: service.description,
              }),
            },
            ...(service.from
              ? {
                  priceSpecification: {
                    "@type": "PriceSpecification",
                    minPrice: service.price,
                    priceCurrency: "GBP",
                  },
                }
              : { price: service.price, priceCurrency: "GBP" }),
          })),
        })),
      },
    }),
    sameAs: content.socials.map((social) => social.url),
  }
}
