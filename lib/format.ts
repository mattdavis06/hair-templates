const wholePounds = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
})
const poundsAndPence = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

/** "£24", "£24.50", or "from £30". */
export function formatPrice(price: number, from = false): string {
  const amount = (
    Number.isInteger(price) ? wholePounds : poundsAndPence
  ).format(price)
  return from ? `from ${amount}` : amount
}

/** "45 min", "1 hr", "1 hr 15 min". */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} min`
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`
}
