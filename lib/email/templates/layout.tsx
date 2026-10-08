import type { CSSProperties, ReactNode } from "react"
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "react-email"
import type { EmailBrand, EmailTheme } from "@/lib/email/brand"

type BrandLayoutProps = {
  brand: EmailBrand
  preview: string
  /** Small print at the very bottom: why this email was sent. */
  footnote: string
  /** Internal emails skip the visitor-facing address, hours and socials. */
  footer?: "full" | "minimal"
  children: ReactNode
}

export function BrandLayout({
  brand,
  preview,
  footnote,
  footer = "full",
  children,
}: BrandLayoutProps) {
  const { theme } = brand

  return (
    <Html lang="en-GB" dir="ltr">
      <Head>
        <meta name="color-scheme" content={theme.scheme} />
        <meta name="supported-color-schemes" content={theme.scheme} />
        {/* Clients that block web fonts fall back to the stacks in EmailTheme. */}
        {/* react-doctor-disable-next-line react-doctor/nextjs-no-css-link -- an email, not a Next page */}
        <link rel="stylesheet" href={theme.fontsHref} />
      </Head>
      <Body
        style={{
          margin: 0,
          padding: "32px 12px",
          backgroundColor: theme.page,
          color: theme.text,
          fontFamily: theme.bodyFont,
        }}
      >
        <Preview>{preview}</Preview>
        <Container
          style={{
            width: "100%",
            maxWidth: 600,
            backgroundColor: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.radius,
            overflow: "hidden",
          }}
        >
          <Section
            style={{
              backgroundColor: theme.subtle,
              borderBottom: `1px solid ${theme.border}`,
              padding: "28px 24px",
              textAlign: "center",
            }}
          >
            <Link href={brand.siteUrl}>
              <Img
                src={brand.logoUrl}
                width="72"
                height="72"
                alt={brand.name}
                style={{
                  display: "block",
                  margin: "0 auto",
                  borderRadius: theme.radius,
                }}
              />
            </Link>
          </Section>

          <Section style={{ padding: "40px 40px 36px" }}>{children}</Section>

          <Section
            style={{
              backgroundColor: theme.footer,
              color: theme.onFooter,
              padding: "32px 40px",
            }}
          >
            <Text
              style={{
                margin: 0,
                fontFamily: theme.headingFont,
                fontSize: 26,
                lineHeight: "30px",
                fontWeight: theme.headingWeight,
                textTransform: theme.headingCase,
                color: theme.onFooter,
              }}
            >
              {brand.name}
            </Text>
            <Text
              style={{
                margin: "4px 0 0",
                fontSize: 14,
                lineHeight: "20px",
                color: theme.footerMuted,
              }}
            >
              {brand.tagline}
            </Text>

            {footer === "full" ? <FooterDetails brand={brand} /> : null}

            <Hr
              style={{
                margin: "24px 0 16px",
                border: "none",
                borderTop: `1px solid ${theme.footerRule}`,
              }}
            />
            <Text
              style={{
                margin: 0,
                fontSize: 12,
                lineHeight: "18px",
                color: theme.footerMuted,
              }}
            >
              {footnote}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

function FooterDetails({ brand }: { brand: EmailBrand }) {
  const { theme } = brand
  const label: CSSProperties = {
    margin: "24px 0 6px",
    fontSize: 11,
    lineHeight: "16px",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: theme.footerMuted,
  }
  const line: CSSProperties = {
    margin: 0,
    fontSize: 14,
    lineHeight: "22px",
    color: theme.onFooter,
  }
  const link: CSSProperties = {
    color: theme.onFooter,
    textDecoration: "underline",
  }

  return (
    <>
      <Text style={label}>Find us</Text>
      {brand.address.map((addressLine) => (
        <Text key={addressLine} style={line}>
          {addressLine}
        </Text>
      ))}
      <Text style={line}>
        <Link href={`tel:${brand.phone.replace(/\s/g, "")}`} style={link}>
          {brand.phone}
        </Link>
        {" · "}
        <Link href={`mailto:${brand.email}`} style={link}>
          {brand.email}
        </Link>
      </Text>

      <Text style={label}>Opening hours</Text>
      <Section>
        {brand.hours.map(({ days, hours }) => (
          <Row key={days}>
            <Column style={{ ...line, width: 88, verticalAlign: "top" }}>
              {days}
            </Column>
            <Column style={line}>{hours}</Column>
          </Row>
        ))}
      </Section>

      {brand.socials.length > 0 ? (
        <Text style={{ ...line, marginTop: 24 }}>
          {brand.socials.map((social, index) => (
            <span key={social.label}>
              {index > 0 ? " · " : null}
              <Link href={social.url} style={link}>
                {social.label}
              </Link>
            </span>
          ))}
        </Text>
      ) : null}
    </>
  )
}

export function Eyebrow({
  theme,
  children,
}: {
  theme: EmailTheme
  children: ReactNode
}) {
  return (
    <Text
      style={{
        margin: "0 0 12px",
        fontSize: 12,
        lineHeight: "16px",
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: theme.highlight,
      }}
    >
      {children}
    </Text>
  )
}

export function EmailHeading({
  theme,
  children,
}: {
  theme: EmailTheme
  children: ReactNode
}) {
  return (
    <Heading
      as="h1"
      style={{
        margin: "0 0 20px",
        fontFamily: theme.headingFont,
        fontSize: 36,
        lineHeight: "42px",
        fontWeight: theme.headingWeight,
        textTransform: theme.headingCase,
        color: theme.text,
      }}
    >
      {children}
    </Heading>
  )
}

export function EmailText({
  theme,
  muted = false,
  children,
}: {
  theme: EmailTheme
  muted?: boolean
  children: ReactNode
}) {
  return (
    <Text
      style={{
        margin: "0 0 20px",
        fontSize: muted ? 15 : 16,
        lineHeight: muted ? "24px" : "26px",
        color: muted ? theme.muted : theme.text,
      }}
    >
      {children}
    </Text>
  )
}

export function EmailButton({
  theme,
  href,
  children,
}: {
  theme: EmailTheme
  href: string
  children: ReactNode
}) {
  return (
    <Section style={{ margin: "8px 0 32px" }}>
      <Button
        href={href}
        style={{
          display: "inline-block",
          boxSizing: "border-box",
          padding: "14px 28px",
          borderRadius: theme.radius,
          backgroundColor: theme.button,
          color: theme.onButton,
          fontSize: 15,
          lineHeight: "20px",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        {children}
      </Button>
    </Section>
  )
}

/** The visitor's own words, quoted back so they know what was received. */
export function MessageQuote({
  theme,
  label,
  children,
}: {
  theme: EmailTheme
  label: string
  children: ReactNode
}) {
  return (
    <Section
      style={{
        margin: "4px 0 24px",
        padding: "16px 20px",
        backgroundColor: theme.subtle,
        borderLeft: `3px solid ${theme.highlight}`,
      }}
    >
      <Text
        style={{
          margin: "0 0 6px",
          fontSize: 12,
          lineHeight: "16px",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: theme.muted,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          margin: 0,
          fontSize: 15,
          lineHeight: "24px",
          color: theme.text,
          whiteSpace: "pre-wrap",
        }}
      >
        {children}
      </Text>
    </Section>
  )
}

export function Signoff({ brand }: { brand: EmailBrand }) {
  const { theme } = brand
  return (
    <Text
      style={{
        margin: 0,
        fontFamily: theme.accentFont,
        fontSize: 28,
        lineHeight: "34px",
        fontWeight: 400,
        color: theme.highlight,
      }}
    >
      {brand.copy.signoff}
    </Text>
  )
}
