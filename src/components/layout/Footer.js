// src/components/layout/Footer.js
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4">JustBecho</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
A curated marketplace for luxury and premium fashion.
Buy and sell brand-new or pre-owned pieces with confidence, backed by Becho Protect, which offers authenticity verification and secure transactions.
A refined way to experience luxury online.            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium text-black mb-3 sm:mb-4 text-sm sm:text-base">Categories</h4>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-2">
              <Link href="/categories/men" className="text-gray-600 hover:text-black text-xs sm:text-sm transition-colors">Men</Link>
              <Link href="/categories/women" className="text-gray-600 hover:text-black text-xs sm:text-sm transition-colors">Women</Link>
              <Link href="/categories/kids" className="text-gray-600 hover:text-black text-xs sm:text-sm transition-colors">Kids</Link>
              <Link href="/categories/accessories" className="text-gray-600 hover:text-black text-xs sm:text-sm transition-colors">Accessories</Link>
              <Link href="/categories/footwear" className="text-gray-600 hover:text-black text-xs sm:text-sm transition-colors">Footwear</Link>
              <Link href="/categories/toys" className="text-gray-600 hover:text-black text-xs sm:text-sm transition-colors">Toys</Link>
              <Link href="/categories/watches" className="text-gray-600 hover:text-black text-xs sm:text-sm transition-colors">Watches</Link>
              <Link href="/categories/perfumes" className="text-gray-600 hover:text-black text-xs sm:text-sm transition-colors">Perfumes</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium text-black mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
            <div className="space-y-2 sm:space-y-2">
              <Link href="/contact-us" className="block text-gray-600 hover:text-black text-xs sm:text-sm transition-colors">Contact Us</Link>
              <Link href="/shipping" className="block text-gray-600 hover:text-black text-xs sm:text-sm transition-colors">Shipping</Link>
              <Link href="/returns" className="block text-gray-600 hover:text-black text-xs sm:text-sm transition-colors">Returns & Refunds</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-medium text-black mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
            <div className="space-y-2 sm:space-y-2">
              <Link href="/terms/seller-terms" className="block text-gray-600 hover:text-black text-xs sm:text-sm transition-colors">Seller Terms & Condition</Link>
              <Link href="/terms/buyer-terms" className="block text-gray-600 hover:text-black text-xs sm:text-sm transition-colors">Buyer Terms & Condition</Link>
              <Link href="/privacy-policy" className="block text-gray-600 hover:text-black text-xs sm:text-sm transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-100">
          <div className="text-center">
            <p className="text-gray-500 text-xs sm:text-sm">
              © 2025 JustBecho. Premium resale marketplace.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}