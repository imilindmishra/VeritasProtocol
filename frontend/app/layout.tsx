import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "BetChat - Decentralized Group Chat Betting",
  description: "Predict, discuss, and earn in real-time with Ethereum",
  keywords: "betting, decentralized, chat, web3, predictions, ethereum",
  authors: [{ name: "BetChat Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#1A2238",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-inter antialiased`}>{children}</body>
    </html>
  )
}
