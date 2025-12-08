'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiUser, FiHeart, FiShoppingBag, FiLogOut, FiSettings, FiPackage, FiShoppingCart } from 'react-icons/fi'
import { usePathname, useRouter } from 'next/navigation'
import AuthModal from '@/components/ui/AuthModal'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)
  const [cartApiAvailable, setCartApiAvailable] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  const isProductPage = pathname?.includes('/products/')
  const isSellNowPage = pathname === '/sell-now'
  const isDashboardPage = pathname?.includes('/dashboard')

  // ✅ FIXED: Ensure username is in "name@justbecho" format
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

  // ✅ FIXED: Listen for seller status updates
  useEffect(() => {
    const updateUserState = () => {
      try {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        
        if (token && userData) {
          const user = JSON.parse(userData)
          
          if (user.username) {
            user.username = ensureJustbechoFormat(user.username);
          }
          
          setUser(user)
          
          if (user.role === 'seller' && user.sellerVerificationStatus === 'approved') {
            if (!user.sellerVerified) {
              const updatedUser = {
                ...user,
                sellerVerified: true
              };
              localStorage.setItem('user', JSON.stringify(updatedUser));
              setUser(updatedUser);
            }
          }
          
          fetchCartCount()
        } else {
          setUser(null)
          setCartCount(0)
        }
      } catch (error) {
        console.error('Error updating user state:', error)
        setUser(null)
        setCartCount(0)
      }
    }

    updateUserState();
    
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        updateUserState();
      }
    };
    
    const handleSellerStatusUpdate = () => {
      updateUserState();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sellerStatusUpdated', handleSellerStatusUpdate);
    
    const pollInterval = setInterval(() => {
      updateUserState();
    }, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sellerStatusUpdated', handleSellerStatusUpdate);
      clearInterval(pollInterval);
    };
  }, [ensureJustbechoFormat])

  // ✅ FIXED: Fetch categories from backend ONLY
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        console.log('📡 Fetching categories from backend API...')
        
        const response = await fetch('https://just-becho-backend.vercel.app/api/categories')
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('📦 Backend API response:', data)
        
        if (data.success && data.categories && Array.isArray(data.categories)) {
          console.log(`✅ Backend categories found: ${data.categories.length}`)
          setCategories(data.categories)
        } else {
          console.error('❌ Backend API response structure incorrect')
          setCategories([]) // Empty array if no categories from backend
        }
      } catch (error) {
        console.error('💥 Error fetching categories from backend:', error)
        setCategories([]) // Empty array on error
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // ✅ FIXED: Fetch cart count
  const fetchCartCount = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setCartCount(0)
        return
      }

      const response = await fetch('https://just-becho-backend.vercel.app/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(3000)
      })

      if (!response.ok) {
        setCartApiAvailable(false);
        setCartCount(0);
        return;
      }

      const data = await response.json()
      
      if (data.success) {
        setCartCount(data.cart.totalItems || 0);
        setCartApiAvailable(true);
      } else {
        setCartApiAvailable(false);
        setCartCount(0);
      }
    } catch (error) {
      setCartApiAvailable(false);
      setCartCount(0);
    }
  }, [])

  // ✅ FIXED: Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    handleScroll()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ✅ Convert to Seller Function
  const convertToSeller = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      
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
        const formattedUsername = ensureJustbechoFormat(data.user?.username);
        
        const userData = localStorage.getItem('user');
        const currentUser = userData ? JSON.parse(userData) : null;
        
        const updatedUser = {
          ...currentUser,
          role: 'seller',
          sellerVerified: data.user?.sellerVerified || false,
          sellerVerificationStatus: data.user?.sellerVerificationStatus || 'pending',
          verificationId: data.user?.verificationId || null,
          username: formattedUsername
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        window.dispatchEvent(new Event('authChange'));
        window.dispatchEvent(new Event('sellerStatusUpdated'));
        
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        alert('✅ You are now registered as a seller!');
        
        localStorage.setItem('changingRoleToSeller', 'true');
        
        setTimeout(() => {
          router.push('/complete-profile?convertingToSeller=true');
        }, 1000);
        
      } else {
        throw new Error(data.message || 'Conversion failed');
      }
      
    } catch (error) {
      console.error('Error in convertToSeller:', error);
      alert(`Error: ${error.message}`);
    }
  }, [router, ensureJustbechoFormat])

  // ✅ FIXED: Transform categories - ONLY BACKEND DATA
  const transformedCategories = useMemo(() => {
    console.log('🔄 Transforming backend categories:', categories)
    
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      console.log('⚠️ No categories from backend')
      return []; // Empty array - will show "No categories available"
    }
    
    // Transform backend categories based on their structure
    const transformed = categories.map((category, index) => {
      // If category is a string (like ["Mobile Phones", "Laptops"])
      if (typeof category === 'string') {
        return {
          name: category,
          href: `/categories/${category.toLowerCase().replace(/\s+/g, '-')}`,
          dropdown: {
            sections: [{
              title: "ITEMS",
              items: ["View All Products", "New Arrivals", "Best Sellers"]
            }]
          }
        };
      }
      
      // If category is an object (with name, href, subCategories)
      return {
        name: category?.name || `Category ${index + 1}`,
        href: category?.href || `/categories/${(category?.name || `category-${index}`).toLowerCase().replace(/\s+/g, '-')}`,
        dropdown: {
          sections: category?.subCategories || [{
            title: "ITEMS",
            items: ["View All Products", "New Arrivals", "Best Sellers"]
          }]
        }
      };
    });
    
    console.log('✅ Transformed categories:', transformed)
    return transformed;
  }, [categories]);

  // ✅ Rest of your handlers remain the same...
  const handleSellNowClick = useCallback((e) => {
    e.preventDefault()
    
    if (user) {
      const currentUserData = localStorage.getItem('user');
      const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
      
      const latestUser = currentUser || user;
      
      if (latestUser.role === 'seller') {
        if (latestUser.sellerVerified) {
          router.push('/sell-now')
        } else {
          if (latestUser.sellerVerificationStatus === 'pending') {
            alert('Your seller account is pending approval.')
            router.push('/dashboard?section=listings')
          } else if (latestUser.sellerVerificationStatus === 'approved') {
            const updatedUser = {
              ...latestUser,
              sellerVerified: true
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            window.dispatchEvent(new Event('sellerStatusUpdated'));
            router.push('/sell-now')
          } else {
            router.push('/sell-now')
          }
        }
      } else {
        const confirmBecomeSeller = confirm('You need to be a seller to list products. Would you like to become a seller?');
        if (confirmBecomeSeller) {
          convertToSeller();
        }
      }
    } else {
      setIsAuthModalOpen(true)
    }
  }, [user, router, convertToSeller])

  const handleMobileSellNowClick = useCallback(() => {
    if (user) {
      const currentUserData = localStorage.getItem('user');
      const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
      
      const latestUser = currentUser || user;
      
      if (latestUser.role === 'seller') {
        if (latestUser.sellerVerified) {
          router.push('/sell-now')
        } else {
          if (latestUser.sellerVerificationStatus === 'pending') {
            alert('Your seller account is pending approval.')
            router.push('/dashboard?section=listings')
          } else if (latestUser.sellerVerificationStatus === 'approved') {
            const updatedUser = {
              ...latestUser,
              sellerVerified: true
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            window.dispatchEvent(new Event('sellerStatusUpdated'));
            router.push('/sell-now')
          } else {
            router.push('/sell-now')
          }
        }
      } else {
        const confirmBecomeSeller = confirm('You need to be a seller to list products. Would you like to become a seller?');
        if (confirmBecomeSeller) {
          convertToSeller();
        }
      }
    } else {
      setIsAuthModalOpen(true)
    }
    setIsMenuOpen(false)
  }, [user, router, convertToSeller])

  const handleProfileClick = useCallback((e) => {
    e.preventDefault()
    if (user) {
      setShowUserDropdown(!showUserDropdown)
    } else {
      setIsAuthModalOpen(true)
      setShowUserDropdown(false)
    }
  }, [user, showUserDropdown])

  const handleWishlistClick = useCallback(() => {
    if (user) {
      router.push('/dashboard?section=wishlist')
      setShowUserDropdown(false)
    } else {
      setIsAuthModalOpen(true)
    }
  }, [user, router])

  const handleMobileWishlistClick = useCallback(() => {
    if (user) {
      router.push('/dashboard?section=wishlist')
    } else {
      setIsAuthModalOpen(true)
    }
    setIsMenuOpen(false)
  }, [user, router])

  const handleCartClick = useCallback((e) => {
    e.preventDefault()
    if (user) {
      if (cartApiAvailable) {
        router.push('/cart')
      } else {
        alert('Cart functionality is currently unavailable.');
      }
    } else {
      setIsAuthModalOpen(true)
    }
  }, [user, router, cartApiAvailable])

  const handleMobileCartClick = useCallback(() => {
    if (user) {
      if (cartApiAvailable) {
        router.push('/cart')
      } else {
        alert('Cart functionality is currently unavailable.');
      }
    } else {
      setIsAuthModalOpen(true)
    }
    setIsMenuOpen(false)
  }, [user, router, cartApiAvailable])

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('isGoogleSignup')
      localStorage.removeItem('verificationId')
      localStorage.removeItem('changingRoleToSeller')
      localStorage.removeItem('isGoogleUser')
      
      sessionStorage.clear()
      
      setUser(null)
      setCartCount(0)
      setShowUserDropdown(false)
      
      const cookies = document.cookie.split(";")
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf("=")
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
      }
      
      window.dispatchEvent(new Event('authChange'))
      window.dispatchEvent(new Event('storage'))
      
      window.location.href = '/'
      
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/'
    }
  }, [])

  const handleMobileLogout = useCallback(() => {
    setIsMenuOpen(false)
    
    setTimeout(() => {
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('isGoogleSignup')
        localStorage.removeItem('verificationId')
        localStorage.removeItem('changingRoleToSeller')
        localStorage.removeItem('isGoogleUser')
        
        sessionStorage.clear()
        
        setUser(null)
        setCartCount(0)
        
        const cookies = document.cookie.split(";")
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i]
          const eqPos = cookie.indexOf("=")
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
        }
        
        window.dispatchEvent(new Event('authChange'))
        window.dispatchEvent(new Event('storage'))
        
        window.location.href = '/'
        
      } catch (error) {
        console.error('Mobile logout error:', error)
        window.location.href = '/'
      }
    }, 300)
  }, [])

  const handleMobileProfileClick = useCallback(() => {
    if (user) {
      router.push('/dashboard')
    } else {
      setIsAuthModalOpen(true)
    }
    setIsMenuOpen(false)
  }, [user, router])

  return (
    <>
      {/* MAIN HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans ${
          isDashboardPage ? 'bg-white text-gray-900 shadow-sm' :
          isProductPage || isSellNowPage ? 'bg-white text-gray-900 shadow-sm' : 
          isScrolled ? 'bg-white text-gray-900 shadow-sm' : 'bg-transparent text-white'
        }`}
      >
        <div className="w-[95%] sm:w-[90%] mx-auto">
          <div className="flex items-center justify-between py-4 sm:py-5">
            {/* LEFT: Search + Sell Now - Desktop Only */}
            <div className="hidden md:flex flex-1 items-center space-x-4">
              {/* Search Bar */}
              <div className={`relative flex items-center max-w-[200px] lg:max-w-[220px] w-full border-b-2 ${
                isDashboardPage ? 'border-gray-400' :
                isProductPage || isSellNowPage ? 'border-gray-400' : 
                isScrolled ? 'border-gray-400' : 'border-white'
              }`}>
                <input
                  type="text"
                  placeholder="Search for products..."
                  className={`flex-1 bg-transparent outline-none py-1.5 text-[14px] lg:text-[15px] w-full font-light tracking-wide ${
                    isDashboardPage ? 'text-gray-800 placeholder-gray-500' :
                    isProductPage || isSellNowPage ? 'text-gray-800 placeholder-gray-500' :
                    isScrolled ? 'text-gray-800 placeholder-gray-500' : 'text-white placeholder-white/80'
                  }`}
                />
                <button
                  className={`px-2 py-1.5 transition flex-shrink-0 ${
                    isDashboardPage ? 'text-gray-600' :
                    isProductPage || isSellNowPage ? 'text-gray-600' :
                    isScrolled ? 'text-gray-600' : 'text-white'
                  }`}
                >
                  <svg
                    className="w-4 h-4 lg:w-5 lg:h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Sell Now Button */}
              <button
                onClick={handleSellNowClick}
                className={`text-[14px] lg:text-[15px] font-light tracking-widest uppercase transition-all duration-300 whitespace-nowrap px-4 lg:px-5 py-1.5 rounded-full ${
                  isDashboardPage ? 'bg-black text-white hover:bg-gray-800' :
                  isProductPage || isSellNowPage ? 'bg-black text-white hover:bg-gray-800' :
                  isScrolled ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                SELL NOW
              </button>
            </div>

            {/* CENTER: Logo - Perfect Center */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="flex items-center justify-center">
                <Image
                  src="/Just Becho Logo Golden.png"
                  alt="Just Becho"
                  width={isDashboardPage ? 70 : isProductPage || isSellNowPage ? 70 : isScrolled ? 70 : 80}
                  height={isDashboardPage ? 70 : isProductPage || isSellNowPage ? 70 : isScrolled ? 70 : 80}
                  className={`transition-all duration-500 ${
                    isDashboardPage ? 'h-14 w-auto' : 
                    isProductPage || isSellNowPage ? 'h-14 w-auto' : 
                    isScrolled ? 'h-14 w-auto' : 'h-16 w-auto'
                  }`}
                  priority
                />
              </Link>
            </div>

            {/* RIGHT: Icons - ORDER: Profile -> Wishlist -> Cart */}
            <div className="flex items-center space-x-4 sm:space-x-5 flex-1 justify-end">
              {/* Mobile Menu Button */}
              <button
                className="md:hidden focus:outline-none p-1"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  className={`w-6 h-6 sm:w-7 sm:h-7 ${
                    isDashboardPage ? 'text-gray-900' :
                    isProductPage || isSellNowPage ? 'text-gray-900' : 
                    isScrolled ? 'text-gray-900' : 'text-white'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>

              {/* Desktop Options */}
              <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                {/* Profile Icon with Dropdown */}
                <div className="relative">
                  <button 
                    onClick={handleProfileClick}
                    className={`hover:text-gray-700 transition-all duration-300 transform hover:scale-110 flex items-center ${
                      isDashboardPage ? 'text-gray-900' :
                      isProductPage || isSellNowPage ? 'text-gray-900' : 
                      isScrolled ? 'text-gray-900' : 'text-white'
                    }`}
                  >
                    <FiUser className="w-6 h-6 lg:w-7 lg:h-7" />
                  </button>

                  {/* User Dropdown */}
                  {showUserDropdown && user && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'User'}</p>
                      
                        
                        {/* Seller Status Badge */}
                        {user.role === 'seller' && (
                          <div className="mt-2">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.sellerVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.sellerVerified ? 'Seller Verified' : 'Seller Pending'}
                            </div>
                           
                          </div>
                        )}
                      </div>
                      
                      {/* Dashboard Links */}
                      <div className="py-1">
                        <Link 
                          href="/dashboard" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <FiUser className="w-4 h-4 mr-3 text-gray-400" />
                          My Dashboard
                        </Link>
                        
                        {user.role === 'seller' && (
                          <Link 
                            href="/dashboard?section=listings" 
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <FiPackage className="w-4 h-4 mr-3 text-gray-400" />
                            My Listings
                          </Link>
                        )}
                        
                        <Link 
                          href="/dashboard?section=orders" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <FiShoppingCart className="w-4 h-4 mr-3 text-gray-400" />
                          My Orders
                        </Link>
                      </div>
                      
                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-1">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiLogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Wishlist Icon */}
                <button 
                  onClick={handleWishlistClick}
                  className={`hover:text-gray-700 transition-all duration-300 transform hover:scale-110 flex items-center ${
                    isDashboardPage ? 'text-gray-900' :
                    isProductPage || isSellNowPage ? 'text-gray-900' : 
                    isScrolled ? 'text-gray-900' : 'text-white'
                  }`}
                >
                  <FiHeart className="w-6 h-6 lg:w-7 lg:h-7" />
                </button>

                {/* Cart Icon - Only show if cart API is available */}
                {cartApiAvailable && (
                  <button 
                    onClick={handleCartClick}
                    className={`relative hover:text-gray-700 transition-all duration-300 transform hover:scale-110 flex items-center ${
                      isDashboardPage ? 'text-gray-900' :
                      isProductPage || isSellNowPage ? 'text-gray-900' : 
                      isScrolled ? 'text-gray-900' : 'text-white'
                    }`}
                  >
                    <FiShoppingBag className="w-6 h-6 lg:w-7 lg:h-7" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar - Below Header */}
          <div className="md:hidden border-t border-gray-200/50 mt-2 pt-2 pb-1">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search for products..."
                className={`flex-1 border border-gray-300/50 rounded-full px-4 py-2 text-sm outline-none w-full font-light tracking-wide ${
                  isDashboardPage ? 'text-gray-800 placeholder-gray-500 bg-white' :
                  isProductPage || isSellNowPage ? 'text-gray-800 placeholder-gray-500 bg-white' :
                  isScrolled ? 'text-gray-800 placeholder-gray-500 bg-white' : 'text-white placeholder-white/80 bg-white/10'
                }`}
              />
              <button
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  isDashboardPage ? 'text-gray-600' :
                  isProductPage || isSellNowPage ? 'text-gray-600' :
                  isScrolled ? 'text-gray-600' : 'text-white'
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div
            className={`md:hidden transition-all duration-300 font-light tracking-widest uppercase ${
              isDashboardPage ? 'bg-white text-gray-800 shadow-lg' :
              isProductPage || isSellNowPage ? 'bg-white text-gray-800 shadow-lg' :
              isScrolled ? 'bg-white text-gray-800 shadow-lg' : 'bg-black/95 text-white'
            }`}
          >
            <nav className="flex flex-col px-6 py-4 space-y-4 text-base">
              {/* Mobile Sell Now Button */}
              <button 
                onClick={handleMobileSellNowClick}
                className="py-2 hover:text-gray-700 transition-colors duration-300 text-left"
              >
                SELL NOW
              </button>
              
              {user ? (
                <>
                  {/* Seller Status in Mobile Menu */}
                  {user.role === 'seller' && (
                    <div className="px-2 py-1">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.sellerVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.sellerVerified ? 'Seller Verified' : 'Seller Pending'}
                      </div>
                      {user.username && (
                        <p className="text-xs text-gray-600 mt-1">
                          Username: {ensureJustbechoFormat(user.username)}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <Link href="/dashboard" className="flex items-center py-2 hover:text-gray-700 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                    <FiUser className="w-4 h-4 mr-3" />
                    DASHBOARD
                  </Link>
                  
                  {user.role === 'seller' && (
                    <Link href="/dashboard?section=listings" className="flex items-center py-2 hover:text-gray-700 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                      <FiPackage className="w-4 h-4 mr-3" />
                      MY LISTINGS
                    </Link>
                  )}
                  
                  <Link href="/dashboard?section=purchases" className="flex items-center py-2 hover:text-gray-700 transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                    <FiShoppingCart className="w-4 h-4 mr-3" />
                    MY PURCHASES
                  </Link>
                  
                  <button onClick={handleMobileLogout} className="flex items-center py-2 text-red-600 hover:text-red-700 transition-colors duration-300 text-left">
                    <FiLogOut className="w-4 h-4 mr-3" />
                    LOGOUT
                  </button>
                </>
              ) : (
                <button onClick={handleMobileProfileClick} className="py-2 hover:text-gray-700 transition-colors duration-300 text-left">
                  PROFILE
                </button>
              )}
              
              {/* Mobile Wishlist */}
              <button 
                onClick={handleMobileWishlistClick}
                className="py-2 hover:text-gray-700 transition-colors duration-300 text-left"
              >
                WISHLIST
              </button>
              
              {/* Mobile Cart - Only show if cart API is available */}
              {cartApiAvailable && (
                <button 
                  onClick={handleMobileCartClick}
                  className="flex items-center py-2 hover:text-gray-700 transition-colors duration-300 text-left"
                >
                  <FiShoppingBag className="w-4 h-4 mr-3" />
                  CART {cartCount > 0 && `(${cartCount})`}
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* SUBHEADER WITH CATEGORIES */}
      <div
        className={`fixed top-20 left-0 right-0 z-40 transition-all duration-500 ${
          isDashboardPage ? 'bg-white shadow-md' :
          isProductPage || isSellNowPage ? 'bg-white shadow-md' :
          isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
        {/* Main Categories Bar */}
        <div className="w-[95%] sm:w-[90%] mx-auto">
          <nav className="hidden md:flex items-center justify-center space-x-8 lg:space-x-12 py-4">
            {loading ? (
              <div className="text-sm text-gray-500">Loading categories...</div>
            ) : transformedCategories.length > 0 ? (
              transformedCategories.map((category, index) => (
                <div
                  key={category.name || index}
                  className="relative group"
                  onMouseEnter={() => setActiveCategory(category.name)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  {/* Category Link */}
                  <Link
                    href={category.href}
                    className={`text-sm font-light tracking-widest uppercase transition-all duration-300 hover:scale-105 ${
                      isDashboardPage ? 'text-gray-800 hover:text-gray-600' :
                      isProductPage || isSellNowPage ? 'text-gray-800 hover:text-gray-600' :
                      isScrolled ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-gray-200'
                    }`}
                  >
                    {category.name.toUpperCase()}
                  </Link>

                  {/* COMPACT DROPDOWN */}
                  {activeCategory === category.name && (
                    <div 
                      className="fixed left-0 right-0 top-[140px] bg-white shadow-2xl border-t border-gray-100 py-8 z-[60]"
                      onMouseEnter={() => setActiveCategory(category.name)}
                      onMouseLeave={() => setActiveCategory(null)}
                    >
                      <div className="w-[95%] sm:w-[90%] mx-auto max-w-5xl">
                        <div className="grid grid-cols-5 gap-6">
                          {category.dropdown.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="space-y-2">
                              {/* Section Title - Compact */}
                              <h3 className="text-gray-900 text-[13px] font-semibold tracking-wide uppercase mb-1">
                                {section.title}
                              </h3>
                              
                              {/* Section Items - Compact */}
                              <ul className="space-y-1">
                                {section.items.map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    <Link
                                      href={`${category.href}?subcategory=${(item || '').toLowerCase().replace(/\s+/g, '-')}`}
                                      className="text-gray-600 text-[12px] font-normal hover:text-gray-900 transition-colors duration-200 block py-0.5"
                                    >
                                      {item}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        
                        {/* View All Button - Compact */}
                        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                          <Link
                            href={category.href}
                            className="inline-flex items-center text-gray-900 text-[13px] font-semibold tracking-wide uppercase hover:text-gray-700 transition-colors duration-200 group"
                          >
                            View All {category.name} 
                            <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No categories available</div>
            )}
          </nav>
        </div>

        {/* Mobile Categories - Horizontal Scroll */}
        <div className="md:hidden border-t border-gray-200/50">
          <div className="flex overflow-x-auto space-x-6 py-3 px-4 hide-scrollbar">
            {loading ? (
              <div className="text-xs text-gray-500">Loading...</div>
            ) : transformedCategories.length > 0 ? (
              transformedCategories.map((category, index) => (
                <Link
                  key={category.name || index}
                  href={category.href}
                  className={`flex-shrink-0 text-xs font-light tracking-widest uppercase whitespace-nowrap ${
                    isDashboardPage ? 'text-gray-800 hover:text-gray-600' :
                    isProductPage || isSellNowPage ? 'text-gray-800 hover:text-gray-600' :
                    isScrolled ? 'text-gray-800 hover:text-gray-600' : 'text-white hover:text-gray-200'
                  }`}
                >
                  {category.name.split(' ')[0]}
                </Link>
              ))
            ) : (
              <div className="text-xs text-gray-500">No categories</div>
            )}
          </div>
        </div>

        <style jsx>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* AUTH MODAL */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  )
}