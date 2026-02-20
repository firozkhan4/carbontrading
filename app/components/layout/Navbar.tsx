'use client'

import { Leaf, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import WalletButton from '../common/WalletButton'

interface Props {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Navbar({ activeTab, setActiveTab }: Props) {

  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Detect scroll for navbar style change
  useEffect(() => {

    const onScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)

  }, [])

  const navLinks = [
    { id: 'market', label: 'Marketplace' },
    { id: 'inventory', label: 'My Portfolio' }
  ]

  return (

    <nav
      className={`
        sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl
        ${scrolled
          ? 'bg-white/95 shadow-lg border-b border-zinc-200'
          : 'bg-white/70'
        }
      `}
    >

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-3 font-semibold tracking-tight hover:opacity-80 transition"
        >

          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow">

            <Leaf size={16} className="text-white" />

          </div>

          <span className="text-lg">
            CARBONBASE
          </span>

        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2">

          {navLinks.map(link => (

            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${activeTab === link.id
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
                }
              `}
            >

              {link.label}

            </button>

          ))}

        </div>

        {/* Right Actions */}
        <div className="flex gap-3 items-center">

          {/* Wallet CTA */}
          <WalletButton />

          {/* Hamburger */}
          <button
            aria-label="Toggle Menu"
            className="md:hidden p-2 rounded-lg hover:bg-zinc-100 transition"
            onClick={() => setMobileOpen(prev => !prev)}
          >

            {mobileOpen ? <X /> : <Menu />}

          </button>

        </div>

      </div>

      {/* Mobile Menu */}
      {
        mobileOpen && (

          <div className="md:hidden border-t bg-white shadow-lg animate-in slide-in-from-top duration-200">

            <div className="px-6 py-4 flex flex-col gap-2">

              {navLinks.map(link => (

                <button
                  key={link.id}
                  onClick={() => {

                    setActiveTab(link.id)
                    setMobileOpen(false)

                  }}
                  className={`
                    text-left px-4 py-3 rounded-lg text-sm font-medium
                    transition
                    ${activeTab === link.id
                      ? 'bg-emerald-600 text-white'
                      : 'hover:bg-zinc-100 text-zinc-700'
                    }
                  `}
                >

                  {link.label}

                </button>

              ))}

            </div>

          </div>

        )
      }

    </nav>

  )

}
