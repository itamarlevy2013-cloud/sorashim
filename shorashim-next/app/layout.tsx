import type { Metadata, Viewport } from "next"
import { Frank_Ruhl_Libre, Suez_One } from "next/font/google"
import "./globals.css"

const suez = Suez_One({ variable: "--font-suez", weight: "400", subsets: ["hebrew", "latin"] })
const frank = Frank_Ruhl_Libre({ variable: "--font-frank", weight: ["400", "500", "700"], subsets: ["hebrew", "latin"] })

export const metadata: Metadata = {
  title: "מל״ן – משה לוי נחום | עבודת שורשים",
  description: "עבודת שורשים של איתמר לוי על משה לוי נחום (מל״ן), מייסד דפוס מל״ן בכרם התימנים בתל אביב.",
}

export const viewport: Viewport = { themeColor: "#090a08" }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${suez.variable} ${frank.variable} antialiased`}>{children}</body>
    </html>
  )
}
