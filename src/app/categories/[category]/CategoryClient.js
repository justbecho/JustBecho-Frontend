'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function CategoryClient({ categorySlug, apiCategory, config }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    brands: [],
    conditions: [],
    minPrice: '',
    maxPrice: ''
  })
  const [availableBrands, setAvailableBrands] = useState([])
  const [availableConditions, setAvailableConditions] = useState([])
  const [error, setError] = useState(null)

  // ✅ DEBUGGING: API call log karein
  const logApiCall = (url, status, data) => {
    console.log('📡 API CALL DETAILS:', {
      url,
      status,
      productsCount: data?.products?.length || 0,
      success: data?.success,
      timestamp: new Date().toISOString()
    })
  }

  // ✅ OPTIMIZED: Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 Starting fetch for:', {
        categorySlug,
        apiCategory,
        sortBy
      })
      
      // ✅ OPTION 1: Direct category endpoint (Recommended)
      const apiUrl = `https://just-becho-backend.vercel.app/api/products/category/${apiCategory}?sort=${sortBy}`
      console.log('🎯 API URL:', apiUrl)
      
      // ✅ OPTION 2: Fallback - Use search endpoint if category fails
      const fallbackUrl = `https://just-becho-backend.vercel.app/api/products/search?q=${apiCategory}&limit=50`
      
      let response = await fetch(apiUrl, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      // ✅ If first API fails, try fallback
      if (!response.ok) {
        console.log('⚠️ Primary API failed, trying fallback...')
        response = await fetch(fallbackUrl, {
          cache: 'no-store'
        })
      }
      
      console.log('📥 Response Status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        logApiCall(apiUrl, response.status, data)
        
        if (data.success && data.products) {
          console.log(`✅ Found ${data.products.length} products`)
          console.log('📦 Sample products:', data.products.slice(0, 3))
          
          setProducts(data.products)
          
          // Extract filters from products
          const brands = [...new Set(data.products.map(p => p.brand).filter(Boolean))]
          const conditions = [...new Set(data.products.map(p => p.condition).filter(Boolean))]
          
          setAvailableBrands(brands)
          setAvailableConditions(conditions)
        } else {
          console.log('❌ API returned success: false', data)
          setProducts([])
          setError('No products found in this category')
        }
      } else {
        const errorText = await response.text()
        console.log('❌ API Error Response:', errorText)
        setProducts([])
        setError(`API Error: ${response.status}`)
      }
    } catch (error) {
      console.error('💥 Fetch Error:', error)
      setProducts([])
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [apiCategory, sortBy])

  // ✅ Fetch on component mount and when sort changes
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // ✅ Handle filter changes
  const handleBrandChange = (brand) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }))
  }

  const handleConditionChange = (condition) => {
    setFilters(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }))
  }

  const handleClearFilters = () => {
    setFilters({
      brands: [],
      conditions: [],
      minPrice: '',
      maxPrice: ''
    })
    setActiveFilter('all')
  }

  // ✅ Filter products
  const filteredProducts = products.filter(product => {
    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false
    }
    
    // Condition filter
    if (filters.conditions.length > 0 && !filters.conditions.includes(product.condition)) {
      return false
    }
    
    // Price filter
    const price = product.finalPrice || 0
    if (filters.minPrice && price < parseInt(filters.minPrice)) {
      return false
    }
    
    if (filters.maxPrice && price > parseInt(filters.maxPrice)) {
      return false
    }
    
    return true
  })

  // ✅ Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.finalPrice || 0) - (b.finalPrice || 0)
      case 'price-high':
        return (b.finalPrice || 0) - (a.finalPrice || 0)
      default: // newest
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    }
  })

  // ✅ Product Card Component
  const ProductCard = ({ product }) => (
    <Link 
      href={`/products/${product._id}`}
      className="group block cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative w-full aspect-square overflow-hidden mb-3 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
        <img
          src={product.images?.[0]?.url || '/placeholder-image.jpg'}
          alt={product.productName}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg'
          }}
        />
        
        {/* Condition Badge */}
        {product.condition && (
          <div className="absolute top-2 left-2">
            <span className="text-gray-900 text-xs font-light tracking-widest uppercase bg-white px-2 py-1 rounded-full">
              {product.condition}
            </span>
          </div>
        )}

        {/* Views Count */}
        {product.views > 0 && (
          <div className="absolute bottom-2 left-2">
            <span className="text-white text-xs bg-black/70 px-2 py-1 rounded-full">
              👁️ {product.views}
            </span>
          </div>
        )}

        {/* Likes Count */}
        {product.likes > 0 && (
          <div className="absolute bottom-2 right-2">
            <span className="text-white text-xs bg-red-500/70 px-2 py-1 rounded-full">
              ❤️ {product.likes}
            </span>
          </div>
        )}
      </div>
      
      <div className="text-left px-1 space-y-2">
        <h3 className="text-gray-900 text-sm font-light tracking-widest uppercase line-clamp-2">
          {product.productName?.toUpperCase() || 'Product Name'}
        </h3>
        
        <p className="text-gray-600 text-xs font-light uppercase">
          {product.brand || 'Brand'}
        </p>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-900 text-base font-light">
            ₹{(product.finalPrice || 0).toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.finalPrice && (
            <span className="text-gray-400 text-sm line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  )

  // ✅ Debug Info Component
  const DebugInfo = () => (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs hidden md:block">
      <div className="font-bold mb-2">🔧 Debug Info:</div>
      <div>Category: {categorySlug}</div>
      <div>API Category: {apiCategory}</div>
      <div>Total Products: {products.length}</div>
      <div>Filtered: {filteredProducts.length}</div>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
      {error && <div className="text-red-300">Error: {error}</div>}
    </div>
  )

  return (
    <>
      <Header />
      
      <div className="bg-white">
        <div className="pt-32 md:pt-36"></div>
        
        {/* ✅ Hero Banner with Error Boundary */}
        <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
          
          <Image
            src={config.banner || '/banners/default-banner.jpg'}
            alt={config.title}
            fill
            className="object-cover"
            priority
            onError={(e) => {
              console.error('Banner image failed:', config.banner)
              e.target.src = '/banners/default-banner.jpg'
            }}
          />
          
          <div className="relative z-20 h-full flex flex-col justify-center items-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
              {config.title || 'CATEGORY'}
            </h1>
            <p className="text-lg md:text-xl text-center max-w-2xl mb-8">
              {config.subtitle || 'Explore our collection'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#products"
                className="bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                SHOP NOW
              </Link>
              <Link
                href="/sell-now"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-gray-900 transition-colors"
              >
                SELL ITEMS
              </Link>
            </div>
          </div>
        </div>

        {/* ✅ Products Section */}
        <section id="products" className="py-12 md:py-16">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            
            {/* ✅ Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
                <button 
                  onClick={fetchProducts}
                  className="mt-2 text-red-600 underline text-sm"
                >
                  Try Again
                </button>
              </div>
            )}
            
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* ✅ Sidebar Filters */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="bg-gray-50 rounded-2xl p-6 sticky top-44">
                  
                  {/* Filters Header */}
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-gray-900 text-lg font-light tracking-widest uppercase">
                      FILTERS
                    </h3>
                    <button 
                      onClick={handleClearFilters}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Brands Filter */}
                  {availableBrands.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-gray-700 text-sm font-medium mb-3">
                        BRANDS ({availableBrands.length})
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {availableBrands.map(brand => (
                          <label key={brand} className="flex items-center space-x-3 cursor-pointer group py-1">
                            <input 
                              type="checkbox" 
                              checked={filters.brands.includes(brand)}
                              onChange={() => handleBrandChange(brand)}
                              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black" 
                            />
                            <span className="text-gray-600 text-sm font-light group-hover:text-gray-900 transition-colors">
                              {brand}
                            </span>
                            <span className="text-gray-400 text-xs ml-auto">
                              ({products.filter(p => p.brand === brand).length})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Condition Filter */}
                  {availableConditions.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-gray-700 text-sm font-medium mb-3">
                        CONDITION ({availableConditions.length})
                      </h4>
                      <div className="space-y-2">
                        {availableConditions.map(condition => (
                          <label key={condition} className="flex items-center space-x-3 cursor-pointer group py-1">
                            <input 
                              type="checkbox" 
                              checked={filters.conditions.includes(condition)}
                              onChange={() => handleConditionChange(condition)}
                              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black" 
                            />
                            <span className="text-gray-600 text-sm font-light group-hover:text-gray-900 transition-colors">
                              {condition}
                            </span>
                            <span className="text-gray-400 text-xs ml-auto">
                              ({products.filter(p => p.condition === condition).length})
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Filter */}
                  <div>
                    <h4 className="text-gray-700 text-sm font-medium mb-3">
                      PRICE RANGE
                    </h4>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-gray-500 block mb-1">Min</label>
                          <input 
                            type="number" 
                            placeholder="₹0" 
                            value={filters.minPrice}
                            onChange={(e) => setFilters(prev => ({...prev, minPrice: e.target.value}))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                            min="0"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-500 block mb-1">Max</label>
                          <input 
                            type="number" 
                            placeholder="₹100000" 
                            value={filters.maxPrice}
                            onChange={(e) => setFilters(prev => ({...prev, maxPrice: e.target.value}))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  {(filters.brands.length > 0 || filters.conditions.length > 0 || filters.minPrice || filters.maxPrice) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-gray-700 text-sm font-medium mb-2">
                        ACTIVE FILTERS
                      </h4>
                      <div className="space-y-1">
                        {filters.brands.map(brand => (
                          <div key={brand} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Brand: {brand}</span>
                            <button 
                              onClick={() => handleBrandChange(brand)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {filters.conditions.map(condition => (
                          <div key={condition} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Condition: {condition}</span>
                            <button 
                              onClick={() => handleConditionChange(condition)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {filters.minPrice && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Min Price: ₹{filters.minPrice}</span>
                            <button 
                              onClick={() => setFilters(prev => ({...prev, minPrice: ''}))}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ×
                            </button>
                          </div>
                        )}
                        {filters.maxPrice && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Max Price: ₹{filters.maxPrice}</span>
                            <button 
                              onClick={() => setFilters(prev => ({...prev, maxPrice: ''}))}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* ✅ Products Grid */}
              <div className="flex-1">
                
                {/* Header with Stats */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-gray-900 text-2xl font-light tracking-widest uppercase mb-1">
                      {config.title || 'PRODUCTS'}
                    </h2>
                    <p className="text-gray-600 text-sm font-light">
                      Showing {filteredProducts.length} of {products.length} products
                      {loading && ' • Loading...'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black bg-white"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    
                    <Link href="/sell-now">
                      <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-colors whitespace-nowrap">
                        + SELL ITEM
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Loading State */}
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : 
                
                
                sortedProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg mb-2">No products found.</p>
                    <p className="text-gray-400 text-sm mb-6">
                      {products.length === 0 
                        ? 'No products available in this category.' 
                        : 'No products match your filters.'}
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button 
                        onClick={handleClearFilters}
                        className="border-2 border-black text-black px-6 py-2 rounded-lg font-light tracking-widest uppercase hover:bg-black hover:text-white transition-all"
                      >
                        Clear Filters
                      </button>
                      <Link 
                        href="/sell-now" 
                        className="bg-black text-white px-6 py-2 rounded-lg font-light tracking-widest uppercase hover:bg-gray-800 transition-all"
                      >
                        Sell Items
                      </Link>
                    </div>
                  </div>
                ) : 
                
                {/* Products Grid */}
                (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                    
                    {/* Load More Button */}
                    {!loading && filteredProducts.length > 0 && (
                      <div className="text-center mt-12">
                        <button className="border-2 border-black text-black px-8 py-3 font-light tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300 rounded-full">
                          LOAD MORE PRODUCTS
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ✅ Why Shop Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-gray-900 text-3xl sm:text-4xl font-light tracking-widest uppercase mb-4">
                {config.whyTitle || 'WHY SHOP AT JUST BECHO'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(config.features || []).map((feature, index) => (
                <div key={index} className="text-center p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-2xl">{feature.icon || '✨'}</span>
                  </div>
                  <h3 className="text-gray-900 text-lg font-light tracking-widest uppercase mb-2">
                    {feature.title || 'FEATURE'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description || 'Premium service and quality guaranteed'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      
      {/* ✅ Debug Info (Visible in development) */}
      {process.env.NODE_ENV === 'development' && <DebugInfo />}
      
      <Footer />
    </>
  )
}