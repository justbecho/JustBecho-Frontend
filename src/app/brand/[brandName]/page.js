// app/brand/[brandName]/page.js
"use client"

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function BrandPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [brandName, setBrandName] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState(null)
  const [totalProducts, setTotalProducts] = useState(0)

  useEffect(() => {
    if (params.brandName) {
      // URL से brand name decode करें
      const decodedBrandName = decodeURIComponent(params.brandName).replace(/-/g, ' ')
      setBrandName(decodedBrandName)
      
      // Search params से category get करें
      const categoryParam = searchParams.get('category')
      if (categoryParam) {
        const decodedCategory = decodeURIComponent(categoryParam).replace(/-/g, ' ')
        setCategory(decodedCategory)
      }

      fetchProducts(decodedBrandName, categoryParam)
    }
  }, [params.brandName, searchParams])

  const fetchProducts = async (brand, category) => {
    try {
      setLoading(true)
      setError(null)
      
      // Build API URL
      let apiUrl = `https://just-becho-backend.vercel.app/api/products/brand/${encodeURIComponent(brand)}`
      
      // Add category parameter if available
      if (category) {
        apiUrl += `?category=${encodeURIComponent(category)}`
      }
      
      console.log('Fetching products from:', apiUrl)
      
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products || [])
        setTotalProducts(data.pagination?.total || data.products?.length || 0)
      } else {
        setProducts([])
        setError(data.message || 'Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setError(error.message || 'Network error occurred')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const renderProductCard = (product) => {
    if (!product || !product._id) return null;
    
    const productName = product.productName || 'Product';
    const safeProductName = typeof productName === 'string' ? productName : 'Product';
    const safeCondition = product.condition && typeof product.condition === 'string' ? product.condition : '';
    const primaryImage = product.images?.[0]?.url || '/images/placeholder.jpg';
    
    return (
      <Link 
        href={`/products/${product._id}`}
        key={product._id}
        className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-300 block"
      >
        <div className="relative w-full aspect-square overflow-hidden mb-3 rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
          <Image
            src={primaryImage}
            alt={safeProductName}
            fill
            className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
              e.target.onerror = null;
            }}
          />
          {safeCondition && (
            <div className="absolute top-2 left-2 z-20">
              <span className="text-gray-900 text-xs font-light tracking-widest uppercase bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                {safeCondition.toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="text-left px-1 pt-2">
          <h3 className="text-gray-800 text-sm font-light tracking-widest uppercase mb-2 line-clamp-2 leading-tight">
            {safeProductName.toUpperCase()}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 text-base font-light tracking-widest uppercase">
                ₹{product.finalPrice?.toLocaleString() || '0'}
              </p>
              {product.originalPrice && product.originalPrice > product.finalPrice && (
                <p className="text-gray-500 text-sm line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </p>
              )}
            </div>
            {product.likes > 0 && (
              <span className="text-gray-500 text-xs flex items-center gap-1">
                ♥️ {product.likes}
              </span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  const safeToUpperCase = (str) => {
    if (typeof str === 'string') {
      return str.toUpperCase();
    }
    return '';
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white pt-24">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
          {/* Brand Header Section */}
          <section className="py-10 text-center">
            <div className="mb-6">
              <h1 className="text-gray-900 text-3xl sm:text-5xl font-light tracking-widest uppercase mb-4 animate-fade-in-up">
                {safeToUpperCase(brandName)}
              </h1>
              
              {category ? (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-gray-600 text-lg font-light max-w-2xl">
                    Explore  {brandName} products in {category}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">•</span>
                    <Link 
                      href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-gray-900 text-base font-light tracking-widest uppercase hover:text-gray-700 transition-colors duration-300"
                    >
                      → {safeToUpperCase(category)}
                    </Link>
                    <span className="text-gray-400">•</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
                  Discover  {brandName} luxury items
                </p>
              )}
              
              <div className="w-32 h-0.5 bg-gradient-to-r from-gray-300 via-gray-900 to-gray-300 mx-auto mt-6"></div>
            </div>

            {/* Stats - Views removed */}
            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto mb-8">
                <div className="text-center">
                  <div className="text-gray-900 text-3xl font-light mb-1">{products.length}</div>
                  <div className="text-gray-600 text-sm font-light tracking-widest uppercase">PRODUCTS</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-900 text-3xl font-light mb-1">
                    ₹{Math.min(...products.map(p => p.finalPrice || 0)).toLocaleString() || '0'}
                  </div>
                  <div className="text-gray-600 text-sm font-light tracking-widest uppercase">STARTING FROM</div>
                </div>
              </div>
            )}
          </section>

          {/* Loading State */}
          {loading && (
            <section className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-6"></div>
              <h3 className="text-gray-900 text-xl font-light tracking-widest uppercase mb-3">
                LOADING {safeToUpperCase(brandName)}
              </h3>
              <p className="text-gray-600">Fetching luxury items...</p>
            </section>
          )}

          {/* Error State */}
          {error && !loading && (
            <section className="py-16 text-center">
              <div className="text-gray-400 text-7xl mb-8">🔍</div>
              <h2 className="text-gray-900 text-2xl font-light tracking-widest uppercase mb-4">
                UNABLE TO LOAD PRODUCTS
              </h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
                {error}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => fetchProducts(brandName, category)}
                  className="bg-gray-900 text-white px-8 py-3 font-light tracking-widest uppercase hover:bg-gray-800 transition-all duration-300 rounded-full text-sm flex items-center gap-2"
                >
                  <span>⟳</span> TRY AGAIN
                </button>
                <Link
                  href="/products"
                  className="border border-gray-900 text-gray-900 px-8 py-3 font-light tracking-widest uppercase hover:bg-gray-50 transition-all duration-300 rounded-full text-sm"
                >
                  BROWSE ALL LUXURY
                </Link>
              </div>
            </section>
          )}

          {/* Products Grid Section */}
          {!loading && !error && products.length > 0 && (
            <section className="py-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-gray-900 text-2xl sm:text-3xl font-light tracking-widest uppercase mb-2">
                    CURATED COLLECTION
                  </h2>
               
                </div>
                
                <div className="flex items-center gap-4">
                  {category && (
                    <Link
                      href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-gray-900 text-sm font-light tracking-widest uppercase hover:text-gray-700 transition-colors duration-300 border-b border-transparent hover:border-gray-900"
                    >
                      VIEW ALL {safeToUpperCase(category)}
                    </Link>
                  )}
                  <Link
                    href="/sell-now"
                    className="bg-gray-900 text-white px-6 py-2.5 font-light tracking-widest uppercase hover:bg-gray-800 transition-all duration-300 rounded-full text-sm"
                  >
                    SELL {safeToUpperCase(brandName)}
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
                {products.map(renderProductCard)}
              </div>

              {/* View More Button */}
              <div className="text-center mt-12">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-3 text-gray-900 text-lg font-light tracking-widest uppercase hover:text-gray-700 transition-all duration-500 group"
                >
                  <span className="relative">
                    → EXPLORE MORE LUXURY BRANDS
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-700 group-hover:delay-100"></span>
                  </span>
                </Link>
              </div>
            </section>
          )}

          {/* No Products State */}
          {!loading && !error && products.length === 0 && (
            <section className="py-16 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="text-gray-300 text-8xl mb-6">👜</div>
                <h2 className="text-gray-900 text-3xl font-light tracking-widest uppercase mb-4">
                  NO {safeToUpperCase(brandName)} PRODUCTS YET
                </h2>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  We currently don't have any {brandName} products listed
                  {category && ` in the ${category} category`}.
                  Be the first to list a {brandName} product!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <div className="text-gray-900 text-2xl mb-2">📱</div>
                    <h3 className="text-gray-900 font-light tracking-widest uppercase mb-2 text-sm">LIST YOUR ITEM</h3>
                    <p className="text-gray-600 text-xs">List your {brandName} product with detailed photos</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <div className="text-gray-900 text-2xl mb-2">🔍</div>
                    <h3 className="text-gray-900 font-light tracking-widest uppercase mb-2 text-sm">GET VERIFIED</h3>
                    <p className="text-gray-600 text-xs">Our experts authenticate every {brandName} product (Only with BECHO PROTECT)</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-xl">
                    <div className="text-gray-900 text-2xl mb-2">💎</div>
                    <h3 className="text-gray-900 font-light tracking-widest uppercase mb-2 text-sm">SELL WITH TRUST</h3>
                    <p className="text-gray-600 text-xs">Reach thousands of luxury buyers</p>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* Related Categories Section */}
          {!loading && !error && products.length > 0 && category && (
            <section className="py-12 border-t border-gray-100">
              <div className="text-center mb-10">
                <h2 className="text-gray-900 text-2xl sm:text-3xl font-light tracking-widest uppercase mb-4">
                  EXPLORE MORE IN {safeToUpperCase(category)}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover other luxury brands in {category}
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {['Gucci', 'Prada', 'Louis Vuitton', 'Chanel', 'Dior', 'Burberry']
                  .filter(brand => brand.toLowerCase() !== brandName.toLowerCase())
                  .slice(0, 6)
                  .map((relatedBrand) => (
                    <Link
                      key={relatedBrand}
                      href={`/brand/${relatedBrand.toLowerCase().replace(/\s+/g, '-')}?category=${encodeURIComponent(category)}`}
                      className="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl text-center transition-all duration-300 group"
                    >
                      <div className="text-gray-900 text-lg font-light mb-1 group-hover:text-gray-700">
                        {relatedBrand}
                      </div>
                      <div className="text-gray-500 text-xs font-light tracking-widest uppercase">
                        {category}
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* ✅ UPDATED: Full Width CTA Section with Reduced Height */}
        <section className="py-12 bg-gradient-to-r from-gray-900 to-black mt-12">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-white text-2xl sm:text-3xl font-light tracking-widest uppercase mb-4">
              READY TO SELL YOUR {safeToUpperCase(brandName)}?
            </h2>
            <p className="text-gray-300 text-base font-light tracking-widest uppercase mb-6 max-w-2xl mx-auto">
              Get the best value for your authentic {brandName} items
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/sell-now"
                className="bg-white text-gray-900 px-6 py-3 font-light tracking-widest uppercase hover:bg-gray-100 transition-all duration-300 rounded-full text-base"
              >
                SELL {safeToUpperCase(brandName)}
              </Link>
              <Link
                href="/products"
                className="border border-white text-white px-6 py-3 font-light tracking-widest uppercase hover:bg-white hover:text-gray-900 transition-all duration-300 rounded-full text-base"
              >
                BROWSE ALL LUXURY
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}