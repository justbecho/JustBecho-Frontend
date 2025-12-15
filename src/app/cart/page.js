// app/cart/page.js - WITH RAZORPAY INTEGRATION
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { 
  FiShoppingBag, FiTrash2, FiPlus, FiMinus, FiArrowLeft, 
  FiShoppingCart, FiShield, FiCheck, FiX, FiInfo, FiUser 
} from 'react-icons/fi'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [togglingBechoProtect, setTogglingBechoProtect] = useState(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()

  // Constants
  const SHIPPING_CHARGE = 299

  // Fetch cart and user data
  useEffect(() => {
    fetchUserData()
    fetchCart()
    
    const handleCartUpdate = () => {
      fetchCart()
    }
    
    window.addEventListener('cartUpdate', handleCartUpdate)
    return () => window.removeEventListener('cartUpdate', handleCartUpdate)
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('https://just-becho-backend.vercel.app/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      if (data.success) {
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
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

  // ✅ RAZORPAY CHECKOUT FUNCTION
  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to checkout')
      router.push('/login')
      return
    }

    if (!user.profileCompleted) {
      alert('Please complete your profile before checkout')
      router.push('/complete-profile')
      return
    }

    if (!user.address || !user.address.street || !user.address.city || !user.address.state || !user.address.pincode) {
      alert('Please add your shipping address in profile settings')
      router.push('/profile')
      return
    }

    if (!user.phone) {
      alert('Please add your phone number in profile settings')
      router.push('/profile')
      return
    }

    setCheckoutLoading(true)

    try {
      const token = localStorage.getItem('token')
      const totals = calculateTotals()

      console.log('🚀 Starting checkout process...')
      console.log('📊 Total amount:', totals.grandTotal)
      console.log('👤 User ID:', user.id)

      // Step 1: Create order in backend
      const orderResponse = await fetch('https://just-becho-backend.vercel.app/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: totals.grandTotal,
          cartId: cart._id,
          shippingAddress: {
            street: user.address.street,
            city: user.address.city,
            state: user.address.state,
            pincode: user.address.pincode,
            phone: user.phone
          }
        })
      })

      const orderData = await orderResponse.json()
      console.log('📦 Order creation response:', orderData)

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order')
      }

      // Step 2: Check if Razorpay script is loaded
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay payment gateway not loaded. Please refresh the page.')
      }

      // Step 3: Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'JustBecho.com',
        description: 'Secure Payment for your order',
        order_id: orderData.order.id,
        handler: async function (response) {
          console.log('✅ Payment successful, verifying...', response)
          
          // Step 4: Verify payment with backend
          const verifyResponse = await fetch('https://just-becho-backend.vercel.app/api/razorpay/verify-payment', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(response)
          })

          const verifyData = await verifyResponse.json()
          console.log('🔐 Verification response:', verifyData)

          if (verifyData.success) {
            alert('🎉 Payment Successful! Your order has been placed.')
            
            // Trigger cart update
            window.dispatchEvent(new Event('cartUpdate'))
            
            // Redirect to orders page
            router.push('/orders?success=true')
          } else {
            alert('❌ Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: user.name || user.email.split('@')[0],
          email: user.email,
          contact: user.phone || '9999999999'
        },
        theme: {
          color: '#000000'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal closed')
            setCheckoutLoading(false)
          }
        }
      }

      // Step 5: Open Razorpay checkout
      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error) {
      console.error('❌ Checkout error:', error)
      alert(`Checkout failed: ${error.message}`)
    } finally {
      setCheckoutLoading(false)
    }
  }

  // Calculate totals
  // Calculate totals - FIXED VERSION
const calculateTotals = () => {
  if (!cart) return { 
    subtotal: 0, 
    bechoProtectTotal: 0,
    platformFee: 0, 
    platformFeePercentage: 0,
    tax: 0, 
    shipping: SHIPPING_CHARGE, 
    grandTotal: 0 
  };
  
  // Cart se values lo
  const subtotal = cart.subtotal || 0;
  const bechoProtectTotal = cart.bechoProtectTotal || 0;
  
  // ✅ CORRECT: Platform fee percentage SUBTOTAL pe calculate karo
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
  
  // Platform fee calculate karo (sirf subtotal pe)
  const platformFee = Math.round((subtotal * platformFeePercentage) / 100);
  
  // ✅ Tax sirf platform fee pe calculate karo
  const tax = Math.round(platformFee * 0.18);
  
  // ✅ Grand total CORRECT calculation
  const grandTotal = subtotal + bechoProtectTotal + platformFee + tax + SHIPPING_CHARGE;
  
  console.log('🧮 Calculation Breakdown:', {
    subtotal,
    bechoProtectTotal,
    platformFeePercentage,
    platformFee,
    tax,
    shipping: SHIPPING_CHARGE,
    grandTotal
  });
  
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
      {/* ✅ IMPORTANT: Add Razorpay Script */}
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => console.log('✅ Razorpay SDK loaded successfully')}
        onError={() => console.error('❌ Failed to load Razorpay SDK')}
      />
      
      <Header />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ✅ HEADER SECTION */}
          <div className="mb-10">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
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
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-light tracking-widest uppercase"
                  >
                    <FiArrowLeft className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Link>
                  
                  <button
                    onClick={clearCart}
                    className="flex items-center text-red-600 hover:text-red-700 transition-colors text-sm font-light tracking-widest uppercase"
                  >
                    <FiTrash2 className="w-4 h-4 mr-2" />
                    Clear Cart
                  </button>
                </div>
              )}
            </div>
          </div>

          {cart && cart.items && cart.items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ✅ LEFT SECTION - PRODUCTS */}
              <div className="lg:col-span-2">
                {/* User Info Banner */}
                {user && (
                  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name || user.email}</p>
                        <p className="text-sm text-gray-600">
                          Shipping to: {user.address ? `${user.address.city}, ${user.address.state}` : 'Add address'}
                        </p>
                      </div>
                      <Link 
                        href="/profile" 
                        className="ml-auto text-sm text-blue-600 hover:text-blue-800"
                      >
                        Update Profile
                      </Link>
                    </div>
                  </div>
                )}
                
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
                    <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Product Image */}
                        <Link 
                          href={`/products/${item.product?._id}`}
                          className="flex-shrink-0 w-full sm:w-24 h-64 sm:h-24 bg-gray-100 rounded-lg overflow-hidden"
                        >
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
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div className="flex-1">
                              <Link href={`/products/${item.product?._id}`}>
                                <h3 className="text-lg font-light text-gray-900 hover:text-gray-700">
                                  {item.product?.productName || 'Product'}
                                </h3>
                              </Link>
                              
                              <div className="space-y-1 mt-2">
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
                              <p className="text-lg font-light text-gray-900">
                                ₹{item.price?.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
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
              </div>

              {/* ✅ RIGHT SECTION - CHECKOUT */}
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
                    
                    {/* GST */}
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

                  {/* ✅ UPDATED CHECKOUT BUTTON WITH RAZORPAY */}
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading || !user?.profileCompleted || !user?.address || !user?.phone}
                    className={`w-full py-4 rounded-lg font-medium shadow-lg mb-4 transition-all duration-300 ${
                      checkoutLoading || !user?.profileCompleted || !user?.address || !user?.phone
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-gray-900 to-black text-white hover:from-gray-800 hover:to-gray-900 hover:shadow-xl'
                    }`}
                  >
                    {checkoutLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </span>
                    ) : !user?.profileCompleted ? (
                      'Complete Profile to Checkout'
                    ) : !user?.address || !user?.phone ? (
                      'Add Address & Phone'
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </button>

                  {/* Payment Methods */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">We accept:</p>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-gray-100 rounded text-xs">Credit/Debit Cards</div>
                      <div className="px-3 py-1 bg-gray-100 rounded text-xs">UPI</div>
                      <div className="px-3 py-1 bg-gray-100 rounded text-xs">Net Banking</div>
                      <div className="px-3 py-1 bg-gray-100 rounded text-xs">Wallets</div>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <FiShield className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600">
                      Secure checkout • 100% Authenticity Guaranteed
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    24/7 Customer Support • SSL Encrypted
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