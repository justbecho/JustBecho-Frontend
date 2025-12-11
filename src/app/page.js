"use client"

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo, Suspense, useRef } from 'react'
import { useRouter } from 'next/navigation'

// Main content ko alag component mein rakho
function HomeContent() {
  const router = useRouter()
  const [testimonialStart, setTestimonialStart] = useState(0)
  const [categoryProducts, setCategoryProducts] = useState({})
  const [loading, setLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [categoriesFromBackend, setCategoriesFromBackend] = useState([])
  const [brandsFromBackend, setBrandsFromBackend] = useState([])
  
  // ✅ Carousel states
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const carouselIntervalRef = useRef(null)

  // ✅ UPDATED: Brand logos
  const categoryBrands = useMemo(() => ({
    "Men's Fashion": [
      { name: "Balenciaga", logo: "/brandslogo/mens-fashion/Balenciaga.png", fallback: "/brands/Balenciaga.png" },
      { name: "Armani", logo: "/brandslogo/mens-fashion/Armani.png", fallback: "/brands/armani.png" },
      { name: "Prada", logo: "/brandslogo/mens-fashion/Prada.png", fallback: "/brands/prada.png" },
      { name: "Versace", logo: "/brandslogo/mens-fashion/Versace.png", fallback: "/brands/versace.png" },
      { name: "Louis Vuitton", logo: "/brandslogo/mens-fashion/Louis Vuitton.png", fallback: "/brands/louis-vuitton.png" },
      { name: "Gucci", logo: "/brandslogo/mens-fashion/Gucci.png", fallback: "/brands/gucci.png" },
      { name: "Burberry", logo: "/brandslogo/mens-fashion/Burberry.png", fallback: "/brands/burberry.png" },
      { name: "Fendi", logo: "/brandslogo/mens-fashion/Fendi.png", fallback: "/brands/fendi.png" }
    ],
    "Women's Fashion": [
      { name: "Balenciaga", logo: "/brandslogo/womens-fashion/Balenciaga.png", fallback: "/brands/Balenciaga.png" },
      { name: "Dior", logo: "/brandslogo/womens-fashion/Dior.png", fallback: "/brands/dior.png" },
      { name: "Chanel", logo: "/brandslogo/womens-fashion/Chanel.png", fallback: "/brands/chanel.png" },
      { name: "Louis Vuitton", logo: "/brandslogo/womens-fashion/Louis Vuitton.png", fallback: "/brands/louis-vuitton.png" },
      { name: "Gucci", logo: "/brandslogo/womens-fashion/Gucci.png", fallback: "/brands/gucci.png" },
      { name: "Givenchy", logo: "/brandslogo/womens-fashion/Givenchy.png", fallback: "/brands/givenchy.png" },
      { name: "Dolce & Gabbana", logo: "/brandslogo/womens-fashion/Dolce & Gabbana.png", fallback: "/brands/dolce-gabbana.png" }
    ],
    "Footwear": [
      { name: "Acne Studios", logo: "/brandslogo/footwear/Acne-Studios.jpg", fallback: "/brands/Balenciaga.png" },
      { name: "Adidas", logo: "/brandslogo/footwear/Adidas.png", fallback: "/brands/jimmy-choo.png" },
      { name: "Air Jordan", logo: "/brandslogo/footwear/Air-Jordan.png", fallback: "/brands/prada.png" },
      { name: "ALAIA", logo: "/brandslogo/footwear/ALAIA.jpg", fallback: "/brands/puma.png" },
      { name: "Alexander McQueen", logo: "/brandslogo/footwear/Alexander-McQueen.jpg", fallback: "/brands/gucci.png" },
      { name: "Nike", logo: "/brandslogo/footwear/Nike.png", fallback: "/brands/gucci.png" },
      { name: "Alo Yoga", logo: "/brandslogo/footwear/Alo-Yoga.png", fallback: "/brands/reebok.png" },
      { name: "Altra Running", logo: "/brandslogo/footwear/Altra Running.png", fallback: "/brands/Balenciaga.png" },
      { name: "Amiri", logo: "/brandslogo/footwear/Amiri.jpg", fallback: "/brands/jimmy-choo.png" },
      { name: "ANTA", logo: "/brandslogo/footwear/ANTA.jpg", fallback: "/brands/prada.png" },
      { name: "Armani", logo: "/brandslogo/footwear/Armani.png", fallback: "/brands/puma.png" },
      { name: "Balenciaga", logo: "/brandslogo/footwear/Balenciaga.jpg", fallback: "/brands/gucci.png" },
      { name: "BALLY", logo: "/brandslogo/footwear/BALLY.png", fallback: "/brands/reebok.png" },
      { name: "BALMAIN", logo: "/brandslogo/footwear/BALMAIN.png", fallback: "/brands/Balenciaga.png" },
      { name: "BAPE", logo: "/brandslogo/footwear/BAPE.jpg", fallback: "/brands/jimmy-choo.png" },
      { name: "Burberry", logo: "/brandslogo/footwear/Burberry.jpg", fallback: "/brands/prada.png" },
      { name: "Calvin Klein", logo: "/brandslogo/footwear/Calvin Klein.png", fallback: "/brands/puma.png" },
      { name: "Chloe", logo: "/brandslogo/footwear/Chloe.png", fallback: "/brands/gucci.png" },
      { name: "Coach", logo: "/brandslogo/footwear/Coach.jpg", fallback: "/brands/reebok.png" },
      { name: "Converse", logo: "/brandslogo/footwear/Converse.png", fallback: "/brands/Balenciaga.png" },
      { name: "Crocs", logo: "/brandslogo/footwear/Crocs.png", fallback: "/brands/jimmy-choo.png" },
      { name: "Dior", logo: "/brandslogo/footwear/Dior.png", fallback: "/brands/prada.png" },
      { name: "Hoka", logo: "/brandslogo/footwear/Hoka.png", fallback: "/brands/puma.png" },
      { name: "On", logo: "/brandslogo/footwear/On.jpg", fallback: "/brands/reebok.png" },
      { name: "Puma", logo: "/brandslogo/footwear/Puma.jpg", fallback: "/brands/Balenciaga.png" }
    ],
    "Accessories": [
      { name: "Alexander McQueen", logo: "/brandslogo/Accessories/Alenxander McQueen.jpg", fallback: "/brands/Alexander McQueen.jpg" },
      { name: "Apm Monaco", logo: "/brandslogo/Accessories/Apm Monaco.png", fallback: "/brands/baggit.png" },
      { name: "Balenciaga", logo: "/brandslogo/Accessories/Balenciaga.jpg", fallback: "/brands/ray-ban.png" },
      { name: "Buccellati", logo: "/brandslogo/Accessories/Buccellati.png", fallback: "/brands/wildhorn.jpg" },
      { name: "Cartier", logo: "/brandslogo/Accessories/Cartier.jpg", fallback: "/brands/nike.png" },
      { name: "Chaumet", logo: "/brandslogo/Accessories/Chaumet.png", fallback: "/brands/Chaumet.png" },
      { name: "Chloe", logo: "/brandslogo/Accessories/Chloe.png", fallback: "/brands/baggit.png" },
      { name: "Dior", logo: "/brandslogo/Accessories/Dior.png", fallback: "/brands/ray-ban.png" },
      { name: "Fendi", logo: "/brandslogo/Accessories/Fendi.png", fallback: "/brands/wildhorn.jpg" },
      { name: "FRED", logo: "/brandslogo/Accessories/FRED.png", fallback: "/brands/FRED.png" },
      { name: "Gucci", logo: "/brandslogo/Accessories/Gucci.png", fallback: "/brands/baggit.png" },
      { name: "Harry Winston", logo: "/brandslogo/Accessories/Harry Winston.jpg", fallback: "/brands/ray-ban.png" },
      { name: "MCM", logo: "/brandslogo/Accessories/MCM.png", fallback: "/brands/wildhorn.jpg" },
      { name: "Messika", logo: "/brandslogo/Accessories/Messika.png", fallback: "/brands/nike.png" },
      { name: "Miu Miu", logo: "/brandslogo/Accessories/Miu Miu.png", fallback: "/brands/Miu Miu.png" },
      { name: "Prada", logo: "/brandslogo/Accessories/Prada.jpg", fallback: "/brands/baggit.png" },
      { name: "Qeelin", logo: "/brandslogo/Accessories/Qeelin.png", fallback: "/brands/ray-ban.png" },
      { name: "Swaroski", logo: "/brandslogo/Accessories/Swaroski.png", fallback: "/brands/wildhorn.jpg" }
    ],
    "Watches": [
      { name: "Armani", logo: "/brandslogo/watches/Armani.png", fallback: "/brands/Armani.png" },
      { name: "AUDEMARS PIGUET", logo: "/brandslogo/watches/AUDEMARS PIGUET.png", fallback: "/brands/baggit.png" },
      { name: "BLANCPAIN", logo: "/brandslogo/watches/BLANCPAIN.png", fallback: "/brands/ray-ban.png" },
      { name: "BREGUET", logo: "/brandslogo/watches/BREGUET.png", fallback: "/brands/wildhorn.jpg" },
      { name: "Hamilton", logo: "/brandslogo/watches/Hamilton.jpg", fallback: "/brands/nike.png" },
      { name: "Chanel", logo: "/brandslogo/watches/Chanel.png", fallback: "/brands/Chanel.png" },
      { name: "CORUM", logo: "/brandslogo/watches/CORUM.jpg", fallback: "/brands/baggit.png" },
      { name: "Dior", logo: "/brandslogo/watches/Dior.png", fallback: "/brands/ray-ban.png" },
      { name: "Fendi", logo: "/brandslogo/watches/Fendi.png", fallback: "/brands/wildhorn.jpg" },
      { name: "Franck Muller", logo: "/brandslogo/watches/Franck Muller.jpg", fallback: "/brands/Franck Muller.jpg" },
      { name: "Gucci", logo: "/brandslogo/watches/Gucci.png", fallback: "/brands/baggit.png" },
      { name: "Hermes", logo: "/brandslogo/watches/Hermes.jpg", fallback: "/brands/ray-ban.png" },
      { name: "HUBLOT", logo: "/brandslogo/watches/HUBLOT.png", fallback: "/brands/wildhorn.jpg" },
      { name: "LONGINES", logo: "/brandslogo/watches/LONGINES.jpg", fallback: "/brands/nike.png" },
      { name: "OMEGA", logo: "/brandslogo/watches/OMEGA.png", fallback: "/brands/OMEGA.png" },
      { name: "CHOPARD", logo: "/brandslogo/watches/CHOPARD.png", fallback: "/brands/baggit.png" }
    ],
    "TOYS & COLLECTIBLES": [
      { name: "Bearbrick", logo: "/brandslogo/toys/Bearbrick.png", fallback: "/brands/Bearbrick.png" },
      { name: "JellyCat", logo: "/brandslogo/toys/JellyCat.jpg", fallback: "/brands/baggit.png" },
      { name: "KAWS", logo: "/brandslogo/toys/KAWS.png", fallback: "/brands/ray-ban.png" },
      { name: "Pokemon", logo: "/brandslogo/toys/Pokemon.png", fallback: "/brands/wildhorn.jpg" },
      { name: "POP MART", logo: "/brandslogo/toys/POP MART.jpg", fallback: "/brands/nike.png" },
      { name: "Sport Cards", logo: "/brandslogo/toys/Sport Cards.jpg", fallback: "/brands/Sport Cards.jpg" },
      { name: "Takashi Murakami", logo: "/brandslogo/toys/Takashi Murakami.png", fallback: "/brands/baggit.png" },
      { name: "WWF", logo: "/brandslogo/toys/WWF.png", fallback: "/brands/ray-ban.png" }
    ],
    "PERFUMES": [
      { name: "3CE", logo: "/brandslogo/perfumes/3CE.jpg", fallback: "/brands/3CE.jpg" },
      { name: "Anessa", logo: "/brandslogo/perfumes/Anessa.jpg", fallback: "/brands/baggit.png" },
      { name: "Anna Sui", logo: "/brandslogo/perfumes/Anna Sui.png", fallback: "/brands/ray-ban.png" },
      { name: "Armani", logo: "/brandslogo/perfumes/Armani.png", fallback: "/brands/wildhorn.jpg" },
      { name: "Bobbi Brown", logo: "/brandslogo/perfumes/Bobbi Brown.png", fallback: "/brands/nike.png" },
      { name: "Bottega Veneta", logo: "/brandslogo/perfumes/Bottega Veneta.png", fallback: "/brands/Bottega Veneta.png" },
      { name: "Burberry", logo: "/brandslogo/perfumes/Burberry.jpg", fallback: "/brands/baggit.png" },
      { name: "Bvlgari", logo: "/brandslogo/perfumes/Bvlgari.png", fallback: "/brands/ray-ban.png" },
      { name: "Chanel", logo: "/brandslogo/perfumes/Chanel.png", fallback: "/brands/baggit.png" },
      { name: "Clarins", logo: "/brandslogo/perfumes/Clarins.png", fallback: "/brands/ray-ban.png" },
      { name: "Cle de Peau", logo: "/brandslogo/perfumes/Cle de Peau.png", fallback: "/brands/wildhorn.jpg" },
      { name: "Clinique", logo: "/brandslogo/perfumes/Clinique.png", fallback: "/brands/nike.png" },
      { name: "Cosmo Decorte", logo: "/brandslogo/perfumes/Cosmo Decorte.png", fallback: "/brands/Cosmo Decorte.png" },
      { name: "Curel", logo: "/brandslogo/perfumes/Curel.png", fallback: "/brands/baggit.png" },
      { name: "Davidoff", logo: "/brandslogo/perfumes/Davidoff.png", fallback: "/brands/ray-ban.png" },
      { name: "FANCL", logo: "/brandslogo/perfumes/FANCL.png", fallback: "/brands/FANCL.png" },
      { name: "Filorga", logo: "/brandslogo/perfumes/Filorga.png", fallback: "/brands/baggit.png" },
      { name: "Guerlain", logo: "/brandslogo/perfumes/Guerlain.png", fallback: "/brands/ray-ban.png" }
    ],
    "KIDS": [
      { name: "Bearbrick", logo: "/brandslogo/toys/Bearbrick.png", fallback: "/brands/Bearbrick.png" },
      { name: "JellyCat", logo: "/brandslogo/toys/JellyCat.jpg", fallback: "/brands/baggit.png" },
      { name: "KAWS", logo: "/brandslogo/toys/KAWS.png", fallback: "/brands/ray-ban.png" },
      { name: "Pokemon", logo: "/brandslogo/toys/Pokemon.png", fallback: "/brands/wildhorn.jpg" },
      { name: "POP MART", logo: "/brandslogo/toys/POP MART.jpg", fallback: "/brands/nike.png" },
      { name: "Sport Cards", logo: "/brandslogo/toys/Sport Cards.jpg", fallback: "/brands/Sport Cards.jpg" },
      { name: "Takashi Murakami", logo: "/brandslogo/toys/Takashi Murakami.png", fallback: "/brands/baggit.png" },
      { name: "WWF", logo: "/brandslogo/toys/WWF.png", fallback: "/brands/ray-ban.png" }
    ],
  }), [])

  // ✅ Category images mapping for carousel
  const categoryImages = useMemo(() => ({
    "Men's Fashion": "/banners/Men_s Fashion.png",
    "Women's Fashion": "/banners/bagu.jpeg", 
    "Footwear": "/banners/DIOR LOAFERS.png",
    "Accessories": "/banners/Fashion Accessories.png",
    "Watches": "/banners/rolex.jpg", 
    "Perfumes": "/banners/perfumes.png",
    "TOYS & COLLECTIBLES": "/banners/Toys and Figurines.png",
    "KIDS": "/banners/Kids Fashion.png",
    "default": "/banners/default.jpg"
  }), [])

  // ✅ UPDATED: PROPER INFINITE MARQUEE WITHOUT GLITCH
  const createInfiniteMarquee = (brands) => {
    if (!brands || brands.length === 0) return [];
    // Create enough duplicates for seamless transition
    return [...brands, ...brands, ...brands, ...brands];
  };

  // ✅ Carousel slides from categories
  const carouselSlides = useMemo(() => {
    if (categoriesFromBackend.length > 0) {
      return categoriesFromBackend.slice(0, 6).map(cat => ({
        image: cat.image,
        title: cat.name,
        description: `Explore luxury ${cat.name.toLowerCase()}`,
        href: cat.href
      }))
    }
    return [
      {
        image: "/banners/Men_s Fashion.png",
        title: "Men's Fashion",
        description: "Discover premium men's fashion",
        href: "/categories/mens-fashion"
      },
      {
        image: "/banners/bagu.jpeg",
        title: "Women's Fashion",
        description: "Explore luxury women's collections",
        href: "/categories/womens-fashion"
      },
      {
        image: "/banners/DIOR LOAFERS.png",
        title: "Footwear",
        description: "Step into luxury footwear",
        href: "/categories/footwear"
      },
      {
        image: "/banners/Fashion Accessories.png",
        title: "Accessories",
        description: "Complete your look with accessories",
        href: "/categories/accessories"
      },
      {
        image: "/banners/rolex.jpg",
        title: "Watches",
        description: "Timeless luxury timepieces",
        href: "/categories/watches"
      },
      {
        image: "/banners/perfumes.png",
        title: "Perfumes",
        description: "Signature scents and fragrances",
        href: "/categories/perfumes"
      }
    ]
  }, [categoriesFromBackend])

  // ✅ Featured Collections
  const featuredCollections = useMemo(() => [
    {
      title: "LUXURY TIMEPIECES",
      description: "Elevate your style with iconic watches",
      image: "/banners/rolex.jpg",
      href: "/categories/watches"
    },
    {
      title: "DESIGNER HANDBAGS",
      description: "Carry timeless elegance",
      image: "/banners/HERMES MINI KELLY.jpg",
      href: "/categories/bags"
    },
    {
      title: "POPULAR FOOTWEAR",
      description: "Innovation meets luxury",
      image: "/banners/Footwear.png",
      href: "/categories/footwear"
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

  // ✅ Carousel functions
  const nextSlide = () => {
    if (isTransitioning || carouselSlides.length === 0) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
      setIsTransitioning(false);
    }, 500);
  }

  const prevSlide = () => {
    if (isTransitioning || carouselSlides.length === 0) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
      setIsTransitioning(false);
    }, 500);
  }

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide || carouselSlides.length === 0) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 300);
  }

  // ✅ Start carousel auto-play
  useEffect(() => {
    if (carouselSlides.length > 1) {
      carouselIntervalRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    
    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, [carouselSlides.length, currentSlide]);

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

  // ✅ Helper function to get category brands
  const getCategoryBrands = (categoryName) => {
    if (!categoryName) {
      return [];
    }
    
    if (categoryBrands[categoryName]) {
      return categoryBrands[categoryName];
    }
    
    const capitalized = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    if (categoryBrands[capitalized]) {
      return categoryBrands[capitalized];
    }
    
    const normalizedInput = categoryName.toLowerCase();
    for (const [key, value] of Object.entries(categoryBrands)) {
      if (key.toLowerCase() === normalizedInput) {
        return value;
      }
    }
    
    return [];
  }

  // ✅ Fetch categories and brands from backend
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
              const brandLogos = getCategoryBrands(categoryName);
              
              return {
                name: displayName,
                originalName: categoryName,
                href: `/categories/${cat.slug || categoryName.toLowerCase().replace(/\s+/g, '-')}`,
                apiCategory: categoryName,
                image: imagePath,
                brands: brandLogos
              }
            })
            
            setCategoriesFromBackend(formattedCategories)
            
            // ✅ Fetch brands from backend (optional - for future use)
            try {
              const brandsResponse = await fetch('https://just-becho-backend.vercel.app/api/products/brands/all')
              if (brandsResponse.ok) {
                const brandsData = await brandsResponse.json()
                if (brandsData.success && brandsData.brands) {
                  setBrandsFromBackend(brandsData.brands)
                }
              }
            } catch (brandsError) {
              console.log('Could not fetch brands from backend:', brandsError.message)
            }
            
            // ✅ Fetch products for each category
            const productsByCategory = {}
            
            for (const category of formattedCategories) {
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
            setCategoriesFromBackend([])
          }
        } else {
          setCategoriesFromBackend([])
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error)
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

  // ✅ UPDATED: Brand logo component - SINGLE MARQUEE ONLY
  const BrandLogo = ({ brand, index, categoryName }) => {
    const [imgSrc, setImgSrc] = useState(brand.logo);
    const [hasError, setHasError] = useState(false);
    
    if (!brand || !brand.name) return null;

    const handleBrandClick = () => {
      const brandSlug = encodeURIComponent(brand.name.toLowerCase().replace(/\s+/g, '-'));
      const categorySlug = encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'));
      
      router.push(`/brand/${brandSlug}?category=${categorySlug}`);
    };

    return (
      <div 
        key={index} 
        className="flex-shrink-0 px-3 sm:px-4 md:px-5 cursor-pointer group brand-logo-hover tap-highlight"
        title={`Browse ${brand.name} products in ${categoryName}`}
        onClick={handleBrandClick}
      >
        <div className="relative h-10 w-24 sm:h-12 sm:w-28 md:h-14 md:w-32 flex items-center justify-center">
          <img
            src={imgSrc}
            alt={brand.name}
            className="max-h-full max-w-full w-auto h-auto object-contain transition-all duration-300 grayscale hover:grayscale-0 opacity-80 hover:opacity-100"
            onError={(e) => {
              if (!hasError && brand.fallback) {
                setImgSrc(brand.fallback);
                setHasError(true);
              } else {
                setImgSrc('/images/placeholder.jpg');
              }
            }}
            loading="lazy"
          />
        </div>
      </div>
    )
  }

  // ✅ UPDATED: SINGLE INFINITE Brand Marquee Component (NO DUPLICATES)
  const InfiniteBrandMarquee = ({ brands, categoryName }) => {
    const infiniteBrands = useMemo(() => createInfiniteMarquee(brands), [brands]);
    
    return (
      <div className="marquee-container w-full overflow-hidden py-4 sm:py-6">
        {/* ✅ SINGLE MARQUEE - Desktop version */}
        <div className="marquee-desktop whitespace-nowrap">
          <div className="marquee-seamless">
            {infiniteBrands.map((brand, index) => (
              <BrandLogo 
                key={`desktop-${brand.name}-${index}`} 
                brand={brand} 
                index={index}
                categoryName={categoryName}
              />
            ))}
          </div>
        </div>
        
        {/* ✅ SINGLE MARQUEE - Mobile version */}
        <div className="marquee-mobile whitespace-nowrap">
          <div className="marquee-seamless-mobile">
            {infiniteBrands.map((brand, index) => (
              <BrandLogo 
                key={`mobile-${brand.name}-${index}`} 
                brand={brand} 
                index={index}
                categoryName={categoryName}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ✅ UPDATED: Product card render function
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
              <span className="text-gray-900 text-xs font-light tracking-widest uppercase bg-white px-2 py-1 rounded-full mobile-text-xs">
                {safeCondition.toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="text-left px-1">
          <h3 className="text-gray-800 text-xs sm:text-sm font-light tracking-widest uppercase mb-1 line-clamp-2 mobile-text-sm">
            {safeProductName.toUpperCase()}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-gray-900 text-sm sm:text-base font-light tracking-widest uppercase mobile-text-sm">
              ₹{product.finalPrice?.toLocaleString() || '0'}
            </p>
          </div>
          {product.originalPrice && product.originalPrice > product.finalPrice && (
            <p className="text-gray-500 text-xs sm:text-sm line-through mobile-text-xs">
              ₹{product.originalPrice.toLocaleString()}
            </p>
          )}
        </div>
      </Link>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-white prevent-horizontal-scroll pt-24">
        {/* ✅ FIXED: Carousel Hero Section - HEADER KE NICHE */}
        <section className="relative h-[55vh] sm:h-[65vh] md:h-[75vh] lg:h-[85vh] overflow-hidden">
          <div 
            className="absolute inset-0 z-0"
            onMouseEnter={() => carouselIntervalRef.current && clearInterval(carouselIntervalRef.current)}
            onMouseLeave={() => {
              if (carouselSlides.length > 1) {
                carouselIntervalRef.current = setInterval(() => nextSlide(), 5000);
              }
            }}
          >
            <div className={`absolute inset-0 ${isTransitioning ? 'carousel-fade-out' : 'carousel-fade-in'}`}>
              <Image
                src={carouselSlides[currentSlide]?.image || "/banners/Men_s Fashion.png"}
                alt={carouselSlides[currentSlide]?.title || "Just Becho"}
                fill
                className="object-cover object-center brightness-110 contrast-105 saturate-110"
                priority
                sizes="100vw"
                onError={(e) => {
                  e.target.src = '/images/hero-placeholder.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black/40"></div>
              
              {/* ✅ FIXED: Content bottom position */}
              <div className="carousel-content">
                <div className={`transform transition-all duration-1000 ${isTransitioning ? 'translate-x-[-100%] opacity-0' : 'translate-x-0 opacity-100'}`}>
                  <h1 className="carousel-title text-white font-light tracking-widest uppercase mb-2 sm:mb-3 responsive-heading">
                    {carouselSlides[currentSlide]?.title || "JUST BECHO"}
                  </h1>
                  <p className="carousel-description text-white font-light tracking-widest uppercase mb-3 sm:mb-4 max-w-2xl mx-auto responsive-subheading">
                    {carouselSlides[currentSlide]?.description || "Luxury Reborn • Trust Redefined"}
                  </p>
                  <Link
                    href={carouselSlides[currentSlide]?.href || "/products"}
                    className="carousel-button touch-button bg-white text-gray-900 font-light tracking-widest uppercase hover:bg-gray-100 transition-all duration-300 rounded-full inline-block responsive-text"
                  >
                    EXPLORE NOW
                  </Link>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 touch-button-small bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group tap-highlight-none mobile-hidden sm:flex"
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 touch-button-small bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group tap-highlight-none mobile-hidden sm:flex"
              aria-label="Next slide"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-1 sm:space-x-2">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 tap-highlight-none ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-10 sm:py-16 bg-gray-50 section-padding safe-area-padding">
          <div className="max-w-[1700px] mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-widest uppercase mb-2 sm:mb-3 responsive-heading">
                WHY CHOOSE JUST BECHO
              </h2>
              <p className="text-gray-600 text-sm sm:text-base font-light max-w-2xl mx-auto responsive-text">
                Experience luxury redefined with our curated collection of luxury items
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-full bg-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-lg sm:text-xl font-light">{feature.icon}</span>
                  </div>
                  <h3 className="text-gray-900 text-sm sm:text-base font-light tracking-widest uppercase mb-1 sm:mb-2 responsive-text">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed px-2 responsive-text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-10 sm:py-16 bg-white section-padding safe-area-padding">
          <div className="max-w-[1700px] mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-widest uppercase responsive-heading">
                EXPLORE CATEGORIES
              </h2>
              <p className="text-gray-900 text-sm sm:text-base md:text-lg font-light tracking-widest uppercase mt-2 sm:mt-3 responsive-subheading">
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
            ) : categoriesFromBackend.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 sm:gap-6 md:gap-8 lg:gap-10 category-grid">
                {categoriesFromBackend.slice(0, 7).map((cat, index) => (
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
                    <h3 className="text-gray-900 text-xs font-light tracking-widest uppercase mt-3 sm:mt-4 md:mt-6 leading-tight mobile-text-sm">
                      {cat.name.toUpperCase()}
                    </h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 text-base sm:text-lg responsive-text">No categories available yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Collections */}
        <section className="py-10 sm:py-16 bg-gray-50 section-padding safe-area-padding">
          <div className="max-w-[1700px] mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-widest uppercase responsive-heading">
                FEATURED COLLECTIONS
              </h2>
              <p className="text-gray-900 text-sm sm:text-base md:text-lg font-light tracking-widest uppercase mt-2 sm:mt-3 responsive-subheading">
                CURATED LUXURY SELECTIONS
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 featured-collections-grid">
              {featuredCollections.map((collection, index) => (
                <Link
                  href={collection.href}
                  key={index}
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
                      <h3 className="text-lg sm:text-xl md:text-2xl font-light tracking-widest uppercase mb-1 sm:mb-2 responsive-subheading">
                        {collection.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-light opacity-90 responsive-text-sm">
                        {collection.description}
                      </p>
                      <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm font-light tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span>Explore Collection</span>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-10 sm:py-16 bg-white section-padding safe-area-padding">
          <div className="max-w-[1700px] mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-widest uppercase mb-2 sm:mb-3 responsive-heading">
                HOW IT WORKS
              </h2>
              <p className="text-gray-600 text-sm sm:text-base font-light max-w-2xl mx-auto responsive-text">
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
                      <h3 className="text-gray-900 text-xs sm:text-sm font-light tracking-widest uppercase mb-1 sm:mb-2 responsive-text">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-xs font-light leading-relaxed responsive-text-sm">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Category-wise Sections with Banners */}
        {categoriesFromBackend.map((category, index) => {
          const categoryBrandsData = category.brands || [];
          const products = categoryProducts[category.name] || [];

          return (
            <div key={category.name || index}>
              <section className="py-10 sm:py-16 bg-white border-t border-gray-100 section-padding safe-area-padding">
                <div className="max-w-[1700px] mx-auto">
                  <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-widest uppercase responsive-heading">
                      {category.name.toUpperCase()}
                    </h2>
                    <p className="text-gray-900 text-sm sm:text-base md:text-lg font-light tracking-widest uppercase mt-2 sm:mt-3 responsive-subheading">
                      EXPLORE OUR CURATED {category.name.toUpperCase()} COLLECTION
                    </p>
                  </div>

                  {/* Product Grid */}
                  {loading ? (
                    <div className="grid mobile-grid-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="w-full aspect-square bg-gray-200 rounded-lg mb-2 sm:mb-3"></div>
                          <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1 sm:mb-2"></div>
                          <div className="h-4 sm:h-6 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : products.length > 0 ? (
                    <div className="grid mobile-grid-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                      {products.map(renderProductCard)}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <p className="text-gray-500 text-base sm:text-lg responsive-text">No products available in this category yet.</p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2 responsive-text-sm">Be the first to list a product!</p>
                    </div>
                  )}

                  {/* ✅ FIXED: SINGLE INFINITE Brand Marquee (NO DUPLICATE MARQUEES) */}
                  {categoryBrandsData.length > 0 && (
                    <div className="mt-12 sm:mt-16">
                      <div className="text-center mb-6 sm:mb-8">
                        <h3 className="text-gray-900 text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-widest uppercase responsive-subheading">
                          POPULAR BRANDS IN {category.name.toUpperCase()}
                        </h3>
                        <p className="text-gray-900 text-sm sm:text-base font-light tracking-widest uppercase mt-1 sm:mt-2 responsive-text">
                          AUTHENTIC LUXURY BRANDS YOU CAN TRUST
                        </p>
                      </div>

                      <InfiniteBrandMarquee 
                        brands={categoryBrandsData} 
                        categoryName={category.name}
                      />
                      
                      <div className="text-center mt-4 sm:mt-6">
                        <p className="text-gray-500 text-xs sm:text-sm responsive-text-sm">
                          Click on any brand to view all {category.name} products from that brand
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="text-center mt-8 sm:mt-12">
                    <button
                      onClick={() => router.push(category.href)}
                      className="text-gray-900 text-sm sm:text-base md:text-lg font-light hover:text-gray-700 transition-all duration-500 tracking-widest uppercase group relative touch-button responsive-text"
                    >
                      <span className="relative">
                        → VIEW ALL {category.name.toUpperCase()}
                        <span className="absolute bottom-0 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-700 group-hover:delay-100"></span>
                      </span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Banner after each category */}
              {index < categoriesFromBackend.length - 1 && (
                <section className="py-10 sm:py-16 bg-gradient-to-r from-gray-900 to-black section-padding safe-area-padding">
                  <div className="max-w-[1700px] mx-auto text-center">
                    <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-widest uppercase mb-3 sm:mb-4 responsive-subheading">
                      READY TO SELL YOUR {category.name.toUpperCase()}?
                    </h2>
                    <p className="text-gray-300 text-sm sm:text-base font-light tracking-widest uppercase mb-4 sm:mb-6 max-w-2xl mx-auto responsive-text">
                      Get the best value for your luxury items
                    </p>
                    <Link
                      href="/sell"
                      className="touch-button bg-white text-gray-900 font-light tracking-widest uppercase hover:bg-gray-100 transition-all duration-300 rounded-full inline-block responsive-text"
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
        <section className="py-10 sm:py-16 bg-gray-50 section-padding safe-area-padding">
          <div className="max-w-[1800px] mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-widest uppercase mb-2 sm:mb-3 responsive-heading">
                VOICES OF TRUST
              </h2>
              <p className="text-gray-900 text-sm sm:text-base md:text-lg font-light tracking-widest uppercase mt-1 sm:mt-2 responsive-subheading">
                DISCOVER WHY THOUSANDS CHOOSE JUST BECHO
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center justify-center w-12 sm:w-16 mobile-hidden sm:flex">
                <button
                  onClick={prevTestimonials}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 border border-gray-200 z-10 hover:bg-gray-50 group touch-button-small tap-highlight-none"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center justify-center w-12 sm:w-16 mobile-hidden sm:flex">
                <button
                  onClick={nextTestimonials}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 border border-gray-200 z-10 hover:bg-gray-50 group touch-button-small tap-highlight-none"
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

                          <p className="text-gray-700 mb-2 sm:mb-3 leading-relaxed text-xs sm:text-[13px] font-light line-clamp-4 tracking-wide responsive-text-sm">
                            "{testimonial.comment}"
                          </p>
                        </div>

                        <div className="flex items-center pt-2 sm:pt-3 border-t border-gray-200/50">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-light text-sm sm:text-base mr-2 sm:mr-3 shadow-md">
                            {testimonial.name?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 text-xs sm:text-sm font-light tracking-wide mb-0.5 responsive-text-sm">{testimonial.name || 'User'}</h4>
                            <p className="text-gray-600 text-xs font-light responsive-text-sm">{testimonial.location || 'India'}</p>
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
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 tap-highlight-none ${index === testimonialStart ? 'bg-gray-900 scale-125 shadow-md' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 sm:py-16 bg-gray-900 text-white section-padding safe-area-padding">
          <div className="max-w-[1700px] mx-auto text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light tracking-widest uppercase mb-3 sm:mb-4 responsive-heading">
              READY TO EXPERIENCE SECURE LUXURY TRADING?
            </h2>
            <p className="text-sm sm:text-base md:text-lg font-light tracking-widest uppercase mb-4 sm:mb-6 opacity-90 max-w-2xl mx-auto responsive-subheading">
              Join India's most trusted managed marketplace for pre-loved and brand new luxury
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <Link
                href="/products"
                className="touch-button bg-white text-gray-900 font-light tracking-widest uppercase hover:bg-gray-100 transition-all duration-300 rounded-full responsive-text"
              >
                SHOP VERIFIED LUXURY
              </Link>
              <Link
                href="/sell-now"
                className="touch-button border border-white text-white font-light tracking-widest uppercase hover:bg-white hover:text-gray-900 transition-all duration-300 rounded-full responsive-text"
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
          <p className="text-gray-600 responsive-text">Loading Just Becho...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}