import { DAYS, type DayHours, type WalkIns } from "@/content/schema"

export type OpeningStatus = {
  isOpen: boolean
  label: string
  detail: string
}

type Day = (typeof DAYS)[number]

/** Opening hours are always evaluated in the shop's time zone, not the visitor's. */
const SHOP_TIME_ZONE = "Europe/London"

const clockFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: SHOP_TIME_ZONE,
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})

function shopClock(now: Date) {
  const parts = clockFormat.formatToParts(now)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ""
  return {
    dayIndex: DAYS.indexOf(get("weekday") as Day),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  }
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "pm" : "am"
  const displayHours = hours % 12 || 12
  return minutes === 0
    ? `${displayHours}${period}`
    : `${displayHours}:${String(minutes).padStart(2, "0")}${period}`
}

export function formatDayHours(day: DayHours): string {
  if ("closed" in day) return "Closed"
  return `${formatTime(day.open)} – ${formatTime(day.close)}`
}

function hoursFor(hours: DayHours[], dayIndex: number) {
  const day = DAYS[((dayIndex % 7) + 7) % 7]
  const entry = hours.find((h) => h.day === day)
  return entry && !("closed" in entry) ? entry : null
}

function nextOpening(hours: DayHours[], dayIndex: number): string {
  for (let offset = 1; offset <= 7; offset++) {
    const day = hoursFor(hours, dayIndex + offset)
    if (day) {
      const when = offset === 1 ? "tomorrow" : day.day
      return `Opens ${when} at ${formatTime(day.open)}`
    }
  }
  return ""
}

const shortDay = (day: string) => day.slice(0, 3)

/** Collapses runs of identical hours: "Mon–Wed 9am – 6pm". */
export function groupOpeningHours(
  days: DayHours[]
): { days: string; hours: string }[] {
  const groups: { first: string; last: string; hours: string }[] = []
  for (const day of days) {
    const hours = formatDayHours(day)
    const previous = groups.at(-1)
    if (previous?.hours === hours) previous.last = day.day
    else groups.push({ first: day.day, last: day.day, hours })
  }
  return groups.map(({ first, last, hours }) => ({
    days:
      first === last ? shortDay(first) : `${shortDay(first)}–${shortDay(last)}`,
    hours,
  }))
}

/** "Sat", "Thu–Fri" or "Mon, Wed"; days are listed in week order. */
export function formatDays(days: Day[]): string {
  const sorted = [...days].sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b))
  const consecutive = sorted.every(
    (day, i) => i === 0 || DAYS.indexOf(day) === DAYS.indexOf(sorted[i - 1]) + 1
  )
  if (sorted.length > 1 && consecutive) {
    return `${shortDay(sorted[0])}–${shortDay(sorted[sorted.length - 1])}`
  }
  return sorted.map(shortDay).join(", ")
}

export type WalkInStatus =
  | { isOpen: true; wait: number; busy: boolean; detail: string }
  | { isOpen: false; label: string; detail: string }

/** Typical walk-in wait for the shop's current time: a guide from the busy times, not a live queue. */
export function getWalkInStatus(
  walkIns: WalkIns,
  hours: DayHours[],
  now: Date
): WalkInStatus {
  const status = getOpeningStatus(hours, now)
  if (!status.isOpen) {
    return { isOpen: false, label: status.label, detail: status.detail }
  }

  const { dayIndex, minutes } = shopClock(now)
  const busy = walkIns.busyTimes.find(
    (band) =>
      band.days.includes(DAYS[dayIndex]) &&
      minutes >= toMinutes(band.from) &&
      minutes < toMinutes(band.to)
  )
  return {
    isOpen: true,
    wait: busy?.wait ?? walkIns.usualWait,
    busy: Boolean(busy),
    detail: status.detail,
  }
}

export function getOpeningStatus(hours: DayHours[], now: Date): OpeningStatus {
  const { dayIndex, minutes } = shopClock(now)
  const today = hoursFor(hours, dayIndex)

  if (!today) {
    return {
      isOpen: false,
      label: "Closed today",
      detail: nextOpening(hours, dayIndex),
    }
  }

  const opens = toMinutes(today.open)
  const closes = toMinutes(today.close)

  if (minutes >= opens && minutes < closes) {
    return {
      isOpen: true,
      label: "Open now",
      detail: `until ${formatTime(today.close)}`,
    }
  }

  return {
    isOpen: false,
    label: "Closed",
    detail:
      minutes < opens
        ? `Opens at ${formatTime(today.open)}`
        : nextOpening(hours, dayIndex),
  }
}
