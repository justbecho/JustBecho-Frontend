'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    
    fetchUserData(token)
    fetchOrders(token)
    
    // Check for success parameter
    const success = searchParams.get('success')
    if (success === 'true') {
      // Show success message
      setTimeout(() => {
        alert('🎉 Order placed successfully! Check your orders below.')
      }, 500)
    }
  }, [router, searchParams])
  
  const fetchUserData = async (token) => {
    try {
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
  
  const fetchOrders = async (token) => {
    try {
      const response = await fetch('https://just-becho-backend.vercel.app/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders)
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your orders...</p>
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
          <div className="mb-10">
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/dashboard" className="hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">My Orders</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-light tracking-widest uppercase text-gray-900 mb-2">
                  My Orders
                </h1>
                <p className="text-gray-600 text-sm font-light tracking-widest uppercase">
                  {orders.length} ORDER{orders.length !== 1 ? 'S' : ''}
                </p>
              </div>
              
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-light tracking-widest uppercase self-start sm:self-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
          
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          Order #{order._id.toString().substring(0, 8)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'paid' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    
                    <div className="mt-3 md:mt-0 text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{order.totalAmount?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total Amount
                      </p>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-light text-gray-900 mb-3">Order Items</h3>
                    {order.products && order.products.length > 0 ? (
                      order.products.map((product, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          {product.images?.[0]?.url && (
                            <img 
                              src={product.images[0].url} 
                              alt={product.productName}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{product.productName}</h4>
                            <p className="text-sm text-gray-600">Status: Sold</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              ₹{product.finalPrice?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No product details available</p>
                    )}
                  </div>
                  
                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-lg font-light text-gray-900 mb-3">Shipping Address</h4>
                      <div className="text-gray-600">
                        <p>{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        <p>Phone: {order.shippingAddress.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-light text-gray-900 mb-4">No orders yet</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping to place your first order!
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