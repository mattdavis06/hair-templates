import { Column, Row, Section } from "react-email"
import type { EmailTheme } from "@/lib/email/brand"
import type { EnquiryRow } from "@/lib/forms/enquiries"
import { MessageQuote } from "./layout"

/** Short answers as a label/value table, then long answers as quotes. */
export function EnquiryDetails({
  theme,
  rows,
}: {
  theme: EmailTheme
  rows: EnquiryRow[]
}) {
  const label = {
    width: 120,
    padding: "6px 12px 6px 0",
    fontSize: 13,
    lineHeight: "20px",
    color: theme.muted,
    verticalAlign: "top",
  } as const
  const value = {
    padding: "6px 0",
    fontSize: 15,
    lineHeight: "20px",
    color: theme.text,
  } as const

  const short = rows.filter((row) => !row.long)
  const long = rows.filter((row) => row.long)

  return (
    <>
      {short.length > 0 ? (
        <Section style={{ margin: "0 0 16px" }}>
          {short.map((row) => (
            <Row key={row.name}>
              <Column style={label}>{row.label}</Column>
              <Column style={value}>{row.value}</Column>
            </Row>
          ))}
        </Section>
      ) : null}
      {long.map((row) => (
        <MessageQuote key={row.name} theme={theme} label={row.label}>
          {row.value}
        </MessageQuote>
      ))}
    </>
  )
}
