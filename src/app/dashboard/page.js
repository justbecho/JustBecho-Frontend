// pages/dashboard.js - PERFECTLY ALIGNED VERSION
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
  FiRefreshCw,
  FiSave,
  FiBox,
  FiCreditCard,
  FiPackage as FiPackageIcon,
  FiTruck as FiTruckIcon,
  FiCheckSquare,
  FiArrowRight,
  FiPercent,
  FiDollarSign as FiDollarSignIcon,
  FiShoppingCart as FiShoppingCartIcon
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
  
  const [shippingTracking, setShippingTracking] = useState({})
  const [trackingLoading, setTrackingLoading] = useState({})

  const [listingFilter, setListingFilter] = useState('all')

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState('')

  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  })

  const [cartCount, setCartCount] = useState(0)

  // ✅ Calculate isMobile based on window width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const getLocalStorage = useCallback((key) => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Error accessing localStorage:', error)
      return null
    }
  }, [])

  const parseUserData = useCallback((data) => {
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }, [])

  const ensureJustbechoFormat = useCallback((username) => {
    if (!username) return null;
    
    let clean = username.replace(/^@+/, '');
    
    if (clean.endsWith('@justbecho')) {
      return clean;
    }
    
    if (clean.includes('@justbecho')) {
      const namePart = clean.replace('@justbecho', '');
      return `${namePart}@justbecho`;
    }
    
    return `${clean}@justbecho`;
  }, [])

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

  const parseAddressForEdit = (address) => {
    if (!address) {
      return {
        street: '',
        city: '',
        state: '',
        pincode: ''
      };
    }
    
    if (typeof address === 'string') {
      const parts = address.split(',');
      return {
        street: parts[0]?.trim() || '',
        city: parts[1]?.trim() || '',
        state: parts[2]?.trim() || '',
        pincode: parts[3]?.trim() || ''
      };
    }
    
    if (typeof address === 'object') {
      return {
        street: address.street || '',
        city: address.city || '',
        state: address.state || '',
        pincode: address.pincode || ''
      };
    }
    
    return {
      street: '',
      city: '',
      state: '',
      pincode: ''
    };
  };

  const fetchCartCount = useCallback(async () => {
    try {
      const token = getLocalStorage('token');
      if (!token) {
        setCartCount(0);
        return;
      }

      const response = await fetch('https://just-becho-backend.vercel.app/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        setCartCount(0);
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        setCartCount(data.cart.totalItems || 0);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      setCartCount(0);
    }
  }, [getLocalStorage]);

  const fetchShippingTracking = async (orderId, forceRefresh = false) => {
    try {
      const token = getLocalStorage('token');
      if (!token || !orderId) return null;
      
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
        
        if (data.success) {
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

  const openLiveTracking = (awbNumber) => {
    if (awbNumber) {
      window.open(`https://track.nimbuspost.com/track/${awbNumber}`, '_blank');
    }
  };

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

  const getOrderStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
      case 'processing':
        return { label: 'Processing', color: 'bg-yellow-100 text-yellow-800', icon: <FiClock className="w-4 h-4" /> };
      case 'confirmed':
      case 'paid':
        return { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: <FiCheckCircle className="w-4 h-4" /> };
      case 'shipped':
        return { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: <FiTruck className="w-4 h-4" /> };
      case 'delivered':
        return { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: <FiCheckSquare className="w-4 h-4" /> };
      case 'cancelled':
        return { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: <FiX className="w-4 h-4" /> };
      default:
        return { label: 'Pending', color: 'bg-gray-100 text-gray-800', icon: <FiClock className="w-4 h-4" /> };
    }
  };

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
          const formattedUsername = ensureJustbechoFormat(data.username);
          
          setSellerStatus({
            verified: data.sellerVerified,
            status: data.sellerVerificationStatus,
            verificationId: data.verificationId,
            username: formattedUsername
          });
          
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

  const fetchMyProducts = async () => {
    try {
      const token = getLocalStorage('token');
      if (!token) {
        console.log('❌ No token found for fetching products');
        return;
      }
      
      const response = await fetch('https://just-becho-backend.vercel.app/api/products/my-products', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.products) {
          setListings(data.products);
        } else if (data.success && Array.isArray(data.products)) {
          setListings(data.products);
        } else if (Array.isArray(data)) {
          setListings(data);
        } else if (data && data.length !== undefined) {
          setListings(data);
        } else {
          setListings([]);
        }
      } else {
        if (user?.role === 'seller') {
          setListings([]);
        } else {
          setListings([]);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching my products:', error);
      setListings([]);
    }
  }

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
        
        if (ordersData.success) {
          const fetchedOrders = ordersData.orders || [];
          setOrders(fetchedOrders);
          
          const stats = {
            total: fetchedOrders.length,
            pending: fetchedOrders.filter(o => 
              ['pending', 'processing', 'confirmed', 'paid'].includes(o.status?.toLowerCase())
            ).length,
            shipped: fetchedOrders.filter(o => 
              o.status?.toLowerCase() === 'shipped'
            ).length,
            delivered: fetchedOrders.filter(o => 
              o.status?.toLowerCase() === 'delivered'
            ).length,
            cancelled: fetchedOrders.filter(o => 
              o.status?.toLowerCase() === 'cancelled'
            ).length
          };
          setOrderStats(stats);
          
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

  useEffect(() => {
    if (shouldRedirect && redirectPath) {
      router.push(redirectPath);
      setShouldRedirect(false);
    }
  }, [shouldRedirect, redirectPath, router])

  useEffect(() => {
    const checkAuth = async () => {
      
      try {
        const token = getLocalStorage('token');
        const storedUserData = getLocalStorage('user');
        
        if (!token || !storedUserData) {
          setRedirectPath('/login');
          setShouldRedirect(true);
          return;
        }
        
        const userObj = parseUserData(storedUserData);
        
        if (!userObj) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setRedirectPath('/login');
          setShouldRedirect(true);
          return;
        }
        
        if (userObj.username) {
          userObj.username = ensureJustbechoFormat(userObj.username);
        }
        
        setUser(userObj);
        
        if (!userObj.profileCompleted) {
          setRedirectPath('/complete-profile');
          setShouldRedirect(true);
          return;
        }
        
        if (userObj.role === 'seller') {
          await checkSellerStatus();
        }
        
        await Promise.allSettled([
          fetchMyProducts(),
          fetchWishlist(),
          fetchOrders(),
          fetchCartCount()
        ]);
        
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

  useEffect(() => {
    if (user && authChecked && activeSection === 'listings') {
      fetchMyProducts();
    }
    
    if (user && authChecked && activeSection === 'wishlist') {
      fetchWishlist();
    }
    
    if (user && authChecked && activeSection === 'orders') {
      fetchOrders();
    }
  }, [user, authChecked, activeSection])

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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return `${formatDate(dateString)} at ${formatTime(dateString)}`;
  }

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

  const handleProductClick = (productId) => {
    if (productId) {
      router.push(`/products/${productId}`);
    }
  }

  const deleteListing = async (productId) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    try {
      const token = getLocalStorage('token')
      if (!token) {
        alert('Please login first');
        return;
      }
      
      const response = await fetch(`https://just-becho-backend.vercel.app/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json();
        
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

  const renderSellerStatusBanner = () => {
    if (user?.role !== 'seller') return null;
    
    const formattedUsername = sellerStatus.username 
      ? ensureJustbechoFormat(sellerStatus.username)
      : null;
    
    if (sellerStatus.status === 'pending') {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 mx-4 md:mx-8">
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
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 mx-4 md:mx-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-900">Seller Approved! 🎉</h4>
              <p className="text-green-700 text-sm mt-1">
                Your seller account is now active.
                {formattedUsername && (
                  <span className="block font-medium mt-2">
                    Your @justbecho username: <span className="text-green-900">{formattedUsername}</span>
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 mx-4 md:mx-8">
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

  const filteredListings = listings.filter(item => {
    if (listingFilter === 'all') return true;
    if (listingFilter === 'active') return item.status === 'active';
    if (listingFilter === 'sold') return item.status === 'sold';
    if (listingFilter === 'shipped') return item.status === 'sold' && item.shippingStatus === 'shipped';
    if (listingFilter === 'delivered') return item.status === 'sold' && item.shippingStatus === 'delivered';
    return true;
  });

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

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  })

  useEffect(() => {
    if (user) {
      const addressData = parseAddressForEdit(user.address);
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: addressData
      })
    }
  }, [user])

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = getLocalStorage('token')
      if (!token) {
        alert('Please login first');
        return;
      }
      
      setUpdateError('');
      setUpdateSuccess(false);
      setIsUpdatingProfile(true);
      
      const updateData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: {
          street: formData.address.street.trim(),
          city: formData.address.city.trim(),
          state: formData.address.state.trim(),
          pincode: formData.address.pincode.trim()
        }
      };
      
      const endpoints = [
        'https://just-becho-backend.vercel.app/api/users/profile',
        'https://just-becho-backend.vercel.app/api/auth/profile',
        'https://just-becho-backend.vercel.app/api/users/update-profile'
      ];
      
      let response = null;
      let success = false;
      
      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
          });
          
          if (response.ok) {
            success = true;
            break;
          }
        } catch (endpointError) {
          continue;
        }
      }
      
      if (!success || !response) {
        throw new Error('All update endpoints failed');
      }
      
      const result = await response.json();
      
      if (result.success) {
        const updatedUser = {
          ...user,
          name: updateData.name,
          phone: updateData.phone,
          address: updateData.address
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        setIsEditing(false);
        setUpdateSuccess(true);
        
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      } else {
        throw new Error(result.message || 'Update failed');
      }
      
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setUpdateError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  // ✅ LOADING STATE - Fixed with exact header alignment
  if (loading) {
    return (
      <>
        <Header />
        {/* ✅ EXACT SPACING: Mobile pt-[80px], Desktop pt-[120px] */}
        <div className="min-h-screen bg-gray-50 pt-[80px] md:pt-[120px] pb-16 flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="animate-spin rounded-full h-full w-full border-4 border-gray-200 border-t-gray-900"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FiUser className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
            <p className="text-gray-600 text-sm">Please wait while we load your information</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (shouldRedirect || !authChecked) {
    return null;
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-[80px] md:pt-[120px] pb-16 flex items-center justify-center p-4">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
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

  // ✅ RENDER MOBILE ACTIVE SECTION FUNCTION
  const renderMobileActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
                <p className="text-gray-600 text-xs">Manage your personal information</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1"
              >
                {isEditing ? <FiX className="w-3 h-3" /> : <FiEdit className="w-3 h-3" />}
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {updateSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-green-800 text-sm font-medium">Profile updated successfully!</p>
                  </div>
                </div>
              </div>
            )}

            {updateError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="text-red-800 text-sm font-medium">Update failed</p>
                    <p className="text-red-700 text-xs">{updateError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-transparent text-sm"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-sm">{user?.name || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Email</label>
                  <p className="text-gray-900 font-medium text-sm">{user?.email}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-transparent text-sm"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium text-sm">{user?.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Address</label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={formData.address.street}
                        onChange={(e) => handleAddressChange('street', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-transparent text-sm"
                        placeholder="Street address"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={formData.address.city}
                          onChange={(e) => handleAddressChange('city', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-transparent text-sm"
                          placeholder="City"
                        />
                        <input
                          type="text"
                          value={formData.address.state}
                          onChange={(e) => handleAddressChange('state', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-transparent text-sm"
                          placeholder="State"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.address.pincode}
                        onChange={(e) => handleAddressChange('pincode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-transparent text-sm"
                        placeholder="Pincode"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900 font-medium text-sm">
                      {formatAddress(user?.address) || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isUpdatingProfile}
                    className="w-full py-2.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-3 h-3" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Account Info */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Account Info</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Role</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user?.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                      user?.role === 'influencer' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user?.role?.toUpperCase() || 'BUYER'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Member Since</span>
                    <span className="text-gray-900 text-xs font-medium">
                      {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </span>
                  </div>
                  
                  {user?.role === 'seller' && user?.username && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Username</span>
                      <span className="text-gray-900 text-xs font-medium">
                        {ensureJustbechoFormat(user.username)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'listings':
        return (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">My Listings</h2>
                <p className="text-gray-600 text-xs">
                  {listings.length} item{listings.length !== 1 ? 's' : ''}
                </p>
              </div>
              {user?.sellerVerified && (
                <button
                  onClick={() => router.push('/sell-now')}
                  className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs rounded-lg hover:from-green-700 hover:to-green-800 transition-colors font-medium flex items-center gap-1"
                >
                  <FiPackage className="w-3 h-3" />
                  + Add Item
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide gap-2 mb-4 pb-1">
              {['all', 'active', 'sold', 'shipped', 'delivered'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setListingFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
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
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiPackage className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">No listings found</h3>
                <p className="text-gray-600 text-xs mb-4">
                  {listingFilter === 'all' ? 'Start selling your items!' :
                   listingFilter === 'active' ? 'No active listings' :
                   listingFilter === 'sold' ? 'No sold items' :
                   'No items in this category'}
                </p>
                {user?.sellerVerified ? (
                  <button
                    onClick={() => router.push('/sell-now')}
                    className="w-full py-2.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all font-medium text-sm"
                  >
                    Create Your First Listing
                  </button>
                ) : (
                  <button 
                    onClick={() => router.push('/complete-profile?section=seller')}
                    className="w-full py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium text-sm"
                  >
                    Become a Seller
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredListings.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleProductClick(item._id)}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow cursor-pointer"
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
                      <div className="absolute top-1 right-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
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
                           item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <h3 className="text-xs font-medium text-gray-900 mb-1 line-clamp-2 h-6">
                        {item.productName}
                      </h3>
                      <p className="text-gray-900 font-semibold text-sm mb-2">
                        ₹{item.finalPrice?.toLocaleString()}
                      </p>
                      
                      <div className="flex gap-1">
                        {item.status === 'active' && (
                          <>
                           
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteListing(item._id);
                              }}
                              className="flex-1 px-1.5 py-1 bg-red-600 text-white text-[10px] rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-0.5"
                            >
                              <FiTrash2 className="w-2.5 h-2.5" />
                              Delete
                            </button>
                          </>
                        )}
                        
                        {item.status === 'sold' && item.shippingStatus === 'shipped' && item.shippingDetails?.awbNumber && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              openLiveTracking(item.shippingDetails.awbNumber);
                            }}
                            className="flex-1 px-1.5 py-1 bg-blue-600 text-white text-[10px] rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-0.5"
                            >
                            <FiTruck className="w-2.5 h-2.5" />
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
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">My Orders</h2>
              <p className="text-gray-600 text-xs">
                {orders.length} order{orders.length !== 1 ? 's' : ''} • Track your purchases
              </p>
            </div>

            {/* Order Stats */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-sm font-semibold text-blue-600 mb-0.5">{orderStats.total}</div>
                <div className="text-[10px] text-gray-600 uppercase">Total</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-sm font-semibold text-yellow-600 mb-0.5">{orderStats.pending}</div>
                <div className="text-[10px] text-gray-600 uppercase">Processing</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-sm font-semibold text-purple-600 mb-0.5">{orderStats.shipped}</div>
                <div className="text-[10px] text-gray-600 uppercase">Shipped</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-sm font-semibold text-green-600 mb-0.5">{orderStats.delivered}</div>
                <div className="text-[10px] text-gray-600 uppercase">Delivered</div>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiShoppingBag className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">No orders yet</h3>
                <p className="text-gray-600 text-xs mb-4">Your order history will appear here</p>
                <Link
                  href="/products"
                  className="w-full py-2.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all font-medium text-sm block text-center"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const orderTracking = shippingTracking[order._id];
                  const shipments = orderTracking?.nimbuspostShipments || order.nimbuspostShipments || [];
                  const statusBadge = getOrderStatusBadge(order.status);
                  
                  return (
                    <div key={order._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      {/* Order Header */}
                      <div className="p-3 border-b border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <FiShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                              <p className="text-xs font-medium text-gray-900">
                                Order #{order._id?.toString().substring(0, 6).toUpperCase() || 'N/A'}
                              </p>
                            </div>
                            <p className="text-[10px] text-gray-500">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {statusBadge.icon}
                            <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${statusBadge.color}`}>
                              {statusBadge.label}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              ₹{order.totalAmount?.toLocaleString() || '0'}
                            </p>
                            <p className="text-[10px] text-gray-600">
                              {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tracking Section */}
                      {shipments.length > 0 && (
                        <div className="p-3 border-b border-gray-100 bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-xs flex items-center gap-1.5">
                              <FiTruck className="w-3.5 h-3.5 text-blue-600" /> 
                              <span>Shipment Tracking</span>
                            </h4>
                            <button 
                              onClick={() => fetchShippingTracking(order._id, true)}
                              className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                              disabled={trackingLoading[order._id]}
                            >
                              <FiRefreshCw className={`w-3 h-3 ${trackingLoading[order._id] ? 'animate-spin' : ''}`} />
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            {shipments.map((shipment, idx) => {
                              const status = getShipmentStatusBadge(shipment.status);
                              return (
                                <div key={idx} className="bg-white border border-gray-200 rounded p-2">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-1.5 mb-1.5">
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${status.color}`}>
                                          {status.label}
                                        </span>
                                        {shipment.courierName && (
                                          <span className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                                            {shipment.courierName}
                                          </span>
                                        )}
                                      </div>
                                      
                                      <div className="space-y-0.5">
                                        <p className="text-xs font-medium text-gray-900 flex items-center gap-1.5">
                                          <span className="text-gray-600 text-[10px]">AWB:</span>
                                          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                                            {shipment.awbNumber?.substring(0, 12)}...
                                          </code>
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <button
                                      onClick={() => openLiveTracking(shipment.awbNumber)}
                                      className="ml-2 px-2 py-1 bg-blue-600 text-white text-[10px] rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                                      disabled={trackingLoading[order._id]}
                                    >
                                      <FiExternalLink className="w-2.5 h-2.5" /> Track
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* Order Actions */}
                      <div className="p-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => router.push(`/orders/${order._id}`)}
                            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-medium text-xs flex items-center justify-center gap-1.5"
                          >
                            <FiEye className="w-3 h-3" />
                            Details
                          </button>
                          
                          {shipments.length > 0 && (
                            <button 
                              onClick={() => {
                                const awbNumber = shipments[0]?.awbNumber;
                                if (awbNumber) {
                                  openLiveTracking(awbNumber);
                                }
                              }}
                              className="flex-1 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-medium text-xs flex items-center justify-center gap-1.5"
                            >
                              <FiTruck className="w-3 h-3" />
                              Track
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
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">My Wishlist</h2>
              <p className="text-gray-600 text-xs">
                {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
              </p>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiHeart className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Your wishlist is empty</h3>
                <p className="text-gray-600 text-xs mb-4">Start adding items you love to your wishlist!</p>
                <Link
                  href="/products"
                  className="w-full py-2.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all font-medium text-sm block text-center"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {wishlist.map((item) => {
                  const product = item.product || item;
                  const productId = product._id || item._id;
                  const productName = product.productName || product.name;
                  const productPrice = product.finalPrice || product.price;
                  const productImage = product.images?.[0]?.url || product.image;
                  
                  return (
                    <div
                      key={productId}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
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
                          className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-red-500 shadow hover:bg-red-50 transition-colors"
                          title="Remove from wishlist"
                        >
                          <FiHeart className="w-3 h-3 fill-current" />
                        </button>
                      </div>
                      
                      <div className="p-2">
                        <h3 
                          onClick={() => handleProductClick(productId)}
                          className="text-xs font-medium text-gray-900 mb-1 line-clamp-2 h-6 cursor-pointer hover:text-gray-700"
                        >
                          {productName}
                        </h3>
                        <p className="text-gray-900 font-semibold text-sm mb-2">
                          ₹{productPrice?.toLocaleString()}
                        </p>
                        
                        <button 
                          onClick={() => handleProductClick(productId)}
                          className="w-full py-1.5 bg-gray-900 text-white text-xs rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-1"
                        >
                          <FiShoppingBag className="w-2.5 h-2.5" />
                          Buy Now
                        </button>
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
          <div className="p-4">
            <div className="text-center py-8">
              <h3 className="text-base font-semibold text-gray-900 mb-1">Select a section</h3>
              <p className="text-gray-600 text-xs">Choose a section to view your dashboard content</p>
            </div>
          </div>
        );
    }
  }

  // ✅ RENDER DESKTOP ACTIVE SECTION FUNCTION
  const renderDesktopActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Profile</h2>
                <p className="text-gray-600">Manage your personal information</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <FiX className="w-4 h-4" /> Cancel
                  </>
                ) : (
                  <>
                    <FiEdit className="w-4 h-4" /> Edit
                  </>
                )}
              </button>
            </div>

            {updateSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium">Profile updated successfully!</p>
                    <p className="text-green-700 text-sm">Your changes have been saved.</p>
                  </div>
                </div>
              </div>
            )}

            {updateError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiAlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-red-800 font-medium">Update failed</p>
                    <p className="text-red-700 text-sm">{updateError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
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
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium text-lg">{user?.name || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Email</label>
                    <p className="text-gray-900 font-medium text-lg">{user?.email}</p>
                    <p className="text-gray-500 text-sm mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium text-lg">{user?.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-900 mb-4">Address</h3>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Full Address</label>
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.address.street}
                        onChange={(e) => handleAddressChange('street', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="Street address"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={formData.address.city}
                          onChange={(e) => handleAddressChange('city', e.target.value)}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          placeholder="City"
                        />
                        <input
                          type="text"
                          value={formData.address.state}
                          onChange={(e) => handleAddressChange('state', e.target.value)}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          placeholder="State"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.address.pincode}
                        onChange={(e) => handleAddressChange('pincode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        placeholder="Pincode"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900 font-medium text-lg">
                      {formatAddress(user?.address) || 'Not provided'}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUpdatingProfile}
                      className="w-full py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdatingProfile ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 col-span-2">
                <h3 className="font-medium text-gray-900 mb-4">Account Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Role</div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                      user?.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                      user?.role === 'influencer' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user?.role?.toUpperCase() || 'BUYER'}
                    </div>
                  </div>
                  
                  {user?.role === 'seller' && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">Verification</div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                        sellerStatus.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sellerStatus.verified ? 'Verified' : 'Pending'}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Member Since</div>
                    <div className="text-gray-900 font-medium">
                      {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'listings':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">My Listings</h2>
                <p className="text-gray-600">
                  {listings.length} item{listings.length !== 1 ? 's' : ''}
                </p>
              </div>
              {user?.sellerVerified && (
                <button
                  onClick={() => router.push('/sell-now')}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors font-medium flex items-center gap-2"
                >
                  <FiPackage className="w-4 h-4" />
                  + Add Item
                </button>
              )}
            </div>

            {/* Desktop Filter Tabs */}
            <div className="flex gap-2 mb-6">
              {['all', 'active', 'sold', 'shipped', 'delivered'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setListingFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
                <p className="text-gray-600 mb-6">
                  {listingFilter === 'all' ? 'Start selling your items!' :
                   listingFilter === 'active' ? 'No active listings' :
                   listingFilter === 'sold' ? 'No sold items' :
                   'No items in this category'}
                </p>
                {user?.sellerVerified ? (
                  <button
                    onClick={() => router.push('/sell-now')}
                    className="px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all font-medium"
                  >
                    Create Your First Listing
                  </button>
                ) : (
                  <button 
                    onClick={() => router.push('/complete-profile?section=seller')}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium"
                  >
                    Become a Seller
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {filteredListings.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleProductClick(item._id)}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
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
                    
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                        {item.productName}
                      </h3>
                      <p className="text-gray-900 font-semibold text-lg mb-3">
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
                              className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                            >
                              <FiEdit className="w-3 h-3" />
                              Edit
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteListing(item._id);
                              }}
                              className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                            >
                              <FiTrash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </>
                        )}
                        
                        {item.status === 'sold' && item.shippingStatus === 'shipped' && item.shippingDetails?.awbNumber && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              openLiveTracking(item.shippingDetails.awbNumber);
                            }}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
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
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">My Orders</h2>
              <p className="text-gray-600">
                {orders.length} order{orders.length !== 1 ? 's' : ''} • Track your purchases
              </p>
            </div>

            {/* Order Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-2xl font-semibold text-blue-600 mb-1">{orderStats.total}</div>
                <div className="text-gray-600 uppercase tracking-wider text-xs font-medium">Total</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-2xl font-semibold text-yellow-600 mb-1">{orderStats.pending}</div>
                <div className="text-gray-600 uppercase tracking-wider text-xs font-medium">Processing</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-2xl font-semibold text-purple-600 mb-1">{orderStats.shipped}</div>
                <div className="text-gray-600 uppercase tracking-wider text-xs font-medium">Shipped</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-2xl font-semibold text-green-600 mb-1">{orderStats.delivered}</div>
                <div className="text-gray-600 uppercase tracking-wider text-xs font-medium">Delivered</div>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-6">Your order history will appear here</p>
                <Link
                  href="/products"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all font-medium"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const orderTracking = shippingTracking[order._id];
                  const shipments = orderTracking?.nimbuspostShipments || order.nimbuspostShipments || [];
                  const statusBadge = getOrderStatusBadge(order.status);
                  
                  return (
                    <div key={order._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <FiShoppingBag className="w-5 h-5 text-gray-400" />
                              <p className="text-lg font-medium text-gray-900">
                                Order #{order._id?.toString().substring(0, 8).toUpperCase() || 'N/A'}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">
                              {formatDateTime(order.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {statusBadge.icon}
                            <span className={`px-3 py-1 rounded-full text-sm ${statusBadge.color}`}>
                              {statusBadge.label}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div>
                            <p className="text-2xl font-semibold text-gray-900">
                              ₹{order.totalAmount?.toLocaleString() || '0'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {shipments.length > 0 && (
                        <div className="p-6 border-b border-gray-200 bg-gray-50">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                              <FiTruck className="w-5 h-5 text-blue-600" /> 
                              <span>Shipment Tracking</span>
                            </h4>
                            <button 
                              onClick={() => fetchShippingTracking(order._id, true)}
                              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              disabled={trackingLoading[order._id]}
                              title="Refresh tracking"
                            >
                              <FiRefreshCw className={`w-4 h-4 ${trackingLoading[order._id] ? 'animate-spin' : ''}`} />
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            {shipments.map((shipment, idx) => {
                              const status = getShipmentStatusBadge(shipment.status);
                              return (
                                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-3 py-1 rounded text-sm font-medium ${status.color}`}>
                                          {status.label}
                                        </span>
                                        {shipment.courierName && (
                                          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                                            {shipment.courierName}
                                          </span>
                                        )}
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                          <span className="text-gray-600">AWB:</span>
                                          <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                                            {shipment.awbNumber}
                                          </code>
                                        </p>
                                        
                                        <p className="text-sm text-gray-600">
                                          {shipment.shipmentType === 'seller_to_warehouse' ? (
                                            <span className="flex items-center gap-2">
                                              <FiPackageIcon className="w-4 h-4" /> Seller → Warehouse
                                            </span>
                                          ) : shipment.shipmentType === 'warehouse_to_buyer' ? (
                                            <span className="flex items-center gap-2">
                                              <FiTruckIcon className="w-4 h-4" /> Warehouse → You
                                            </span>
                                          ) : (
                                            <span className="flex items-center gap-2">
                                              <FiTruck className="w-4 h-4" /> Direct Delivery
                                            </span>
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    <button
                                      onClick={() => openLiveTracking(shipment.awbNumber)}
                                      className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                      disabled={trackingLoading[order._id]}
                                    >
                                      <FiExternalLink className="w-4 h-4" /> Live Track
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex gap-3">
                          <button 
                            onClick={() => router.push(`/orders/${order._id}`)}
                            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <FiEye className="w-5 h-5" />
                            View Details
                          </button>
                          
                          {shipments.length > 0 && (
                            <button 
                              onClick={() => {
                                const awbNumber = shipments[0]?.awbNumber;
                                if (awbNumber) {
                                  openLiveTracking(awbNumber);
                                }
                              }}
                              className="flex-1 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                              <FiTruck className="w-5 h-5" />
                              Track Order
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
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">My Wishlist</h2>
              <p className="text-gray-600">
                {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
              </p>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiHeart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-6">Start adding items you love to your wishlist!</p>
                <Link
                  href="/products"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all font-medium"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {wishlist.map((item) => {
                  const product = item.product || item;
                  const productId = product._id || item._id;
                  const productName = product.productName || product.name;
                  const productPrice = product.finalPrice || product.price;
                  const productImage = product.images?.[0]?.url || product.image;
                  
                  return (
                    <div
                      key={productId}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
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
                          className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 shadow-lg hover:bg-red-50 transition-colors"
                          title="Remove from wishlist"
                        >
                          <FiHeart className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                      
                      <div className="p-4">
                        <h3 
                          onClick={() => handleProductClick(productId)}
                          className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-gray-700"
                        >
                          {productName}
                        </h3>
                        <p className="text-gray-900 font-semibold text-lg mb-3">
                          ₹{productPrice?.toLocaleString()}
                        </p>
                        
                        <button 
                          onClick={() => handleProductClick(productId)}
                          className="w-full py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          <FiShoppingBag className="w-4 h-4" />
                          Buy Now
                        </button>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a section</h3>
            <p className="text-gray-600">Choose a section to view your dashboard content</p>
          </div>
        );
    }
  };

  // ✅ MOBILE VERSION - PERFECT HEADER ALIGNMENT (EXACT HEIGHT)
  if (isMobile) {
    return (
      <>
        <Header />
        {/* ✅ MOBILE: Start exactly after header ends (80px) - NO GAP */}
        <main className="min-h-screen bg-gray-50 pt-[67px] pb-16">
          
          {/* Welcome Banner */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                  <p className="text-sm text-gray-600">Welcome back, {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user?.role === 'seller' 
                      ? user?.sellerVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user?.role === 'seller' 
                      ? user?.sellerVerified ? 'Seller' : 'Pending'
                      : 'Buyer'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Seller Status Banner */}
          {renderSellerStatusBanner()}
          
          {/* Quick Stats */}
          <div className="px-4 py-4">
            <div className="grid grid-cols-3 gap-3 mb-4">
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
            
            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide bg-white rounded-xl border border-gray-200 p-1 mb-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex-1 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors min-w-0 whitespace-nowrap ${
                    activeSection === item.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    {item.icon}
                    <span className="text-xs">{item.label}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Active Section Content */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {renderMobileActiveSection()}
            </div>
          </div>
          
          {/* Bottom Navigation for Quick Actions */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-40">
            <div className="flex justify-around">
              <button 
                onClick={() => router.push('/')}
                className="flex flex-col items-center p-2"
              >
                <FiHome className="w-5 h-5 text-gray-600 mb-1" />
                <span className="text-xs text-gray-600">Home</span>
              </button>
              
              <button 
                onClick={() => router.push('/sell-now')}
                className="flex flex-col items-center p-2"
              >
                <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center mb-1 font-bold">$</span>
                <span className="text-xs text-gray-600">Sell</span>
              </button>
              
              <button 
                onClick={() => router.push('/dashboard?section=wishlist')}
                className="flex flex-col items-center p-2"
              >
                <FiHeart className="w-5 h-5 text-gray-600 mb-1" />
                <span className="text-xs text-gray-600">Wishlist</span>
              </button>
              
              <button 
                onClick={() => router.push('/cart')}
                className="flex flex-col items-center p-2 relative"
              >
                <FiShoppingBag className="w-5 h-5 text-gray-600 mb-1" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
                <span className="text-xs text-gray-600">Cart</span>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ✅ DESKTOP VERSION - PERFECT HEADER ALIGNMENT (EXACT HEIGHT)
  return (
    <>
      <Header />
      
      {/* ✅ DESKTOP: Start exactly after header + subheader ends (120px) - NO GAP */}
      <main className="min-h-screen bg-gray-50">
        <div className="pt-[140px] pb-16">
          {renderSellerStatusBanner()}
          
          <section className="bg-white border-b border-gray-200">
            <div className="max-w-screen-2xl mx-auto px-8 py-8">
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
            <div className="max-w-screen-2xl mx-auto px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-lg transition-all duration-300">
                  <div className="text-2xl font-light text-gray-900 mb-2">{stats.totalListings}</div>
                  <div className="text-gray-600 uppercase tracking-wider text-xs font-medium">Total Listings</div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-lg transition-all duration-300">
                  <div className="text-2xl font-light text-green-600 mb-2">{stats.activeListings}</div>
                  <div className="text-gray-600 uppercase tracking-wider text-xs font-medium">Active Listings</div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-lg transition-all duration-300">
                  <div className="text-2xl font-light text-red-600 mb-2">{stats.soldListings}</div>
                  <div className="text-gray-600 uppercase tracking-wider text-xs font-medium">Sold Listings</div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-lg transition-all duration-300">
                  <div className="text-2xl font-light text-yellow-600 mb-2">{stats.readyForShipment}</div>
                  <div className="text-gray-600 uppercase tracking-wider text-xs font-medium">Ready to Ship</div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-5 text-center hover:shadow-lg transition-all duration-300">
                  <div className="text-2xl font-light text-blue-600 mb-2">{stats.totalOrders}</div>
                  <div className="text-gray-600 uppercase tracking-wider text-xs font-medium">Orders</div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="max-w-screen-2xl mx-auto px-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="lg:w-1/4">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-40 shadow-sm">
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

                    <nav className="space-y-3">
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
                            className="block w-full px-3 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors font-medium text-xs flex items-center justify-center gap-2"
                          >
                            <FiPackage className="w-3 h-3" />
                            + Sell New Item
                          </button>
                        ) : user?.role === 'seller' ? (
                          <button 
                            onClick={checkSellerStatus}
                            className="block w-full px-3 py-2 bg-yellow-600 text-white text-center rounded-lg hover:bg-yellow-700 transition-colors font-medium text-xs flex items-center justify-center gap-2"
                          >
                            <FiCheckCircle className="w-3 h-3" />
                            Check Approval Status
                          </button>
                        ) : (
                          <button 
                            onClick={() => router.push('/complete-profile?section=seller')}
                            className="block w-full px-3 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors font-medium text-xs flex items-center justify-center gap-2"
                          >
                            <FiUser className="w-3 h-3" />
                            Become a Seller
                          </button>
                        )}
                        <Link href="/products" className="block w-full px-3 py-2 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 transition-colors font-medium text-xs flex items-center justify-center gap-2">
                          <FiShoppingBag className="w-3 h-3" />
                          Browse Products
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content - Wider */}
                <div className="lg:w-[85%]">
                  <div className="bg-white rounded-xl border border-gray-200 min-h-[600px] w-full shadow-sm">
                    <div className="p-8">
                      {updateSuccess && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FiCheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="text-green-800 font-medium">Profile updated successfully!</p>
                              <p className="text-green-700 text-sm">Your changes have been saved.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {updateError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FiAlertCircle className="w-5 h-5 text-red-600" />
                            <div>
                              <p className="text-red-800 font-medium">Update failed</p>
                              <p className="text-red-700 text-sm">{updateError}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Desktop render active section */}
                      {renderDesktopActiveSection()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}