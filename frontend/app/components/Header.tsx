"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from 'wagmi/connectors'

export default function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const navLinks = [
    { href: "/", label: "Markets" },
    { href: "/my-bets", label: "My Bets" },
    { href: "/create", label: "Create Market" },
  ]

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  const WalletButton = ({ isMobile = false }: { isMobile?: boolean }) => {
    if (!isClient) return <div className="h-10 w-36 bg-gray-700/50 animate-pulse rounded-lg"></div>;
    
    if (isConnected) {
      return (
        <div className={`flex items-center gap-2 ${isMobile ? 'flex-col w-full' : ''}`}>
           <span className={`font-mono text-sm ${isMobile ? 'mb-2 text-center' : ''}`}>{truncateAddress(address!)}</span>
           <button onClick={() => disconnect()} className="px-6 py-2 border-2 border-electric-purple text-electric-purple font-semibold rounded-lg hover:bg-electric-purple hover:text-navy-dark w-full md:w-auto">
              Disconnect
           </button>
        </div>
      )
    }
    return (
      <button onClick={() => connect({ connector: injected() })} className="px-6 py-2 border-2 border-neon-green text-neon-green font-semibold rounded-lg glow-button hover:bg-neon-green hover:text-navy-dark w-full md:w-auto">
        Connect Wallet
      </button>
    )
  }

  

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/95 backdrop-blur-sm border-b border-charcoal">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-neon-green">OracleBet</Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`text-lg font-medium transition-colors duration-200 ${ pathname === link.href ? "text-neon-green border-b-2 border-neon-green pb-1" : "text-gray-300 hover:text-neon-green" }`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <WalletButton />
            </div>
            <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-charcoal">
            <nav className="flex flex-col items-center space-y-4 mt-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={`text-lg font-medium transition-colors duration-200 ${ pathname === link.href ? "text-neon-green" : "text-gray-300 hover:text-neon-green" }`} onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 w-full flex flex-col items-center space-y-4">
                <WalletButton isMobile={true} />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}