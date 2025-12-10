// app/brand/[brandName]/page.js
"use client"

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export default function BrandPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [brandName, setBrandName] = useState('')
  const [category, setCategory] = useState('')

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
      
      // API endpoint - आपके backend के according adjust करें
      let apiUrl = `https://just-becho-backend.vercel.app/api/products?brand=${encodeURIComponent(brand)}`
      
      // अगर category है तो उसे भी filter में add करें
      if (category) {
        apiUrl += `&category=${encodeURIComponent(category)}`
      }
      
      const response = await fetch(apiUrl)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.products) {
          setProducts(data.products)
        } else {
          setProducts([])
        }
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
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
    
    return (
      <Link 
        href={`/products/${product._id}`}
        key={product._id}
        className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-300 block"
      >
        <div className="relative w-full aspect-square overflow-hidden mb-3 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
          <img
            src={product.images?.[0]?.url || '/images/placeholder.jpg'}
            alt={safeProductName}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
              e.target.onerror = null;
            }}
          />
          {safeCondition && (
            <div className="absolute top-2 left-2">
              <span className="text-gray-900 text-xs font-light tracking-widest uppercase bg-white px-2 py-1 rounded-full">
                {safeCondition.toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="text-left px-1">
          <h3 className="text-gray-800 text-sm font-light tracking-widest uppercase mb-1 line-clamp-2">
            {safeProductName.toUpperCase()}
          </h3>
          <p className="text-gray-900 text-base font-light tracking-widest uppercase">
            ₹{product.finalPrice?.toLocaleString() || '0'}
          </p>
          {product.originalPrice && product.originalPrice > product.finalPrice && (
            <p className="text-gray-500 text-sm line-through">
              ₹{product.originalPrice.toLocaleString()}
            </p>
          )}
        </div>
      </Link>
    )
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white pt-24">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
          {/* Brand Header */}
          <div className="text-center mb-12">
            <h1 className="text-gray-900 text-3xl sm:text-4xl font-light tracking-widest uppercase mb-3">
              {brandName.toUpperCase()}
            </h1>
            {category && (
              <p className="text-gray-600 text-lg font-light">
                in {category.charAt(0).toUpperCase() + category.slice(1)}
              </p>
            )}
            <div className="w-24 h-0.5 bg-gray-900 mx-auto mt-4"></div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Showing {products.length} product{products.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {products.map(renderProductCard)}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-400 text-6xl mb-6">👜</div>
              <h2 className="text-gray-900 text-2xl font-light tracking-widest uppercase mb-4">
                NO PRODUCTS AVAILABLE
              </h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Currently there are no {brandName} products listed in this category.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="bg-gray-900 text-white px-6 py-3 font-light tracking-widest uppercase hover:bg-gray-800 transition-all duration-300 rounded-full text-sm"
                >
                  BROWSE ALL PRODUCTS
                </Link>
                {category && (
                  <Link
                    href={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="border border-gray-900 text-gray-900 px-6 py-3 font-light tracking-widest uppercase hover:bg-gray-50 transition-all duration-300 rounded-full text-sm"
                  >
                    VIEW CATEGORY
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}