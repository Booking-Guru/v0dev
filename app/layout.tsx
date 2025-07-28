import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth/AuthProvider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BookingGuru - Find Qualified Driving Instructors Online",
  description:
    "Book driving lessons with qualified instructors across Australia. Easy online booking, verified instructors, and flexible scheduling. Start your driving journey with BookingGuru today.",
  keywords: "driving lessons, driving instructors, book driving lessons, learn to drive, driving school, Australia",
  authors: [{ name: "BookingGuru Team" }],
  creator: "BookingGuru",
  publisher: "BookingGuru",
  robots: "index, follow",
  openGraph: {
    title: "BookingGuru - Find Qualified Driving Instructors Online",
    description:
      "Book driving lessons with qualified instructors across Australia. Easy online booking, verified instructors, and flexible scheduling.",
    url: "https://bookingguru.com.au",
    siteName: "BookingGuru",
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "BookingGuru - Find Qualified Driving Instructors Online",
    description:
      "Book driving lessons with qualified instructors across Australia. Easy online booking, verified instructors, and flexible scheduling.",
    creator: "@bookingguru",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
