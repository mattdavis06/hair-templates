const wholePounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
})
const poundsAndPence = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

/** "£24", "£24.50", "from £30", or "Free". */
export function formatPrice(price: number, from = false): string {
  if (price === 0 && !from) return "Free"
  const amount = (
    Number.isInteger(price) ? wholePounds : poundsAndPence
  ).format(price)
  return from ? `from ${amount}` : amount
}

const monthYear = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

/** "2026-09-14" → "September 2026". */
export function formatMonthYear(isoDate: string): string {
  return monthYear.format(new Date(`${isoDate}T00:00:00Z`))
}

/** "45 min", "1 hr", "1 hr 15 min". */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`
}
