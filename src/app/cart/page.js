// app/cart/page.js - UPDATED WITH HIDDEN CALCULATIONS
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiShoppingBag, FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingCart, FiShield, FiCheck, FiX, FiInfo } from 'react-icons/fi'
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
              <h1 className="text-2xl sm:text-3xl font-light text-gray-900">Shopping Cart</h1>
            </div>
            
            {cart && cart.items && cart.items.length > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center text-red-600 hover:text-red-700 transition-colors self-start sm:self-center"
              >
                <FiTrash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </button>
            )}
          </div>

          {cart && cart.items && cart.items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-full sm:w-24 h-64 sm:h-24 bg-gray-100 rounded-lg overflow-hidden">
                        {item.product?.images?.[0]?.url ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <FiShoppingBag className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="flex-1">
                            <Link href={`/products/${item.product?._id}`}>
                              <h3 className="text-lg font-medium text-gray-900 hover:text-gray-700">
                                {item.product?.productName || 'Product'}
                              </h3>
                            </Link>
                            
                            <p className="text-gray-600 text-sm mt-1">
                              Brand: {item.product?.brand || 'Unknown'}
                            </p>
                            
                            <p className="text-gray-600 text-sm">
                              Condition: {item.product?.condition || 'Not specified'}
                            </p>
                            
                            {item.size && (
                              <p className="text-gray-600 text-sm">Size: {item.size}</p>
                            )}
                            
                            {item.color && (
                              <p className="text-gray-600 text-sm">Color: {item.color}</p>
                            )}
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              ₹{item.price?.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              per item
                            </p>
                          </div>
                        </div>

                        {/* Becho Protect Toggle */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.bechoProtect?.selected ? 'bg-green-500' : 'bg-gray-300'}`}>
                              {item.bechoProtect?.selected && <FiCheck className="w-2 h-2 text-white" />}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              Becho Protect - ₹{item.bechoProtect?.price || 0}
                            </span>
                            <span className="text-xs text-gray-500">
                              (Authenticity Guaranteed)
                            </span>
                          </div>
                          
                          <button
                            onClick={() => toggleBechoProtect(item._id, item.bechoProtect?.selected)}
                            disabled={togglingBechoProtect === item._id}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${item.bechoProtect?.selected 
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'}`}
                          >
                            {togglingBechoProtect === item._id ? (
                              'Updating...'
                            ) : item.bechoProtect?.selected ? (
                              <>
                                <FiX className="w-3 h-3" />
                                Remove Protection
                              </>
                            ) : (
                              <>
                                <FiShield className="w-3 h-3" />
                                Add Protection
                              </>
                            )}
                          </button>
                        </div>

                        {/* Quantity Controls & Item Total */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              disabled={updating === item._id || item.quantity <= 1}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FiMinus className="w-3 h-3" />
                            </button>
                            
                            <span className="w-8 text-center font-medium">
                              {updating === item._id ? '...' : item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              disabled={updating === item._id || item.quantity >= (item.product?.stock || 1)}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FiPlus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              ₹{item.totalPrice?.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              Item total
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item._id)}
                        className="flex-shrink-0 text-red-600 hover:text-red-700 transition-colors p-2 self-start"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-32">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    {/* Subtotal */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({cart.totalItems || 0} items)</span>
                      <span className="text-gray-900">₹{(cart.subtotal || 0).toLocaleString()}</span>
                    </div>
                    
                    {/* Becho Protect Total */}
                    {cart.bechoProtectTotal > 0 && (
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">Becho Protect</span>
                          <FiShield className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-green-600">₹{(cart.bechoProtectTotal || 0).toLocaleString()}</span>
                      </div>
                    )}
                    
                    
                    
                    {/* Shipping */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">₹{SHIPPING_CHARGE.toLocaleString()}</span>
                    </div>
                    
                    {/* ✅ GST (18% on Platform Fee) - HIDE CALCULATION */}
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">GST (18%)</span>
                       
                      </div>
                      <span className="text-gray-900">₹{totals.tax.toLocaleString()}</span>
                    </div>
                    
                    {/* Divider */}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-900">Total Amount</span>
                        <span className="text-gray-900">
                          ₹{totals.grandTotal.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Inclusive of GST 
                      </p>
                      
                      {/* Simplified Breakdown Tooltip */}
                      <div className="mt-2 text-xs text-gray-500">
                        <details>
                          <summary className="cursor-pointer hover:text-gray-700 flex items-center gap-1">
                            <FiInfo className="w-3 h-3" />
                            View summary
                          </summary>
                          <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Items total:</span>
                                <span className="font-medium">₹{totals.subtotal.toLocaleString()}</span>
                              </div>
                              {totals.bechoProtectTotal > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Becho Protect:</span>
                                  <span className="font-medium">₹{totals.bechoProtectTotal.toLocaleString()}</span>
                                </div>
                              )}
                              
                              <div className="flex justify-between">
                                <span className="text-gray-600">GST (18%):</span>
                                <span className="font-medium">₹{totals.tax.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Shipping:</span>
                                <span className="font-medium">₹{SHIPPING_CHARGE.toLocaleString()}</span>
                              </div>
                              <div className="border-t border-gray-300 pt-2 mt-2">
                                <div className="flex justify-between font-bold">
                                  <span>Total Payable:</span>
                                  <span>₹{totals.grandTotal.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </details>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-4 rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300 font-medium shadow-lg hover:shadow-xl mb-4"
                  >
                    Proceed to Checkout
                  </button>

               

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <FiShield className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600">
                      Secure checkout • 100% Authenticity Guaranteed
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    24/7 Customer Support
                  </p>
                </div>

             
              </div>
            </div>
          ) : (
            // Empty Cart State
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <FiShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start shopping to discover amazing luxury products!
              </p>
              <Link
                href="/"
                className="inline-flex items-center bg-gradient-to-r from-gray-900 to-black text-white px-8 py-3 rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all duration-300 font-medium"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}