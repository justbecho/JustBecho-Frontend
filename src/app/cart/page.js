// app/cart/page.js - UPDATED WITH IMPROVED DESIGN
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiShoppingBag, FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingCart, FiShield, FiCheck, FiX, FiInfo, FiChevronRight } from 'react-icons/fi'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [togglingBechoProtect, setTogglingBechoProtect] = useState(null)
  const router = useRouter()

  // Constants
  const SHIPPING_CHARGE = 299 // ✅ Shipping charges fixed at ₹299

  // Fetch cart data
  useEffect(() => {
    fetchCart()
    
    // Listen for cart update events
    const handleCartUpdate = () => {
      fetchCart()
    }
    
    window.addEventListener('cartUpdate', handleCartUpdate)
    return () => window.removeEventListener('cartUpdate', handleCartUpdate)
  }, [])

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        return
      }

      const response = await fetch('https://just-becho-backend.vercel.app/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        console.log('🛒 Cart data:', data.cart)
        setCart(data.cart)
      } else {
        console.error('Failed to fetch cart:', data.message)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return

    setUpdating(itemId)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://just-becho-backend.vercel.app/api/cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      })

      const data = await response.json()

      if (data.success) {
        setCart(data.cart)
      } else {
        alert(data.message || 'Failed to update quantity')
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert('Error updating quantity')
    } finally {
      setUpdating(null)
    }
  }

  const toggleBechoProtect = async (itemId, currentStatus) => {
    setTogglingBechoProtect(itemId)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://just-becho-backend.vercel.app/api/cart/item/${itemId}/becho-protect`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ selected: !currentStatus })
      })

      const data = await response.json()

      if (data.success) {
        setCart(data.cart)
        alert(`Becho Protect ${!currentStatus ? 'enabled' : 'disabled'} successfully`)
      } else {
        alert(data.message || 'Failed to update Becho Protect')
      }
    } catch (error) {
      console.error('Error toggling Becho Protect:', error)
      alert('Error updating Becho Protect')
    } finally {
      setTogglingBechoProtect(null)
    }
  }

  const removeItem = async (itemId) => {
    if (!confirm('Are you sure you want to remove this item from cart?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`https://just-becho-backend.vercel.app/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        setCart(data.cart)
      } else {
        alert(data.message || 'Failed to remove item')
      }
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Error removing item')
    }
  }

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your entire cart?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://just-becho-backend.vercel.app/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        setCart(data.cart)
      } else {
        alert(data.message || 'Failed to clear cart')
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      alert('Error clearing cart')
    }
  }

  // ✅ Calculate total amount with shipping and tax (GST ONLY ON PLATFORM FEE)
  const calculateTotals = () => {
    if (!cart) return { 
      subtotal: 0, 
      platformFee: 0, 
      platformFeePercentage: 0,
      tax: 0, 
      shipping: SHIPPING_CHARGE, 
      grandTotal: 0 
    };
    
    const subtotal = cart.subtotal || 0;
    const bechoProtectTotal = cart.bechoProtectTotal || 0;
    
    // ✅ Platform fee calculation
    let platformFeePercentage = 0;
    
    if (subtotal <= 2000) {
      platformFeePercentage = 30;
    } else if (subtotal >= 2001 && subtotal <= 5000) {
      platformFeePercentage = 28;
    } else if (subtotal >= 5001 && subtotal <= 10000) {
      platformFeePercentage = 25;
    } else if (subtotal >= 10001 && subtotal <= 15000) {
      platformFeePercentage = 20;
    } else {
      platformFeePercentage = 15;
    }
    
    const platformFee = Math.round((subtotal * platformFeePercentage) / 100);
    
    // ✅ GST is 18% ONLY on platform fee
    const tax = Math.round(platformFee * 0.18);
    
    // ✅ Grand total = subtotal + becho protect + platform fee + tax + shipping
    const grandTotal = subtotal + bechoProtectTotal + platformFee + tax + SHIPPING_CHARGE;
    
    return {
      subtotal,
      bechoProtectTotal,
      platformFee,
      platformFeePercentage,
      tax,
      shipping: SHIPPING_CHARGE,
      grandTotal
    };
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your cart...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ✅ IMPROVED HEADER SECTION */}
          <div className="mb-10">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
              <FiChevronRight className="mx-2 w-4 h-4" />
              <span className="text-gray-900 font-medium">Shopping Cart</span>
            </div>
            
            {/* Main Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase text-gray-900 mb-2">
                  Your Shopping Cart
                </h1>
                <p className="text-gray-600 text-sm font-light tracking-widest uppercase">
                  {cart?.items?.length || 0} ITEMS
                </p>
              </div>
              
              {cart && cart.items && cart.items.length > 0 && (
                <div className="flex items-center gap-4 self-start sm:self-center">
                  <Link 
                    href="/" 
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-light tracking-widest uppercase group"
                  >
                    <FiArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Continue Shopping
                  </Link>
                  
                  <button
                    onClick={clearCart}
                    className="flex items-center text-red-600 hover:text-red-700 transition-colors text-sm font-light tracking-widest uppercase group"
                  >
                    <FiTrash2 className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                    Clear Cart
                  </button>
                </div>
              )}
            </div>
          </div>

          {cart && cart.items && cart.items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items - ✅ IMPROVED LAYOUT */}
              <div className="lg:col-span-2">
                {/* Items Header */}
                <div className="bg-white rounded-t-lg border border-gray-200 px-6 py-4 mb-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-light tracking-widest uppercase text-gray-900">
                      Products
                    </h2>
                    <span className="text-sm text-gray-600">
                      Total: {cart.totalItems || 0} items
                    </span>
                  </div>
                </div>
                
                {/* Items List */}
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Product Image */}
                        <Link 
                          href={`/products/${item.product?._id}`}
                          className="flex-shrink-0 w-full sm:w-24 h-64 sm:h-24 bg-gray-100 rounded-lg overflow-hidden group"
                        >
                          {item.product?.images?.[0]?.url ? (
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.productName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <FiShoppingBag className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div className="flex-1">
                              <Link href={`/products/${item.product?._id}`}>
                                <h3 className="text-lg font-light tracking-widest text-gray-900 hover:text-gray-700 uppercase mb-1">
                                  {item.product?.productName || 'Product'}
                                </h3>
                              </Link>
                              
                              <div className="space-y-1">
                                <p className="text-gray-600 text-sm">
                                  <span className="font-medium">Brand:</span> {item.product?.brand || 'Unknown'}
                                </p>
                                
                                <p className="text-gray-600 text-sm">
                                  <span className="font-medium">Condition:</span> {item.product?.condition || 'Not specified'}
                                </p>
                                
                                {item.size && (
                                  <p className="text-gray-600 text-sm">
                                    <span className="font-medium">Size:</span> {item.size}
                                  </p>
                                )}
                                
                                {item.color && (
                                  <p className="text-gray-600 text-sm">
                                    <span className="font-medium">Color:</span> {item.color}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-lg font-light tracking-widest text-gray-900">
                                ₹{item.price?.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500 font-light">
                                PER ITEM
                              </p>
                            </div>
                          </div>

                          {/* Becho Protect Toggle */}
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.bechoProtect?.selected ? 'bg-green-500' : 'bg-gray-300'}`}>
                                  {item.bechoProtect?.selected && <FiCheck className="w-3 h-3 text-white" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">
                                      Becho Protect
                                    </span>
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                      ₹{item.bechoProtect?.price || 0}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    Authenticity Guaranteed • Secure Delivery
                                  </p>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => toggleBechoProtect(item._id, item.bechoProtect?.selected)}
                                disabled={togglingBechoProtect === item._id}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${item.bechoProtect?.selected 
                                  ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' 
                                  : 'bg-gray-900 text-white hover:bg-gray-800 border border-gray-900'}`}
                              >
                                {togglingBechoProtect === item._id ? (
                                  'Updating...'
                                ) : item.bechoProtect?.selected ? (
                                  <>
                                    <FiX className="w-3 h-3" />
                                    Remove
                                  </>
                                ) : (
                                  <>
                                    <FiShield className="w-3 h-3" />
                                    Add Protection
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Quantity Controls & Item Total */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center space-x-1">
                              <p className="text-sm text-gray-600 mr-4 font-light">QUANTITY:</p>
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                  disabled={updating === item._id || item.quantity <= 1}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                                >
                                  <FiMinus className="w-3 h-3" />
                                </button>
                                
                                <span className="w-8 text-center font-light border-x border-gray-300 py-1">
                                  {updating === item._id ? '...' : item.quantity}
                                </span>
                                
                                <button
                                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                  disabled={updating === item._id || item.quantity >= (item.product?.stock || 1)}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
                                >
                                  <FiPlus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <p className="text-lg font-light tracking-widest text-gray-900">
                                ₹{item.totalPrice?.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500 font-light">
                                ITEM TOTAL
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item._id)}
                          className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors p-2 self-start hover:bg-red-50 rounded-full"
                          title="Remove item"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ✅ IMPROVED Order Summary Section */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-32">
                  <div className="mb-6">
                    <h2 className="text-xl font-light tracking-widest uppercase text-gray-900 mb-1">
                      Order Summary
                    </h2>
                    <p className="text-sm text-gray-500 font-light">
                      Review your items and proceed to checkout
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {/* Subtotal */}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm font-light">Subtotal</span>
                      <span className="text-gray-900 font-light">₹{(cart.subtotal || 0).toLocaleString()}</span>
                    </div>
                    
                    {/* Becho Protect Total */}
                    {cart.bechoProtectTotal > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 text-sm font-light">Becho Protect</span>
                          <FiShield className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-green-600 font-light">+₹{(cart.bechoProtectTotal || 0).toLocaleString()}</span>
                      </div>
                    )}
                    
                    {/* Shipping */}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 text-sm font-light">Shipping</span>
                      <span className="text-gray-900 font-light">+₹{SHIPPING_CHARGE.toLocaleString()}</span>
                    </div>
                    
                    {/* ✅ GST (18% on Platform Fee) */}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-sm font-light">GST (18%)</span>
                      </div>
                      <span className="text-gray-900 font-light">+₹{totals.tax.toLocaleString()}</span>
                    </div>
                    
                    {/* Total Amount */}
                    <div className="flex justify-between py-4 border-t border-gray-300">
                      <div>
                        <span className="text-gray-900 text-lg font-light tracking-widest uppercase">Total Amount</span>
                        <p className="text-xs text-gray-500 mt-1">
                          Inclusive of all charges
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-light text-gray-900">
                          ₹{totals.grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Summary Details */}
                    <div className="mt-4">
                      <details className="group">
                        <summary className="cursor-pointer hover:text-gray-700 flex items-center justify-between text-sm text-gray-600 pb-2 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <FiInfo className="w-4 h-4" />
                            <span>View detailed summary</span>
                          </div>
                          <span className="transform transition-transform group-open:rotate-180">
                            <FiChevronRight className="w-4 h-4" />
                          </span>
                        </summary>
                        <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Items total:</span>
                            <span className="font-light">₹{totals.subtotal.toLocaleString()}</span>
                          </div>
                          {totals.bechoProtectTotal > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Becho Protect:</span>
                              <span className="font-light">₹{totals.bechoProtectTotal.toLocaleString()}</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">GST (18%):</span>
                            <span className="font-light">₹{totals.tax.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping:</span>
                            <span className="font-light">₹{SHIPPING_CHARGE.toLocaleString()}</span>
                          </div>
                          <div className="pt-2 border-t border-gray-300 mt-2">
                            <div className="flex justify-between font-medium">
                              <span className="text-gray-900">Total Payable:</span>
                              <span className="text-gray-900">₹{totals.grandTotal.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-4 rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300 font-light tracking-widest uppercase shadow-lg hover:shadow-xl mb-6 group"
                  >
                    <div className="flex items-center justify-center gap-2">
                      Proceed to Checkout
                      <FiChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FiShield className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-light text-gray-900">Secure checkout</p>
                      <p className="text-xs text-gray-500">100% Authenticity Guaranteed</p>
                    </div>
                  </div>

                  {/* Support Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-500 font-light tracking-widest uppercase">
                      24/7 CUSTOMER SUPPORT
                    </p>
                  </div>
                </div>

                {/* Continue Shopping Card */}
                <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiShoppingBag className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-light text-gray-900">Continue Shopping</h3>
                      <p className="text-xs text-gray-500">Discover more luxury items</p>
                    </div>
                  </div>
                  <Link
                    href="/"
                    className="block w-full text-center border border-gray-300 text-gray-900 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-light"
                  >
                    Browse Collections
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            // Empty Cart State
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                <FiShoppingCart className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-3xl font-light tracking-widest uppercase text-gray-900 mb-4">
                Your Cart is Empty
              </h2>
              <p className="text-gray-600 mb-10 max-w-md mx-auto font-light">
                Looks like you haven't added any items to your cart yet. Start shopping to discover amazing luxury products!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-gray-900 to-black text-white px-8 py-3 rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300 font-light tracking-widest uppercase group"
                >
                  Start Shopping
                  <FiArrowLeft className="w-4 h-4 ml-2 transform rotate-180 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/collections"
                  className="inline-flex items-center justify-center border border-gray-300 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 font-light tracking-widest uppercase"
                >
                  View Collections
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}