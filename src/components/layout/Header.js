'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiUser, FiHeart, FiShoppingBag, FiLogOut, FiSettings, FiPackage, FiShoppingCart, FiSearch, FiHome, FiMenu, FiX } from 'react-icons/fi'
import { usePathname, useRouter } from 'next/navigation'
import AuthModal from '@/components/ui/AuthModal'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuAnimating, setIsMenuAnimating] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)
  const [cartApiAvailable, setCartApiAvailable] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const isProductPage = pathname?.includes('/products/')
  const isSellNowPage = pathname === '/sell-now'
  const isDashboardPage = pathname?.includes('/dashboard')
  const isCartPage = pathname === '/cart'

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

  // ✅ FIXED: Handle Google OAuth redirect from URL
  useEffect(() => {
    const handleGoogleAuthRedirect = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const source = urlParams.get('source');
        const isNewUser = urlParams.get('isNewUser') === 'true';
        const profileCompleted = urlParams.get('profileCompleted') === 'true';
        const authError = urlParams.get('auth_error');
        
        // Handle authentication errors
        if (authError) {
          console.error('❌ Google OAuth error from URL:', authError);
          // Clear URL parameters
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          return;
        }
        
        // Handle successful Google OAuth
        if (token && source === 'google') {
          console.log('✅ Google OAuth token detected in URL');
          
          // Save token
          localStorage.setItem('token', token);
          localStorage.setItem('isGoogleSignup', 'true');
          
          // Clear URL parameters
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          
          // Fetch user data
          fetchUserData(token, isNewUser, profileCompleted);
        }
      } catch (error) {
        console.error('Error handling Google auth redirect:', error);
      }
    };
    
    const fetchUserData = async (token, isNewUser, profileCompleted) => {
      try {
        console.log('📡 Fetching user data from backend...');
        const response = await fetch('https://just-becho-backend.vercel.app/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            console.log('✅ User data fetched:', data.user.email);
            
            // Store user data
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Set user state
            setUser(data.user);
            
            // Check what to do next
            if (isNewUser || !data.user.profileCompleted) {
              console.log('🔄 New user or profile not completed, redirecting to complete-profile');
              router.push('/complete-profile');
            } else {
              console.log('🚀 Existing user with completed profile, redirecting to dashboard');
              router.push('/dashboard');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const updateUserState = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const user = JSON.parse(userData);
          
          if (user.username) {
            user.username = ensureJustbechoFormat(user.username);
          }
          
          setUser(user);
          
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
          
          fetchCartCount();
        } else {
          setUser(null);
          setCartCount(0);
        }
      } catch (error) {
        console.error('Error updating user state:', error);
        setUser(null);
        setCartCount(0);
      }
    };

    // First check for Google OAuth redirect
    handleGoogleAuthRedirect();
    
    // Then update user state
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
  }, [ensureJustbechoFormat, router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('📡 Fetching categories from backend API...');
        
        const response = await fetch('https://just-becho-backend.vercel.app/api/categories');
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Backend API response:', data);
        
        if (data.success && data.categories && Array.isArray(data.categories)) {
          console.log(`✅ Backend categories found: ${data.categories.length}`);
          setCategories(data.categories);
        } else {
          console.error('❌ Backend API response structure incorrect');
          setCategories([]);
        }
      } catch (error) {
        console.error('💥 Error fetching categories from backend:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchCartCount = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartCount(0);
        return;
      }

      const response = await fetch('https://just-becho-backend.vercel.app/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(3000)
      });

      if (!response.ok) {
        setCartApiAvailable(false);
        setCartCount(0);
        return;
      }

      const data = await response.json();
      
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
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isCartPage) {
        setIsScrolled(true);
      } else {
        setIsScrolled(window.scrollY > 50);
      }
    };
    
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCartPage]);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(
        `https://just-becho-backend.vercel.app/api/products/search?query=${encodeURIComponent(query)}&limit=10`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.products) {
          setSearchResults(data.products);
          setShowSearchResults(true);
        } else {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      handleSearch(value);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest('.search-container')) return;
      setShowSearchResults(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleBurgerClick = () => {
    setIsMenuAnimating(true);
    setIsMenuOpen(!isMenuOpen);
    
    setTimeout(() => {
      setIsMenuAnimating(false);
    }, 300);
  };

  const convertToSeller = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
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
  }, [router, ensureJustbechoFormat]);

  const transformedCategories = useMemo(() => {
    console.log('🔄 Transforming backend categories:', categories);
    
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      console.log('⚠️ No categories from backend');
      return [];
    }
    
    const transformed = categories.map((category, index) => {
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
    
    console.log('✅ Transformed categories:', transformed);
    return transformed;
  }, [categories]);

  const handleSellNowClick = useCallback((e) => {
    e.preventDefault();
    
    if (user) {
      const currentUserData = localStorage.getItem('user');
      const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
      
      const latestUser = currentUser || user;
      
      if (latestUser.role === 'seller') {
        if (latestUser.sellerVerified) {
          router.push('/sell-now');
        } else {
          if (latestUser.sellerVerificationStatus === 'pending') {
            alert('Your seller account is pending approval.');
            router.push('/dashboard?section=listings');
          } else if (latestUser.sellerVerificationStatus === 'approved') {
            const updatedUser = {
              ...latestUser,
              sellerVerified: true
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            window.dispatchEvent(new Event('sellerStatusUpdated'));
            router.push('/sell-now');
          } else {
            router.push('/sell-now');
          }
        }
      } else {
        const confirmBecomeSeller = confirm('You need to be a seller to list products. Would you like to become a seller?');
        if (confirmBecomeSeller) {
          convertToSeller();
        }
      }
    } else {
      setIsAuthModalOpen(true);
    }
  }, [user, router, convertToSeller]);

  const handleMobileSellNowClick = useCallback(() => {
    if (user) {
      const currentUserData = localStorage.getItem('user');
      const currentUser = currentUserData ? JSON.parse(currentUserData) : null;
      
      const latestUser = currentUser || user;
      
      if (latestUser.role === 'seller') {
        if (latestUser.sellerVerified) {
          router.push('/sell-now');
        } else {
          if (latestUser.sellerVerificationStatus === 'pending') {
            alert('Your seller account is pending approval.');
            router.push('/dashboard?section=listings');
          } else if (latestUser.sellerVerificationStatus === 'approved') {
            const updatedUser = {
              ...latestUser,
              sellerVerified: true
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            window.dispatchEvent(new Event('sellerStatusUpdated'));
            router.push('/sell-now');
          } else {
            router.push('/sell-now');
          }
        }
      } else {
        const confirmBecomeSeller = confirm('You need to be a seller to list products. Would you like to become a seller?');
        if (confirmBecomeSeller) {
          convertToSeller();
        }
      }
    } else {
      setIsAuthModalOpen(true);
    }
    setIsMenuOpen(false);
  }, [user, router, convertToSeller]);

  const handleProfileClick = useCallback((e) => {
    e.preventDefault();
    if (user) {
      setShowUserDropdown(!showUserDropdown);
    } else {
      setIsAuthModalOpen(true);
      setShowUserDropdown(false);
    }
  }, [user, showUserDropdown]);

  const handleWishlistClick = useCallback(() => {
    if (user) {
      router.push('/dashboard?section=wishlist');
      setShowUserDropdown(false);
    } else {
      setIsAuthModalOpen(true);
    }
  }, [user, router]);

  const handleMobileWishlistClick = useCallback(() => {
    if (user) {
      router.push('/dashboard?section=wishlist');
    } else {
      setIsAuthModalOpen(true);
    }
    setIsMenuOpen(false);
  }, [user, router]);

  const handleCartClick = useCallback((e) => {
    e.preventDefault();
    if (user) {
      if (cartApiAvailable) {
        router.push('/cart');
      } else {
        alert('Cart functionality is currently unavailable.');
      }
    } else {
      setIsAuthModalOpen(true);
    }
  }, [user, router, cartApiAvailable]);

  const handleMobileCartClick = useCallback(() => {
    if (user) {
      if (cartApiAvailable) {
        router.push('/cart');
      } else {
        alert('Cart functionality is currently unavailable.');
      }
    } else {
      setIsAuthModalOpen(true);
    }
    setIsMenuOpen(false);
  }, [user, router, cartApiAvailable]);

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isGoogleSignup');
      localStorage.removeItem('verificationId');
      localStorage.removeItem('changingRoleToSeller');
      localStorage.removeItem('isGoogleUser');
      
      sessionStorage.clear();
      
      setUser(null);
      setCartCount(0);
      setShowUserDropdown(false);
      
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
      
      window.dispatchEvent(new Event('authChange'));
      window.dispatchEvent(new Event('storage'));
      
      window.location.href = '/';
      
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  }, []);

  const handleMobileLogout = useCallback(() => {
    setIsMenuOpen(false);
    
    setTimeout(() => {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isGoogleSignup');
        localStorage.removeItem('verificationId');
        localStorage.removeItem('changingRoleToSeller');
        localStorage.removeItem('isGoogleUser');
        
        sessionStorage.clear();
        
        setUser(null);
        setCartCount(0);
        
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
        
        window.dispatchEvent(new Event('authChange'));
        window.dispatchEvent(new Event('storage'));
        
        window.location.href = '/';
        
      } catch (error) {
        console.error('Mobile logout error:', error);
        window.location.href = '/';
      }
    }, 300);
  }, []);

  const handleMobileProfileClick = useCallback(() => {
    if (user) {
      router.push('/dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
    setIsMenuOpen(false);
  }, [user, router]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans bg-white text-gray-900 shadow-sm`}
      >
        <div className="w-[95%] sm:w-[90%] mx-auto">
          <div className="flex items-center justify-between py-4 sm:py-5">
            
            {/* LEFT SECTION: Desktop Search + Sell Now */}
            <div className="hidden md:flex items-center space-x-4">
              
              {/* DESKTOP SEARCH BAR */}
              <div className="relative w-60 lg:w-72 search-container">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                    className="border border-gray-300 rounded-full px-4 py-2.5 text-sm outline-none w-full text-gray-800 bg-white placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                  >
                    <FiSearch className="w-4 h-4" />
                  </button>
                </form>
                
                {/* SEARCH RESULTS - WITHOUT "VIEW ALL RESULTS" */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl rounded-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
                    {searchLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-2 text-sm">Searching...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map((product) => (
                          <Link
                            key={product._id}
                            href={`/products/${product._id}`}
                            className="flex items-center px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            onClick={() => setShowSearchResults(false)}
                          >
                            {product.images?.[0]?.url ? (
                              <img
                                src={product.images[0].url}
                                alt={product.productName}
                                className="w-10 h-10 object-cover rounded mr-3"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded mr-3 flex items-center justify-center">
                                <FiShoppingBag className="w-5 h-5 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.productName}
                              </p>
                              <p className="text-xs text-gray-500">
                                ₹{product.finalPrice?.toLocaleString() || '0'}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : searchQuery.trim() && (
                      <div className="p-4 text-center text-gray-500">
                        <p className="text-sm">No products found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* DESKTOP SELL NOW BUTTON */}
              <button
                onClick={handleSellNowClick}
                className="px-5 py-2.5 rounded-full text-sm font-medium transition-colors bg-black text-white hover:bg-gray-800"
              >
                Sell Now
              </button>
            </div>

            {/* MOBILE Burger Menu */}
            <div className="md:hidden flex items-center">
              <button
                className={`focus:outline-none p-1 ${
                  isMenuAnimating ? 'opacity-70' : ''
                }`}
                onClick={handleBurgerClick}
                aria-label="Menu"
              >
                <div className="relative w-6 h-6">
                  <span className={`absolute top-1/2 left-0 w-6 h-0.5 transform transition-all duration-300 ${
                    isMenuOpen 
                      ? 'rotate-45 translate-y-0 bg-gray-900' 
                      : '-translate-y-2 bg-gray-900'
                  }`}></span>
                  <span className={`absolute top-1/2 left-0 w-6 h-0.5 transform transition-all duration-300 ${
                    isMenuOpen 
                      ? 'opacity-0 translate-x-4' 
                      : 'opacity-100'
                  } bg-gray-900`}></span>
                  <span className={`absolute top-1/2 left-0 w-6 h-0.5 transform transition-all duration-300 ${
                    isMenuOpen 
                      ? '-rotate-45 translate-y-0 bg-gray-900' 
                      : 'translate-y-2 bg-gray-900'
                  }`}></span>
                </div>
              </button>
            </div>

            {/* CENTER: Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="flex items-center justify-center">
                <Image
                  src="/Just Becho Logo Golden.png"
                  alt="Just Becho"
                  width={70}
                  height={70}
                  className="h-14 w-auto transition-all duration-500 mt-1"
                  priority
                />
              </Link>
            </div>

            {/* RIGHT SECTION: Icons */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                {/* Profile Icon with Dropdown */}
                <div className="relative">
                  <button 
                    onClick={handleProfileClick}
                    className="hover:text-gray-700 transition-all duration-300 transform hover:scale-110 flex items-center text-gray-900"
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
                  className="hover:text-gray-700 transition-all duration-300 transform hover:scale-110 flex items-center text-gray-900"
                >
                  <FiHeart className="w-6 h-6 lg:w-7 lg:h-7" />
                </button>

                {/* Cart Icon */}
                {cartApiAvailable && (
                  <button 
                    onClick={handleCartClick}
                    className="relative hover:text-gray-700 transition-all duration-300 transform hover:scale-110 flex items-center text-gray-900"
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

              {/* Mobile Cart Icon */}
              {cartApiAvailable && (
                <button 
                  onClick={handleMobileCartClick}
                  className="md:hidden relative hover:text-gray-700 transition-all duration-300 flex items-center text-gray-900"
                >
                  <FiShoppingBag className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* MOBILE SEARCH BAR */}
          <div className="md:hidden border-t border-gray-200 mt-2 pt-2 pb-1 search-container">
            <div className="relative">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none w-full font-light tracking-wide text-gray-800 placeholder-gray-500 bg-white"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  <FiSearch className="w-4 h-4" />
                </button>
              </form>
              
              {/* Mobile Search Results - WITHOUT "VIEW ALL RESULTS" */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl rounded-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="mt-2 text-sm">Searching...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((product) => (
                        <Link
                          key={product._id}
                          href={`/products/${product._id}`}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          onClick={() => {
                            setShowSearchResults(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.productName}
                              className="w-10 h-10 object-cover rounded mr-3"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded mr-3 flex items-center justify-center">
                              <FiShoppingBag className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.productName}
                            </p>
                            <p className="text-xs text-gray-500">
                              ₹{product.finalPrice?.toLocaleString() || '0'}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : searchQuery.trim() && (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">No products found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div className={`md:hidden fixed top-0 left-0 right-0 bottom-0 z-[60] transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className={`absolute top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <nav className="flex flex-col h-full overflow-y-auto">
              {/* Header with Close Button */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <Image
                    src="/Just Becho Logo Golden.png"
                    alt="Just Becho"
                    width={40}
                    height={40}
                    className="h-10 w-auto"
                  />
                  <span className="ml-3 text-lg font-light tracking-widest uppercase text-gray-900">
                    MENU
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <FiX className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* CATEGORIES SECTION */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">CATEGORIES</h3>
                <div className="grid grid-cols-2 gap-3">
                  {loading ? (
                    <div className="col-span-2 text-xs text-gray-500">Loading categories...</div>
                  ) : transformedCategories.length > 0 ? (
                    transformedCategories.map((category, index) => (
                      <Link
                        key={category.name || index}
                        href={category.href}
                        className="px-4 py-3 text-xs font-light bg-gray-50 text-gray-800 hover:bg-gray-100 rounded-lg transition-all text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name.toUpperCase()}
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-2 text-xs text-gray-500">No categories available</div>
                  )}
                </div>
              </div>

              {/* Mobile Menu Items */}
              <div className="flex-1 p-6 space-y-1">
                {/* Home Link */}
                <Link 
                  href="/"
                  className="flex items-center py-3 px-4 text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiHome className="w-5 h-5 mr-4 text-gray-900" />
                  <span className="font-light tracking-widest uppercase">HOME</span>
                </Link>
                
                {/* Mobile Sell Now Button */}
                <button 
                  onClick={handleMobileSellNowClick}
                  className="flex items-center w-full py-3 px-4 text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300 text-left"
                >
                  <span className="w-5 h-5 mr-4 text-center text-gray-900 font-bold">$</span>
                  <span className="font-light tracking-widest uppercase">SELL NOW</span>
                </button>
                
                {user ? (
                  <>
                    {/* Seller Status in Mobile Menu */}
                    {user.role === 'seller' && (
                      <div className="px-4 py-3 mb-2 bg-gray-50 rounded-lg">
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
                    
                    <Link href="/dashboard" className="flex items-center py-3 px-4 text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                      <FiUser className="w-5 h-5 mr-4 text-gray-900" />
                      <span className="font-light tracking-widest uppercase">DASHBOARD</span>
                    </Link>
                    
                    {user.role === 'seller' && (
                      <Link href="/dashboard?section=listings" className="flex items-center py-3 px-4 text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                        <FiPackage className="w-5 h-5 mr-4 text-gray-900" />
                        <span className="font-light tracking-widest uppercase">MY LISTINGS</span>
                      </Link>
                    )}
                    
                    <Link href="/dashboard?section=purchases" className="flex items-center py-3 px-4 text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                      <FiShoppingCart className="w-5 h-5 mr-4 text-gray-900" />
                      <span className="font-light tracking-widest uppercase">MY PURCHASES</span>
                    </Link>
                    
                    <button onClick={handleMobileLogout} className="flex items-center w-full py-3 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-300 text-left">
                      <FiLogOut className="w-5 h-5 mr-4 text-red-600" />
                      <span className="font-light tracking-widest uppercase">LOGOUT</span>
                    </button>
                  </>
                ) : (
                  <button onClick={handleMobileProfileClick} className="flex items-center w-full py-3 px-4 text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300 text-left">
                    <FiUser className="w-5 h-5 mr-4 text-gray-900" />
                    <span className="font-light tracking-widest uppercase">PROFILE</span>
                  </button>
                )}
                
                {/* Mobile Wishlist */}
                <button 
                  onClick={handleMobileWishlistClick}
                  className="flex items-center w-full py-3 px-4 text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300 text-left"
                >
                  <FiHeart className="w-5 h-5 mr-4 text-gray-900" />
                  <span className="font-light tracking-widest uppercase">WISHLIST</span>
                </button>
                
                {/* Mobile Cart */}
                {cartApiAvailable && (
                  <button 
                    onClick={handleMobileCartClick}
                    className="flex items-center w-full py-3 px-4 text-gray-900 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-300 text-left"
                  >
                    <FiShoppingBag className="w-5 h-5 mr-4 text-gray-900" />
                    <span className="font-light tracking-widest uppercase">
                      CART {cartCount > 0 && `(${cartCount})`}
                    </span>
                  </button>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 mt-auto">
                <p className="text-xs text-gray-500 text-center">
                  © 2025 Just Becho. All rights reserved.
                </p>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* SUBHEADER WITH CATEGORIES */}
      <div
        className="hidden md:block fixed top-20 left-0 right-0 z-40 bg-white shadow-md"
      >
        {/* Main Categories Bar */}
        <div className="w-[95%] sm:w-[90%] mx-auto">
          <nav className="flex items-center justify-center space-x-8 lg:space-x-12 py-4">
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
                    className="text-sm font-light tracking-widest uppercase transition-all duration-300 hover:scale-105 text-gray-800 hover:text-gray-600"
                  >
                    {category.name.toUpperCase()}
                  </Link>

                  {/* COMPACT DROPDOWN */}
                  {activeCategory === category.name && (
                    <div 
                      className="fixed left-0 right-0 top-[130px] bg-white shadow-2xl border-t border-gray-100 py-8 z-[60]"
                      onMouseEnter={() => setActiveCategory(category.name)}
                      onMouseLeave={() => setActiveCategory(null)}
                    >
                      <div className="w-[95%] sm:w-[90%] mx-auto max-w-5xl">
                        <div className="grid grid-cols-5 gap-6">
                          {category.dropdown.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="space-y-2">
                              {/* Section Title */}
                              <h3 className="text-gray-900 text-[13px] font-semibold tracking-wide uppercase mb-1">
                                {section.title}
                              </h3>
                              
                              {/* Section Items */}
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
                        
                        {/* View All Button */}
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
      </div>

      {/* AUTH MODAL */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  )
}