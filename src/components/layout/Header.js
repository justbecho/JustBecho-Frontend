'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiUser, FiHeart, FiShoppingBag, FiLogOut, FiSettings, FiPackage, FiShoppingCart, FiSearch, FiHome, FiMenu, FiX } from 'react-icons/fi'
import { usePathname, useRouter } from 'next/navigation'
import AuthModal from '@/components/ui/AuthModal'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuAnimating, setIsMenuAnimating] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)
  const [cartApiAvailable, setCartApiAvailable] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // ... (rest of your states and useEffect hooks remain the same)

  return (
    <>
      {/* ✅ MAIN HEADER - ALWAYS WHITE WITH DARK TEXT */}
      <header className="fixed top-0 left-0 right-0 z-50 font-sans bg-white text-gray-900 shadow-sm">
        <div className="w-[95%] sm:w-[90%] mx-auto">
          <div className="flex items-center justify-between py-4 sm:py-5">
            
            {/* ✅ LEFT SECTION: Desktop Search + Sell Now */}
            <div className="hidden md:flex items-center space-x-4">
              
              {/* DESKTOP SEARCH BAR - DARK THEME */}
              <div className="relative w-60 lg:w-72 search-container">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                    className="border border-gray-300 rounded-full px-4 py-2.5 text-sm outline-none w-full text-gray-800 bg-white placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                  >
                    <FiSearch className="w-4 h-4" />
                  </button>
                </form>
                
                {/* SEARCH RESULTS */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl rounded-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
                    {/* Search results content */}
                  </div>
                )}
              </div>
              
              {/* DESKTOP SELL NOW BUTTON - DARK THEME */}
              <button
                onClick={handleSellNowClick}
                className="px-5 py-2.5 rounded-full text-sm font-medium transition-colors bg-black text-white hover:bg-gray-800"
              >
                Sell Now
              </button>
            </div>

            {/* ✅ MOBILE Burger Menu - DARK BURGER ICON */}
            <div className="md:hidden flex items-center">
              <button
                className={`focus:outline-none p-1 ${
                  isMenuAnimating ? 'opacity-70' : ''
                }`}
                onClick={handleBurgerClick}
                aria-label="Menu"
              >
                <div className="relative w-6 h-6">
                  <span className={`absolute top-1/2 left-0 w-6 h-0.5 transform transition-all duration-300 ${
                    isMenuOpen 
                      ? 'rotate-45 translate-y-0 bg-gray-900' 
                      : '-translate-y-2 bg-gray-900'
                  }`}></span>
                  <span className={`absolute top-1/2 left-0 w-6 h-0.5 transform transition-all duration-300 ${
                    isMenuOpen 
                      ? 'opacity-0 translate-x-4' 
                      : 'opacity-100'
                  } bg-gray-900`}></span>
                  <span className={`absolute top-1/2 left-0 w-6 h-0.5 transform transition-all duration-300 ${
                    isMenuOpen 
                      ? '-rotate-45 translate-y-0 bg-gray-900' 
                      : 'translate-y-2 bg-gray-900'
                  }`}></span>
                </div>
              </button>
            </div>

            {/* ✅ CENTER: Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="flex items-center justify-center">
                <Image
                  src="/Just Becho Logo Golden.png"
                  alt="Just Becho"
                  width={70}
                  height={70}
                  className="h-14 w-auto transition-all duration-500 mt-1"
                  priority
                />
              </Link>
            </div>

            {/* ✅ RIGHT SECTION: Icons - DARK ICONS */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              {/* Desktop Icons - DARK */}
              <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                {/* Profile Icon with Dropdown */}
                <div className="relative">
                  <button 
                    onClick={handleProfileClick}
                    className="hover:text-gray-700 transition-all duration-300 transform hover:scale-110 flex items-center text-gray-900"
                  >
                    <FiUser className="w-6 h-6 lg:w-7 lg:h-7" />
                  </button>

                  {/* User Dropdown - DARK TEXT */}
                  {showUserDropdown && user && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'User'}</p>
                        
                        {/* Seller Status Badge */}
                        {user.role === 'seller' && (
                          <div className="mt-2">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.sellerVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.sellerVerified ? 'Seller Verified' : 'Seller Pending'}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Dashboard Links - DARK TEXT */}
                      <div className="py-1">
                        <Link 
                          href="/dashboard" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <FiUser className="w-4 h-4 mr-3 text-gray-400" />
                          My Dashboard
                        </Link>
                        
                        {user.role === 'seller' && (
                          <Link 
                            href="/dashboard?section=listings" 
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <FiPackage className="w-4 h-4 mr-3 text-gray-400" />
                            My Listings
                          </Link>
                        )}
                        
                        <Link 
                          href="/dashboard?section=orders" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <FiShoppingCart className="w-4 h-4 mr-3 text-gray-400" />
                          My Orders
                        </Link>
                      </div>
                      
                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-1">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiLogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Wishlist Icon - DARK */}
                <button 
                  onClick={handleWishlistClick}
                  className="hover:text-gray-700 transition-all duration-300 transform hover:scale-110 flex items-center text-gray-900"
                >
                  <FiHeart className="w-6 h-6 lg:w-7 lg:h-7" />
                </button>

                {/* Cart Icon - DARK */}
                {cartApiAvailable && (
                  <button 
                    onClick={handleCartClick}
                    className="relative hover:text-gray-700 transition-all duration-300 transform hover:scale-110 flex items-center text-gray-900"
                  >
                    <FiShoppingBag className="w-6 h-6 lg:w-7 lg:h-7" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </button>
                )}
              </div>

              {/* Mobile Cart Icon - DARK */}
              {cartApiAvailable && (
                <button 
                  onClick={handleMobileCartClick}
                  className="md:hidden relative hover:text-gray-700 transition-all duration-300 flex items-center text-gray-900"
                >
                  <FiShoppingBag className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ✅ MOBILE SEARCH BAR - DARK THEME */}
          <div className="md:hidden border-t border-gray-200 mt-2 pt-2 pb-1 search-container">
            <div className="relative">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none w-full font-light tracking-wide text-gray-800 placeholder-gray-500 bg-white"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  <FiSearch className="w-4 h-4" />
                </button>
              </form>
              
              {/* Mobile Search Results */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl rounded-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
                  {/* Search results content */}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ MOBILE MENU - ALREADY HAS WHITE BACKGROUND */}
        <div className={`md:hidden fixed top-0 left-0 right-0 bottom-0 z-[60] transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel - WHITE WITH DARK TEXT */}
          <div className={`absolute top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <nav className="flex flex-col h-full overflow-y-auto">
              {/* Header with Close Button - DARK TEXT */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <Image
                    src="/Just Becho Logo Golden.png"
                    alt="Just Becho"
                    width={40}
                    height={40}
                    className="h-10 w-auto"
                  />
                  <span className="ml-3 text-lg font-light tracking-widest uppercase text-gray-900">
                    MENU
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <FiX className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* CATEGORIES SECTION - DARK TEXT */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">CATEGORIES</h3>
                <div className="grid grid-cols-2 gap-3">
                  {loading ? (
                    <div className="col-span-2 text-xs text-gray-500">Loading categories...</div>
                  ) : transformedCategories.length > 0 ? (
                    transformedCategories.map((category, index) => (
                      <Link
                        key={category.name || index}
                        href={category.href}
                        className="px-4 py-3 text-xs font-light bg-gray-50 text-gray-800 hover:bg-gray-100 rounded-lg transition-all text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name.toUpperCase()}
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-2 text-xs text-gray-500">No categories available</div>
                  )}
                </div>
              </div>

              {/* Mobile Menu Items - DARK TEXT */}
              <div className="flex-1 p-6 space-y-1">
                {/* Home Link */}
                <Link 
                  href="/"
                  className="flex items-center py-3 px-4 text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiHome className="w-5 h-5 mr-4 text-gray-900" />
                  <span className="font-light tracking-widest uppercase">HOME</span>
                </Link>
                
                {/* Mobile Sell Now Button */}
                <button 
                  onClick={handleMobileSellNowClick}
                  className="flex items-center w-full py-3 px-4 text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300 text-left"
                >
                  <span className="w-5 h-5 mr-4 text-center text-gray-900 font-bold">$</span>
                  <span className="font-light tracking-widest uppercase">SELL NOW</span>
                </button>
                
                {user ? (
                  <>
                    {/* Seller Status in Mobile Menu */}
                    {user.role === 'seller' && (
                      <div className="px-4 py-3 mb-2 bg-gray-50 rounded-lg">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.sellerVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.sellerVerified ? 'Seller Verified' : 'Seller Pending'}
                        </div>
                        {user.username && (
                          <p className="text-xs text-gray-600 mt-1">
                            Username: {ensureJustbechoFormat(user.username)}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <Link href="/dashboard" className="flex items-center py-3 px-4 text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                      <FiUser className="w-5 h-5 mr-4 text-gray-900" />
                      <span className="font-light tracking-widest uppercase">DASHBOARD</span>
                    </Link>
                    
                    {user.role === 'seller' && (
                      <Link href="/dashboard?section=listings" className="flex items-center py-3 px-4 text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                        <FiPackage className="w-5 h-5 mr-4 text-gray-900" />
                        <span className="font-light tracking-widest uppercase">MY LISTINGS</span>
                      </Link>
                    )}
                    
                    <Link href="/dashboard?section=purchases" className="flex items-center py-3 px-4 text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                      <FiShoppingCart className="w-5 h-5 mr-4 text-gray-900" />
                      <span className="font-light tracking-widest uppercase">MY PURCHASES</span>
                    </Link>
                    
                    <button onClick={handleMobileLogout} className="flex items-center w-full py-3 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-300 text-left">
                      <FiLogOut className="w-5 h-5 mr-4 text-red-600" />
                      <span className="font-light tracking-widest uppercase">LOGOUT</span>
                    </button>
                  </>
                ) : (
                  <button onClick={handleMobileProfileClick} className="flex items-center w-full py-3 px-4 text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300 text-left">
                    <FiUser className="w-5 h-5 mr-4 text-gray-900" />
                    <span className="font-light tracking-widest uppercase">PROFILE</span>
                  </button>
                )}
                
                {/* Mobile Wishlist */}
                <button 
                  onClick={handleMobileWishlistClick}
                  className="flex items-center w-full py-3 px-4 text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300 text-left"
                >
                  <FiHeart className="w-5 h-5 mr-4 text-gray-900" />
                  <span className="font-light tracking-widest uppercase">WISHLIST</span>
                </button>
                
                {/* Mobile Cart */}
                {cartApiAvailable && (
                  <button 
                    onClick={handleMobileCartClick}
                    className="flex items-center w-full py-3 px-4 text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300 text-left"
                  >
                    <FiShoppingBag className="w-5 h-5 mr-4 text-gray-900" />
                    <span className="font-light tracking-widest uppercase">
                      CART {cartCount > 0 && `(${cartCount})`}
                    </span>
                  </button>
                )}
              </div>

              {/* Footer - DARK TEXT */}
              <div className="p-6 border-t border-gray-200 mt-auto">
                <p className="text-xs text-gray-500 text-center">
                  © 2024 Just Becho. All rights reserved.
                </p>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* ✅ SUBHEADER WITH CATEGORIES - WHITE WITH DARK TEXT */}
      <div className="hidden md:block fixed top-20 left-0 right-0 z-40 bg-white shadow-md">
        {/* Main Categories Bar - Desktop Only */}
        <div className="w-[95%] sm:w-[90%] mx-auto">
          <nav className="flex items-center justify-center space-x-8 lg:space-x-12 py-4">
            {loading ? (
              <div className="text-sm text-gray-500">Loading categories...</div>
            ) : transformedCategories.length > 0 ? (
              transformedCategories.map((category, index) => (
                <div
                  key={category.name || index}
                  className="relative group"
                  onMouseEnter={() => setActiveCategory(category.name)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  {/* Category Link - DARK TEXT */}
                  <Link
                    href={category.href}
                    className="text-sm font-light tracking-widest uppercase transition-all duration-300 hover:scale-105 text-gray-800 hover:text-gray-600"
                  >
                    {category.name.toUpperCase()}
                  </Link>

                  {/* COMPACT DROPDOWN - DARK TEXT */}
                  {activeCategory === category.name && (
                    <div 
                      className="fixed left-0 right-0 top-[130px] bg-white shadow-2xl border-t border-gray-100 py-8 z-[60]"
                      onMouseEnter={() => setActiveCategory(category.name)}
                      onMouseLeave={() => setActiveCategory(null)}
                    >
                      <div className="w-[95%] sm:w-[90%] mx-auto max-w-5xl">
                        <div className="grid grid-cols-5 gap-6">
                          {category.dropdown.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="space-y-2">
                              {/* Section Title - Compact - DARK */}
                              <h3 className="text-gray-900 text-[13px] font-semibold tracking-wide uppercase mb-1">
                                {section.title}
                              </h3>
                              
                              {/* Section Items - Compact - DARK */}
                              <ul className="space-y-1">
                                {section.items.map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    <Link
                                      href={`${category.href}?subcategory=${(item || '').toLowerCase().replace(/\s+/g, '-')}`}
                                      className="text-gray-600 text-[12px] font-normal hover:text-gray-900 transition-colors duration-200 block py-0.5"
                                    >
                                      {item}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        
                        {/* View All Button - Compact - DARK */}
                        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                          <Link
                            href={category.href}
                            className="inline-flex items-center text-gray-900 text-[13px] font-semibold tracking-wide uppercase hover:text-gray-700 transition-colors duration-200 group"
                          >
                            View All {category.name} 
                            <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No categories available</div>
            )}
          </nav>
        </div>
      </div>

      {/* AUTH MODAL */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  )
}