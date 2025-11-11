'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsSearchExpanded(false)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) console.log('Search for:', searchQuery)
    setIsSearchExpanded(false)
    setSearchQuery('')
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-500 ease-in-out ${
        isScrolled
          ? 'bg-white/95 shadow-md text-gray-900'
          : 'bg-transparent text-white'
      }`}
    >
      {/* -------- TOP HEADER -------- */}
      <div className="max-w-[1600px] mx-auto px-8 transition-all duration-500 ease-in-out">
        <div
          className={`grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-500 ease-in-out ${
            isScrolled ? 'py-2' : 'py-5'
          }`}
        >
          {/* Left Spacer */}
          <div></div>

          {/* Center Logo */}
          <div className="flex justify-center transition-transform duration-500 ease-in-out">
            <Link href="/" className="block">
              <div
                className={`relative transition-transform duration-500 ease-in-out ${
                  isScrolled ? 'scale-90' : 'scale-100'
                }`}
              >
                <Image
                  src="/Just Becho New Logo.png"
                  alt="Logo"
                  width={180}
                  height={60}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex justify-end items-center space-x-6 transition-all duration-500 ease-in-out">
            {/* Search */}
            <div ref={searchRef} className="relative">
              {isSearchExpanded ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center w-full max-w-xs bg-white border border-gray-200 rounded-full shadow-sm px-3 py-1 transition-all duration-500 ease-in-out"
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm text-gray-800 bg-transparent border-none outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-2 text-gray-600 hover:text-primary transition-colors duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className={`flex items-center text-sm font-medium transition-colors duration-500 ${
                    isScrolled
                      ? 'text-gray-800 hover:text-primary'
                      : 'text-white hover:text-gray-200'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Login */}
            <Link
              href="/login"
              className={`text-sm font-medium transition-colors duration-500 ${
                isScrolled
                  ? 'text-gray-800 hover:text-primary'
                  : 'text-white hover:text-gray-200'
              }`}
            >
              Login
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className={`relative transition-colors duration-500 ${
                isScrolled
                  ? 'text-gray-800 hover:text-primary'
                  : 'text-white hover:text-gray-200'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* -------- CATEGORY NAV -------- */}
      <div
        className={`border-t transition-all duration-500 ease-in-out ${
          isScrolled ? 'bg-white border-gray-100' : 'bg-transparent border-transparent'
        }`}
      >
        <nav
          className={`max-w-[1600px] mx-auto flex justify-center space-x-8 py-3 text-sm font-medium transition-all duration-500 ease-in-out ${
            isScrolled
              ? 'text-gray-800 hover:text-primary'
              : 'text-white hover:text-gray-200'
          }`}
        >
          {['NEW ARRIVALS', 'WOMEN', 'MEN', 'ACCESSORIES', 'HOME DECOR', 'FOOTWEAR'].map((item) => (
            <Link
              key={item}
              href="#"
              className={`transition-colors duration-300 ${
                isScrolled
                  ? 'text-gray-800 hover:text-primary'
                  : 'text-white hover:text-gray-200'
              }`}
            >
              {item}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
