'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiUser, FiHeart, FiShoppingBag } from 'react-icons/fi'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    // Initialize on mount
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans ${
        isScrolled ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-white'
      }`}
    >
      <div className="w-[95%] sm:w-[90%] mx-auto">
        <div className="flex items-center justify-between py-4 sm:py-5">
          {/* LEFT: Search + Sell Now - Desktop Only */}
          <div className="hidden md:flex flex-1 items-center space-x-4">
            {/* Search Bar */}
            <div className="relative flex items-center max-w-[200px] lg:max-w-[220px] w-full border-b-2 border-gray-400">
              <input
                type="text"
                placeholder="Search for products..."
                className={`flex-1 bg-transparent outline-none py-1.5 text-[14px] lg:text-[15px] w-full font-light tracking-wide ${
                  isScrolled
                    ? 'text-gray-800 placeholder-gray-500'
                    : 'text-white placeholder-white/80'
                }`}
              />
              <button
                className={`px-2 py-1.5 transition flex-shrink-0 ${
                  isScrolled ? 'text-gray-600' : 'text-white'
                }`}
              >
                <svg
                  className="w-4 h-4 lg:w-5 lg:h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Sell Now Button - SAME STYLE WITHOUT UNDERLINE */}
            <Link
              href="/sell"
              className={`text-[14px] lg:text-[15px] font-light tracking-widest uppercase transition-all duration-300 whitespace-nowrap px-4 lg:px-5 py-1.5 rounded-full ${
                isScrolled
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              SELL NOW
            </Link>
          </div>

          {/* CENTER: Logo - Perfect Center */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/Just Becho Logo Golden.png"
                alt="Just Becho"
                width={isScrolled ? 70 : 80}
                height={isScrolled ? 70 : 80}
                className={`transition-all duration-500 ${
                  isScrolled ? 'h-14 w-auto' : 'h-16 w-auto'
                }`}
                priority
              />
            </Link>
          </div>

          {/* RIGHT: Icons - REACT ICONS WITH SAME SIZE */}
          <div className="flex items-center space-x-4 sm:space-x-5 flex-1 justify-end">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden focus:outline-none p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Desktop Options - REACT ICONS WITH EXACT SAME SIZE */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {/* Profile Icon */}
              <Link href="/profile" className="hover:text-gray-700 transition-all duration-300 transform hover:scale-110">
                <FiUser className="w-6 h-6 lg:w-7 lg:h-7" />
              </Link>

              {/* Wishlist Icon */}
              <Link href="/wishlist" className="hover:text-gray-700 transition-all duration-300 transform hover:scale-110">
                <FiHeart className="w-6 h-6 lg:w-7 lg:h-7" />
              </Link>

              {/* Cart Icon */}
              <Link href="/cart" className="relative hover:text-gray-700 transition-all duration-300 transform hover:scale-110">
                <FiShoppingBag className="w-6 h-6 lg:w-7 lg:h-7" />
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Below Header */}
        <div className="md:hidden border-t border-gray-200/50 mt-2 pt-2 pb-1">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search for products..."
              className={`flex-1 bg-white/20 backdrop-blur-sm border border-gray-300/50 rounded-full px-4 py-2 text-sm outline-none w-full font-light tracking-wide ${
                isScrolled
                  ? 'text-gray-800 placeholder-gray-500 bg-white'
                  : 'text-white placeholder-white/80 bg-white/10'
              }`}
            />
            <button
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                isScrolled ? 'text-gray-600' : 'text-white'
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU - UPDATED WITH PROFILE */}
      {isMenuOpen && (
        <div
          className={`md:hidden transition-all duration-300 font-light tracking-widest uppercase ${
            isScrolled ? 'bg-white text-gray-800 shadow-lg' : 'bg-black/95 text-white'
          }`}
        >
          <nav className="flex flex-col px-6 py-4 space-y-4 text-base">
            <Link href="/sell" className="py-2 hover:text-gray-700 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
              SELL NOW
            </Link>
            <Link href="/profile" className="py-2 hover:text-gray-700 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
              PROFILE
            </Link>
            <Link href="/wishlist" className="py-2 hover:text-gray-700 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
              WISHLIST
            </Link>
            <Link href="/cart" className="py-2 hover:text-gray-700 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
              CART
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}