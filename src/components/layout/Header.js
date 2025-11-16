'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiUser, FiHeart, FiShoppingBag } from 'react-icons/fi'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    // Initialize on mount
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Categories with dropdown data - Nike website jaisa
  const categories = [
    {
      name: "MEN'S FASHION",
      href: '/categories/men',
      dropdown: {
        sections: [
          {
            title: "TOPWEAR",
            items: ["T-Shirts", "Shirts", "Hoodies", "Sweaters", "Jackets", "Blazers"]
          },
          {
            title: "BOTTOMWEAR", 
            items: ["Jeans", "Trousers", "Shorts", "Track Pants", "Cargos"]
          },
          {
            title: "INDIAN WEAR",
            items: ["Kurtas", "Sherwanis", "Dhotis", "Nehru Jackets", "Pathani Suits"]
          },
          {
            title: "SPORTS WEAR",
            items: ["Sports T-Shirts", "Track Pants", "Shorts", "Jackets"]
          },
          {
            title: "BRANDS",
            items: ["Balenciaga", "Armani", "Prada", "Versace", "Louis Vuitton", "Gucci"]
          }
        ]
      }
    },
    {
      name: "WOMEN'S FASHION",
      href: '/categories/women',
      dropdown: {
        sections: [
          {
            title: "WESTERN WEAR",
            items: ["Dresses", "Tops", "Jeans", "Skirts", "Jumpsuits", "Co-ords"]
          },
          {
            title: "INDIAN WEAR",
            items: ["Sarees", "Kurtis", "Lehengas", "Salwar Suits", "Blouses", "Anarkalis"]
          },
          {
            title: "ACCESSORIES",
            items: ["Handbags", "Jewelry", "Scarves", "Belts", "Hair Accessories"]
          },
          {
            title: "SPORTS WEAR", 
            items: ["Sports Bras", "Leggings", "Shorts", "Tracksuits"]
          },
          {
            title: "BRANDS",
            items: ["Chanel", "Dior", "Gucci", "Louis Vuitton", "Prada", "Zara"]
          }
        ]
      }
    },
    {
      name: "KIDS",
      href: '/categories/kids',
      dropdown: {
        sections: [
          {
            title: "BOYS FASHION",
            items: ["T-Shirts", "Shirts", "Shorts", "Jeans", "Jackets", "Suits"]
          },
          {
            title: "GIRLS FASHION",
            items: ["Dresses", "Tops", "Skirts", "Lehengas", "Frocks", "Sets"]
          },
          {
            title: "INFANTS",
            items: ["Onesies", "Rompers", "Sleepwear", "Sets", "Bodysuits"]
          },
          {
            title: "ACCESSORIES",
            items: ["Shoes", "Bags", "Toys", "Watches", "Stationery"]
          },
          {
            title: "SCHOOL WEAR",
            items: ["Uniforms", "Shoes", "Bags", "Stationery", "Lunch Boxes"]
          }
        ]
      }
    },
    {
      name: "FOOTWEAR",
      href: '/categories/footwear',
      dropdown: {
        sections: [
          {
            title: "MEN'S FOOTWEAR",
            items: ["Sneakers", "Formal Shoes", "Sports Shoes", "Sandals", "Loafers", "Boots"]
          },
          {
            title: "WOMEN'S FOOTWEAR", 
            items: ["Heels", "Flats", "Sandals", "Sports Shoes", "Boots", "Wedges"]
          },
          {
            title: "KIDS FOOTWEAR",
            items: ["School Shoes", "Sandals", "Sports Shoes", "Casual Shoes", "Slippers"]
          },
          {
            title: "SPORTS FOOTWEAR",
            items: ["Running Shoes", "Training Shoes", "Basketball Shoes", "Football Shoes"]
          },
          {
            title: "BRANDS",
            items: ["Nike", "Adidas", "Puma", "Gucci", "Balenciaga", "Jimmy Choo"]
          }
        ]
      }
    },
    {
      name: "WATCHES",
      href: '/categories/watches', 
      dropdown: {
        sections: [
          {
            title: "MEN'S WATCHES",
            items: ["Luxury", "Sports", "Casual", "Smart Watches", "Chronograph"]
          },
          {
            title: "WOMEN'S WATCHES",
            items: ["Luxury", "Fashion", "Casual", "Smart Watches", "Diamond"] 
          },
          {
            title: "UNISEX WATCHES",
            items: ["Minimalist", "Sports", "Luxury", "Smart Watches"]
          },
          {
            title: "BRANDS",
            items: ["Rolex", "Omega", "Tag Heuer", "Fossil", "Apple Watch", "Casio"]
          },
          {
            title: "FEATURES",
            items: ["Chronograph", "Automatic", "Water Resistant", "Smart Features", "GPS"]
          }
        ]
      }
    },
    {
      name: "ELECTRONICS",
      href: '/categories/electronics',
      dropdown: {
        sections: [
          {
            title: "MOBILES & TABLETS",
            items: ["Smartphones", "Tablets", "Accessories", "Cases", "Power Banks"]
          },
          {
            title: "AUDIO",
            items: ["Headphones", "Earphones", "Speakers", "Soundbars", "Earbuds"]
          },
          {
            title: "WEARABLES", 
            items: ["Smart Watches", "Fitness Bands", "VR Headsets", "Smart Glasses"]
          },
          {
            title: "LAPTOPS & PC",
            items: ["Laptops", "Desktops", "Monitors", "Keyboards", "Mouse"]
          },
          {
            title: "BRANDS",
            items: ["Apple", "Samsung", "Sony", "JBL", "Bose", "OnePlus"]
          }
        ]
      }
    },
    {
      name: "HOME & LIVING",
      href: '/categories/home',
      dropdown: {
        sections: [
          {
            title: "FURNITURE",
            items: ["Sofas", "Beds", "Dining Tables", "Wardrobes", "Chairs", "Desks"]
          },
          {
            title: "DECOR",
            items: ["Wall Art", "Showpieces", "Clocks", "Mirrors", "Plants", "Vases"]
          },
          {
            title: "KITCHEN & DINING",
            items: ["Cookware", "Dinner Sets", "Appliances", "Storage", "Cutlery"]
          },
          {
            title: "BEDDING",
            items: ["Bedsheets", "Pillows", "Blankets", "Curtains", "Mattresses"]
          },
          {
            title: "LIGHTING",
            items: ["Lamps", "LED Lights", "Chandeliers", "Wall Lights", "Table Lamps"]
          }
        ]
      }
    },
    {
      name: "ACCESSORIES",
      href: '/categories/accessories',
      dropdown: {
        sections: [
          {
            title: "BAGS",
            items: ["Handbags", "Backpacks", "Wallets", "Luggage", "Clutches", "Totes"]
          },
          {
            title: "JEWELRY",
            items: ["Necklaces", "Earrings", "Rings", "Bracelets", "Watches", "Anklets"]
          },
          {
            title: "EYEWEAR",
            items: ["Sunglasses", "Spectacles", "Contact Lenses", "Reading Glasses"]
          },
          {
            title: "OTHER ACCESSORIES",
            items: ["Belts", "Caps", "Scarves", "Ties", "Perfumes", "Wallets"]
          },
          {
            title: "TRAVEL",
            items: ["Luggage", "Travel Bags", "Passport Covers", "Neck Pillows"]
          }
        ]
      }
    }
  ]

  return (
    <>
      {/* MAIN HEADER */}
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

              {/* Sell Now Button */}
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

            {/* RIGHT: Icons */}
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

              {/* Desktop Options */}
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

        {/* MOBILE MENU */}
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

      {/* SUBHEADER WITH CATEGORIES */}
      <div
        className={`fixed top-20 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        {/* Main Categories Bar */}
        <div className="w-[95%] sm:w-[90%] mx-auto">
          <nav className="hidden md:flex items-center justify-center space-x-8 lg:space-x-12 py-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="relative group"
                onMouseEnter={() => setActiveCategory(category.name)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                {/* Category Link */}
                <Link
                  href={category.href}
                  className={`text-sm font-light tracking-widest uppercase transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'text-gray-800 hover:text-gray-600' 
                      : 'text-white hover:text-gray-200'
                  }`}
                >
                  {category.name}
                </Link>

                {/* FULL WIDTH DROPDOWN - NIKE STYLE */}
                {activeCategory === category.name && (
                  <div 
                    className="fixed left-0 right-0 top-[140px] bg-white shadow-2xl border-t border-gray-100 py-12 z-[60]"
                    onMouseEnter={() => setActiveCategory(category.name)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    <div className="w-[95%] sm:w-[90%] mx-auto">
                      <div className="grid grid-cols-5 gap-12">
                        {category.dropdown.sections.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="space-y-4">
                            <h3 className="text-gray-900 text-base font-medium tracking-wider uppercase mb-4 border-b border-gray-200 pb-2">
                              {section.title}
                            </h3>
                            <ul className="space-y-3">
                              {section.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <Link
                                    href={`${category.href}?subcategory=${item.toLowerCase().replace(' ', '-')}`}
                                    className="text-gray-600 text-sm font-light tracking-wide hover:text-gray-900 transition-colors duration-200 block py-1 hover:translate-x-1 transform transition-transform"
                                  >
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      
                      {/* View All Button - Centered */}
                      <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                        <Link
                          href={category.href}
                          className="inline-flex items-center text-gray-900 text-base font-medium tracking-wider uppercase hover:text-gray-700 transition-colors duration-200 border-b-2 border-gray-900 pb-1"
                        >
                          View All {category.name} 
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Mobile Categories - Horizontal Scroll */}
        <div className="md:hidden border-t border-gray-200/50">
          <div className="flex overflow-x-auto space-x-6 py-3 px-4 hide-scrollbar">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`flex-shrink-0 text-xs font-light tracking-widest uppercase whitespace-nowrap ${
                  isScrolled 
                    ? 'text-gray-800 hover:text-gray-600' 
                    : 'text-white hover:text-gray-200'
                }`}
              >
                {category.name.split(' ')[0]}
              </Link>
            ))}
          </div>
        </div>

        <style jsx>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </>
  )
}