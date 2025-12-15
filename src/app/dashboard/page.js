'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [activeSection, setActiveSection] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [redirectPath, setRedirectPath] = useState('')
  const router = useRouter()
  
  const [sellerStatus, setSellerStatus] = useState({
    verified: false,
    status: 'not_started',
    verificationId: null,
    username: null
  })

  const [listings, setListings] = useState([])
  const [purchases, setPurchases] = useState([])
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])

  // ✅ ADDED: Listing filter state
  const [listingFilter, setListingFilter] = useState('all')

  // ✅ FIXED: Safe localStorage access
  const getLocalStorage = useCallback((key) => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Error accessing localStorage:', error)
      return null
    }
  }, [])

  // ✅ FIXED: Safe JSON parsing
  const parseUserData = useCallback((data) => {
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }, [])

  // ✅ FIXED: Ensure username is in "name@justbecho" format
  const ensureJustbechoFormat = useCallback((username) => {
    if (!username) return null;
    
    // Remove any leading @
    let clean = username.replace(/^@+/, '');
    
    // If already ends with @justbecho, return as-is
    if (clean.endsWith('@justbecho')) {
      return clean;
    }
    
    // If contains @justbecho elsewhere, fix it
    if (clean.includes('@justbecho')) {
      const namePart = clean.replace('@justbecho', '');
      return `${namePart}@justbecho`;
    }
    
    // Add @justbecho suffix
    return `${clean}@justbecho`;
  }, [])

  // ✅ Format address function
  const formatAddress = useCallback((address) => {
    if (!address) return 'Not provided'
    
    if (typeof address === 'string') {
      return address
    }
    
    if (typeof address === 'object') {
      const parts = []
      if (address.street) parts.push(address.street)
      if (address.city) parts.push(address.city)
      if (address.state) parts.push(address.state)
      if (address.pincode) parts.push(address.pincode)
      
      return parts.length > 0 ? parts.join(', ') : 'Not provided'
    }
    
    return 'Not provided'
  }, [])

  // ✅ SELLER STATUS CHECK FUNCTION
  const checkSellerStatus = useCallback(async () => {
    try {
      const token = getLocalStorage('token');
      if (!token) return;
      
      const response = await fetch('https://just-becho-backend.vercel.app/api/auth/profile-status', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          // ✅ FIXED: Ensure username is in "name@justbecho" format
          const formattedUsername = ensureJustbechoFormat(data.username);
          
          setSellerStatus({
            verified: data.sellerVerified,
            status: data.sellerVerificationStatus,
            verificationId: data.verificationId,
            username: formattedUsername
          });
          
          // Update user data with latest status
          if (user) {
            const updatedUser = { 
              ...user, 
              ...data,
              username: formattedUsername
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
          }
        }
      }
    } catch (error) {
      console.error('Error checking seller status:', error);
    }
  }, [user, getLocalStorage, ensureJustbechoFormat])

  // ✅ UPDATED: HANDLE BECOME A SELLER/BECOME SELLER BUTTON CLICK - FIXED
  const handleBecomeSeller = async () => {
    try {
      const token = getLocalStorage('token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      console.log('🔄 Converting buyer to seller...');
      
      // Show confirmation
      const confirmUpdate = confirm('Are you sure you want to become a seller? This will require you to complete seller profile details (bank information, etc.) and admin approval.');
      if (!confirmUpdate) return;
      
      // Call backend API to convert to seller
      const response = await fetch('https://just-becho-backend.vercel.app/api/auth/convert-to-seller', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to convert to seller');
      }
      
      if (data.success) {
        console.log('✅ Converted to seller, redirecting to complete profile');
        
        // ✅ FIXED: Ensure username is in "name@justbecho" format
        const formattedUsername = ensureJustbechoFormat(data.user?.username);
        
        // ✅ IMPORTANT: Set flag for seller conversion
        localStorage.setItem('changingRoleToSeller', 'true');
        localStorage.setItem('sellerConversionInProgress', 'true');
        
        // ✅ Don't clear user data immediately, let complete-profile handle it
        
        // Save new token if provided
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        // Save user data if provided
        if (data.user) {
          const updatedUser = {
            ...data.user,
            username: formattedUsername
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        // Show success message
        alert('✅ You are now registered as a seller! Please complete your seller profile details including bank information.');
        
        // ✅ FIXED: Redirect to complete-profile with proper parameters
        setTimeout(() => {
          router.push('/complete-profile?convertingToSeller=true');
        }, 1000);
        
      } else {
        throw new Error(data.message || 'Conversion failed');
      }
      
    } catch (error) {
      console.error('Error in handleBecomeSeller:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // ✅ FETCH USER'S PRODUCTS - WORKING VERSION
  const fetchMyProducts = async () => {
    try {
      const token = getLocalStorage('token');
      if (!token) {
        console.log('❌ No token found for fetching products');
        return;
      }
      
      console.log('📡 Fetching my products from /api/products/my-products...');
      
      const response = await fetch('https://just-becho-backend.vercel.app/api/products/my-products', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📊 My Products Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ My Products API Response:', data);
        
        // ✅ Handle different response formats
        if (data.success && data.products) {
          // Format 1: { success: true, products: [...] }
          console.log(`📦 Found ${data.products.length} products (format 1)`);
          setListings(data.products);
        } else if (data.success && Array.isArray(data.products)) {
          // Format 2: { success: true, products: [...] } (alternative)
          console.log(`📦 Found ${data.products.length} products (format 2)`);
          setListings(data.products);
        } else if (Array.isArray(data)) {
          // Format 3: Direct array response
          console.log(`📦 Found ${data.length} products (format 3)`);
          setListings(data);
        } else if (data && data.length !== undefined) {
          // Format 4: Array-like object
          console.log(`📦 Found ${data.length} products (format 4)`);
          setListings(data);
        } else {
          console.error('❌ API returned unexpected format:', data);
          setListings([]);
        }
      } else {
        console.error('❌ Failed to fetch my products:', response.status);
        
        // ✅ Fallback: Check if user is seller and show appropriate message
        if (user?.role === 'seller') {
          console.log('👤 User is seller but no products found');
          setListings([]);
        } else {
          console.log('👤 User is not a seller');
          setListings([]);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching my products:', error);
      setListings([]);
    }
  }

  // ✅ FETCH WISHLIST
  const fetchWishlist = async () => {
    try {
      const token = getLocalStorage('token');
      if (!token) return;
      
      const response = await fetch('https://just-becho-backend.vercel.app/api/wishlist', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const wishlistData = await response.json();
        console.log('🎯 Wishlist API Response:', wishlistData);
        
        if (wishlistData.success) {
          setWishlist(wishlistData.products || wishlistData.wishlist?.products || []);
        }
      } else {
        console.error('Failed to fetch wishlist');
        setWishlist([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    }
  }

  // ✅ FETCH ORDERS
  const fetchOrders = async () => {
    try {
      const token = getLocalStorage('token');
      if (!token) return;
      
      const response = await fetch('https://just-becho-backend.vercel.app/api/orders/my-orders', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const ordersData = await response.json();
        console.log('📦 Orders API Response:', ordersData);
        
        if (ordersData.success) {
          setOrders(ordersData.orders || []);
        }
      } else {
        console.error('Failed to fetch orders');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  }

  // ✅ FETCH USER DATA
  const fetchUserData = async (token) => {
    try {
      console.log('📡 Fetching user data from backend...');
      
      let userResponse = await fetch('https://just-becho-backend.vercel.app/api/auth/google/user', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!userResponse.ok) {
        console.log('🔄 Trying regular user endpoint...');
        userResponse = await fetch('https://just-becho-backend.vercel.app/api/auth/me', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log('✅ User data received:', userData);
        
        if (userData.success && userData.user) {
          // ✅ FIXED: Ensure username is in "name@justbecho" format
          const cleanedUser = {
            ...userData.user,
            username: ensureJustbechoFormat(userData.user.username)
          };
          return cleanedUser;
        } else if (userData.id || userData.email) {
          const cleanedUser = {
            ...userData,
            username: ensureJustbechoFormat(userData.username)
          };
          return cleanedUser;
        } else {
          throw new Error('Invalid user data structure');
        }
      } else {
        throw new Error(`Failed to fetch user data: ${userResponse.status}`);
      }
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      throw error;
    }
  }

  // ✅ HANDLE REDIRECTS
  useEffect(() => {
    if (shouldRedirect && redirectPath) {
      console.log(`🔄 Redirecting to: ${redirectPath}`);
      router.push(redirectPath);
      setShouldRedirect(false);
    }
  }, [shouldRedirect, redirectPath, router])

  // ✅ MAIN AUTH CHECK
  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔄 Starting auth check...');
      
      try {
        const token = getLocalStorage('token');
        const storedUserData = getLocalStorage('user');
        
        console.log('🔑 Token exists:', !!token);
        console.log('👤 User data exists:', !!storedUserData);
        
        if (!token || !storedUserData) {
          console.log('❌ No auth data, redirecting to login');
          setRedirectPath('/login');
          setShouldRedirect(true);
          return;
        }
        
        const userObj = parseUserData(storedUserData);
        console.log('📋 Parsed user data:', userObj);
        
        if (!userObj) {
          console.log('❌ Invalid user data, redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setRedirectPath('/login');
          setShouldRedirect(true);
          return;
        }
        
        // ✅ FIXED: Ensure username is in "name@justbecho" format
        if (userObj.username) {
          userObj.username = ensureJustbechoFormat(userObj.username);
        }
        
        // Set user immediately for better UX
        setUser(userObj);
        
        // Check profile completion
        if (!userObj.profileCompleted) {
          console.log('🔄 Profile not completed, redirecting...');
          setRedirectPath('/complete-profile');
          setShouldRedirect(true);
          return;
        }
        
        // Check seller status if user is seller
        if (userObj.role === 'seller') {
          await checkSellerStatus();
        }
        
        console.log('🚀 Fetching dashboard data...');
        
        // Fetch all data in parallel
        await Promise.allSettled([
          fetchMyProducts(),
          fetchWishlist(),
          fetchOrders()
        ]);
        
        console.log('✅ All data fetched successfully');
        console.log('📊 Products count:', listings.length);
        console.log('📊 Orders count:', orders.length);
        console.log('📊 Wishlist count:', wishlist.length);
        
        setAuthChecked(true);
        
      } catch (error) {
        console.error('❌ Dashboard auth error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setRedirectPath('/login');
        setShouldRedirect(true);
      } finally {
        setLoading(false);
      }
    }

    if (!authChecked) {
      checkAuth();
    }
  }, [router])

  // ✅ REFRESH DATA WHEN SECTION CHANGES
  useEffect(() => {
    if (user && authChecked && activeSection === 'listings') {
      console.log('🔄 Refreshing products for listings section...');
      fetchMyProducts();
    }
    
    if (user && authChecked && activeSection === 'wishlist') {
      console.log('🔄 Refreshing wishlist...');
      fetchWishlist();
    }
    
    if (user && authChecked && activeSection === 'orders') {
      console.log('🔄 Refreshing orders...');
      fetchOrders();
    }
  }, [user, authChecked, activeSection])

  // ✅ HANDLE URL PARAMS
  useEffect(() => {
    const handleUrlParams = () => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const section = urlParams.get('section');
        
        if (section && ['profile', 'listings', 'purchases', 'orders', 'wishlist'].includes(section)) {
          setActiveSection(section);
          
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }
      }
    }

    handleUrlParams();
  }, [])

  // ✅ RENDER SELLER STATUS BANNER - FIXED USERNAME DISPLAY
  const renderSellerStatusBanner = () => {
    if (user?.role !== 'seller') return null;
    
    // ✅ FIXED: Ensure username is in "name@justbecho" format
    const formattedUsername = sellerStatus.username 
      ? ensureJustbechoFormat(sellerStatus.username)
      : null;
    
    switch(sellerStatus.status) {
      case 'pending':
        return (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-900">Seller Approval Pending</h4>
                  <p className="text-yellow-700 text-sm">
                    Your verification is under review. You'll be notified once approved.
                    {sellerStatus.verificationId && (
                      <span className="block mt-1 text-xs">
                        Verification ID: <code className="bg-yellow-100 px-2 py-1 rounded">{sellerStatus.verificationId}</code>
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button 
                onClick={checkSellerStatus}
                className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Refresh Status
              </button>
            </div>
          </div>
        );
      
      case 'approved':
        return (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-green-900">Seller Approved! 🎉</h4>
                  <p className="text-green-700 text-sm">
                    Your seller account is now active. You can start listing products.
                    {formattedUsername && (
                      <span className="block mt-1 font-medium">
                        Username: {formattedUsername}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/sell-now')}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Selling
              </button>
            </div>
          </div>
        );
      
      case 'rejected':
        return (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-red-900">Seller Verification Rejected</h4>
                <p className="text-red-700 text-sm">
                  Your verification request was rejected. Please contact support.
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  }

  // ✅ REMOVE FROM WISHLIST
  const removeFromWishlist = async (productId) => {
    if (!confirm('Are you sure you want to remove this item from wishlist?')) return;

    try {
      const token = getLocalStorage('token');
      if (!token) {
        alert('Please login first');
        return;
      }
      
      const response = await fetch(`https://just-becho-backend.vercel.app/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          await fetchWishlist();
          alert('Removed from wishlist!');
        }
      } else {
        alert('Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Error removing from wishlist');
    }
  }

  // ✅ HANDLE PRODUCT CLICK
  const handleProductClick = (productId) => {
    if (productId) {
      router.push(`/products/${productId}`);
    }
  }

  // ✅ DELETE PRODUCT LISTING
  const deleteListing = async (productId) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    try {
      const token = getLocalStorage('token')
      if (!token) {
        alert('Please login first');
        return;
      }
      
      console.log('🗑️ Deleting listing:', productId);
      
      const response = await fetch(`https://just-becho-backend.vercel.app/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Listing deleted:', result);
        
        // Refresh products list
        await fetchMyProducts();
        alert('Listing deleted successfully!');
      } else {
        const errorText = await response.text();
        console.error('❌ Delete failed:', response.status, errorText);
        alert('Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Error deleting listing');
    }
  }

  // ✅ MARK AS SHIPPED FUNCTION
  const markAsShipped = async (productId) => {
    if (!confirm('Mark this item as shipped? Buyer will be notified.')) return;

    try {
      const token = getLocalStorage('token')
      if (!token) {
        alert('Please login first');
        return;
      }
      
      console.log('🚚 Marking as shipped:', productId);
      
      const response = await fetch(`https://just-becho-backend.vercel.app/api/products/${productId}/ship`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          shippingStatus: 'shipped',
          shippedAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Product marked as shipped:', result);
        
        // Refresh products list
        await fetchMyProducts();
        alert('Product marked as shipped! Buyer will be notified.');
      } else {
        const errorText = await response.text();
        console.error('❌ Mark as shipped failed:', response.status, errorText);
        alert('Failed to mark as shipped');
      }
    } catch (error) {
      console.error('Error marking as shipped:', error);
      alert('Error marking as shipped');
    }
  }

  // ✅ MARK AS DELIVERED FUNCTION
  const markAsDelivered = async (productId) => {
    if (!confirm('Mark this item as delivered? Order will be completed.')) return;

    try {
      const token = getLocalStorage('token')
      if (!token) {
        alert('Please login first');
        return;
      }
      
      console.log('✅ Marking as delivered:', productId);
      
      const response = await fetch(`https://just-becho-backend.vercel.app/api/products/${productId}/deliver`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          shippingStatus: 'delivered',
          deliveredAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Product marked as delivered:', result);
        
        // Refresh products list
        await fetchMyProducts();
        alert('Product marked as delivered! Order completed.');
      } else {
        const errorText = await response.text();
        console.error('❌ Mark as delivered failed:', response.status, errorText);
        alert('Failed to mark as delivered');
      }
    } catch (error) {
      console.error('Error marking as delivered:', error);
      alert('Error marking as delivered');
    }
  }

  // ✅ MENU ITEMS
  const menuItems = [
    {
      id: 'profile',
      label: 'My Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'listings',
      label: 'My Listings', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 'orders',
      label: 'My Orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      id: 'wishlist',
      label: 'My Wishlist',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
  ]

  // ✅ PROFILE EDIT STATE
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  // ✅ SET FORM DATA WHEN USER CHANGES
  useEffect(() => {
    if (user) {
      let addressValue = '';
      
      if (user.address) {
        if (typeof user.address === 'string') {
          addressValue = user.address;
        } else if (typeof user.address === 'object') {
          const parts = [];
          if (user.address.street) parts.push(user.address.street);
          if (user.address.city) parts.push(user.address.city);
          if (user.address.state) parts.push(user.address.state);
          if (user.address.pincode) parts.push(user.address.pincode);
          addressValue = parts.join(', ');
        }
      }
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: addressValue || ''
      })
    }
  }, [user])

  // ✅ SAVE PROFILE
  const handleSaveProfile = async () => {
    try {
      const token = getLocalStorage('token')
      if (!token) {
        alert('Please login first');
        return;
      }
      
      const formattedData = {
        ...formData,
        address: formData.address
      }
      
      const response = await fetch('https://just-becho-backend.vercel.app/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      })

      if (response.ok) {
        const updatedUser = await response.json()
        localStorage.setItem('user', JSON.stringify(updatedUser.user))
        setUser(updatedUser.user)
        setIsEditing(false)
        alert('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
    }
  }

  // ✅ FORMAT DATE
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // ✅ FILTERED LISTINGS
  const filteredListings = listings.filter(item => {
    if (listingFilter === 'all') return true;
    if (listingFilter === 'active') return item.status === 'active';
    if (listingFilter === 'sold') return item.status === 'sold';
    if (listingFilter === 'ready') return item.status === 'sold' && (!item.shippingStatus || item.shippingStatus === 'pending' || item.shippingStatus === 'ready');
    if (listingFilter === 'shipped') return item.status === 'sold' && item.shippingStatus === 'shipped';
    if (listingFilter === 'delivered') return item.status === 'sold' && item.shippingStatus === 'delivered';
    return true;
  });

  // ✅ STATS
  const readyForShipmentCount = listings.filter(item => 
    item.status === 'sold' && (!item.shippingStatus || item.shippingStatus === 'pending' || item.shippingStatus === 'ready')
  ).length;
  
  const shippedCount = listings.filter(item => 
    item.status === 'sold' && item.shippingStatus === 'shipped'
  ).length;
  
  const deliveredCount = listings.filter(item => 
    item.status === 'sold' && item.shippingStatus === 'delivered'
  ).length;

  const stats = {
    totalListings: listings.length,
    activeListings: listings.filter(l => l.status === 'active').length,
    soldListings: listings.filter(l => l.status === 'sold').length,
    readyForShipment: readyForShipmentCount,
    shipped: shippedCount,
    delivered: deliveredCount,
    totalOrders: orders.length,
    wishlistItems: wishlist.length,
    totalSales: user?.totalSales || 0
  }

  // ✅ LOADING STATE
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-40 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
            <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // ✅ DON'T SHOW CONTENT IF REDIRECTING
  if (shouldRedirect || !authChecked) {
    return null;
  }

  // ✅ IF NO USER AFTER AUTH CHECK
  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-40 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-4">Please log in to access your dashboard</p>
            <Link 
              href="/login"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Go to Login
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // ✅ RENDER ACTIVE SECTION
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-light text-gray-900">Personal Information</h3>
                <p className="text-gray-600 mt-1 text-sm">Manage your personal details and contact information</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium tracking-wide text-sm"
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider text-xs">
                      Full Name
                    </label>
                    <p className="text-gray-900 text-base font-light">{user?.name || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider text-xs">
                      Email Address
                    </label>
                    <p className="text-gray-900 text-base font-light">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider text-xs">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-gray-900 text-base font-light">{user?.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider text-xs">
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                        placeholder="Enter your complete address (Street, City, State, Pincode)"
                      />
                    ) : (
                      <p className="text-gray-900 text-base font-light">
                        {formatAddress(user?.address)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium tracking-wide text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'listings':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-light text-gray-900">My Product Listings</h3>
                <p className="text-gray-600 mt-1 text-sm">
                  Total {listings.length} • Active {stats.activeListings} • Sold {stats.soldListings}
                </p>
              </div>
              {user?.sellerVerified && (
                <button
                  onClick={() => router.push('/sell-now')}
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium tracking-wide text-sm"
                >
                  + List New Item
                </button>
              )}
            </div>

            {/* ✅ ADDED: Listing Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
              <button
                onClick={() => setListingFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${listingFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All ({listings.length})
              </button>
              <button
                onClick={() => setListingFilter('active')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${listingFilter === 'active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Active ({stats.activeListings})
              </button>
              <button
                onClick={() => setListingFilter('sold')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${listingFilter === 'sold' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Sold ({stats.soldListings})
              </button>
              <button
                onClick={() => setListingFilter('ready')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${listingFilter === 'ready' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Ready to Ship ({stats.readyForShipment})
              </button>
              <button
                onClick={() => setListingFilter('shipped')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${listingFilter === 'shipped' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Shipped ({stats.shipped})
              </button>
              <button
                onClick={() => setListingFilter('delivered')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${listingFilter === 'delivered' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Delivered ({stats.delivered})
              </button>
            </div>

            {filteredListings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="text-gray-300 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h4 className="text-xl font-light text-gray-900 mb-3">
                  {listingFilter === 'all' ? 'No listings yet' :
                   listingFilter === 'active' ? 'No active listings' :
                   listingFilter === 'sold' ? 'No sold items' :
                   listingFilter === 'ready' ? 'No items ready for shipment' :
                   listingFilter === 'shipped' ? 'No shipped items' :
                   'No delivered items'}
                </h4>
                <p className="text-gray-600 mb-6 text-base">
                  {listingFilter === 'all' ? 'Start selling your luxury items and earn money!' :
                   listingFilter === 'active' ? 'List new items to start selling' :
                   listingFilter === 'sold' ? 'Your sold items will appear here' :
                   listingFilter === 'ready' ? 'Items that need shipping will appear here' :
                   'Your shipped/delivered items will appear here'}
                </p>
                {user?.sellerVerified && listingFilter !== 'sold' && listingFilter !== 'ready' && listingFilter !== 'shipped' && listingFilter !== 'delivered' ? (
                  <button
                    onClick={() => router.push('/sell-now')}
                    className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium tracking-wide text-base"
                  >
                    Create Your First Listing
                  </button>
                ) : user?.role === 'seller' ? (
                  <div className="space-y-3">
                    <p className="text-yellow-600">Your seller verification is pending approval</p>
                    <button 
                      onClick={checkSellerStatus}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Check Status
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleBecomeSeller}
                    className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium tracking-wide text-base"
                  >
                    Become a Seller to List Products
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {filteredListings.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleProductClick(item._id)}
                    className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative w-full aspect-square overflow-hidden mb-3 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                      <img
                        src={item.images?.[0]?.url || '/placeholder-image.jpg'}
                        alt={item.productName}
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      
                      {/* ✅ ADDED: Status Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`text-xs font-light tracking-widest uppercase px-2 py-1 rounded-full ${
                          item.status === 'active' 
                            ? 'bg-green-100 text-green-800' :
                          item.status === 'sold' && (!item.shippingStatus || item.shippingStatus === 'pending' || item.shippingStatus === 'ready')
                            ? 'bg-yellow-100 text-yellow-800' :
                          item.status === 'sold' && item.shippingStatus === 'shipped'
                            ? 'bg-blue-100 text-blue-800' :
                          item.status === 'sold' && item.shippingStatus === 'delivered'
                            ? 'bg-purple-100 text-purple-800' :
                          item.status === 'sold'
                            ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status === 'sold' && (!item.shippingStatus || item.shippingStatus === 'pending' || item.shippingStatus === 'ready')
                            ? 'READY TO SHIP' :
                           item.status === 'sold' && item.shippingStatus === 'shipped'
                            ? 'SHIPPED' :
                           item.status === 'sold' && item.shippingStatus === 'delivered'
                            ? 'DELIVERED' :
                           item.status === 'sold'
                            ? 'SOLD' :
                           item.status?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-left px-1">
                      <h3 className="text-gray-800 text-sm font-light tracking-widest uppercase mb-1 line-clamp-2">
                        {item.productName?.toUpperCase()}
                      </h3>
                      <p className="text-gray-900 text-base font-light tracking-widest uppercase mb-2">
                        ₹{item.finalPrice?.toLocaleString()}
                      </p>
                      
                      {/* ✅ ADDED: Sold Item Details */}
                      {item.status === 'sold' && (
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              (!item.shippingStatus || item.shippingStatus === 'pending' || item.shippingStatus === 'ready') ? 'bg-yellow-500' :
                              item.shippingStatus === 'shipped' ? 'bg-blue-500' :
                              item.shippingStatus === 'delivered' ? 'bg-green-500' :
                              'bg-gray-500'
                            }`}></div>
                            <span className="text-xs font-medium">
                              {(!item.shippingStatus || item.shippingStatus === 'pending' || item.shippingStatus === 'ready') ? 'Ready for Shipment' :
                               item.shippingStatus === 'shipped' ? 'Shipped' :
                               item.shippingStatus === 'delivered' ? 'Delivered' :
                               'Processing'}
                            </span>
                          </div>
                          
                          {item.soldAt && (
                            <p className="text-xs text-gray-500">Sold on: {formatDate(item.soldAt)}</p>
                          )}
                          
                          {item.shippedAt && (
                            <p className="text-xs text-gray-500">Shipped on: {formatDate(item.shippedAt)}</p>
                          )}
                          
                          {item.deliveredAt && (
                            <p className="text-xs text-gray-500">Delivered on: {formatDate(item.deliveredAt)}</p>
                          )}
                        </div>
                      )}
                      
                      {/* ✅ ADDED: Action Buttons */}
                      <div className="flex space-x-2 mt-2">
                        {item.status === 'active' && (
                          <>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/edit-listing/${item._id}`);
                              }}
                              className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors font-medium"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteListing(item._id);
                              }}
                              className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors font-medium"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        
                        {item.status === 'sold' && (!item.shippingStatus || item.shippingStatus === 'pending' || item.shippingStatus === 'ready') && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsShipped(item._id);
                            }}
                            className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors font-medium"
                          >
                            Mark as Shipped
                          </button>
                        )}
                        
                        {item.status === 'sold' && item.shippingStatus === 'shipped' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsDelivered(item._id);
                            }}
                            className="flex-1 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors font-medium"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'orders':
        return (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-light text-gray-900">My Orders</h3>
              <p className="text-gray-600 mt-1 text-sm">
                {orders.length} ORDER{orders.length !== 1 ? 'S' : ''} • 
                Track your purchases and shipments
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="text-gray-300 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h4 className="text-xl font-light text-gray-900 mb-3">No orders yet</h4>
                <p className="text-gray-600 text-base mb-6">Your order history will appear here</p>
                <Link
                  href="/products"
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium tracking-wide text-base"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-lg border border-gray-200 p-6">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            Order #{order._id.toString().substring(0, 8).toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                            order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status?.toUpperCase() || 'PAID'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          📅 Placed on {formatDate(order.createdAt)}
                          {order.paidAt && ` • 💰 Paid on ${formatDate(order.paidAt)}`}
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
                      <h3 className="text-lg font-light text-gray-900 mb-3">🛍️ Order Items</h3>
                      {order.products && order.products.length > 0 ? (
                        order.products.map((product, index) => (
                          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              {product.images?.[0]?.url ? (
                                <img 
                                  src={product.images[0].url} 
                                  alt={product.productName}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              ) : (
                                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-lg mb-1">{product.productName}</h4>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                                <span>Brand: {product.brand || 'Unknown'}</span>
                                <span>•</span>
                                <span>Condition: {product.condition}</span>
                                <span>•</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  product.status === 'sold' ? 'bg-red-100 text-red-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {product.status === 'sold' ? 'SOLD' : 'PURCHASED'}
                                </span>
                              </div>
                              
                              {/* Seller Info */}
                              {product.sellerName && (
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-gray-500">Sold by:</span>
                                  <span className="font-medium text-gray-900">{product.sellerName}</span>
                                  {product.sellerUsername && (
                                    <span className="text-blue-600">({product.sellerUsername})</span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Price and Actions */}
                            <div className="flex flex-col items-end gap-2">
                              <p className="text-lg font-bold text-gray-900">
                                ₹{product.finalPrice?.toLocaleString()}
                              </p>
                              
                              {/* Tracking Status */}
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  order.status === 'shipped' ? 'bg-green-500' :
                                  order.status === 'delivered' ? 'bg-purple-500' :
                                  'bg-blue-500'
                                }`}></div>
                                <span className="text-sm font-medium">
                                  {order.status === 'paid' ? 'Processing' : 
                                   order.status === 'shipped' ? 'Shipped' :
                                   order.status === 'delivered' ? 'Delivered' : 
                                   'Processing'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No product details available</p>
                      )}
                    </div>
                    
                    {/* Order Summary */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Shipping Address */}
                        {order.shippingAddress && (
                          <div>
                            <h4 className="text-lg font-light text-gray-900 mb-3">🚚 Shipping Address</h4>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="font-medium text-gray-900">{order.shippingAddress.street}</p>
                              <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                              <p className="text-gray-600">Pincode: {order.shippingAddress.pincode}</p>
                              <p className="text-gray-600">📞 {order.shippingAddress.phone}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Order Summary */}
                        <div>
                          <h4 className="text-lg font-light text-gray-900 mb-3">📋 Order Summary</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Items Total</span>
                                <span className="text-gray-900">₹{(order.totalAmount - 299)?.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="text-gray-900">₹299</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Taxes & Fees</span>
                                <span className="text-gray-900">Included</span>
                              </div>
                              <div className="border-t border-gray-300 pt-2 mt-2">
                                <div className="flex justify-between font-medium">
                                  <span className="text-gray-900">Total Amount</span>
                                  <span className="text-gray-900">₹{order.totalAmount?.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-4">
                            <button className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors font-medium">
                              Track Order
                            </button>
                            <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors font-medium">
                              Download Invoice
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'wishlist':
        return (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-light text-gray-900">My Wishlist</h3>
              <p className="text-gray-600 mt-1 text-sm">Items you've saved for later purchase</p>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <div className="text-gray-300 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-light text-gray-900 mb-3">Your wishlist is empty</h4>
                <p className="text-gray-600 text-base mb-6">Start adding items you love to your wishlist!</p>
                <Link
                  href="/products"
                  className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium tracking-wide text-base"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {wishlist.map((item) => {
                  const product = item.product || item;
                  const productId = product._id || item._id;
                  const productName = product.productName || product.name;
                  const productPrice = product.finalPrice || product.price;
                  const productImage = product.images?.[0]?.url || product.image;
                  
                  return (
                    <div
                      key={productId}
                      onClick={() => handleProductClick(productId)}
                      className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="relative w-full aspect-square overflow-hidden mb-3 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                        <img
                          src={productImage || '/placeholder-image.jpg'}
                          alt={productName}
                          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWishlist(productId);
                          }}
                          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="text-left px-1">
                        <h3 className="text-gray-800 text-sm font-light tracking-widest uppercase mb-1 line-clamp-2">
                          {productName?.toUpperCase()}
                        </h3>
                        
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-gray-900 text-base font-light tracking-widest uppercase">
                            ₹{productPrice?.toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2 mt-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(productId);
                            }}
                            className="flex-1 px-2 py-1 bg-gray-900 text-white text-xs rounded hover:bg-gray-800 transition-colors font-medium"
                          >
                            Buy Now
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromWishlist(productId);
                            }}
                            className="px-2 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-light text-gray-900 mb-4">Select a section from the menu</h3>
            <p className="text-gray-600">Choose a section to view your dashboard content</p>
          </div>
        );
    }
  }

  // ✅ MAIN RETURN
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 pt-40 pb-16">
        {/* Seller Status Banner */}
        {renderSellerStatusBanner()}
        
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-light tracking-widest uppercase text-gray-900 mb-3">
                My Dashboard
              </h1>
              <p className="text-gray-600 text-lg font-light">
                Welcome back, {user?.name || user?.email}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 border-b border-gray-200 py-8">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-lg transition-all duration-300">
                <div className="text-xl font-light text-gray-900 mb-1">{stats.totalListings}</div>
                <div className="text-gray-600 uppercase tracking-wider text-xs font-medium">Total Listings</div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-lg transition-all duration-300">
                <div className="text-xl font-light text-green-600 mb-1">{stats.activeListings}</div>
                <div className="text-gray-600 uppercase tracking-wider text-xs font-medium">Active Listings</div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-lg transition-all duration-300">
                <div className="text-xl font-light text-red-600 mb-1">{stats.soldListings}</div>
                <div className="text-gray-600 uppercase tracking-wider text-xs font-medium">Sold Listings</div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-lg transition-all duration-300">
                <div className="text-xl font-light text-yellow-600 mb-1">{stats.readyForShipment}</div>
                <div className="text-gray-600 uppercase tracking-wider text-xs font-medium">Ready to Ship</div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-lg transition-all duration-300">
                <div className="text-xl font-light text-blue-600 mb-1">{stats.totalOrders}</div>
                <div className="text-gray-600 uppercase tracking-wider text-xs font-medium">Orders</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/4">
                <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-40">
                  <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-lg">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">{user?.name || 'User'}</h3>
                     
                      {user?.role === 'seller' && user?.username && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            {ensureJustbechoFormat(user.username)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user?.role === 'seller' 
                            ? 'bg-blue-100 text-blue-800'
                            : user?.role === 'influencer'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user?.role?.toUpperCase() || 'BUYER'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <nav className="space-y-2">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                          activeSection === item.id
                            ? 'bg-gray-900 text-white shadow-lg transform -translate-y-0.5'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md'
                        }`}
                      >
                        <span className={`${activeSection === item.id ? 'text-white' : 'text-gray-400'}`}>
                          {item.icon}
                        </span>
                        <span className="font-medium text-sm">{item.label}</span>
                      </button>
                    ))}
                  </nav>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wider">Quick Actions</h4>
                    <div className="space-y-2">
                      {user?.role === 'seller' && user?.sellerVerified ? (
                        <button 
                          onClick={() => router.push('/sell-now')}
                          className="block w-full px-3 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors font-medium text-xs"
                        >
                          + Sell New Item
                        </button>
                      ) : user?.role === 'seller' ? (
                        <button 
                          onClick={checkSellerStatus}
                          className="block w-full px-3 py-2 bg-yellow-600 text-white text-center rounded-lg hover:bg-yellow-700 transition-colors font-medium text-xs"
                        >
                          Check Approval Status
                        </button>
                      ) : (
                        <button 
                          onClick={handleBecomeSeller}
                          className="block w-full px-3 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors font-medium text-xs"
                        >
                          Become a Seller
                        </button>
                      )}
                      <Link href="/products" className="block w-full px-3 py-2 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 transition-colors font-medium text-xs">
                        Browse Products
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-3/4">
                <div className="bg-white rounded-xl border border-gray-200 min-h-[600px]">
                  <div className="p-6">
                    {renderActiveSection()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}