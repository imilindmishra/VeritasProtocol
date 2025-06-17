"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Markets" },
    { href: "/my-bets", label: "My Bets" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/95 backdrop-blur-sm border-b border-charcoal">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-neon-green">
            OracleBet
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-medium transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-neon-green border-b-2 border-neon-green pb-1"
                    : "text-gray-300 hover:text-neon-green"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Connect Wallet Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:block px-6 py-2 border-2 border-neon-green text-neon-green font-semibold rounded-lg glow-button hover:bg-neon-green hover:text-navy-dark">
              Connect Wallet
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-charcoal">
            <nav className="flex flex-col space-y-4 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-lg font-medium transition-colors duration-200 ${
                    pathname === link.href ? "text-neon-green" : "text-gray-300 hover:text-neon-green"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button className="mt-4 px-6 py-2 border-2 border-neon-green text-neon-green font-semibold rounded-lg glow-button hover:bg-neon-green hover:text-navy-dark w-fit">
                Connect Wallet
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
