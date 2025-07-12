import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import {MapPinned} from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Proofer Spot Map", // Judul website Anda
  description: "Connect with fellow proofers around the world.",
  icons: {
    icon: "/map-pinned.svg",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
