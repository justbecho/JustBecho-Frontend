"use client"

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo, Suspense } from 'react'
import { useRouter } from 'next/navigation'

// ✅ Dynamic export add karo (Netlify ke liye important)
export const dynamic = 'force-dynamic'

// Main content ko alag component mein rakho
function HomeContent() {
  const router = useRouter()
  const [testimonialStart, setTestimonialStart] = useState(0)
  const [categoryProducts, setCategoryProducts] = useState({})
  const [loading, setLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  // ✅ FIXED: Home page should always show homepage content
  // Removed auth check that was causing redirect to /login
  
  // ✅ FIXED: Brand logos ke liye default images ka fallback rakho
  const getBrandLogo = (brandName, category) => {
    // Agar brand logo nahi hai to default image use karo
    const logoPath = `/brandslogo/${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}/${brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
    return logoPath;
  }

  // ✅ FIXED: Updated categoryBrands with safer approach
  const categoryBrands = useMemo(() => ({
    "Men's Fashion": [
      { name: "Balenciaga", logo: "/brandslogo/mens-fashion/balenciaga.png", fallback: "/brands/balenciaga.png" },
      { name: "Armani", logo: "/brandslogo/mens-fashion/armani.png", fallback: "/brands/armani.png" },
      { name: "Prada", logo: "/brandslogo/mens-fashion/prada.png", fallback: "/brands/prada.png" },
      { name: "Versace", logo: "/brandslogo/mens-fashion/versace.png", fallback: "/brands/versace.png" },
      { name: "Louis Vuitton", logo: "/brandslogo/mens-fashion/louis-vuitton.png", fallback: "/brands/louis-vuitton.png" },
      { name: "Gucci", logo: "/brandslogo/mens-fashion/gucci.png", fallback: "/brands/gucci.png" },
      { name: "Burberry", logo: "/brandslogo/mens-fashion/burberry.png", fallback: "/brands/burberry.png" },
      { name: "Fendi", logo: "/brandslogo/mens-fashion/fendi.png", fallback: "/brands/fendi.png" }
    ],
    "Women's Fashion": [
      { name: "Balenciaga", logo: "/brandslogo/womens-fashion/balenciaga.png", fallback: "/brands/balenciaga.png" },
      { name: "Dior", logo: "/brandslogo/womens-fashion/dior.png", fallback: "/brands/dior.png" },
      { name: "Chanel", logo: "/brandslogo/womens-fashion/chanel.png", fallback: "/brands/chanel.png" },
      { name: "Louis Vuitton", logo: "/brandslogo/womens-fashion/louis-vuitton.png", fallback: "/brands/louis-vuitton.png" },
      { name: "Gucci", logo: "/brandslogo/womens-fashion/gucci.png", fallback: "/brands/gucci.png" },
      { name: "Givenchy", logo: "/brandslogo/womens-fashion/givenchy.png", fallback: "/brands/givenchy.png" },
      { name: "Dolce & Gabbana", logo: "/brandslogo/womens-fashion/dolce-gabbana.png", fallback: "/brands/dolce-gabbana.png" }
    ],
    "Footwear": [
      { name: "Balenciaga", logo: "/brandslogo/footwear/Acne-Studios.jpg", fallback: "/brands/balenciaga.png" },
      { name: "Jimmy Choo", logo: "/brandslogo/footwear/Adidias.png", fallback: "/brands/jimmy-choo.png" },
      { name: "Prada", logo: "/brandslogo/footwear/Air-Jordan.png", fallback: "/brands/prada.png" },
      { name: "Puma", logo: "/brandslogo/footwear/ALAIA.jpg", fallback: "/brands/puma.png" },
      { name: "Gucci", logo: "/brandslogo/footwear/Alexander-McQueen.jpg", fallback: "/brands/gucci.png" },
      { name: "Reebok", logo: "/brandslogo/footwear/Alo-Yoga.png", fallback: "/brands/reebok.png" },
      { name: "Balenciaga", logo: "/brandslogo/footwear/Acne-Studios.jpg", fallback: "/brands/balenciaga.png" },
      { name: "Jimmy Choo", logo: "/brandslogo/footwear/Adidias.png", fallback: "/brands/jimmy-choo.png" },
      { name: "Prada", logo: "/brandslogo/footwear/Air-Jordan.png", fallback: "/brands/prada.png" },
      { name: "Puma", logo: "/brandslogo/footwear/ALAIA.jpg", fallback: "/brands/puma.png" },
      { name: "Gucci", logo: "/brandslogo/footwear/Alexander-McQueen.jpg", fallback: "/brands/gucci.png" },
      { name: "Reebok", logo: "/brandslogo/footwear/Alo-Yoga.png", fallback: "/brands/reebok.png" },
      { name: "Balenciaga", logo: "/brandslogo/footwear/Altra Running.png", fallback: "/brands/balenciaga.png" },
      { name: "Jimmy Choo", logo: "/brandslogo/footwear/Amiri.jpg", fallback: "/brands/jimmy-choo.png" },
      { name: "Prada", logo: "/brandslogo/footwear/ANTA.jpg", fallback: "/brands/prada.png" },
      { name: "Puma", logo: "/brandslogo/footwear/Armani.png", fallback: "/brands/puma.png" },
      { name: "Gucci", logo: "/brandslogo/footwear/Balenciaga.jpg", fallback: "/brands/gucci.png" },
      { name: "Reebok", logo: "/brandslogo/footwear/BALLY.png", fallback: "/brands/reebok.png" },
      { name: "Balenciaga", logo: "/brandslogo/footwear/BALMAIN.png", fallback: "/brands/balenciaga.png" },
      { name: "Jimmy Choo", logo: "/brandslogo/footwear/BAPE.jpg", fallback: "/brands/jimmy-choo.png" },
      { name: "Prada", logo: "/brandslogo/footwear/Burberry.jpg", fallback: "/brands/prada.png" },
      { name: "Puma", logo: "/brandslogo/footwear/Calvin Klein.png", fallback: "/brands/puma.png" },
      { name: "Gucci", logo: "/brandslogo/footwear/Chloe.png", fallback: "/brands/gucci.png" },
      { name: "Reebok", logo: "/brandslogo/footwear/Coach.jpg", fallback: "/brands/reebok.png" },
      { name: "Balenciaga", logo: "/brandslogo/footwear/Converse.jpg", fallback: "/brands/balenciaga.png" },
      { name: "Jimmy Choo", logo: "/brandslogo/footwear/Crocs.png", fallback: "/brands/jimmy-choo.png" },
      { name: "Prada", logo: "/brandslogo/footwear/Dior.png", fallback: "/brands/prada.png" },
      { name: "Puma", logo: "/brandslogo/footwear/Hoka.png", fallback: "/brands/puma.png" },
      { name: "Gucci", logo: "/brandslogo/footwear/Nike.png", fallback: "/brands/gucci.png" },
      { name: "Reebok", logo: "/brandslogo/footwear/On.jpg", fallback: "/brands/reebok.png" },
      { name: "Balenciaga", logo: "/brandslogo/footwear/Puma.jpg", fallback: "/brands/balenciaga.png" }
      
    ],
    "Accessories": [
      { name: "Woodland", logo: "/brandslogo/Accessories/Alexander McQueen.jpg", fallback: "/brands/woodland.png" },
      { name: "Baggit", logo: "/brandslogo/Accessories/Apm Monaco.png", fallback: "/brands/baggit.png" },
      { name: "Ray-Ban", logo: "/brandslogo/Accessories/Balenciaga.jpg", fallback: "/brands/ray-ban.png" },
      { name: "Wildhorn", logo: "/brandslogo/Accessories/Buccellati.png", fallback: "/brands/wildhorn.jpg" },
      { name: "Nike", logo: "/brandslogo/Accessories/Cartier.jpg", fallback: "/brands/nike.png" },
      { name: "Woodland", logo: "/brandslogo/Accessories/Chaumet.png", fallback: "/brands/woodland.png" },
      { name: "Baggit", logo: "/brandslogo/Accessories/Chloe.png", fallback: "/brands/baggit.png" },
      { name: "Ray-Ban", logo: "/brandslogo/Accessories/Dior.png", fallback: "/brands/ray-ban.png" },
      { name: "Wildhorn", logo: "/brandslogo/Accessories/Fendi.png", fallback: "/brands/wildhorn.jpg" },
      { name: "Woodland", logo: "/brandslogo/Accessories/FRED.png", fallback: "/brands/woodland.png" },
      { name: "Baggit", logo: "/brandslogo/Accessories/Gucci.png", fallback: "/brands/baggit.png" },
      { name: "Ray-Ban", logo: "/brandslogo/Accessories/Harry Winston.jpg", fallback: "/brands/ray-ban.png" },
      { name: "Wildhorn", logo: "/brandslogo/Accessories/MCM.png", fallback: "/brands/wildhorn.jpg" },
      { name: "Nike", logo: "/brandslogo/Accessories/Messika.png", fallback: "/brands/nike.png" },
      { name: "Woodland", logo: "/brandslogo/Accessories/Miu Miu.png", fallback: "/brands/woodland.png" },
      { name: "Baggit", logo: "/brandslogo/Accessories/Prada.jpg", fallback: "/brands/baggit.png" },
      { name: "Ray-Ban", logo: "/brandslogo/Accessories/Qeelin.png", fallback: "/brands/ray-ban.png" },
      { name: "Wildhorn", logo: "/brandslogo/Accessories/Swaroski.png", fallback: "/brands/wildhorn.jpg" }
    ],
    "Watches": [
      { name: "Woodland", logo: "/brandslogo/watches/Armani.png", fallback: "/brands/woodland.png" },
      { name: "Baggit", logo: "/brandslogo/watches/AUDEMARS PIGUET.png", fallback: "/brands/baggit.png" },
      { name: "Ray-Ban", logo: "/brandslogo/watches/BLANCPAIN.png", fallback: "/brands/ray-ban.png" },
      { name: "Wildhorn", logo: "/brandslogo/watches/BREGUET.png", fallback: "/brands/wildhorn.jpg" },
      { name: "Nike", logo: "/brandslogo/watches/Hamilton.jpg", fallback: "/brands/nike.png" },
      { name: "Woodland", logo: "/brandslogo/watches/Chanel.png", fallback: "/brands/woodland.png" },
      { name: "Baggit", logo: "/brandslogo/watches/CORUM.jpg", fallback: "/brands/baggit.png" },
      { name: "Ray-Ban", logo: "/brandslogo/watches/Dior.png", fallback: "/brands/ray-ban.png" },
      { name: "Wildhorn", logo: "/brandslogo/watches/Fendi.png", fallback: "/brands/wildhorn.jpg" },
      { name: "Woodland", logo: "/brandslogo/watches/Franck Muller.jpg", fallback: "/brands/woodland.png" },
      { name: "Baggit", logo: "/brandslogo/watches/Gucci.png", fallback: "/brands/baggit.png" },
      { name: "Ray-Ban", logo: "/brandslogo/watches/Hermes.jpg", fallback: "/brands/ray-ban.png" },
      { name: "Wildhorn", logo: "/brandslogo/watches/HUBLOT.png", fallback: "/brands/wildhorn.jpg" },
      { name: "Nike", logo: "/brandslogo/watches/LONGINES.jpg", fallback: "/brands/nike.png" },
      { name: "Woodland", logo: "/brandslogo/watches/OMEGA.png", fallback: "/brands/woodland.png" },
      { name: "Baggit", logo: "/brandslogo/watches/CHOPARD.png", fallback: "/brands/baggit.png" }
    ],
    "TOYS & COLLECTIBLES": [
      { name: "Woodland", logo: "/brandslogo/toys/Bearbrick.png", fallback: "/brands/woodland.png" },
      { name: "Baggit", logo: "/brandslogo/toys/JellyCat.jpg", fallback: "/brands/baggit.png" },
      { name: "Ray-Ban", logo: "/brandslogo/toys/KAWS.png", fallback: "/brands/ray-ban.png" },
      { name: "Wildhorn", logo: "/brandslogo/toys/Pokemon.png", fallback: "/brands/wildhorn.jpg" },
      { name: "Nike", logo: "/brandslogo/toys/POP MART.jpg", fallback: "/brands/nike.png" },
      { name: "Woodland", logo: "/brandslogo/toys/Sport Cards.jpg", fallback: "/brands/woodland.png" },
      { name: "Baggit", logo: "/brandslogo/toys/Takashi Murakami.png", fallback: "/brands/baggit.png" },
      { name: "Ray-Ban", logo: "/brandslogo/toys/WWF.png", fallback: "/brands/ray-ban.png" }
    ],
    "PERFUMES": [
      { name: "Woodland", logo: "/brandslogo/perfumes/3CE.jpg", fallback: "/brands/woodland.png" },
      { name: "Baggit", logo: "/brandslogo/perfumes/Anessa.jpg", fallback: "/brands/baggit.png" },
      { name: "Ray-Ban", logo: "/brandslogo/perfumes/Anna Sui.png", fallback: "/brands/ray-ban.png" },
      { name: "Wildhorn", logo: "/brandslogo/perfumes/Armani.png", fallback: "/brands/wildhorn.jpg" },
      { name: "Nike", logo: "/brandslogo/perfumes/Bobbi Brown.png", fallback: "/brands/nike.png" },
      { name: "Woodland", logo: "/brandslogo/perfumes/Bottega Veneta.png", fallback: "/brands/woodland.png" },
      { name: "Baggit", logo: "/brandslogo/perfumes/Burberry.jpg", fallback: "/brands/baggit.png" },
      { name: "Ray-Ban", logo: "/brandslogo/perfumes/Bvlgari.png", fallback: "/brands/ray-ban.png" },
      { name: "Baggit", logo: "/brandslogo/perfumes/Chanel.png", fallback: "/brands/baggit.png" },
      { name: "Ray-Ban", logo: "/brandslogo/perfumes/Clarins.png", fallback: "/brands/ray-ban.png" },
      { name: "Wildhorn", logo: "/brandslogo/perfumes/Cle de Peau.png", fallback: "/brands/wildhorn.jpg" },
      { name: "Nike", logo: "/brandslogo/perfumes/Clinique.png", fallback: "/brands/nike.png" },
      { name: "Woodland", logo: "/brandslogo/perfumes/Cosmo Decorte.png", fallback: "/brands/woodland.png" },
      { name: "Baggit", logo: "/brandslogo/perfumes/Curel.png", fallback: "/brands/baggit.png" },
      { name: "Ray-Ban", logo: "/brandslogo/perfumes/Davidoff.png", fallback: "/brands/ray-ban.png" },
      { name: "Woodland", logo: "/brandslogo/perfumes/FANCL.png", fallback: "/brands/woodland.png" },
      { name: "Baggit", logo: "/brandslogo/perfumes/Filorga.png", fallback: "/brands/baggit.png" },
      { name: "Ray-Ban", logo: "/brandslogo/perfumes/Guerlain.png", fallback: "/brands/ray-ban.png" }
    ],
    "KIDS": [
      { name: "Woodland", logo: "/brandslogo/toys/Bearbrick.png", fallback: "/brands/woodland.png" },
      { name: "Baggit", logo: "/brandslogo/toys/JellyCat.jpg", fallback: "/brands/baggit.png" },
      { name: "Ray-Ban", logo: "/brandslogo/toys/KAWS.png", fallback: "/brands/ray-ban.png" },
      { name: "Wildhorn", logo: "/brandslogo/toys/Pokemon.png", fallback: "/brands/wildhorn.jpg" },
      { name: "Nike", logo: "/brandslogo/toys/POP MART.jpg", fallback: "/brands/nike.png" },
      { name: "Woodland", logo: "/brandslogo/toys/Sport Cards.jpg", fallback: "/brands/woodland.png" },
      { name: "Baggit", logo: "/brandslogo/toys/Takashi Murakami.png", fallback: "/brands/baggit.png" },
      { name: "Ray-Ban", logo: "/brandslogo/toys/WWF.png", fallback: "/brands/ray-ban.png" }
    ],
  }), [])

  // Categories for display - WITH CUSTOM IMAGES - useMemo mein rakhein
  const categories = useMemo(() => [
    {
      name: "Men's Fashion",
      href: '/categories/men',
      apiCategory: "men's fashion",
      image: "/categories/mens-fashion.jpg"
    },
    {
      name: "Women's Fashion", 
      href: '/categories/women',
      apiCategory: "women's fashion",
      image: "/categories/womens-fashion.jpg"
    },
    {
      name: "Footwear",
      href: '/categories/footwear',
      apiCategory: "footwear",
      image: "/categories/footwear.jpg"
    },
    {
      name: "Accessories",
      href: '/categories/accessories',
      apiCategory: "accessories",
      image: "/categories/accessories.jpg"
    },
    {
      name: "Watches",
      href: '/categories/watches', 
      apiCategory: "watches",
      image: "/categories/watches.jpg"
    },
    {
      name: "Perfumes",
      href: '/categories/perfumes',
      apiCategory: "perfumes",
      image: "/categories/perfumes.jpg"
    },
    {
      name: "Toys & Collectibles",
      href: '/categories/toys',
      apiCategory: "toys & collectibles",
      image: "/categories/toys-collectibles.jpg"
    }
  ], [])

  // Featured Collections - useMemo mein rakhein
  const featuredCollections = useMemo(() => [
    {
      title: "LUXURY TIMEPIECES",
      description: "Elevate your style with iconic watches",
      image: "/categories/toys-collectibles.jpg",
      href: "/collections/watches"
    },
    {
      title: "DESIGNER HANDBAGS",
      description: "Carry timeless elegance",
      image: "/categories/toys-collectibles.jpg",
      href: "/collections/bags"
    },
    {
      title: "SMART TECHNOLOGY",
      description: "Innovation meets luxury",
      image: "/categories/toys-collectibles.jpg",
      href: "/collections/electronics"
    }
  ], [])

  // How It Works Steps - useMemo mein rakhein
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

  // Why Choose Us features - useMemo mein rakhein
  const features = useMemo(() => [
    {
      icon: "🛡️",
      title: "AUTHENTICITY GUARANTEED",
      description: "Every product verified by luxury experts"
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

  // Testimonials - useMemo mein rakhein
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

  // ✅ FIXED: Use the correct API endpoint
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true)
        const productsByCategory = {}

        // Har category ke liye products fetch karo
        for (const category of categories) {
          try {
            // ✅ FIXED: Use correct endpoint (with query parameter)
            const apiUrl = `https://just-becho-backend.vercel.app/api/products?category=${encodeURIComponent(category.apiCategory)}&limit=4`
            
            console.log(`📡 Fetching ${category.name} from:`, apiUrl)
            
            const response = await fetch(apiUrl)
            console.log(`📡 Response for ${category.name}:`, response.status)
            
            if (response.ok) {
              const data = await response.json()
              console.log(`📦 ${category.name} API response:`, data)
              
              if (data.success && data.products) {
                console.log(`✅ ${category.name} products found:`, data.products.length)
                productsByCategory[category.name] = data.products.slice(0, 4)
              } else {
                console.log(`❌ No products found for ${category.name}`)
                productsByCategory[category.name] = []
              }
            } else {
              console.log(`❌ API call failed for ${category.name}:`, response.status)
              productsByCategory[category.name] = []
            }
          } catch (error) {
            console.error(`💥 Error fetching ${category.name}:`, error)
            productsByCategory[category.name] = []
          }
        }

        console.log('🎯 Final products by category:', productsByCategory)
        setCategoryProducts(productsByCategory)
      } catch (error) {
        console.error('Error in fetchCategoryProducts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryProducts()
  }, [categories])

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

  // ✅ FIXED: Product card render function with better error handling
  const renderProductCard = (product) => {
    if (!product || !product._id) return null;
    
    // ✅ FIXED: toLowerCase() error se bachne ke liye
    const productName = product.productName || 'Product';
    const safeProductName = typeof productName === 'string' ? productName : 'Product';
    const safeCondition = product.condition && typeof product.condition === 'string' ? product.condition : '';
    
    return (
      <Link 
        href={`/products/${product._id}`}
        key={product._id}
        className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-300 block"
      >
        <div className="relative w-full aspect-square overflow-hidden mb-3 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
          <img
            src={product.images?.[0]?.url || '/images/placeholder.jpg'}
            alt={safeProductName}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
              e.target.onerror = null; // Prevent infinite loop
            }}
          />
          {/* Condition Badge */}
          {safeCondition && (
            <div className="absolute top-2 left-2">
              <span className="text-gray-900 text-xs font-light tracking-widest uppercase bg-white px-2 py-1 rounded-full">
                {safeCondition.toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="text-left px-1">
          <h3 className="text-gray-800 text-sm font-light tracking-widest uppercase mb-1 line-clamp-2">
            {safeProductName.toUpperCase()}
          </h3>
          <p className="text-gray-900 text-base font-light tracking-widest uppercase">
            ₹{product.finalPrice?.toLocaleString() || '0'}
          </p>
          {product.originalPrice && product.originalPrice > product.finalPrice && (
            <p className="text-gray-500 text-sm line-through">
              ₹{product.originalPrice.toLocaleString()}
            </p>
          )}
        </div>
      </Link>
    )
  }

  // ✅ FIXED: Brand logo display component
  const BrandLogo = ({ brand, index, categoryName }) => {
    const [imgSrc, setImgSrc] = useState(brand.logo);
    const [hasError, setHasError] = useState(false);
    
    // Agar brand name undefined hai to skip karo
    if (!brand || !brand.name) return null;

    return (
      <div key={index} className="mx-8 sm:mx-12 flex-shrink-0">
        <div
          className="flex items-center justify-center"
          style={{
            width: "100px",
            height: "50px",
          }}
        >
          <img
            src={imgSrc}
            alt={brand.name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
            onError={() => {
              // Pehle fallback image try karo
              if (!hasError && brand.fallback) {
                setImgSrc(brand.fallback);
                setHasError(true);
              } else {
                // Agar fallback bhi fail ho, to brand name dikhao
                setImgSrc('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" viewBox="0 0 100 50"><rect width="100" height="50" fill="%23f3f4f6" rx="4"/><text x="50%" y="50%" font-family="Arial" font-size="10" text-anchor="middle" dy=".3em" fill="%236b7280">' + encodeURIComponent(brand.name.substring(0, 10)) + '</text></svg>');
              }
            }}
            loading="lazy"
          />
        </div>
      </div>
    )
  }

  // ✅ FIXED: Helper function to safely convert strings to uppercase
  const safeToUpperCase = (str) => {
    if (typeof str === 'string') {
      return str.toUpperCase();
    }
    return '';
  }

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[60vh] sm:h-[75vh] md:h-[85vh] overflow-hidden">
          <Header />
          
          <div className="absolute inset-0 z-0">
            <Image
              src="/2_5.webp.jpeg"
              alt="Just Becho - Buy and Sell luxury Items"
              fill
              className="object-cover object-center brightness-110 contrast-105 saturate-110"
              priority
              onError={(e) => {
                e.target.src = '/images/hero-placeholder.jpg';
              }}
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center text-white z-10">
            <h1 className="text-2xl sm:text-4xl font-light tracking-widest uppercase mb-4 opacity-0 animate-fade-in-up" 
                style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
              JUST BECHO
            </h1>
            <p className="text-sm sm:text-lg font-light tracking-widest uppercase opacity-0 animate-fade-in-up"
               style={{animationDelay: '0.6s', animationFillMode: 'forwards'}}>
              Luxury Reborn • Trust Redefined
            </p>
          </div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
            <div className="w-5 h-8 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white rounded-full mt-1"></div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-gray-900 text-2xl sm:text-4xl font-light tracking-widest uppercase mb-3">
                WHY CHOOSE JUST BECHO
              </h2>
              <p className="text-gray-600 text-base font-light max-w-2xl mx-auto">
                Experience luxury redefined with our curated collection of authenticated luxury items
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-xl font-light">{feature.icon}</span>
                  </div>
                  <h3 className="text-gray-900 text-base font-light tracking-widest uppercase mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ FIXED: Categories Section */}
        <section className="py-16 bg-white">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-gray-900 text-2xl sm:text-4xl font-light tracking-widest uppercase">
                EXPLORE CATEGORIES
              </h2>
              <p className="text-gray-900 text-base sm:text-lg font-light tracking-widest uppercase mt-3">
                DISCOVER LUXURY ITEMS
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 sm:gap-8 lg:gap-10">
              {categories.map((cat, index) => (
                <Link
                  href={cat.href}
                  key={index}
                  className="group flex flex-col items-center text-center transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = '/images/category-placeholder.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>
                  </div>
                  <h3 className="text-gray-900 text-xs font-light tracking-widest uppercase mt-4 sm:mt-6 leading-tight">
                    {safeToUpperCase(cat.name)}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-gray-900 text-2xl sm:text-4xl font-light tracking-widest uppercase mb-3">
                HOW IT WORKS
              </h2>
              <p className="text-gray-600 text-base font-light max-w-2xl mx-auto">
                Experience seamless luxury trading with our managed marketplace
              </p>
            </div>

            <div className="relative">
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-gray-200 hidden lg:block"></div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-4">
                {howItWorks.map((step, index) => (
                  <div key={index} className="text-center relative group">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 mx-auto rounded-full bg-white border-2 border-gray-900 flex items-center justify-center group-hover:bg-gray-900 group-hover:scale-110 transition-all duration-500 z-10 relative">
                        <span className="text-gray-900 text-xl group-hover:text-white transition-colors duration-500">{step.icon}</span>
                      </div>
                    </div>

                    <div className="px-2">
                      <h3 className="text-gray-900 text-sm font-light tracking-widest uppercase mb-2 group-hover:text-gray-700 transition-colors duration-300">
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

        {/* Featured Collections */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-gray-900 text-2xl sm:text-4xl font-light tracking-widest uppercase mb-3">
                CURATED COLLECTIONS
              </h2>
              <p className="text-gray-600 text-base font-light max-w-2xl mx-auto">
                Handpicked luxury items curated by our experts for the discerning shopper
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredCollections.map((collection, index) => (
                <Link
                  key={index}
                  href={collection.href}
                  className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 h-80"
                >
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = '/images/collection-placeholder.jpg';
                      }}
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-gray-600/50 z-10" />

                  <div className="absolute inset-0 flex items-end p-6 z-20">
                    <div className="text-white">
                      <h3 className="text-xl font-light tracking-widest uppercase mb-2">
                        {collection.title}
                      </h3>
                      <p className="text-gray-200 font-light text-sm mb-3">
                        {collection.description}
                      </p>
                      <div className="w-10 h-px bg-white transform group-hover:scale-x-150 transition-transform duration-500"></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Category-wise Sections with Banners - FIXED API CALLS */}
        {categories.map((category, index) => {
          const categoryBrandsData = categoryBrands[category.name] || []
          const duplicatedCategoryBrands = [...categoryBrandsData, ...categoryBrandsData, ...categoryBrandsData]
          const products = categoryProducts[category.name] || []

          return (
            <div key={category.name || index}>
              <section className="py-16 bg-white border-t border-gray-100">
                <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
                  <div className="text-center mb-12">
                    <h2 className="text-gray-900 text-2xl sm:text-4xl font-light tracking-widest uppercase">
                      {safeToUpperCase(category.name)}
                    </h2>
                    <p className="text-gray-900 text-base sm:text-lg font-light tracking-widest uppercase mt-3">
                      EXPLORE OUR CURATED {safeToUpperCase(category.name)} COLLECTION
                    </p>
                  </div>

                  {/* Product Grid */}
                  {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3"></div>
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                      {products.map(renderProductCard)}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No products available in this category yet.</p>
                      <p className="text-gray-400 text-sm mt-2">Be the first to list a product!</p>
                    </div>
                  )}

                  {/* Popular Brands Carousel */}
                  {categoryBrandsData.length > 0 && (
                    <div className="mt-16">
                      <div className="text-center mb-8">
                        <h3 className="text-gray-900 text-xl sm:text-3xl font-light tracking-widest uppercase">
                          POPULAR BRANDS IN {safeToUpperCase(category.name)}
                        </h3>
                        <p className="text-gray-900 text-base font-light tracking-widest uppercase mt-2">
                          AUTHENTIC LUXURY BRANDS YOU CAN TRUST
                        </p>
                      </div>

                      <div className="w-full overflow-hidden py-3">
                        <div className="flex animate-marquee-mobile sm:animate-marquee whitespace-nowrap">
                          {duplicatedCategoryBrands.map((brand, brandIndex) => (
                            <BrandLogo 
                              key={brandIndex} 
                              brand={brand} 
                              index={brandIndex} 
                              categoryName={category.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-center mt-12">
                    <Link
                      href={category.href}
                      className="text-gray-900 text-lg font-light hover:text-gray-700 transition-all duration-500 tracking-widest uppercase group relative"
                    >
                      <span className="relative">
                        → {safeToUpperCase(category.name)}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-700 group-hover:delay-100"></span>
                      </span>
                    </Link>
                  </div>
                </div>
              </section>

              {/* Banner after each category */}
              {index < categories.length - 1 && (
                <section className="py-16 bg-gradient-to-r from-gray-900 to-black">
                  <div className="max-w-[1700px] mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-white text-2xl sm:text-3xl font-light tracking-widest uppercase mb-4">
                      READY TO SELL YOUR {safeToUpperCase(category.name)}?
                    </h2>
                    <p className="text-gray-300 text-base font-light tracking-widest uppercase mb-6 max-w-2xl mx-auto">
                      Get the best value for your luxury items
                    </p>
                    <Link
                      href="/sell"
                      className="bg-white text-gray-900 px-6 py-3 font-light tracking-widest uppercase hover:bg-gray-100 transition-all duration-300 rounded-full text-base inline-block"
                    >
                      SELL NOW
                    </Link>
                  </div>
                </section>
              )}
            </div>
          )
        })}

        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-gray-900 text-2xl sm:text-4xl font-light tracking-widest uppercase mb-3">
                VOICES OF TRUST
              </h2>
              <p className="text-gray-900 text-base sm:text-lg font-light tracking-widest uppercase mt-2">
                DISCOVER WHY THOUSANDS CHOOSE JUST BECHO
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center justify-center w-16">
                <button
                  onClick={prevTestimonials}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 border border-gray-200 z-10 hover:bg-gray-50 group"
                >
                  <svg className="w-5 h-5 text-gray-900 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center justify-center w-16">
                <button
                  onClick={nextTestimonials}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 border border-gray-200 z-10 hover:bg-gray-50 group"
                >
                  <svg className="w-5 h-5 text-gray-900 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="mx-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {visibleTestimonials.map((testimonial, index) => (
                    <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200/50 group hover:border-gray-300 h-80 flex flex-col relative overflow-hidden hover:transform hover:-translate-y-1 cursor-pointer">

                      <div className="absolute top-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-900 to-gray-700 group-hover:w-full transition-all duration-500"></div>

                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gray-100 to-transparent rounded-full -translate-y-10 translatex-10 opacity-50"></div>

                      <div className="flex-1 flex flex-col justify-between relative z-10">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <span key={i} className="text-yellow-500 text-sm mr-1 drop-shadow-sm">★</span>
                              ))}
                            </div>
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[9px] font-light tracking-widest uppercase px-2 py-1 rounded-full">
                              Verified
                            </div>
                          </div>

                          <p className="text-gray-700 mb-3 leading-relaxed text-[13px] font-light line-clamp-4 tracking-wide">
                            "{testimonial.comment}"
                          </p>
                        </div>

                        <div className="flex items-center pt-3 border-t border-gray-200/50">
                          <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center text-white font-light text-base mr-3 shadow-md">
                            {testimonial.name?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 text-sm font-light tracking-wide mb-0.5">{testimonial.name || 'User'}</h4>
                            <p className="text-gray-600 text-xs font-light">{testimonial.location || 'India'}</p>
                            <div className="mt-1">
                              <span className="inline-block bg-gray-200/70 text-gray-700 text-[9px] font-light tracking-wider px-2 py-0.5 rounded-full">
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

              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setTestimonialStart(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${index === testimonialStart ? 'bg-gray-900 scale-125 shadow-md' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-4xl font-light tracking-widest uppercase mb-4">
              READY TO EXPERIENCE SECURE LUXURY TRADING?
            </h2>
            <p className="text-lg font-light tracking-widest uppercase mb-6 opacity-90 max-w-2xl mx-auto">
              Join India's most trusted managed marketplace for  pre-loved and brand new luxury
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="bg-white text-gray-900 px-6 py-3 font-light tracking-widest uppercase hover:bg-gray-100 transition-all duration-300 rounded-full text-base"
              >
                SHOP VERIFIED LUXURY
              </Link>
              <Link
                href="/sell-now"
                className="border border-white text-white px-6 py-3 font-light tracking-widest uppercase hover:bg-white hover:text-gray-900 transition-all duration-300 rounded-full text-base"
              >
                SELL WITH CONFIDENCE
              </Link>
            </div>
          </div>
        </section>
      </main>

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