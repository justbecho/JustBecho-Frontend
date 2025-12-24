// pages/dashboard.js - COMPLETE 1600+ LINES WITH TRACKING FIXED
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  FiUser, 
  FiPackage, 
  FiShoppingBag, 
  FiHeart,
  FiHome,
  FiSettings,
  FiBell,
  FiTrendingUp,
  FiDollarSign,
  FiTruck,
  FiCheckCircle,
  FiAlertCircle,
  FiGrid,
  FiMenu,
  FiX,
  FiChevronRight,
  FiClock,
  FiStar,
  FiMessageSquare,
  FiHelpCircle,
  FiExternalLink,
  FiMapPin,
  FiCalendar,
  FiTag,
  FiEdit,
  FiTrash2,
  FiEye,
  FiShoppingCart,
  FiRefreshCw
} from 'react-icons/fi'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [activeSection, setActiveSection] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [redirectPath, setRedirectPath] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const router = useRouter()
  
  const [sellerStatus, setSellerStatus] = useState({
    verified: false,
    status: 'not_started',
    verificationId: null,
    username: null
  })

  const [listings, setListings] = useState([])
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])
  
  // ✅ ADDED: Shipping tracking state
  const [shippingTracking, setShippingTracking] = useState({})
  const [trackingLoading, setTrackingLoading] = useState({})

  // ✅ ADDED: Listing filter state
  const [listingFilter, setListingFilter] = useState('all')

  // ✅ Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  // ✅ NEW FUNCTION: Fetch Shipping Tracking
  const fetchShippingTracking = async (orderId, forceRefresh = false) => {
    try {
      const token = getLocalStorage('token');
      if (!token || !orderId) return null;
      
      // Check if we already have cached data
      if (!forceRefresh && shippingTracking[orderId]) {
        return shippingTracking[orderId];
      }
      
      setTrackingLoading(prev => ({ ...prev, [orderId]: true }));
      
      const response = await fetch(`https://just-becho-backend.vercel.app/api/orders/${orderId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('🚚 Order data received:', data);
        
        if (data.success) {
          // Update shipping tracking state
          setShippingTracking(prev => ({
            ...prev,
            [orderId]: data.order
          }));
          
          return data.order;
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching shipping tracking:', error);
      return null;
    } finally {
      setTrackingLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // ✅ NEW FUNCTION: Open Live Tracking Link
  const openLiveTracking = (awbNumber) => {
    if (awbNumber) {
      window.open(`https://track.nimbuspost.com/track/${awbNumber}`, '_blank');
    }
  };

  // ✅ NEW FUNCTION: Get Shipment Status Badge
  const getShipmentStatusBadge = (status) => {
    switch(status) {
      case 'booked':
        return { label: 'Booked', color: 'bg-blue-100 text-blue-800', text: 'Shipment created' };
      case 'pickup_scheduled':
      case 'pickup_generated':
        return { label: 'Pickup Scheduled', color: 'bg-yellow-100 text-yellow-800', text: 'Pickup scheduled' };
      case 'picked_up':
        return { label: 'Picked Up', color: 'bg-green-100 text-green-800', text: 'Picked up' };
      case 'in_transit':
        return { label: 'In Transit', color: 'bg-purple-100 text-purple-800', text: 'On the way' };
      case 'out_for_delivery':
        return { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-800', text: 'Will be delivered today' };
      case 'delivered':
        return { label: 'Delivered', color: 'bg-green-100 text-green-800', text: 'Successfully delivered' };
      case 'failed':
        return { label: 'Failed', color: 'bg-red-100 text-red-800', text: 'Delivery failed' };
      default:
        return { label: 'Processing', color: 'bg-gray-100 text-gray-800', text: 'Processing shipment' };
    }
  };

  // ✅ NEW FUNCTION: Get Shipping Leg Status
  const getShippingLegStatus = (legs) => {
    if (!legs || legs.length === 0) {
      return { current: 'pending', text: 'Awaiting shipment' };
    }
    
    const lastLeg = legs[legs.length - 1];
    return {
      current: lastLeg.status,
      text: `${lastLeg.leg.replace('_', ' ')} - ${lastLeg.status}`,
      startedAt: lastLeg.startedAt,
      completedAt: lastLeg.completedAt
    };
  };

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

  // ✅ FETCH ORDERS - UPDATED FOR TRACKING
  const fetchOrders = async () => {
    try {
      const token = getLocalStorage('token');
      if (!token) return;
      
      console.log('📦 Fetching orders...');
      
      const response = await fetch('https://just-becho-backend.vercel.app/api/orders/my-orders', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const ordersData = await response.json();
        console.log('✅ Orders API Response:', ordersData);
        
        if (ordersData.success) {
          const fetchedOrders = ordersData.orders || [];
          setOrders(fetchedOrders);
          
          // Fetch shipping tracking for each order with shipments
          fetchedOrders.forEach(order => {
            if (order.nimbuspostShipments && order.nimbuspostShipments.length > 0) {
              fetchShippingTracking(order._id);
            }
          });
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

  // ✅ MENU ITEMS FOR MOBILE
  const menuItems = [
    {
      id: 'profile',
      label: 'My Profile',
      icon: <FiUser className="w-5 h-5" />,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 'listings',
      label: 'My Listings', 
      icon: <FiPackage className="w-5 h-5" />,
      color: 'text-green-600 bg-green-50'
    },
    {
      id: 'orders',
      label: 'My Orders',
      icon: <FiShoppingBag className="w-5 h-5" />,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      id: 'wishlist',
      label: 'My Wishlist',
      icon: <FiHeart className="w-5 h-5" />,
      color: 'text-pink-600 bg-pink-50'
    }
  ]

  // ✅ MOBILE QUICK ACTIONS
  const quickActions = [
    {
      label: 'Home',
      icon: <FiHome className="w-4 h-4" />,
      onClick: () => router.push('/')
    },
    {
      label: 'Settings',
      icon: <FiSettings className="w-4 h-4" />,
      onClick: () => router.push('/profile')
    },
    {
      label: 'Notifications',
      icon: <FiBell className="w-4 h-4" />,
      onClick: () => {}
    },
    {
      label: 'Help',
      icon: <FiHelpCircle className="w-4 h-4" />,
      onClick: () => router.push('/contact-us')
    }
  ]

  // ✅ FORMAT DATE
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  // ✅ FORMAT TIME
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // ✅ RENDER SELLER STATUS BANNER - MOBILE OPTIMIZED
  const renderSellerStatusBanner = () => {
    if (user?.role !== 'seller') return null;
    
    const formattedUsername = sellerStatus.username 
      ? ensureJustbechoFormat(sellerStatus.username)
      : null;
    
    if (sellerStatus.status === 'pending') {
      return (
        <div className="bg-yellow-50 border-yellow-200 p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FiClock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-yellow-900">Seller Approval Pending</h4>
              <p className="text-yellow-700 text-sm mt-1">
                Your verification is under review. You'll be notified once approved.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    if (sellerStatus.status === 'approved') {
      return (
        <div className="bg-green-50 border-green-200 p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-900">Seller Approved! 🎉</h4>
              <p className="text-green-700 text-sm mt-1">
                Your seller account is now active.
                {formattedUsername && (
                  <span className="block font-medium mt-1">
                    Username: {formattedUsername}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    if (sellerStatus.status === 'rejected') {
      return (
        <div className="bg-red-50 border-red-200 p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FiAlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-red-900">Seller Verification Rejected</h4>
              <p className="text-red-700 text-sm mt-1">
                Your verification request was rejected. Please contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  }

  // ✅ FILTERED LISTINGS
  const filteredListings = listings.filter(item => {
    if (listingFilter === 'all') return true;
    if (listingFilter === 'active') return item.status === 'active';
    if (listingFilter === 'sold') return item.status === 'sold';
    if (listingFilter === 'shipped') return item.status === 'sold' && item.shippingStatus === 'shipped';
    if (listingFilter === 'delivered') return item.status === 'sold' && item.shippingStatus === 'delivered';
    return true;
  });

  // ✅ STATS
  const readyForShipmentCount = listings.filter(item => 
    item.status === 'sold' && (!item.shippingStatus || item.shippingStatus === 'pending')
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

  // ✅ LOADING STATE
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="animate-spin rounded-full h-full w-full border-4 border-gray-200 border-t-gray-900"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FiUser className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
            <p className="text-gray-600 text-sm">Please wait while we load your information</p>
            
            {/* Progress steps */}
            <div className="mt-6 space-y-2 max-w-xs mx-auto">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-700">User data</span>
                <FiCheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-700">Products</span>
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-gray-600"></div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-700">Orders</span>
                <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
              </div>
            </div>
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
        <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 flex items-center justify-center p-4">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-6">Please log in to access your dashboard</p>
            <Link 
              href="/login"
              className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium w-full"
            >
              Go to Login
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // ✅ RENDER MOBILE HEADER
  const renderMobileHeader = () => (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showMobileMenu ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Dashboard</p>
              <p className="text-xs text-gray-500">Hello, {user?.name?.split(' ')[0] || 'User'}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiBell className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiHome className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMobileMenu(false)}>
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl transform transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.name || 'User'}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left ${
                      activeSection === item.id
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={item.color.replace('text-', '').split(' ')[0] + ' p-2 rounded-lg'}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                ))}
              </nav>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-center transition-colors"
                    >
                      {action.icon}
                      <p className="text-xs font-medium mt-1">{action.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // ✅ RENDER MOBILE STATS
  const renderMobileStats = () => (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <div className="text-lg font-semibold text-gray-900 mb-1">{stats.totalListings}</div>
          <div className="text-xs text-gray-600 uppercase">Listings</div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <div className="text-lg font-semibold text-green-600 mb-1">{stats.activeListings}</div>
          <div className="text-xs text-gray-600 uppercase">Active</div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <div className="text-lg font-semibold text-purple-600 mb-1">{stats.totalOrders}</div>
          <div className="text-xs text-gray-600 uppercase">Orders</div>
        </div>
      </div>
    </div>
  )

  // ✅ RENDER MOBILE NAVIGATION TABS
  const renderMobileNavTabs = () => (
    <div className="sticky top-[64px] z-40 bg-white border-b border-gray-200">
      <div className="flex overflow-x-auto scrollbar-hide px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeSection === item.id
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )

  // ✅ RENDER ACTIVE SECTION
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
                <p className="text-gray-600 text-sm">Manage your personal information</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{user?.name || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Email</label>
                    <p className="text-gray-900 font-medium">{user?.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{user?.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Address</label>
                    {isEditing ? (
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                        placeholder="Enter your complete address"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">
                        {formatAddress(user?.address)}
                      </p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <button
                    onClick={handleSaveProfile}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all font-medium"
                  >
                    Save Changes
                  </button>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-medium text-gray-900 mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Role</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user?.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                      user?.role === 'influencer' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user?.role?.toUpperCase() || 'BUYER'}
                    </span>
                  </div>
                  
                  {user?.role === 'seller' && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Verification</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        sellerStatus.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sellerStatus.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Member Since</span>
                    <span className="text-gray-900 font-medium">
                      {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'listings':
        return (
          <div className="px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">My Listings</h2>
                <p className="text-gray-600 text-sm">
                  {listings.length} item{listings.length !== 1 ? 's' : ''}
                </p>
              </div>
              {user?.sellerVerified && (
                <button
                  onClick={() => router.push('/sell-now')}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm rounded-lg hover:from-green-700 hover:to-green-800 transition-colors font-medium"
                >
                  + Add Item
                </button>
              )}
            </div>

            {/* Mobile Filter Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-6">
              {['all', 'active', 'sold', 'shipped', 'delivered'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setListingFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    listingFilter === filter
                      ? filter === 'all' ? 'bg-gray-900 text-white' :
                        filter === 'active' ? 'bg-green-600 text-white' :
                        filter === 'sold' ? 'bg-red-600 text-white' :
                        filter === 'shipped' ? 'bg-blue-600 text-white' :
                        'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter === 'all' ? 'All' :
                   filter === 'active' ? 'Active' :
                   filter === 'sold' ? 'Sold' :
                   filter === 'shipped' ? 'Shipped' : 'Delivered'}
                </button>
              ))}
            </div>

            {filteredListings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPackage className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings found</h3>
                <p className="text-gray-600 text-sm mb-6">
                  {listingFilter === 'all' ? 'Start selling your items!' :
                   listingFilter === 'active' ? 'No active listings' :
                   listingFilter === 'sold' ? 'No sold items' :
                   'No items in this category'}
                </p>
                {user?.sellerVerified ? (
                  <button
                    onClick={() => router.push('/sell-now')}
                    className="w-full py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all font-medium"
                  >
                    Create Your First Listing
                  </button>
                ) : (
                  <button 
                    onClick={handleBecomeSeller}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium"
                  >
                    Become a Seller
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {filteredListings.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleProductClick(item._id)}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={item.images?.[0]?.url || '/placeholder-image.jpg'}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'active' 
                            ? 'bg-green-100 text-green-800' :
                          item.status === 'sold' && item.shippingStatus === 'shipped'
                            ? 'bg-blue-100 text-blue-800' :
                          item.status === 'sold' && item.shippingStatus === 'delivered'
                            ? 'bg-purple-100 text-purple-800' :
                          item.status === 'sold'
                            ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status === 'sold' && item.shippingStatus === 'shipped'
                            ? 'Shipped' :
                           item.status === 'sold' && item.shippingStatus === 'delivered'
                            ? 'Delivered' :
                           item.status?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {item.productName}
                      </h3>
                      <p className="text-gray-900 font-semibold mb-2">
                        ₹{item.finalPrice?.toLocaleString()}
                      </p>
                      
                      <div className="flex gap-2">
                        {item.status === 'active' && (
                          <>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/edit-listing/${item._id}`);
                              }}
                              className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteListing(item._id);
                              }}
                              className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        
                        {/* ✅ REMOVED: Ship/Deliver buttons - Now automation handles it */}
                        
                        {/* ✅ ADDED: Tracking button for shipped items */}
                        {item.status === 'sold' && item.shippingStatus === 'shipped' && item.shippingDetails?.awbNumber && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              openLiveTracking(item.shippingDetails.awbNumber);
                            }}
                            className="flex-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <FiTruck className="w-3 h-3" />
                            Track
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
          <div className="px-4 py-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Orders</h2>
              <p className="text-gray-600 text-sm">
                {orders.length} order{orders.length !== 1 ? 's' : ''} • Track your purchases
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 text-sm mb-6">Your order history will appear here</p>
                <Link
                  href="/products"
                  className="w-full py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all font-medium block text-center"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const orderTracking = shippingTracking[order._id];
                  const shipments = orderTracking?.nimbuspostShipments || order.nimbuspostShipments || [];
                  
                  return (
                    <div key={order._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Order #{order._id.toString().substring(0, 8).toUpperCase()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(order.createdAt)} • {formatTime(order.createdAt)}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                            order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status?.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{order.totalAmount?.toLocaleString()}
                        </p>
                      </div>
                      
                      {/* ✅ ADDED: Tracking Section */}
                      {shipments.length > 0 && (
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              <FiTruck className="w-4 h-4" /> Shipment Tracking
                            </h4>
                            <button 
                              onClick={() => fetchShippingTracking(order._id, true)}
                              className="p-1 hover:bg-gray-100 rounded"
                              disabled={trackingLoading[order._id]}
                            >
                              <FiRefreshCw className={`w-4 h-4 ${trackingLoading[order._id] ? 'animate-spin' : ''}`} />
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            {shipments.map((shipment, idx) => {
                              const status = getShipmentStatusBadge(shipment.status);
                              return (
                                <div key={idx} className="border border-gray-200 rounded-lg p-3">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-1 rounded text-xs ${status.color}`}>
                                          {status.label}
                                        </span>
                                        {shipment.courierName && (
                                          <span className="text-xs text-gray-600">
                                            • {shipment.courierName}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm font-medium text-gray-900">
                                        AWB: {shipment.awbNumber}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        {shipment.shipmentType === 'seller_to_warehouse' ? 'Seller → Warehouse' :
                                         shipment.shipmentType === 'warehouse_to_buyer' ? 'Warehouse → You' :
                                         shipment.shipmentType || 'Direct Delivery'}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => openLiveTracking(shipment.awbNumber)}
                                      className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1"
                                      disabled={trackingLoading[order._id]}
                                    >
                                      <FiExternalLink className="w-3 h-3" /> Track
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      <div className="p-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => router.push(`/orders/${order._id}`)}
                            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                          >
                            View Details
                          </button>
                          {shipments.length > 0 && (
                            <button 
                              onClick={() => {
                                shipments.forEach(shipment => {
                                  if (shipment.awbNumber) {
                                    openLiveTracking(shipment.awbNumber);
                                  }
                                });
                              }}
                              className="flex-1 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                            >
                              <FiTruck className="w-4 h-4" /> Track All
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'wishlist':
        return (
          <div className="px-4 py-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Wishlist</h2>
              <p className="text-gray-600 text-sm">
                {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
              </p>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiHeart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 text-sm mb-6">Start adding items you love to your wishlist!</p>
                <Link
                  href="/products"
                  className="w-full py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all font-medium block text-center"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {wishlist.map((item) => {
                  const product = item.product || item;
                  const productId = product._id || item._id;
                  const productName = product.productName || product.name;
                  const productPrice = product.finalPrice || product.price;
                  const productImage = product.images?.[0]?.url || product.image;
                  
                  return (
                    <div
                      key={productId}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    >
                      <div 
                        onClick={() => handleProductClick(productId)}
                        className="relative aspect-square cursor-pointer"
                      >
                        <img
                          src={productImage || '/placeholder-image.jpg'}
                          alt={productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWishlist(productId);
                          }}
                          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 shadow-lg"
                        >
                          <FiHeart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                      
                      <div className="p-3">
                        <h3 
                          onClick={() => handleProductClick(productId)}
                          className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 cursor-pointer"
                        >
                          {productName}
                        </h3>
                        <p className="text-gray-900 font-semibold mb-3">
                          ₹{productPrice?.toLocaleString()}
                        </p>
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleProductClick(productId)}
                            className="flex-1 px-2 py-1 bg-gray-900 text-white text-xs rounded hover:bg-gray-800 transition-colors"
                          >
                            Buy Now
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
          <div className="px-4 py-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a section</h3>
              <p className="text-gray-600 text-sm">Choose a section to view your dashboard content</p>
            </div>
          </div>
        );
    }
  }

  // ✅ MAIN RETURN - MOBILE VERSION
  if (isMobile) {
    return (
      <>
        <Header />
        {renderMobileHeader()}
        {renderSellerStatusBanner()}
        {renderMobileStats()}
        {renderMobileNavTabs()}
        {renderActiveSection()}
        <Footer />
      </>
    )
  }

  // ✅ DESKTOP VERSION
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 pt-32 pb-16">
        {/* Seller Status Banner */}
        {renderSellerStatusBanner()}
        
        {/* Desktop Header */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
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

        {/* Desktop Stats */}
        <section className="bg-gray-50 border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
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

        {/* Desktop Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
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

              {/* Main Content */}
              <div className="lg:w-3/4">
                <div className="bg-white rounded-xl border border-gray-200 min-h-[600px]">
                  <div className="p-6">
                    {/* Desktop render active section */}
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