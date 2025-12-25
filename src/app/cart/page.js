'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import Image from 'next/image'
import { 
  FiShoppingBag, FiTrash2, FiPlus, FiMinus, FiArrowLeft, 
  FiShoppingCart, FiShield, FiCheck, FiX, FiUser,
  FiTruck, FiCreditCard, FiChevronLeft, FiChevronRight,
  FiInfo, FiPackage, FiLock
} from 'react-icons/fi'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [togglingBechoProtect, setTogglingBechoProtect] = useState(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [checkoutTotals, setCheckoutTotals] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  // Constants
  const SHIPPING_CHARGE = 1

  // Check mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  // Fetch checkout totals when cart updates
  useEffect(() => {
    if (cart && cart.items && cart.items.length > 0) {
      fetchCheckoutTotals()
    }
  }, [cart])

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

  const fetchCheckoutTotals = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('https://just-becho-backend.vercel.app/api/cart/checkout-totals', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      if (data.success) {
        setCheckoutTotals(data.totals)
      }
    } catch (error) {
      console.error('Error fetching checkout totals:', error)
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
        setCheckoutTotals(null)
      } else {
        alert(data.message || 'Failed to clear cart')
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      alert('Error clearing cart')
    }
  }

  // Calculate frontend totals (matching backend logic)
  const calculateFrontendTotals = () => {
    if (!cart) return {
      subtotal: 0,
      bechoProtectTotal: 0,
      gst: 0,
      shipping: SHIPPING_CHARGE,
      grandTotal: 0
    }

    const subtotal = cart.subtotal || 0
    const bechoProtectTotal = cart.bechoProtectTotal || 0
    
    // Hidden platform fee calculation
    let platformFeePercentage = 0
    if (subtotal <= 2000) {
      platformFeePercentage = 30
    } else if (subtotal >= 2001 && subtotal <= 5000) {
      platformFeePercentage = 28
    } else if (subtotal >= 5001 && subtotal <= 10000) {
      platformFeePercentage = 25
    } else if (subtotal >= 10001 && subtotal <= 15000) {
      platformFeePercentage = 20
    } else {
      platformFeePercentage = 15
    }
    
    const platformFee = Math.round((subtotal * platformFeePercentage) / 100)
    const gst = Math.round(platformFee * 0.18)
    const grandTotal = subtotal + bechoProtectTotal + gst + SHIPPING_CHARGE
    
    return {
      subtotal,
      bechoProtectTotal,
      gst,
      shipping: SHIPPING_CHARGE,
      grandTotal
    }
  }

  // Use backend totals if available, otherwise use frontend calculation
  const displayTotals = checkoutTotals || calculateFrontendTotals()

  // ✅ RAZORPAY CHECKOUT FUNCTION - UPDATED REDIRECT
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
      const totals = displayTotals

      console.log('🚀 Starting checkout process...')
      console.log('📊 Total amount:', totals.grandTotal)

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
          
          try {
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
              console.log('🎉 Payment verified successfully!')
              
              // ✅ Show success message
              alert('🎉 Payment Successful! Your order has been placed.')
              
              // ✅ Clear cart after successful payment
              try {
                const clearCartResponse = await fetch('https://just-becho-backend.vercel.app/api/cart/clear', {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                })
                
                const clearCartData = await clearCartResponse.json()
                if (clearCartData.success) {
                  console.log('🛒 Cart cleared after successful payment')
                  setCart(null)
                  setCheckoutTotals(null)
                }
              } catch (clearError) {
                console.error('Error clearing cart:', clearError)
              }
              
              // ✅ IMPORTANT: Trigger cart update for other components
              window.dispatchEvent(new CustomEvent('cartUpdate', { 
                detail: { cleared: true } 
              }))
              
              // ✅ Store payment success flag for dashboard
              localStorage.setItem('showOrderSuccess', 'true')
              localStorage.setItem('lastOrderId', verifyData.order?._id || '')
              
              // ✅ Redirect to DASHBOARD ORDERS SECTION with success parameter
              setTimeout(() => {
                router.push('/dashboard?section=orders&payment=success')
              }, 1500)
              
            } else {
              console.error('❌ Payment verification failed:', verifyData.message)
              alert(`❌ Payment verification failed: ${verifyData.message}`)
            }
          } catch (verifyError) {
            console.error('❌ Verification error:', verifyError)
            alert('❌ Payment verification error. Please contact support.')
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
        },
        notes: {
          platform: 'justbecho',
          userId: user._id || user.userId
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-24 md:pt-32">
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
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* ✅ MOBILE BACK BUTTON */}
          {isMobile && (
            <div className="mb-4 px-2">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm"
              >
                <FiChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
            </div>
          )}

          {/* ✅ HEADER SECTION - RESPONSIVE */}
          <div className="mb-6 md:mb-10 px-2 md:px-0">
            {/* Breadcrumb - Hidden on mobile */}
            <div className="hidden md:flex items-center text-sm text-gray-600 mb-3">
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Shopping Cart</span>
            </div>
            
            {/* Main Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-widest uppercase text-gray-900 mb-1 md:mb-2">
                  Your Cart
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm font-light tracking-widest uppercase">
                  {cart?.totalItems || 0} ITEM{cart?.totalItems !== 1 ? 'S' : ''}
                </p>
              </div>
              
              {cart && cart.items && cart.items.length > 0 && (
                <div className="flex items-center gap-3 self-start sm:self-center flex-wrap">
                  <Link 
                    href="/" 
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-xs sm:text-sm font-light tracking-widest"
                  >
                    <FiArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Continue Shopping</span>
                    <span className="sm:hidden">Shop More</span>
                  </Link>
                  
                  <button
                    onClick={clearCart}
                    className="flex items-center text-red-600 hover:text-red-700 transition-colors text-xs sm:text-sm font-light tracking-widest"
                  >
                    <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Clear Cart
                  </button>
                </div>
              )}
            </div>
          </div>

          {cart && cart.items && cart.items.length > 0 ? (
            <>
              {/* MOBILE CHECKOUT STICKY BAR */}
              {isMobile && (
                <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm mb-4">
                  <div className="px-3 py-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Total ({cart.totalItems || 0} items)</p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{displayTotals.grandTotal.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={handleCheckout}
                        disabled={checkoutLoading || !user?.profileCompleted || !user?.address || !user?.phone}
                        className={`px-6 py-2.5 rounded-lg font-medium text-sm ${
                          checkoutLoading || !user?.profileCompleted || !user?.address || !user?.phone
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-900'
                        }`}
                      >
                        {checkoutLoading ? 'Processing...' : 'Checkout'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-6">
                {/* ✅ LEFT SECTION - PRODUCTS */}
                <div className="lg:w-2/3">
                  {/* User Info Banner - Mobile Collapsible */}
                  {user && (
                    <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FiUser className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm md:text-base truncate">
                            {user.name || user.email}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600 truncate">
                            Shipping to: {user.address ? `${user.address.city}, ${user.address.state}` : 'Add address'}
                          </p>
                        </div>
                        <Link 
                          href="/profile" 
                          className="text-xs md:text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap"
                        >
                          {isMobile ? 'Edit' : 'Update Profile'}
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  {/* Items List - Mobile Optimized */}
                  <div className="space-y-3 md:space-y-4">
                    {cart.items.map((item) => (
                      <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Mobile Header - Product Name & Remove */}
                        <div className="md:hidden flex justify-between items-center p-3 border-b border-gray-100">
                          <h3 className="font-medium text-gray-900 text-sm truncate">
                            {item.product?.productName || 'Product'}
                          </h3>
                          <button
                            onClick={() => removeItem(item._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 p-3 md:p-4">
                          {/* Product Image - Mobile Stacked */}
                          <div className="flex items-start gap-3 md:gap-4">
                            <Link 
                              href={`/products/${item.product?._id}`}
                              className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden relative"
                            >
                              {item.product?.images?.[0]?.url ? (
                                <Image
                                  src={item.product.images[0].url}
                                  alt={item.product.productName}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <FiShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                                </div>
                              )}
                            </Link>

                            {/* Product Details - Mobile Stacked */}
                            <div className="flex-1 min-w-0">
                              {/* Desktop Product Name */}
                              <div className="hidden md:block mb-2">
                                <Link href={`/products/${item.product?._id}`}>
                                  <h3 className="text-base font-medium text-gray-900 hover:text-gray-700 line-clamp-2">
                                    {item.product?.productName || 'Product'}
                                  </h3>
                                </Link>
                              </div>
                              
                              {/* Product Info */}
                              <div className="space-y-1">
                                <p className="text-gray-600 text-xs md:text-sm">
                                  <span className="font-medium">Brand:</span> {item.product?.brand || 'Unknown'}
                                </p>
                                
                                <p className="text-gray-600 text-xs md:text-sm">
                                  <span className="font-medium">Condition:</span> {item.product?.condition || 'Not specified'}
                                </p>
                                
                                {item.size && (
                                  <p className="text-gray-600 text-xs md:text-sm">
                                    <span className="font-medium">Size:</span> {item.size}
                                  </p>
                                )}
                                
                                {item.color && (
                                  <p className="text-gray-600 text-xs md:text-sm">
                                    <span className="font-medium">Color:</span> {item.color}
                                  </p>
                                )}
                              </div>

                              {/* Mobile Price */}
                              <div className="md:hidden mt-2">
                                <p className="text-base font-bold text-gray-900">
                                  ₹{item.price?.toLocaleString()}
                                </p>
                                {item.bechoProtect?.selected && (
                                  <p className="text-xs text-green-600 mt-1">
                                    + Becho Protect: ₹{item.bechoProtect.price?.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Desktop Controls & Totals */}
                          <div className="hidden md:flex flex-col justify-between w-40 flex-shrink-0">
                            {/* Price */}
                            <div className="text-right">
                              <p className="text-lg font-medium text-gray-900">
                                ₹{item.price?.toLocaleString()}
                              </p>
                              {item.bechoProtect?.selected && (
                                <p className="text-xs text-green-600 mt-1">
                                  + Becho Protect: ₹{item.bechoProtect.price?.toLocaleString()}
                                </p>
                              )}
                            </div>

                            {/* SINGLE ITEM - NO QUANTITY CONTROLS */}
                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                Single Item
                              </p>
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

                            {/* Desktop Remove Button */}
                            <div className="text-right">
                              <button
                                onClick={() => removeItem(item._id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Bottom Section */}
                        <div className="md:hidden border-t border-gray-100 p-3 space-y-3">
                          {/* SINGLE ITEM - NO QUANTITY CONTROLS */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Quantity:</span>
                            <span className="font-medium">1</span>
                          </div>

                          {/* Becho Protect Toggle */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.bechoProtect?.selected ? 'bg-green-500' : 'bg-gray-300'}`}>
                                {item.bechoProtect?.selected && <FiCheck className="w-2 h-2 text-white" />}
                              </div>
                              <span className="text-xs font-medium text-gray-700">
                                Becho Protect
                              </span>
                              {item.bechoProtect?.price > 0 && (
                                <span className="text-xs text-gray-500">
                                  (₹{item.bechoProtect.price})
                                </span>
                              )}
                            </div>
                            
                            <button
                              onClick={() => toggleBechoProtect(item._id, item.bechoProtect?.selected)}
                              disabled={togglingBechoProtect === item._id}
                              className={`px-3 py-1 rounded text-xs font-medium ${item.bechoProtect?.selected 
                                ? 'bg-red-50 text-red-700' 
                                : 'bg-gray-100 text-gray-700'}`}
                            >
                              {togglingBechoProtect === item._id ? 'Updating...' : item.bechoProtect?.selected ? 'Remove' : 'Add'}
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                            <span className="text-sm text-gray-600">Item total:</span>
                            <span className="text-base font-bold text-gray-900">
                              ₹{item.totalPrice?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Security Info - Mobile */}
                  {isMobile && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FiLock className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">Secure Shopping</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Your payment is secured with 256-bit SSL encryption. 100% authenticity guaranteed on all products.
                      </p>
                    </div>
                  )}
                </div>

                {/* ✅ RIGHT SECTION - CHECKOUT (DESKTOP) */}
                <div className="lg:w-1/3">
                  <div className="sticky top-24">
                    <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                      
                      <div className="space-y-4 mb-6">
                        {/* Subtotal */}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal ({cart.totalItems || 0} items)</span>
                          <span className="text-gray-900">₹{(cart.subtotal || 0).toLocaleString()}</span>
                        </div>
                        
                        {/* Becho Protect Total */}
                        {cart.bechoProtectTotal > 0 && (
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <FiShield className="w-3 h-3 text-green-600" />
                              <span className="text-gray-600">Becho Protect</span>
                            </div>
                            <span className="text-green-600">₹{(cart.bechoProtectTotal || 0).toLocaleString()}</span>
                          </div>
                        )}
                        
                        {/* Shipping */}
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <FiTruck className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-600">Shipping</span>
                          </div>
                          <span className="text-gray-900">₹{SHIPPING_CHARGE.toLocaleString()}</span>
                        </div>
                        
                        {/* GST */}
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <FiCreditCard className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-600">GST (18%)</span>
                          </div>
                          <span className="text-gray-900">₹{displayTotals.gst.toLocaleString()}</span>
                        </div>
                        
                        {/* Divider */}
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between text-lg font-bold mb-1">
                            <span className="text-gray-900">Total Amount</span>
                            <span className="text-gray-900">
                              ₹{displayTotals.grandTotal.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Inclusive of all taxes and shipping
                          </p>
                        </div>
                      </div>

                      {/* CHECKOUT BUTTON */}
                      <button
                        onClick={handleCheckout}
                        disabled={checkoutLoading || !user?.profileCompleted || !user?.address || !user?.phone}
                        className={`w-full py-3.5 rounded-lg font-medium text-base mb-4 transition-all ${
                          checkoutLoading || !user?.profileCompleted || !user?.address || !user?.phone
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-gray-900 to-black text-white hover:from-gray-800 hover:to-gray-900'
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

                    {/* Mobile Help Info */}
                    {isMobile && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <FiInfo className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-900">Need Help?</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          Contact our customer support for any questions about your order.
                        </p>
                        <a 
                          href="tel:+919999999999" 
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Call +91 99999 99999
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Empty Cart State - Responsive
            <div className="text-center py-12 md:py-16 px-4">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <FiShoppingCart className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-light text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm md:text-base">
                Looks like you haven't added any items to your cart yet. Start shopping to discover amazing luxury products!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-gray-900 to-black text-white px-6 md:px-8 py-3 rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all font-medium text-sm md:text-base"
                >
                  Start Shopping
                </Link>
                <Link
                  href="/collections"
                  className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-6 md:px-8 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm md:text-base"
                >
                  Browse Collections
                </Link>
              </div>
            </div>
          )}

          {/* Mobile Continue Shopping Bottom Bar */}
          {cart && cart.items && cart.items.length > 0 && isMobile && (
            <div className="mt-6 p-4 bg-white border-t border-gray-200 shadow-lg">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900 text-sm font-medium"
              >
                <FiChevronRight className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}