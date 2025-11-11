// src/app/page.js
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const categories = [
    { name: 'Men Fashion', href: '/categories/men', count: '12K+ items', icon: '👔' },
    { name: 'Women Fashion', href: '/categories/women', count: '15K+ items', icon: '👗' },
    { name: 'Electronics', href: '/categories/electronics', count: '8K+ items', icon: '📱' },
    { name: 'Home & Living', href: '/categories/home', count: '5K+ items', icon: '🏠' },
    { name: 'Footwear', href: '/categories/footwear', count: '6K+ items', icon: '👟' },
  ]

  const featuredProducts = [
    { 
      id: 1, 
      name: 'Samsung Galaxy S23', 
      price: '₹45,999', 
      originalPrice: '₹85,000',
      discount: '46% off',
      condition: 'Like New', 
      rating: 4.5,
    },
    { 
      id: 2, 
      name: 'Nike Air Jordan 1', 
      price: '₹12,499', 
      originalPrice: '₹18,000',
      discount: '30% off',
      condition: 'Excellent', 
      rating: 4.8,
    },
    { 
      id: 3, 
      name: 'Zara Leather Jacket', 
      price: '₹8,499', 
      originalPrice: '₹12,000',
      discount: '29% off',
      condition: 'New', 
      rating: 4.3,
    },
    { 
      id: 4, 
      name: 'Apple MacBook Air', 
      price: '₹62,999', 
      originalPrice: '₹95,000',
      discount: '34% off',
      condition: 'Mint', 
      rating: 4.9,
    },
  ]

  const stats = [
    { number: '1Lakh+', label: 'Happy Customers', icon: '😊' },
    { number: '50K+', label: 'Verified Sellers', icon: '✅' },
    { number: '2Lakh+', label: 'Products Sold', icon: '📦' },
    { number: '98%', label: 'Satisfaction Rate', icon: '⭐' },
  ]

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Hero Section with Image */}
        <section className="relative h-[80vh] md:h-[70vh] overflow-hidden">

          <Header />
          
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/home banner.jpg" // Ya fir jo bhi image name hai
              alt="Just Becho - Buy and Sell Pre-loved Items"
              fill
              className="object-cover"
              priority
            />
            {/* Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
         
               

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-secondary">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-text-primary mb-2">{stat.number}</div>
                  <div className="text-text-secondary font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-text-primary mb-4">Shop by Category</h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Find everything you need in our carefully curated categories
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group text-center p-6 bg-white rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-secondary"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 shadow-lg">
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <h3 className="font-bold text-text-primary mb-2">{category.name}</h3>
                  <p className="text-sm text-text-secondary font-medium">{category.count}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-secondary">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-text-primary mb-4">Trending Now 🔥</h2>
              <p className="text-lg text-text-secondary">Handpicked items with amazing discounts</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-secondary">
                  <div className="aspect-square bg-gradient-to-br from-secondary to-gray-200 relative overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-text-secondary text-sm">Product Image</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-bold">
                        {product.discount}
                      </span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-accent text-white px-2 py-1 rounded-full text-xs font-medium">
                        {product.condition}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1 mb-2">
                      {'⭐'.repeat(Math.floor(product.rating))}
                      <span className="text-sm text-text-secondary ml-1">({product.rating})</span>
                    </div>
                    <h3 className="font-bold text-text-primary mb-2 leading-tight">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold text-text-primary">{product.price}</span>
                      <span className="text-sm text-text-secondary line-through">{product.originalPrice}</span>
                    </div>
                    <button className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/products" className="inline-flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-xl font-semibold hover:bg-text-primary transition-all duration-300 transform hover:scale-105 shadow-lg">
                View All Products
                <span className="text-lg">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 bg-accent text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Choose Just Becho?</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                We make buying and selling pre-loved items safe, easy, and rewarding
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Quality Checked</h3>
                <p className="text-gray-300">Every item is verified for quality and authenticity</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Easy Shipping</h3>
                <p className="text-gray-300">Free pickup and delivery across India</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">💸</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Best Prices</h3>
                <p className="text-gray-300">Get the best value for your pre-loved items</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
                <p className="text-gray-300">100% secure payments with buyer protection</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Join Just Becho?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of happy customers who are buying and selling smart.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/signup" 
                className="bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-secondary transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Create Free Account
              </Link>
              <Link 
                href="/about" 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 shadow-2xl"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}