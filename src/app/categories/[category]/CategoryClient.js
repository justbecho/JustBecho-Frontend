'use client'

import { useState, useEffect } from 'react'
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
  const [categoryName, setCategoryName] = useState('')
  const [imageError, setImageError] = useState(false)

  // ✅ Backend se products fetch karo
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // ✅ URL encode the category name for API call
        const encodedCategory = encodeURIComponent(apiCategory)
        const apiUrl = `https://just-becho-backend.vercel.app/api/products/category/${encodedCategory}`
        console.log('📡 Fetching from:', apiUrl)
        
        const response = await fetch(apiUrl)
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.success && data.products) {
            console.log(`✅ ${data.products.length} products found for ${apiCategory}`)
            setProducts(data.products)
            
            // ✅ Category name set karo (pehle product se)
            if (data.products.length > 0) {
              const firstCategory = data.products[0]?.category || apiCategory
              setCategoryName(firstCategory)
            } else {
              setCategoryName(apiCategory)
            }
          } else {
            console.log(`❌ No products found for ${apiCategory}`)
            setProducts([])
            setCategoryName(apiCategory)
          }
        } else {
          console.log('❌ API call failed:', response.status)
          setProducts([])
          setCategoryName(apiCategory)
        }
      } catch (error) {
        console.error('💥 Error fetching products:', error)
        setProducts([])
        setCategoryName(apiCategory)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categorySlug, apiCategory])

  // ✅ Product card design - RATING HATA DIYA
  const renderProductCard = (product) => (
    <Link 
      href={`/products/${product._id}`}
      key={product._id}
      className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-300 block"
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
              {product.condition.toUpperCase()}
            </span>
          </div>
        )}

        {/* Bestseller Badge */}
        {product.isBestseller && (
          <div className="absolute top-2 right-2">
            <span className="bg-white text-gray-900 text-xs font-light tracking-widest uppercase px-2 py-1 rounded-full">
              BESTSELLER
            </span>
          </div>
        )}

        {/* Verified Badge */}
        {product.isVerified && (
          <div className="absolute top-10 right-2">
            <span className="bg-green-500 text-white text-xs font-light tracking-widest uppercase px-2 py-1 rounded-full">
              VERIFIED
            </span>
          </div>
        )}

        {/* ✅ WISHLIST BUTTON */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white text-gray-900 p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="text-left px-1 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-gray-900 text-sm font-light tracking-widest uppercase flex-1 line-clamp-2">
            {product.productName?.toUpperCase()}
          </h3>
          {/* ✅ RATING REMOVED */}
        </div>
        
        <p className="text-gray-600 text-xs font-light uppercase">
          {product.brand || 'Brand'}
        </p>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-900 text-base font-light">
            ₹{product.finalPrice?.toLocaleString() || '0'}
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

  // Extract unique sub-categories, brands, conditions from products
  const extractFilters = (products) => {
    const subCategoriesSet = new Set()
    const brandsSet = new Set()
    const conditionsSet = new Set()
    
    products.forEach(product => {
      // ✅ Yeh sub-category hai (e.g., "sneakers", "handbags", etc.)
      if (product.subCategory) subCategoriesSet.add(product.subCategory)
      if (product.brand) brandsSet.add(product.brand)
      if (product.condition) conditionsSet.add(product.condition)
    })
    
    return {
      subCategories: Array.from(subCategoriesSet),
      brands: Array.from(brandsSet),
      conditions: Array.from(conditionsSet)
    }
  }

  const filterData = extractFilters(products)

  // ✅ Sub-categories with counts (These are product.subCategory)
  const subCategories = [
    { id: 'all', name: 'All Items', count: products.length },
    ...filterData.subCategories.map(subCat => ({
      id: subCat.toLowerCase().replace(/\s+/g, '-'),
      name: subCat,
      count: products.filter(p => p.subCategory === subCat).length
    }))
  ]

  // ✅ Filter products based on active filter and other filters
  const filteredProducts = products.filter(product => {
    // Sub-category filter (activeFilter is for sub-categories)
    if (activeFilter !== 'all' && product.subCategory?.toLowerCase() !== activeFilter) {
      return false
    }
    
    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false
    }
    
    // Condition filter
    if (filters.conditions.length > 0 && !filters.conditions.includes(product.condition)) {
      return false
    }
    
    // Price filter
    if (filters.minPrice && product.finalPrice < parseInt(filters.minPrice)) {
      return false
    }
    
    if (filters.maxPrice && product.finalPrice > parseInt(filters.maxPrice)) {
      return false
    }
    
    return true
  })

  // ✅ Sort products - RATING WALA OPTION HATA DIYA
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.finalPrice - b.finalPrice
      case 'price-high':
        return b.finalPrice - a.finalPrice
      default: // newest
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    }
  })

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

  const handlePriceApply = () => {
    // Price filter already applied in filteredProducts
  }

  // ✅ Handle image error
  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <>
      {/* ✅ HEADER COMPONENT - REMOVED from main content */}
      <Header />
      
      {/* ✅ HEADER KE BAAD SPACING - IMPORTANT */}
      <div className="pt-24"></div>
      
      <main className="min-h-screen bg-white">
        {/* Hero Section - WITH IMAGE FALLBACK */}
        <section className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* ✅ Gradient background as fallback */}
            <div className={`absolute inset-0 ${imageError ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-black/40'}`}></div>
            
            {/* ✅ Try to load image, agar na ho toh gradient dikhega */}
            {!imageError && (
              <Image
                src={config.banner}
                alt={`${config.title} - Just Becho`}
                fill
                className="object-cover object-center"
                priority
                onError={handleImageError}
              />
            )}
          </div>

          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center text-white px-4 sm:px-6">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-widest uppercase mb-6 opacity-0 animate-fade-in-up"
                  style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
                {config.title}
              </h1>
              <p className="text-xl sm:text-2xl font-light tracking-widest uppercase opacity-90 max-w-2xl mx-auto opacity-0 animate-fade-in-up"
                 style={{animationDelay: '0.6s', animationFillMode: 'forwards'}}>
                {config.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 opacity-0 animate-fade-in-up"
                   style={{animationDelay: '0.9s', animationFillMode: 'forwards'}}>
                <Link
                  href="#products"
                  className="bg-white text-gray-900 px-8 py-4 font-light tracking-widest uppercase hover:bg-gray-100 transition-all duration-300 rounded-full text-lg"
                >
                  SHOP NOW
                </Link>
                <Link
                  href="/sell-now"
                  className="border-2 border-white text-white px-8 py-4 font-light tracking-widest uppercase hover:bg-white hover:text-gray-900 transition-all duration-300 rounded-full text-lg"
                >
                  SELL ITEMS
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
            <div className="w-5 h-8 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white rounded-full mt-1"></div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section id="products" className="py-16 bg-white">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Sidebar Filters */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="bg-gray-50 rounded-2xl p-6 sticky top-32">
                  
                  <div className="mb-8">
                    <h3 className="text-gray-900 text-lg font-light tracking-widest uppercase mb-4">
                      CATEGORIES
                    </h3>
                    <div className="space-y-2">
                      {subCategories.map(subCat => (
                        <button
                          key={subCat.id}
                          onClick={() => setActiveFilter(subCat.id === 'all' ? 'all' : subCat.name.toLowerCase())}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 flex justify-between items-center ${
                            (activeFilter === 'all' && subCat.id === 'all') || 
                            (activeFilter === subCat.name.toLowerCase() && subCat.id !== 'all')
                              ? 'bg-black text-white' 
                              : 'text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <span className="text-sm font-light">{subCat.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            (activeFilter === 'all' && subCat.id === 'all') || 
                            (activeFilter === subCat.name.toLowerCase() && subCat.id !== 'all')
                              ? 'bg-white text-black' 
                              : 'bg-gray-300 text-gray-700'
                          }`}>
                            {subCat.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-gray-900 text-lg font-light tracking-widest uppercase mb-4">
                      BRANDS
                    </h3>
                    <div className="space-y-2">
                      {filterData.brands.map(brand => (
                        <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={filters.brands.includes(brand)}
                            onChange={() => handleBrandChange(brand)}
                            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black" 
                          />
                          <span className="text-gray-600 text-sm font-light group-hover:text-gray-900 transition-colors">
                            {brand}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-gray-900 text-lg font-light tracking-widest uppercase mb-4">
                      CONDITION
                    </h3>
                    <div className="space-y-2">
                      {filterData.conditions.map(condition => (
                        <label key={condition} className="flex items-center space-x-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={filters.conditions.includes(condition)}
                            onChange={() => handleConditionChange(condition)}
                            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black" 
                          />
                          <span className="text-gray-600 text-sm font-light group-hover:text-gray-900 transition-colors">
                            {condition}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-gray-900 text-lg font-light tracking-widest uppercase mb-4">
                      PRICE RANGE
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          placeholder="Min" 
                          value={filters.minPrice}
                          onChange={(e) => setFilters(prev => ({...prev, minPrice: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                        />
                        <input 
                          type="number" 
                          placeholder="Max" 
                          value={filters.maxPrice}
                          onChange={(e) => setFilters(prev => ({...prev, maxPrice: e.target.value}))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                        />
                      </div>
                      <button 
                        onClick={handlePriceApply}
                        className="w-full bg-black text-white py-2 rounded-lg text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-colors"
                      >
                        APPLY
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm font-light">
                      Showing {filteredProducts.length} of {products.length} products in {categoryName}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    
                    <Link href="/sell-now">
                      <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-colors">
                        SELL ITEM
                      </button>
                    </Link>
                  </div>
                </div>

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
                ) : sortedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProducts.map(renderProductCard)}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No products found in {categoryName}.</p>
                    <Link 
                      href="/sell-now" 
                      className="inline-block mt-4 border-2 border-black text-black px-6 py-2 rounded-lg font-light tracking-widest uppercase hover:bg-black hover:text-white transition-all"
                    >
                      Sell Items
                    </Link>
                  </div>
                )}

                {!loading && sortedProducts.length > 0 && (
                  <div className="text-center mt-12">
                    <button className="border-2 border-black text-black px-8 py-3 font-light tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300 rounded-full">
                      LOAD MORE
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-gray-900 text-3xl sm:text-4xl font-light tracking-widest uppercase mb-4">
                {config.whyTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {config.features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white text-2xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-gray-900 text-lg font-light tracking-widest uppercase mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}