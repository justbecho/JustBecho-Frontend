'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo, Suspense, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AuthModal from '@/components/ui/AuthModal'

// Main content ko alag component mein rakho
function HomeContent() {
  const router = useRouter()
  const [testimonialStart, setTestimonialStart] = useState(0)
  const [categoryProducts, setCategoryProducts] = useState({})
  const [loading, setLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [categoriesFromBackend, setCategoriesFromBackend] = useState([])
  const [allCategoriesFromBackend, setAllCategoriesFromBackend] = useState([])
  
  // ✅ NEW: Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // ✅ Carousel states
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const carouselIntervalRef = useRef(null)

  // ✅ UPDATED: All brands combined into single array for unified carousel
  const allBrands = useMemo(() => [
    { name: "Balenciaga", logo: "/brandslogo/mens-fashion/Balenciaga.png", fallback: "/brands/Balenciaga.png", category: "Men's Fashion" },
    { name: "Armani", logo: "/brandslogo/mens-fashion/Armani.png", fallback: "/brands/armani.png", category: "Men's Fashion" },
    { name: "Prada", logo: "/brandslogo/mens-fashion/Prada.png", fallback: "/brands/prada.png", category: "Men's Fashion" },
    { name: "Versace", logo: "/brandslogo/mens-fashion/Versace.png", fallback: "/brands/versace.png", category: "Men's Fashion" },
    { name: "Louis Vuitton", logo: "/brandslogo/mens-fashion/Louis Vuitton.png", fallback: "/brands/louis-vuiton.png", category: "Men's Fashion" },
    { name: "Gucci", logo: "/brandslogo/mens-fashion/Gucci.png", fallback: "/brands/gucci.png", category: "Men's Fashion" },
    { name: "Burberry", logo: "/brandslogo/mens-fashion/Burberry.png", fallback: "/brands/burberry.png", category: "Men's Fashion" },
    { name: "Fendi", logo: "/brandslogo/mens-fashion/Fendi.png", fallback: "/brands/fendi.png", category: "Men's Fashion" },
    
    // Women's Fashion brands
    { name: "Balenciaga", logo: "/brandslogo/womens-fashion/Balenciaga.png", fallback: "/brands/Balenciaga.png", category: "Women's Fashion" },
    { name: "Dior", logo: "/brandslogo/womens-fashion/Dior.png", fallback: "/brands/dior.png", category: "Women's Fashion" },
    { name: "Chanel", logo: "/brandslogo/womens-fashion/Chanel.png", fallback: "/brands/chanel.png", category: "Women's Fashion" },
    { name: "Louis Vuitton", logo: "/brandslogo/womens-fashion/Louis Vuitton.png", fallback: "/brands/louis-vuiton.png", category: "Women's Fashion" },
    { name: "Gucci", logo: "/brandslogo/womens-fashion/Gucci.png", fallback: "/brands/gucci.png", category: "Women's Fashion" },
    { name: "Givenchy", logo: "/brandslogo/womens-fashion/Givenchy.png", fallback: "/brands/givenchy.png", category: "Women's Fashion" },
    { name: "Dolce & Gabbana", logo: "/brandslogo/womens-fashion/Dolce & Gabbana.png", fallback: "/brands/dolce-gabbana.png", category: "Women's Fashion" },
    
    // Footwear brands
    { name: "Nike", logo: "/brandslogo/footwear/Nike.png", fallback: "/brands/gucci.png", category: "Footwear" },
    { name: "Adidas", logo: "/brandslogo/footwear/Adidas.png", fallback: "/brands/jimmy-choo.png", category: "Footwear" },
    { name: "Puma", logo: "/brandslogo/footwear/Puma.jpg", fallback: "/brands/Balenciaga.png", category: "Footwear" },
    { name: "Converse", logo: "/brandslogo/footwear/Converse.png", fallback: "/brands/Balenciaga.png", category: "Footwear" },
    { name: "Crocs", logo: "/brandslogo/footwear/Crocs.png", fallback: "/brands/jimmy-choo.png", category: "Footwear" },
    { name: "Hoka", logo: "/brandslogo/footwear/Hoka.png", fallback: "/brands/puma.png", category: "Footwear" },
    
    // Accessories brands
    { name: "Cartier", logo: "/brandslogo/Accessories/Cartier.jpg", fallback: "/brands/nike.png", category: "Accessories" },
    { name: "Gucci", logo: "/brandslogo/Accessories/Gucci.png", fallback: "/brands/baggit.png", category: "Accessories" },
    { name: "Prada", logo: "/brandslogo/Accessories/Prada.jpg", fallback: "/brands/baggit.png", category: "Accessories" },
    
    // Watches brands
    { name: "Rolex", logo: "/brandslogo/watches/rolexx.jpeg", fallback: "/brands/baggit.png", category: "Watches" },
    { name: "Omega", logo: "/brandslogo/watches/OMEGA.png", fallback: "/brands/OMEGA.png", category: "Watches" },
    { name: "Armani", logo: "/brandslogo/watches/Armani.png", fallback: "/brands/Armani.png", category: "Watches" },
    
    // Perfumes brands
    { name: "Chanel", logo: "/brandslogo/perfumes/Chanel.png", fallback: "/brands/baggit.png", category: "Perfumes" },
    { name: "Dior", logo: "/brandslogo/perfumes/Dior.png", fallback: "/brands/ray-ban.png", category: "Perfumes" },
    { name: "Gucci", logo: "/brandslogo/perfumes/Gucci.png", fallback: "/brands/baggit.png", category: "Perfumes" },
    
    // Toys & Collectibles
    { name: "Bearbrick", logo: "/brandslogo/toys/Bearbrick.png", fallback: "/brands/Bearbrick.png", category: "TOYS & COLLECTIBLES" },
    { name: "KAWS", logo: "/brandslogo/toys/KAWS.png", fallback: "/brands/ray-ban.png", category: "TOYS & COLLECTIBLES" },
    
    // Kid's Fashion
    { name: "Pokemon", logo: "/brandslogo/toys/Pokemon.png", fallback: "/brands/wildhorn.jpg", category: "KID'S FASHION" }
  ], [])

  // ✅ Category images mapping for carousel
  const categoryImages = useMemo(() => ({
    "Men's Fashion": "/banners/mens new.jpeg",
    "Women's Fashion": "/banners/womens new.png", 
    "Footwear": "/banners/footwear new.png",
    "Accessories": "/banners/accessories new.png",
    "Watches": "/banners/watches new.png", 
    "Perfumes": "/banners/perfumes new.png",
    "TOYS & COLLECTIBLES": "/banners/Toys and Figurines.png",
    "KID'S FASHION": "/banners/kids new.png",
    "INFLUENCER": "/banners/default.jpg",
    "default": "/banners/default.jpg"
  }), [])

  // ✅ UPDATED: SIMPLE MARQUEE - FIXED ALL BRANDS DISPLAY
  const BrandMarquee = () => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const animationRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    
    // Duplicate brands for seamless loop
    const duplicatedBrands = useMemo(() => {
      return [...allBrands, ...allBrands, ...allBrands];
    }, [allBrands]);
    
    // Start animation
    useEffect(() => {
      const animate = () => {
        if (!contentRef.current || isHovered) return;
        
        // Move content left by 1px
        const currentTransform = contentRef.current.style.transform || 'translateX(0px)';
        const currentX = parseInt(currentTransform.replace('translateX(', '').replace('px)', '')) || 0;
        
        // Reset when fully scrolled
        const contentWidth = contentRef.current.scrollWidth / 3; // Divide by 3 because we have 3 copies
        if (Math.abs(currentX) >= contentWidth) {
          contentRef.current.style.transform = 'translateX(0px)';
        } else {
          contentRef.current.style.transform = `translateX(${currentX - 1}px)`;
        }
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      // Start animation
      animationRef.current = requestAnimationFrame(animate);
      
      // Cleanup
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [isHovered]);
    
    const handleMouseEnter = () => {
      setIsHovered(true);
    };
    
    const handleMouseLeave = () => {
      setIsHovered(false);
    };
    
    const handleTouchStart = () => {
      setIsHovered(true);
    };
    
    const handleTouchEnd = () => {
      setTimeout(() => {
        setIsHovered(false);
      }, 100);
    };
    
    return (
      <div 
        className="marquee-container w-full overflow-hidden py-4 sm:py-6"
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="marquee-content flex items-center"
          ref={contentRef}
          style={{ 
            width: 'fit-content',
            willChange: 'transform',
            transition: isHovered ? 'transform 0.3s ease' : 'none'
          }}
        >
          {duplicatedBrands.map((brand, idx) => (
            <div 
              key={`${brand.name}-${idx}`} 
              className="flex-shrink-0 px-4 sm:px-6 md:px-8"
            >
              <div className="relative h-12 w-28 sm:h-14 sm:w-32 md:h-16 md:w-36 flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-full max-w-full w-auto h-auto object-contain transition-all duration-300 grayscale hover:grayscale-0 opacity-80 hover:opacity-100"
                  onError={(e) => {
                    e.target.src = brand.fallback || '/images/placeholder.jpg';
                  }}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ✅ Carousel slides from categories
  const carouselSlides = useMemo(() => {
    if (allCategoriesFromBackend.length > 0) {
      return allCategoriesFromBackend.slice(0, 6).map(cat => ({
        image: cat.image,
        title: cat.name,
        description: `Explore luxury ${cat.name.toLowerCase()}`,
        href: cat.href
      }))
    }
    return [
      {
        image: "/banners/Mens new.png",
        title: "Men's Fashion",
        description: "Discover premium men's fashion",
        href: "/categories/men"
      },
      {
        image: "/banners/womens new.png",
        title: "Women's Fashion",
        description: "Explore luxury women's collections",
        href: "/categories/women"
      },
      {
        image: "/banners/footwear new.png",
        title: "Footwear",
        description: "Step into luxury footwear",
        href: "/categories/footwear"
      },
      {
        image: "/banners/accessories new.png",
        title: "Accessories",
        description: "Complete your look with accessories",
        href: "/categories/accessories"
      },
      {
        image: "/banners/watches new.png",
        title: "Watches",
        description: "Timeless luxury timepieces",
        href: "/categories/watches"
      },
      {
        image: "/banners/perfumes new.png",
        title: "Perfumes",
        description: "Signature scents and fragrances",
        href: "/categories/perfumes"
      }
    ]
  }, [allCategoriesFromBackend])

  // ✅ UPDATED: Featured Collections for budget-based filtering
  const featuredCollections = useMemo(() => [
    {
      title: "PRODUCTS UNDER ₹20K",
      image: "/banners/mens new.jpeg",
      href: "/shop?budget=under-20k",
      filter: "under-20k"
    },
    {
      title: "PRODUCTS UNDER ₹40K",
      image: "/banners/womens new.png",
      href: "/shop?budget=under-40k",
      filter: "under-40k"
    },
    {
      title: "PRODUCTS UNDER ₹60K",
      image: "/banners/footwear new.png",
      href: "/shop?budget=under-60k",
      filter: "under-60k"
    }
  ], [])

  // How It Works Steps
  const howItWorks = useMemo(() => [
    {
      step: "01",
      title: "LIST YOUR ITEM",
      description: "Sellers list luxury items with detailed photos and descriptions",
      icon: "📱"
    },
    {
      step: "02",
      title: "SECURE PAYMENT",
      description: "Buyers place orders with 100% secure advance payment",
      icon: "💳"
    },
    {
      step: "03",
      title: "DISPATCH TO US",
      description: "Seller ships to our authentication center with video proof",
      icon: "📦"
    },
    {
      step: "04",
      title: "AUTHENTICATION",
      description: "Our experts verify product authenticity and condition (Only with BECHO PROTECT)",
      icon: "🔍"
    },
    {
      step: "05",
      title: "DELIVER WITH TRUST",
      description: "We ship with authenticity certificate to the buyer",
      icon: "✅"
    }
  ], [])

  // Why Choose Us features
  const features = useMemo(() => [
    {
      icon: "🛡️",
      title: "AUTHENTICITY GUARANTEED",
      description: "Every product verified by luxury experts (Only with BECHO PROTECT)"
    },
    {
      icon: "💎",
      title: "PREMIUM QUALITY",
      description: "Only genuine luxury items"
    },
    {
      icon: "🔒",
      title: "SECURE TRANSACTIONS",
      description: "100% safe and encrypted payments"
    },
    {
      icon: "🚚",
      title: "WHITE GLOVE DELIVERY",
      description: "Premium packaging and insured shipping"
    }
  ], [])

  // Testimonials
  const testimonials = useMemo(() => [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      comment: "Sold my Chanel bag effortlessly! The authentication process was smooth and payment was instant after verification.",
      role: "Luxury Seller",
      rating: 5
    },
    {
      name: "Rahul Mehta",
      location: "Delhi",
      comment: "Bought a Rolex watch. The authenticity certificate gave me complete confidence. Amazing service!",
      role: "Watch Collector",
      rating: 5
    },
    {
      name: "Ananya Patel",
      location: "Bangalore",
      comment: "As both buyer and seller, Just Becho's managed process makes luxury trading completely secure.",
      role: "Fashion Influencer",
      rating: 5
    },
    {
      name: "Vikram Singh",
      location: "Chennai",
      comment: "The white glove delivery and premium packaging made my luxury shopping experience exceptional.",
      role: "Business Executive",
      rating: 5
    },
    {
      name: "Sneha Reddy",
      location: "Hyderabad",
      comment: "Quick verification process and instant payment. Best platform for selling luxury items safely.",
      role: "Luxury Enthusiast",
      rating: 5
    }
  ], [])

  // ✅ FIXED: Category to URL slug mapping
  const getCategorySlug = (categoryName) => {
    const slugMap = {
      "Men's Fashion": "men",
      "Women's Fashion": "women", 
      "Footwear": "footwear",
      "Accessories": "accessories",
      "Watches": "watches",
      "Perfumes": "perfumes",
      "PERFUMES": "perfumes",
      "TOYS & COLLECTIBLES": "toys",
      "KID'S FASHION": "kids-fashion",
      "INFLUENCER": "influencer"
    };
    
    return slugMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
  };

  // ✅ FIXED: Category to API category mapping (backend exact names)
  const getApiCategory = (categoryName) => {
    const apiMap = {
      "Men's Fashion": "Men",
      "Women's Fashion": "Women",
      "Footwear": "Footwear",
      "Accessories": "Accessories", 
      "Watches": "Watches",
      "Perfumes": "Perfumes",
      "PERFUMES": "Perfumes",
      "TOYS & COLLECTIBLES": "Toys",
      "KID'S FASHION": "Kids",
      "INFLUENCER": "Influencer"
    };
    
    return apiMap[categoryName] || categoryName;
  };

  // ✅ Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        setIsLoggedIn(!!(token && user))
      }
    }

    checkLoginStatus()
    window.addEventListener('authChange', checkLoginStatus)
    window.addEventListener('storage', checkLoginStatus)

    return () => {
      window.removeEventListener('authChange', checkLoginStatus)
      window.removeEventListener('storage', checkLoginStatus)
    }
  }, [])

  // ✅ Handle Sell Now Click
  const handleSellNowClick = (e) => {
    e.preventDefault()
    
    if (isLoggedIn) {
      router.push('/sell-now')
    } else {
      setShowAuthModal(true)
    }
  }

  // ✅ Handle Budget Filter Click
  const handleBudgetFilterClick = (filterType) => {
    router.push(`/shop?budget=${filterType}`)
  }

  // ✅ Carousel functions - TRANSITION SPEED INCREASED
  const nextSlide = () => {
    if (isTransitioning || carouselSlides.length === 0) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
      setIsTransitioning(false);
    }, 300);
  }

  const prevSlide = () => {
    if (isTransitioning || carouselSlides.length === 0) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
      setIsTransitioning(false);
    }, 300);
  }

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide || carouselSlides.length === 0) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 200);
  }

  // ✅ Start carousel auto-play - AUTO-PLAY INTERVAL DECREASED
  useEffect(() => {
    if (carouselSlides.length > 1) {
      carouselIntervalRef.current = setInterval(() => {
        nextSlide();
      }, 3000);
    }
    
    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, [carouselSlides.length, currentSlide])

  // ✅ Helper function to get category image
  const getCategoryImage = (categoryName) => {
    if (!categoryName) {
      return categoryImages["default"];
    }
    
    if (categoryImages[categoryName]) {
      return categoryImages[categoryName];
    }
    
    const capitalized = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    if (categoryImages[capitalized]) {
      return categoryImages[capitalized];
    }
    
    const normalizedInput = categoryName.toLowerCase();
    for (const [key, value] of Object.entries(categoryImages)) {
      if (key.toLowerCase() === normalizedInput) {
        return value;
      }
    }
    
    return categoryImages["default"];
  }

  // ✅ FIXED: Fetch categories and brands from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // ✅ Fetch categories
        const categoriesResponse = await fetch('https://just-becho-backend.vercel.app/api/categories')
        
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          
          if (categoriesData.success && categoriesData.categories) {
            const formattedCategories = categoriesData.categories.map(cat => {
              const categoryName = cat.name || '';
              
              const displayName = categoryName.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
              
              const imagePath = getCategoryImage(categoryName);
              
              const urlSlug = getCategorySlug(displayName);
              const apiCategory = getApiCategory(displayName);
              
              return {
                name: displayName,
                originalName: categoryName,
                href: `/categories/${urlSlug}`,
                apiCategory: apiCategory,
                image: imagePath
              }
            })
            
            // ✅ 1. For Explore Categories: Show all categories EXCEPT INFLUENCER
            const allCategoriesExceptInfluencer = formattedCategories.filter(cat => 
              cat.name !== "INFLUENCER"
            );
            setAllCategoriesFromBackend(allCategoriesExceptInfluencer);
            
            // ✅ 2. For Product by Category: Only show Men's Fashion, Women's Fashion, and Footwear
            const allowedCategories = ["Men's Fashion", "Women's Fashion", "Footwear"];
            const filteredCategories = formattedCategories.filter(cat => 
              allowedCategories.includes(cat.name)
            );
            setCategoriesFromBackend(filteredCategories);
            
            // Fetch products for filtered categories only
            const productsByCategory = {}
            
            for (const category of filteredCategories) {
              try {
                if (category.apiCategory) {
                  const apiUrl = `https://just-becho-backend.vercel.app/api/products?category=${encodeURIComponent(category.apiCategory)}&limit=4`
                  
                  const response = await fetch(apiUrl)
                  
                  if (response.ok) {
                    const data = await response.json()
                    
                    if (data.success && data.products) {
                      productsByCategory[category.name] = data.products.slice(0, 4)
                    } else {
                      productsByCategory[category.name] = []
                    }
                  } else {
                    productsByCategory[category.name] = []
                  }
                }
              } catch (error) {
                console.error(`Error fetching products for ${category.name}:`, error)
                productsByCategory[category.name] = []
              }
            }
            
            setCategoryProducts(productsByCategory)
          } else {
            setAllCategoriesFromBackend([])
            setCategoriesFromBackend([])
          }
        } else {
          setAllCategoriesFromBackend([])
          setCategoriesFromBackend([])
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error)
        setAllCategoriesFromBackend([])
        setCategoriesFromBackend([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const nextTestimonials = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTestimonialStart(prev => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  }

  const prevTestimonials = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTestimonialStart(prev => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  }

  const visibleTestimonials = [
    testimonials[testimonialStart],
    testimonials[(testimonialStart + 1) % testimonials.length],
    testimonials[(testimonialStart + 2) % testimonials.length],
    testimonials[(testimonialStart + 3) % testimonials.length],
    testimonials[(testimonialStart + 4) % testimonials.length]
  ]

  // ✅ Product card render function
  const renderProductCard = (product) => {
    if (!product || !product._id) return null;
    
    const productName = product.productName || 'Product';
    const safeProductName = typeof productName === 'string' ? productName : 'Product';
    const safeCondition = product.condition && typeof product.condition === 'string' ? product.condition : '';
    const primaryImage = product.images?.[0]?.url || '/images/placeholder.jpg';
    
    return (
      <Link 
        href={`/products/${product._id}`}
        key={product._id}
        className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-300 block product-card tap-highlight"
      >
        <div className="relative w-full aspect-square overflow-hidden mb-2 sm:mb-3 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
          <Image
            src={primaryImage}
            alt={safeProductName}
            fill
            className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
              e.target.onerror = null;
            }}
          />
          {safeCondition && (
            <div className="absolute top-2 left-2 z-10">
              <span className="text-gray-900 text-xs font-light tracking-widest uppercase bg-white px-2 py-1 rounded-full">
                {safeCondition.toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="text-left px-1">
          <h3 className="text-gray-800 text-xs sm:text-sm font-light tracking-widest uppercase mb-1 line-clamp-2">
            {safeProductName.toUpperCase()}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-gray-900 text-sm sm:text-base font-light tracking-widest uppercase">
              ₹{product.finalPrice?.toLocaleString() || '0'}
            </p>
          </div>
          {product.originalPrice && product.originalPrice > product.finalPrice && (
            <p className="text-gray-500 text-xs sm:text-sm line-through">
              ₹{product.originalPrice.toLocaleString()}
            </p>
          )}
        </div>
      </Link>
    )
  }

  return (
    <>
      <Header />
      
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
      
      <div className="bg-white">
        {/* ✅ 1. Header ke baad reduced gap - Pahle 24 thi, ab 16 kar di */}
        <div className="pt-16"></div>
        
        {/* ✅ 2. Home Banner - FIXED: Mobile scroll pe enlarge issue solve kiya */}
        <section className="relative h-[85vh] md:h-screen overflow-hidden md:mt-20">
          <div 
            className="absolute inset-0 z-0"
            onMouseEnter={() => carouselIntervalRef.current && clearInterval(carouselIntervalRef.current)}
            onMouseLeave={() => {
              if (carouselSlides.length > 1) {
                carouselIntervalRef.current = setInterval(() => nextSlide(), 3000);
              }
            }}
          >
            <div className={`absolute inset-0 ${isTransitioning ? 'carousel-fade-out' : 'carousel-fade-in'}`}>
              <Image
                src={carouselSlides[currentSlide]?.image || "/banners/Men_s Fashion.png"}
                alt={carouselSlides[currentSlide]?.title || "Just Becho"}
                fill
                className="object-cover object-center"
                priority
                sizes="100vw"
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                onError={(e) => {
                  e.target.src = '/images/hero-placeholder.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black/30"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 z-10">
                <div className={`transform transition-all duration-700 ${isTransitioning ? 'translate-x-[-100%] opacity-0' : 'translate-x-0 opacity-100'} text-center`}>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-widest uppercase mb-4 sm:mb-6 md:mb-8">
                    {carouselSlides[currentSlide]?.title || "JUST BECHO"}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-widest uppercase mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto px-4">
                    {carouselSlides[currentSlide]?.description || "Luxury Reborn • Trust Redefined"}
                  </p>
                  <Link
                    href={carouselSlides[currentSlide]?.href || "/products"}
                    className="bg-white text-gray-900 font-light tracking-widest uppercase hover:bg-gray-100 transition-all duration-300 rounded-full inline-block px-10 py-4 sm:px-12 sm:py-5 text-base sm:text-lg shadow-lg hover:shadow-xl"
                  >
                    EXPLORE NOW
                  </Link>
                </div>
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 sm:left-6 md:left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group mobile-hidden sm:flex w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-4 sm:right-6 md:right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group mobile-hidden sm:flex w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="absolute bottom-6 sm:bottom-10 md:bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ✅ 3. Brand Carousel - FIXED: Simple smooth marquee */}
        <section className="py-10 sm:py-12 bg-gray-100 border-t border-gray-200">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-gray-900 text-xl sm:text-2xl md:text-3xl font-light tracking-widest uppercase">
                POPULAR BRANDS IN JUST BECHO
              </h2>
              <p className="text-gray-600 text-sm sm:text-base font-light mt-1 sm:mt-2">
                Explore luxury brands across all categories
              </p>
            </div>

            <BrandMarquee />
          </div>
        </section>

        {/* ✅ 4. How It Works (after brand carousel) */}
        <section className="py-10 sm:py-16 bg-white section-padding safe-area-padding">
          <div className="max-w-[1700px] mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-widest uppercase mb-2 sm:mb-3">
                HOW IT WORKS
              </h2>
              <p className="text-gray-600 text-sm sm:text-base font-light max-w-2xl mx-auto">
                Experience seamless luxury trading with our managed marketplace
              </p>
            </div>

            <div className="relative">
              <div className="absolute top-16 sm:top-20 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-gray-200 hidden lg:block"></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-4 lg:gap-4 how-it-works-grid">
                {howItWorks.map((step, index) => (
                  <div key={index} className="text-center relative group">
                    <div className="relative mb-4 sm:mb-6">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-white border-2 border-gray-900 flex items-center justify-center group-hover:bg-gray-900 group-hover:scale-110 transition-all duration-500 z-10 relative">
                        <span className="text-gray-900 text-lg sm:text-xl group-hover:text-white transition-colors duration-500">{step.icon}</span>
                      </div>
                    </div>

                    <div className="px-1 sm:px-2">
                      <h3 className="text-gray-900 text-xs sm:text-sm font-light tracking-widest uppercase mb-1 sm:mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-xs font-light leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ✅ 5. Explore Categories - सभी categories दिखाएंगे (सिर्फ Influencer को छोड़कर) */}
        <section className="py-10 sm:py-16 bg-gray-50 section-padding safe-area-padding">
          <div className="max-w-[1700px] mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-widest uppercase">
                EXPLORE CATEGORIES
              </h2>
              <p className="text-gray-900 text-sm sm:text-base md:text-lg font-light tracking-widest uppercase mt-2 sm:mt-3">
                DISCOVER LUXURY ITEMS
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 sm:gap-6 md:gap-8 lg:gap-10 category-grid">
                {[...Array(7)].map((_, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-40 xl:h-40 rounded-full bg-gray-200 animate-pulse category-image"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mt-3 sm:mt-4"></div>
                  </div>
                ))}
              </div>
            ) : allCategoriesFromBackend.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 sm:gap-6 md:gap-8 lg:gap-10 category-grid">
                {allCategoriesFromBackend.slice(0, 7).map((cat, index) => (
                  <div
                    key={index}
                    className="group flex flex-col items-center text-center transition-all duration-500 transform hover:-translate-y-2 cursor-pointer tap-highlight"
                    onClick={() => router.push(cat.href)}
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-40 xl:h-40 rounded-full overflow-hidden shadow-lg sm:shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 category-image">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, (max-width: 1280px) 128px, 160px"
                        onError={(e) => e.target.src = '/images/category-placeholder.jpg'}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
                    </div>
                    <h3 className="text-gray-900 text-xs font-light tracking-widest uppercase mt-3 sm:mt-4 md:mt-6 leading-tight">
                      {cat.name.toUpperCase()}
                    </h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 text-base sm:text-lg">No categories available yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* ✅ 6. Featured Collections (Budget-based) */}
        <section className="py-10 sm:py-16 bg-white section-padding safe-area-padding">
          <div className="max-w-[1700px] mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-widest uppercase">
                SHOP BY BUDGET
              </h2>
              <p className="text-gray-900 text-sm sm:text-base md:text-lg font-light tracking-widest uppercase mt-2 sm:mt-3">
                FIND LUXURY ITEMS WITHIN YOUR BUDGET
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 featured-collections-grid">
              {featuredCollections.map((collection, index) => (
                <div
                  key={index}
                  onClick={() => handleBudgetFilterClick(collection.filter)}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer tap-highlight"
                >
                  <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 w-full">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-light tracking-widest uppercase mb-1 sm:mb-2">
                        {collection.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-light opacity-90">
                        {collection.description}
                      </p>
                      <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm font-light tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span>View Products</span>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ 7. Category-wise Products - सिर्फ 3 CATEGORIES (Men's, Women's, Footwear) */}
        {categoriesFromBackend.map((category, index) => {
          const products = categoryProducts[category.name] || [];

          return (
            <div key={category.name || index}>
              <section className="py-10 sm:py-16 bg-white border-t border-gray-100 section-padding safe-area-padding">
                <div className="max-w-[1700px] mx-auto">
                  <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-widest uppercase">
                      {category.name.toUpperCase()}
                    </h2>
                    <p className="text-gray-900 text-sm sm:text-base md:text-lg font-light tracking-widest uppercase mt-2 sm:mt-3">
                      EXPLORE OUR CURATED {category.name.toUpperCase()} COLLECTION
                    </p>
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="w-full aspect-square bg-gray-200 rounded-lg mb-2 sm:mb-3"></div>
                          <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1 sm:mb-2"></div>
                          <div className="h-4 sm:h-6 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                      {products.map(renderProductCard)}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <p className="text-gray-500 text-base sm:text-lg">No products available in this category yet.</p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">Be the first to list a product!</p>
                    </div>
                  )}

                  <div className="text-center mt-8 sm:mt-12">
                    <button
                      onClick={() => router.push(category.href)}
                      className="border border-black text-black font-light tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-500 px-8 py-3 rounded-none"
                    >
                      → VIEW ALL {category.name.toUpperCase()}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )
        })}

        {/* Testimonials Section */}
        <section className="py-10 sm:py-16 bg-gray-50 section-padding safe-area-padding">
          <div className="max-w-[1800px] mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-widest uppercase mb-2 sm:mb-3">
                VOICES OF TRUST
              </h2>
              <p className="text-gray-900 text-sm sm:text-base md:text-lg font-light tracking-widest uppercase mt-1 sm:mt-2">
                DISCOVER WHY THOUSANDS CHOOSE JUST BECHO
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center justify-center w-12 sm:w-16 mobile-hidden sm:flex">
                <button
                  onClick={prevTestimonials}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 border border-gray-200 z-10 hover:bg-gray-50 group"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center justify-center w-12 sm:w-16 mobile-hidden sm:flex">
                <button
                  onClick={nextTestimonials}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 border border-gray-200 z-10 hover:bg-gray-50 group"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="mx-0 sm:mx-12 lg:mx-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 testimonials-grid">
                  {visibleTestimonials.map((testimonial, index) => (
                    <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200/50 group hover:border-gray-300 h-auto sm:h-80 flex flex-col relative overflow-hidden hover:transform hover:-translate-y-1 cursor-pointer testimonial-card tap-highlight">
                      <div className="absolute top-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-900 to-gray-700 group-hover:w-full transition-all duration-500"></div>
                      <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-bl from-gray-100 to-transparent rounded-full -translate-y-8 sm:-translate-y-10 translatex-8 sm:translatex-10 opacity-50"></div>

                      <div className="flex-1 flex flex-col justify-between relative z-10">
                        <div>
                          <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <span key={i} className="text-yellow-500 text-xs sm:text-sm mr-0.5 sm:mr-1 drop-shadow-sm">★</span>
                              ))}
                            </div>
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[8px] sm:text-[9px] font-light tracking-widest uppercase px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                              Verified
                            </div>
                          </div>

                          <p className="text-gray-700 mb-2 sm:mb-3 leading-relaxed text-xs sm:text-[13px] font-light line-clamp-4 tracking-wide">
                            "{testimonial.comment}"
                          </p>
                        </div>

                        <div className="flex items-center pt-2 sm:pt-3 border-t border-gray-200/50">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-light text-sm sm:text-base mr-2 sm:mr-3 shadow-md">
                            {testimonial.name?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 text-xs sm:text-sm font-light tracking-wide mb-0.5">{testimonial.name || 'User'}</h4>
                            <p className="text-gray-600 text-xs font-light">{testimonial.location || 'India'}</p>
                            <div className="mt-0.5 sm:mt-1">
                              <span className="inline-block bg-gray-200/70 text-gray-700 text-[8px] sm:text-[9px] font-light tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full">
                                {testimonial.role || 'Customer'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mt-6 sm:mt-8 space-x-1.5 sm:space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setTestimonialStart(index)}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${index === testimonialStart ? 'bg-gray-900 scale-125 shadow-md' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ✅ 1. Why Choose Just Becho (moved to just before footer) */}
        <section className="py-10 sm:py-16 bg-white section-padding safe-area-padding">
          <div className="max-w-[1700px] mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-widest uppercase mb-2 sm:mb-3">
                WHY CHOOSE JUST BECHO
              </h2>
              <p className="text-gray-600 text-sm sm:text-base font-light max-w-2xl mx-auto">
                Experience luxury redefined with our curated collection of luxury items
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-full bg-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-lg sm:text-xl font-light">{feature.icon}</span>
                  </div>
                  <h3 className="text-gray-900 text-sm sm:text-base font-light tracking-widest uppercase mb-1 sm:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed px-2">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 sm:py-16 bg-gray-900 text-white section-padding safe-area-padding">
          <div className="max-w-[1700px] mx-auto text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light tracking-widest uppercase mb-3 sm:mb-4">
              READY TO EXPERIENCE SECURE LUXURY TRADING?
            </h2>
            <p className="text-sm sm:text-base md:text-lg font-light tracking-widest uppercase mb-4 sm:mb-6 opacity-90 max-w-2xl mx-auto">
              Join India's most trusted managed marketplace for pre-loved and brand new luxury
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <button
                onClick={handleSellNowClick}
                className="border border-white text-white font-light tracking-widest uppercase hover:bg-white hover:text-gray-900 transition-all duration-300 rounded-full px-6 py-3"
              >
                SELL WITH CONFIDENCE
              </button>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  )
}

// ✅ Main component with Suspense wrapper
export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Just Becho...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}