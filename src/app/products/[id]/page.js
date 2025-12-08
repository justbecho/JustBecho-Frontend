// app/products/[id]/page.js - COMPLETELY UPDATED VERSION
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ProductPage() {
  const params = useParams()
  const productId = params.id
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  
  const [isBechoProtectSelected, setIsBechoProtectSelected] = useState(true)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        
        // ✅ UPDATED: Production URL
        const productResponse = await fetch(`https://just-becho-backend.vercel.app/api/products/${productId}`)
        
        if (productResponse.ok) {
          const productData = await productResponse.json()
          
          if (productData.success) {
            const currentProduct = productData.product
            setProduct(currentProduct)
            checkWishlistStatus(currentProduct._id)
            
            // ✅ UPDATED: Production URL
            if (currentProduct.category) {
              console.log('📦 Fetching products of category:', currentProduct.category)
              
              try {
                const relatedResponse = await fetch(
                  `https://just-becho-backend.vercel.app/api/products/category/${encodeURIComponent(currentProduct.category)}?limit=13`
                )
                
                if (relatedResponse.ok) {
                  const relatedData = await relatedResponse.json()
                  if (relatedData.success) {
                    // Current product को exclude करें और 12 products दिखाएं
                    const filteredRelated = relatedData.products
                      .filter(p => p._id !== productId)
                      .slice(0, 12)
                    
                    console.log(`✅ Found ${filteredRelated.length} products in same category`)
                    setRelatedProducts(filteredRelated)
                  }
                }
              } catch (categoryError) {
                console.error('Error fetching category products:', categoryError)
              }
            }
          } else {
            setProduct(null)
          }
        } else {
          setProduct(null)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProductData()
    }
  }, [productId])

  const checkWishlistStatus = async (productId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      // ✅ UPDATED: Production URL
      const response = await fetch('https://just-becho-backend.vercel.app/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const wishlistData = await response.json()
        if (wishlistData.success) {
          const isWishlisted = wishlistData.wishlist.some(item => item.product._id === productId)
          setIsInWishlist(isWishlisted)
        }
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error)
    }
  }

  const handleBechoProtectChange = (e) => {
    const isChecked = e.target.checked
    setIsBechoProtectSelected(isChecked)
    
    if (!isChecked) {
      setShowWarning(true)
    } else {
      setShowWarning(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    
    setAddingToCart(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login to add items to cart')
        return
      }

      const cartData = {
        productId: product._id,
        quantity: 1,
        price: product.finalPrice,
        bechoProtectSelected: isBechoProtectSelected
      }

      if (isBechoProtectSelected) {
        const bechoProtectPrice = product.finalPrice < 15000 ? 499 : 999
        cartData.bechoProtectPrice = bechoProtectPrice
      }

      console.log('📦 Sending cart data to backend:', cartData)

      // ✅ UPDATED: Production URL
      const response = await fetch('https://just-becho-backend.vercel.app/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cartData)
      })

      const data = await response.json()

      if (data.success) {
        alert('Product added to cart successfully!' + 
          (isBechoProtectSelected ? ' Becho Protect included.' : ' Becho Protect not included.'))
        window.dispatchEvent(new Event('cartUpdate'))
      } else {
        alert(data.message || 'Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Error adding to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = () => {
    if (!product) return
    
    if (isBechoProtectSelected) {
      const bechoProtectPrice = product.finalPrice < 15000 ? 499 : 999
      const totalPrice = product.finalPrice + bechoProtectPrice
      
      const orderData = {
        productId: product._id,
        quantity: 1,
        price: product.finalPrice,
        bechoProtectSelected: true,
        bechoProtectPrice: bechoProtectPrice,
        totalPrice: totalPrice
      }
      
      console.log('🛒 Buy Now data:', orderData)
      alert(`Proceeding to purchase ${product.productName}! Total: ₹${totalPrice} (including Becho Protect ₹${bechoProtectPrice})`)
    } else {
      alert(`Proceeding to purchase ${product.productName}! Total: ₹${product.finalPrice} (without Becho Protect)`)
    }
  }

  const conditionOptions = [
    "Brand New With Tag",
    "Brand New Without Tag", 
    "Like New",
    "Excellent",
    "Good",
    "Fairly Used"
  ]

  const handleAddToWishlist = async () => {
    if (!product) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login to add items to wishlist')
        return
      }

      // ✅ UPDATED: Production URL
      const response = await fetch('https://just-becho-backend.vercel.app/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id
        })
      })

      const data = await response.json()

      if (data.success) {
        setIsInWishlist(true)
        alert('Added to wishlist successfully!')
      } else {
        alert(data.message || 'Failed to add to wishlist')
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      alert('Error adding to wishlist')
    }
  }

  const handleRemoveFromWishlist = async () => {
    if (!product) return

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      // ✅ UPDATED: Production URL
      const response = await fetch(`https://just-becho-backend.vercel.app/api/wishlist/${product._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setIsInWishlist(false)
        alert('Removed from wishlist successfully!')
      } else {
        alert(data.message || 'Failed to remove from wishlist')
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      alert('Error removing from wishlist')
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-40">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-8">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="bg-gray-200 aspect-square rounded-lg"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-40">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-12 text-center">
            <h1 className="text-xl font-light text-gray-900">Product not found</h1>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or may have been removed.</p>
            <Link 
              href="/" 
              className="text-black font-light hover:underline mt-3 inline-block"
            >
              ← Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const bechoProtectPrice = product.finalPrice < 15000 ? 499 : 999

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-40">
        {/* Breadcrumb */}
        <section className="border-b border-gray-200">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-3">
            <nav className="flex space-x-2 text-xs font-light text-gray-600">
              <Link href="/" className="hover:text-gray-900">Home</Link>
              <span>/</span>
              <Link href={`/categories/${product.category?.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-gray-900 capitalize">
                {product.category}
              </Link>
              <span>/</span>
              <Link href={`/brands/${product.brand?.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-gray-900 capitalize">
                {product.brand}
              </Link>
              <span>/</span>
              <span className="text-gray-900">{product.productName}</span>
            </nav>
          </div>
        </section>

        {/* Product Section */}
        <section className="py-8">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-12">
              
              {/* Product Images - Left side */}
              <div className="space-y-6">
                {/* Main Image */}
                <div className="flex-1">
                  <div className="aspect-square overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center max-w-[650px] mx-auto">
                    {product.images && product.images[selectedImage]?.url ? (
                      <img
                        src={product.images[selectedImage].url}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">PRODUCT IMAGE</span>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="flex justify-center gap-4">
                  {product.images && product.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg border-2 transition-all duration-200 ${
                        selectedImage === index ? 'border-gray-900' : 'border-gray-300'
                      } bg-gray-50 flex items-center justify-center hover:border-gray-600`}
                    >
                      {image?.url ? (
                        <img
                          src={image.url}
                          alt={`${product.productName} ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">{index + 1}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info - Right side */}
              <div className="space-y-6 max-w-[550px]">
                {/* Product Name */}
                <div className="space-y-1">
                  <h1 className="text-gray-900 text-lg font-light tracking-widest uppercase leading-tight">
                    {product.productName}
                  </h1>
                  <p className="text-gray-600 text-sm font-light uppercase">
                    {product.brand}
                  </p>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <span className="text-gray-900 text-xl font-light">₹{product.finalPrice?.toLocaleString()}</span>
                  {product.originalPrice && product.originalPrice > product.finalPrice && (
                    <p className="text-gray-500 text-sm line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </p>
                  )}
                  <p className="text-gray-600 text-xs">Seller's Price | GST calculated at checkout</p>
                </div>

                {/* ✅ BECHO PROTECT SECTION */}
                <div className="relative">
                  <div className={`border ${isBechoProtectSelected ? 'border-black' : 'border-gray-300'} rounded-lg p-4 bg-white`}>
                    {/* First Row: Checkbox + Main Title + Price */}
                    <div className="flex items-center justify-between mb-3">
                      {/* Left side: Checkbox and Title */}
                      <div className="flex items-center gap-3">
                        <label className="relative cursor-pointer flex items-center gap-3">
                          {/* Custom Checkbox */}
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200
                            ${isBechoProtectSelected 
                              ? 'border-black bg-black' 
                              : 'border-gray-400 bg-white hover:border-gray-600'
                            }`}>
                            {isBechoProtectSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                          
                          {/* Hidden Checkbox */}
                          <input
                            type="checkbox"
                            checked={isBechoProtectSelected}
                            onChange={handleBechoProtectChange}
                            className="sr-only peer"
                          />
                          
                          {/* Title Text */}
                          <div>
                            <span className="text-gray-900 font-bold text-sm">
                              Authenticity Guaranteed with Becho Protect
                            </span>
                          </div>
                        </label>
                        
                       
                      </div>
                      
                      {/* Right side: Price */}
                      <div className="text-right">
                        <p className="text-gray-900 font-bold text-xl">₹{bechoProtectPrice}</p>
                      </div>
                    </div>
                    
                    {/* Third Row: Features List */}
                    <ul className="space-y-1 text-gray-700 text-xs">
                      <li className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Professional authentication at our warehouse</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Genuine product guarantee with certificate</span>
                      </li>
                    </ul>
                    
                    {/* Warning message if unchecked */}
                    {showWarning && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                        <div className="flex items-start gap-2">
                          <span className="text-red-600">⚠️</span>
                          <div>
                            <p className="text-red-700 font-medium text-xs">
                              You are opting out of Authenticity Guarantee
                            </p>
                            <p className="text-red-600 text-xs mt-1">
                              Without Becho Protect, we will directly deliver the product without authentication check and no certificate will be provided.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {isBechoProtectSelected && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        SELECTED
                      </div>
                    </div>
                  )}
                </div>

                {/* Condition */}
                <div className="space-y-2">
                  <h3 className="text-gray-900 text-xs font-light tracking-widest uppercase">CONDITION</h3>
                  <div className="flex gap-1 bg-gray-100 p-1 rounded">
                    {conditionOptions.map((condition) => (
                      <button
                        key={condition}
                        className={`flex-1 px-2 py-1.5 rounded text-xs font-light transition-all duration-200 ${
                          product.condition === condition 
                            ? 'bg-white text-gray-900 shadow-sm border border-gray-300' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {condition}
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-600 text-xs">
                    Seller has listed this item as <span className="font-medium text-gray-900">{product.condition}</span> condition
                  </p>
                </div>

                {/* Shipping Info */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">🚚</span>
                        </div>
                        <div>
                          <p className="text-gray-900 text-xs font-semibold">Shipping</p>
                          <p className="text-gray-600 text-xs">5-7 days</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">💳</span>
                        </div>
                        <div>
                          <p className="text-gray-900 text-xs font-semibold">EMI</p>
                          <p className="text-gray-600 text-xs">Available</p>
                        </div>
                      </div>
                    </div>

                    {/* Seller Info */}
                    <div className="bg-white rounded-lg p-3 border border-gray-300 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-medium text-xs">
                              {product.seller?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <p className="text-gray-900 font-bold text-xs">
                                {product.seller?.name || 'Seller'}
                              </p>
                              <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full">Verified</span>
                            </div>
                            <p className="text-gray-600 text-xs mt-0.5">Premium Seller</p>
                          </div>
                        </div>
                        <div className="text-center bg-gray-100 rounded px-2 py-1">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500 text-xs">⭐</span>
                            <p className="text-gray-900 font-bold text-xs">4.8</p>
                          </div>
                          <p className="text-gray-600 text-xs">50+ reviews</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="flex-1 border-2 border-black text-gray-900 py-3 text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToCart ? 'ADDING TO CART...' : 'ADD TO CART'}
                    </button>
                    <button
                      onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
                      className={`w-12 border-2 py-3 flex items-center justify-center transition-all duration-300 rounded-lg ${
                        isInWishlist 
                          ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100' 
                          : 'border-gray-300 text-gray-600 hover:border-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {isInWishlist ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-3 text-xs font-bold tracking-widest uppercase hover:shadow-lg hover:scale-[1.02] transition-all duration-300 rounded-lg"
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-16 bg-white border-t border-gray-200">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-gray-900 text-xl sm:text-3xl font-light tracking-widest uppercase">
                PRODUCT DETAILS
              </h2>
              <p className="text-gray-900 text-base font-light tracking-widest uppercase mt-3">
                PRODUCT DESCRIPTION
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="prose max-w-none">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ UPDATED: RELATED PRODUCTS FROM SAME CATEGORY ONLY */}
        {relatedProducts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
              <div className="text-center mb-12">
                <h2 className="text-gray-900 text-xl sm:text-3xl font-light tracking-widest uppercase">
                  MORE FROM {product.category?.toUpperCase()}
                </h2>
                <p className="text-gray-900 text-base font-light tracking-widest uppercase mt-3">
                  EXPLORE SIMILAR PRODUCTS IN THIS CATEGORY
                </p>
                
                {/* Category Info */}
                <div className="mt-4">
                  <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                   
                    
                    <span className="text-gray-600 text-sm">
                      Showing {relatedProducts.length} related products
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct._id}
                    href={`/products/${relatedProduct._id}`}
                    className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative w-full aspect-square overflow-hidden mb-3 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                      {relatedProduct.images?.[0]?.url ? (
                        <img
                          src={relatedProduct.images[0].url}
                          alt={relatedProduct.productName}
                          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs font-light">PRODUCT IMAGE</span>
                        </div>
                      )}
                      {relatedProduct.condition && (
                        <div className="absolute top-2 left-2">
                          <span className="text-gray-900 text-xs font-light tracking-widest uppercase bg-white px-2 py-1 rounded-full">
                            {relatedProduct.condition.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-left px-1">
                      <h3 className="text-gray-800 text-xs font-light tracking-widest uppercase mb-1 line-clamp-2">
                        {relatedProduct.productName?.toUpperCase()}
                      </h3>
                      
                      {/* Product Type (if available) */}
                      {relatedProduct.productType && (
                        <div className="mb-2">
                          <span className="text-gray-600 text-xs bg-gray-100 px-2 py-0.5 rounded">
                            {relatedProduct.productType}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-gray-900 text-sm font-light tracking-widest uppercase">
                          ₹{relatedProduct.finalPrice?.toLocaleString()}
                        </p>
                        
                        
                      </div>
                      
                      {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.finalPrice && (
                        <p className="text-gray-500 text-xs line-through">
                          ₹{relatedProduct.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Browse More Link */}
              <div className="text-center mt-12">
                <Link
                  href={`/categories/${product.category?.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center gap-2 text-gray-900 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <span>Browse All Products in {product.category}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}