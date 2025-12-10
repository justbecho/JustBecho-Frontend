// src/components/layout/Footer.js
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">JustBecho</h3>
            <p className="text-gray-600 text-sm">
              India's premium marketplace for luxury resale. Buy and sell authenticated premium fashion.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium text-black mb-4">Categories</h4>
            <div className="space-y-2 text-sm">
              <Link href="/categories/men" className="block text-gray-600 hover:text-black">Men</Link>
              <Link href="/categories/women" className="block text-gray-600 hover:text-black">Women</Link>
              <Link href="/categories/kids" className="block text-gray-600 hover:text-black">Kids</Link>
              <Link href="/categories/accessories" className="block text-gray-600 hover:text-black">Accessories</Link>
              <Link href="/categories/footwear" className="block text-gray-600 hover:text-black">Footwear</Link>
              <Link href="/categories/toys" className="block text-gray-600 hover:text-black">Toys</Link>
              <Link href="/categories/watches" className="block text-gray-600 hover:text-black">Watches</Link>
              <Link href="/categories/perfumes" className="block text-gray-600 hover:text-black">Perfumes</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium text-black mb-4">Support</h4>
            <div className="space-y-2 text-sm">
              <Link href="/help" prefetch={false} className="block text-gray-600 hover:text-black">Help Center</Link>
              <Link href="/contact-us"   className="block text-gray-600 hover:text-black">Contact Us</Link>
              <Link href="/shipping" prefetch={false} className="block text-gray-600 hover:text-black">Shipping</Link>
              <Link href="/returns" prefetch={false} className="block text-gray-600 hover:text-black">Returns</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-medium text-black mb-4">Legal</h4>
            <div className="space-y-2 text-sm">
              <Link href="/terms/seller-terms" className="block text-gray-600 hover:text-black">Seller Terms & Condition</Link>
              <Link href="/terms/buyer-terms" className="block text-gray-600 hover:text-black">Buyer Terms & Condition</Link>
              <Link href="/privacy-policy" className="block text-gray-600 hover:text-black">Privacy Policy</Link>
              <Link href="/authenticity" prefetch={false} className="block text-gray-600 hover:text-black">Authenticity Guarantee</Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 JustBecho. Premium resale marketplace.
          </p>
        </div>
      </div>
    </footer>
  )
}