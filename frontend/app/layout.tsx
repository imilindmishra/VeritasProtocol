// File: frontend/app/layout.tsx

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "./components/Header"
import { Web3Provider } from "./components/Web3Provider" // <-- IMPORT THIS

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OracleBet - Decentralized Prediction Markets",
  description: "Join the future of decentralized betting with group chat integration",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-navy-dark min-h-screen text-white`}>
        <Web3Provider> {/* <-- WRAPPER START */}
          <Header />
          <main className="pt-20">{children}</main>
        </Web3Provider> {/* <-- WRAPPER END */}
      </body>
    </html>
  )
}