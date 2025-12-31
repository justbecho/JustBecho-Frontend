// app/categories/[categorySlug]/page.js - MOBILE & DESKTOP OPTIMIZED
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AuthModal from '@/components/ui/AuthModal'
import { useRouter } from 'next/navigation'
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'

// ✅ Category Configuration Function
const getCategoryConfig = (categorySlug) => {
    const configs = {
        'men': {
            title: "MEN'S FASHION",
            subtitle: 'Discover luxury pre-loved fashion for men - Premium brands at amazing prices',
            banner: '/banners/mensnew.jpeg',
            metaTitle: "Men's Luxury Fashion | Pre-Loved Designer Brands",
            metaDescription: 'Shop authentic pre-loved luxury fashion for men. Designer brands at 50-80% off. Verified authenticity.',
            whyTitle: "WHY SHOP MEN'S FASHION AT JUST BECHO",
            features: [
                {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every product verified by luxury experts (Only with BECHO PROTECT)'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only genuine luxury items'
                },
                {
                    icon: '🚚',
                    title: 'WHITE GLOVE DELIVERY',
                    description: 'Premium packaging and insured shipping'
                }
            ],
            apiSlug: 'Men',
            seoKeywords: ['mens fashion', 'pre-loved men', 'luxury brands', 'designer clothes', 'second hand']
        },
        'women': {
            title: "WOMEN'S FASHION",
            subtitle: 'Explore curated luxury fashion for women - Designer pieces reimagined',
            banner: '/banners/womensnew.jpeg',
            metaTitle: "Women's Luxury Fashion | Pre-Loved Designer Collection",
            metaDescription: 'Discover authentic pre-loved luxury fashion for women. Premium brands at unbeatable prices.',
            whyTitle: "WHY SHOP WOMEN'S FASHION AT JUST BECHO",
            features: [
                {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every product verified by luxury experts (Only with BECHO PROTECT)'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only genuine luxury items'
                },
                {
                    icon: '🚚',
                    title: 'WHITE GLOVE DELIVERY',
                    description: 'Premium packaging and insured shipping'
                }
            ],
            apiSlug: 'Women',
            seoKeywords: ['womens fashion', 'designer dresses', 'luxury handbags', 'pre-loved women', 'fashion accessories']
        },
        'footwear': {
            title: 'FOOTWEAR',
            subtitle: 'Step into style with luxury pre-loved footwear',
            banner: '/banners/footwearnew.jpeg',
            metaTitle: 'Luxury Footwear | Pre-Loved Designer Shoes',
            metaDescription: 'Authentic pre-loved luxury footwear. From sneakers to formal shoes, all verified.',
            whyTitle: 'WHY SHOP FOOTWEAR AT JUST BECHO',
            features: [
                {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every product verified by luxury experts (Only with BECHO PROTECT)'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only genuine luxury items'
                },
                {
                    icon: '🚚',
                    title: 'WHITE GLOVE DELIVERY',
                    description: 'Premium packaging and insured shipping'
                }
            ],
            apiSlug: 'Footwear',
            seoKeywords: ['designer shoes', 'luxury sneakers', 'pre-loved footwear', 'branded shoes', 'footwear']
        },
        'accessories': {
            title: 'ACCESSORIES',
            subtitle: 'Complete your look with luxury accessories',
            banner: '/banners/accessoriesnew.jpeg',
            metaTitle: 'Luxury Accessories | Pre-Loved Designer Accessories',
            metaDescription: 'Authentic pre-loved luxury accessories. Bags, belts, jewelry and more.',
            whyTitle: 'WHY SHOP ACCESSORIES AT JUST BECHO',
            features: [
                {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every product verified by luxury experts (Only with BECHO PROTECT)'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only genuine luxury items'
                },
                {
                    icon: '🚚',
                    title: 'WHITE GLOVE DELIVERY',
                    description: 'Premium packaging and insured shipping'
                }
            ],
            apiSlug: 'Accessories',
            seoKeywords: ['luxury accessories', 'designer bags', 'pre-loved jewelry', 'fashion accessories', 'belts']
        },
        'watches': {
            title: 'WATCHES',
            subtitle: 'Timeless luxury timepieces',
            banner: '/banners/watchesnew.jpeg',
            metaTitle: 'Luxury Watches | Pre-Loved Designer Watches',
            metaDescription: 'Authentic pre-loved luxury watches. Rolex, Omega, Tag Heuer and more.',
            whyTitle: 'WHY SHOP WATCHES AT JUST BECHO',
            features: [
                 {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every product verified by luxury experts (Only with BECHO PROTECT)'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only genuine luxury items'
                },
                {
                    icon: '🚚',
                    title: 'WHITE GLOVE DELIVERY',
                    description: 'Premium packaging and insured shipping'
                }
            ],
            apiSlug: 'Watches',
            seoKeywords: ['luxury watches', 'rolex', 'designer watches', 'pre-loved watches', 'timepieces']
        },
        'perfumes': {
            title: 'PERFUMES',
            subtitle: 'Signature scents and luxury fragrances',
            banner: '/banners/perfumesnew.jpeg',
            metaTitle: 'Luxury Perfumes | Designer Fragrances',
            metaDescription: 'Authentic luxury perfumes and fragrances. Chanel, Dior, Gucci and more.',
            whyTitle: 'WHY SHOP PERFUMES AT JUST BECHO',
            features: [
               {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every product verified by luxury experts (Only with BECHO PROTECT)'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only genuine luxury items'
                },
                {
                    icon: '🚚',
                    title: 'WHITE GLOVE DELIVERY',
                    description: 'Premium packaging and insured shipping'
                }
            ],
            apiSlug: 'Perfumes',
            seoKeywords: ['designer perfumes', 'luxury fragrances', 'cologne', 'perfume', 'scents']
        },
        'toys': {
            title: 'TOYS & COLLECTIBLES',
            subtitle: 'Luxury toys and collectible treasures',
            banner: '/banners/toysnew.jpeg',
            metaTitle: 'Luxury Toys | Collectibles & Figurines',
            metaDescription: 'Rare and luxury toys & collectibles. Authentic items at great prices.',
            whyTitle: 'WHY SHOP TOYS AT JUST BECHO',
            features: [
                {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every product verified by luxury experts (Only with BECHO PROTECT)'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only genuine luxury items'
                },
                {
                    icon: '🚚',
                    title: 'WHITE GLOVE DELIVERY',
                    description: 'Premium packaging and insured shipping'
                }
            ],
            apiSlug: 'Toys',
            seoKeywords: ['luxury toys', 'collectibles', 'figurines', 'pre-loved toys', 'rare toys']
        },
        'kids-fashion': {
            title: "KID'S FASHION",
            subtitle: 'Adorable luxury fashion for kids',
            banner: '/banners/kidsnew.jpeg',
            metaTitle: 'Kids Luxury Fashion | Designer Kids Clothes',
            metaDescription: 'Authentic pre-loved luxury fashion for kids. Premium brands for children.',
            whyTitle: "WHY SHOP KIDS FASHION AT JUST BECHO",
            features: [
                 {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every product verified by luxury experts (Only with BECHO PROTECT)'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only genuine luxury items'
                },
                {
                    icon: '🚚',
                    title: 'WHITE GLOVE DELIVERY',
                    description: 'Premium packaging and insured shipping'
                }
            ],
            apiSlug: 'Kids',
            seoKeywords: ['kids fashion', 'children clothes', 'designer kids', 'pre-loved kids', 'baby clothes']
        },
        'influencer': {
            title: "INFLUENCER ONLY",
            subtitle: 'Exclusive influencer collections and collaborations',
            banner: '/banners/influencer.jpeg',
            metaTitle: 'Influencer Fashion | Designer Influencer Clothes',
            metaDescription: 'Authentic pre-loved luxury fashion for influencers. Premium brands for influencers.',
            whyTitle: "WHY SHOP INFLUENCER'S ONLY AT JUST BECHO",
            features: [
               {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every product verified by luxury experts (Only with BECHO PROTECT)'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only genuine luxury items'
                },
                {
                    icon: '🚚',
                    title: 'WHITE GLOVE DELIVERY',
                    description: 'Premium packaging and insured shipping'
                }
            ],
            apiSlug: 'influencer',
            seoKeywords: ['influencer fashion', 'influencer', 'designer influencer', 'pre-loved influencer']
        }
    }

    // ✅ Apply lowercase normalization
    return configs[categorySlug.toLowerCase()] || getDefaultConfig(categorySlug)
}

// ✅ Default Config Function
const getDefaultConfig = (categorySlug) => {
    const formattedName = categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    return {
        title: formattedName.toUpperCase(),
        subtitle: `Discover premium ${formattedName.toLowerCase()} at amazing prices`,
        banner: '/banners/default-banner.jpg',
        metaTitle: `${formattedName} | Luxury Pre-Loved Collection`,
        metaDescription: `Authentic pre-loved ${formattedName.toLowerCase()}. Premium quality with verified authenticity.`,
        whyTitle: `WHY SHOP ${formattedName.toUpperCase()} AT JUST BECHO`,
        features: [
             {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every product verified by luxury experts (Only with BECHO PROTECT)'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only genuine luxury items'
                },
                {
                    icon: '🚚',
                    title: 'WHITE GLOVE DELIVERY',
                    description: 'Premium packaging and insured shipping'
                }
        ],
        apiSlug: formattedName,
        seoKeywords: [formattedName.toLowerCase(), 'pre-loved', 'luxury', 'designer']
    }
}

export default function CategoryClient({
    categorySlug,
    apiCategory,
    config
}) {
    const router = useRouter()

    // ✅ Auth Modal state
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [authAction, setAuthAction] = useState(null)

    // State Management
    const [activeFilter, setActiveFilter] = useState('all')
    const [sortBy, setSortBy] = useState('newest')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    // ✅ Mobile filter state
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [expandedSections, setExpandedSections] = useState({
        brands: false,
        conditions: false,
        price: false
    })

    // Filters
    const [filters, setFilters] = useState({
        brands: [],
        conditions: [],
        minPrice: '',
        maxPrice: '',
        search: ''
    })

    const [availableBrands, setAvailableBrands] = useState(config.initialFilters?.brands || [])
    const [availableConditions, setAvailableConditions] = useState(config.initialFilters?.conditions || [])
    const [error, setError] = useState(null)

    // ✅ Auth Modal close handler
    const handleAuthModalClose = () => {
        setShowAuthModal(false)
        setAuthAction(null)
    }

    // ✅ SELL ITEMS button handler
    const handleSellItems = () => {
        // Check if user is logged in
        const token = localStorage.getItem('token')
        if (!token) {
            // User not logged in, show auth modal
            setAuthAction('sell')
            setShowAuthModal(true)
            return
        }

        // If logged in, navigate to sell page
        router.push('/sell-now')
    }

    // ✅ Debug logging
    useEffect(() => {
        console.log('🎯 Client Component Mounted:', {
            categorySlug,
            apiCategory,
            configTitle: config.title,
            initialProductsCount: products.length
        })
    }, [categorySlug, apiCategory, config.title, products.length])

    // ✅ FIXED: Optimized product fetching - CORRECT API ENDPOINT
    const fetchProducts = useCallback(async (pageNum = 1, isLoadMore = false) => {
        try {
            if (pageNum === 1) {
                setLoading(true)
            } else {
                setLoadingMore(true)
            }

            setError(null)

            // Build query params
            const queryParams = new URLSearchParams()
            queryParams.append('sort', sortBy)
            queryParams.append('page', pageNum)
            queryParams.append('limit', 12)

            // Add filters
            if (filters.brands.length > 0) {
                queryParams.append('brand', filters.brands.join(','))
            }

            if (filters.conditions.length > 0) {
                queryParams.append('condition', filters.conditions.join(','))
            }

            if (filters.minPrice) {
                queryParams.append('minPrice', filters.minPrice)
            }

            if (filters.maxPrice) {
                queryParams.append('maxPrice', filters.maxPrice)
            }

            // ✅ CORRECT API URL: /api/products with category parameter
            const apiUrl = `https://just-becho-backend.vercel.app/api/products?category=${encodeURIComponent(apiCategory)}&${queryParams.toString()}`

            console.log('📡 [CLIENT] Fetching products from:', apiUrl)

            const response = await fetch(apiUrl, {
                cache: 'no-store',
                headers: {
                    'Accept': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`)
            }

            const data = await response.json()

            if (data.success && data.products) {
                if (isLoadMore) {
                    setProducts(prev => [...prev, ...data.products])
                } else {
                    setProducts(data.products)
                }

                // Update available filters
                if (pageNum === 1) {
                    const brands = [...new Set(data.products.map(p => p.brand).filter(Boolean))]
                    const conditions = [...new Set(data.products.map(p => p.condition).filter(Boolean))]

                    setAvailableBrands(brands)
                    setAvailableConditions(conditions)
                }

                // Check if there are more pages
                setHasMore(data.products.length === 12)
                setPage(pageNum)
            } else {
                if (!isLoadMore) {
                    setProducts([])
                }
                setHasMore(false)
            }
        } catch (error) {
            console.error('❌ Fetch error:', error)
            setError(error.message)
            if (!isLoadMore) {
                setProducts([])
            }
        } finally {
            if (pageNum === 1) {
                setLoading(false)
            } else {
                setLoadingMore(false)
            }
        }
    }, [apiCategory, sortBy, filters])

    // ✅ Initial fetch and filter/sort changes
    useEffect(() => {
        console.log('🔄 Triggering product fetch for:', apiCategory)
        fetchProducts(1, false)
    }, [apiCategory, sortBy, filters.brands, filters.conditions, filters.minPrice, filters.maxPrice])

    // ✅ Filter handlers
    const handleBrandChange = (brand) => {
        setFilters(prev => ({
            ...prev,
            brands: prev.brands.includes(brand)
                ? prev.brands.filter(b => b !== brand)
                : [...prev.brands, brand]
        }))
        setPage(1)
    }

    const handleConditionChange = (condition) => {
        setFilters(prev => ({
            ...prev,
            conditions: prev.conditions.includes(condition)
                ? prev.conditions.filter(c => c !== condition)
                : [...prev.conditions, condition]
        }))
        setPage(1)
    }

    const handlePriceChange = (min, max) => {
        setFilters(prev => ({
            ...prev,
            minPrice: min,
            maxPrice: max
        }))
        setPage(1)
    }

    const handleClearFilters = () => {
        setFilters({
            brands: [],
            conditions: [],
            minPrice: '',
            maxPrice: '',
            search: ''
        })
        setActiveFilter('all')
        setPage(1)
        setShowMobileFilters(false)
    }

    const handleLoadMore = () => {
        fetchProducts(page + 1, true)
    }

    // ✅ Toggle section expansion for mobile
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    // ✅ Filtered and sorted products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Brand filter
            if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
                return false
            }

            // Condition filter
            if (filters.conditions.length > 0 && !filters.conditions.includes(product.condition)) {
                return false
            }

            // Price filter
            const price = product.finalPrice || 0
            if (filters.minPrice && price < parseInt(filters.minPrice)) {
                return false
            }

            if (filters.maxPrice && price > parseInt(filters.maxPrice)) {
                return false
            }

            return true
        })
    }, [products, filters])

    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return (a.finalPrice || 0) - (b.finalPrice || 0)
                case 'price-high':
                    return (b.finalPrice || 0) - (a.finalPrice || 0)
                default: // newest
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            }
        })
    }, [filteredProducts, sortBy])

    // ✅ Product Card Component
    const ProductCard = ({ product }) => (
        <Link
            href={`/products/${product._id}`}
            className="group block cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
        >
            <div className="relative w-full aspect-square overflow-hidden mb-2 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                <Image
                    src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                    alt={product.productName}
                    fill
                    className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 33vw"
                    onError={(e) => {
                        e.target.src = '/placeholder-image.jpg'
                    }}
                />

                {/* Condition Badge */}
                {product.condition && (
                    <div className="absolute top-2 left-2">
                        <span className="text-gray-900 text-xs font-light tracking-widest uppercase bg-white px-2 py-1 rounded-full">
                            {product.condition}
                        </span>
                    </div>
                )}

                {/* Views Count */}
                {product.views > 0 && (
                    <div className="absolute bottom-2 left-2">
                        <span className="text-white text-xs bg-gray-900/70 px-2 py-1 rounded-full">
                            👁️ {product.views}
                        </span>
                    </div>
                )}

                {/* Likes Count */}
                {product.likes > 0 && (
                    <div className="absolute bottom-2 right-2">
                        <span className="text-white text-xs bg-gray-800/70 px-2 py-1 rounded-full">
                            ❤️ {product.likes}
                        </span>
                    </div>
                )}
            </div>

            <div className="text-left px-1 space-y-1">
                <h3 className="text-gray-900 text-sm font-light tracking-widest uppercase line-clamp-2 min-h-[2.5rem]">
                    {product.productName?.toUpperCase() || 'Product Name'}
                </h3>

                <p className="text-gray-600 text-xs font-light uppercase">
                    {product.brand || 'Brand'}
                </p>

                <div className="flex items-center gap-2">
                    <span className="text-gray-900 text-base font-light">
                        ₹{(product.finalPrice || 0).toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.finalPrice && (
                        <span className="text-gray-400 text-sm line-through">
                            ₹{product.originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )

    // ✅ Loading Skeleton
    const LoadingSkeleton = () => (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
            ))}
        </div>
    )

    // ✅ Active filters count
    const activeFiltersCount = (
        (filters.brands.length > 0 ? 1 : 0) +
        (filters.conditions.length > 0 ? 1 : 0) +
        (filters.minPrice ? 1 : 0) +
        (filters.maxPrice ? 1 : 0)
    )

    return (
        <>
            <Header />

            <div className="bg-white">
                {/* ✅ PROPER SPACING: Header के नीचे से start होगा */}
                <div className="pt-16 md:pt-[140px]"></div>

                {/* ✅ Hero Banner - Clean Version (No Text/Buttons) */}
                <div className="relative w-full h-[30vh] md:h-[60vh] overflow-hidden">
                    {/* Only Banner Image */}
                    <div className="absolute inset-0">
                        <Image
                            src={config.banner || '/banners/default-banner.jpg'}
                            alt={config.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                            onError={(e) => {
                                console.error('Banner image failed:', config.banner)
                                e.target.src = '/banners/default-banner.jpg'
                            }}
                        />
                    </div>
                </div>

                {/* ✅ Products Section - MOBILE: Reduced padding */}
                <section id="products" className="py-6 md:py-16">
                    <div className="max-w-[1700px] mx-auto px-4 sm:px-6">

                        {/* ✅ Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-800">
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                </div>
                                <button
                                    onClick={() => fetchProducts(1, false)}
                                    className="mt-2 text-gray-700 underline text-sm hover:text-gray-900"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* MOBILE FILTERS TOGGLE - COMPACT FOR MOBILE */}
                        <div className="lg:hidden mb-4">
                            <div className="flex items-center justify-between gap-2">
                                <button
                                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-light tracking-widest uppercase hover:bg-gray-50 transition-colors"
                                >
                                    <FiFilter className="w-3.5 h-3.5" />
                                    Filters
                                    {activeFiltersCount > 0 && (
                                        <span className="bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>
                                
                                <div className="flex-1 max-w-[140px]">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-black bg-white"
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="price-low">Price: Low</option>
                                        <option value="price-high">Price: High</option>
                                    </select>
                                </div>
                                
                                <button
                                    onClick={handleSellItems}
                                    className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-light tracking-widest uppercase hover:bg-gray-800 transition-colors whitespace-nowrap"
                                >
                                    + SELL
                                </button>
                            </div>

                            {/* Active Filters Badges - Mobile */}
                            {(filters.brands.length > 0 || filters.conditions.length > 0 || filters.minPrice || filters.maxPrice) && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {filters.brands.map(brand => (
                                        <div key={brand} className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                                            <span className="text-gray-700 truncate max-w-[60px]">{brand}</span>
                                            <button
                                                onClick={() => handleBrandChange(brand)}
                                                className="text-gray-400 hover:text-gray-600 text-[10px]"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    {filters.conditions.map(condition => (
                                        <div key={condition} className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                                            <span className="text-gray-700 truncate max-w-[60px]">{condition}</span>
                                            <button
                                                onClick={() => handleConditionChange(condition)}
                                                className="text-gray-400 hover:text-gray-600 text-[10px]"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    {filters.minPrice && (
                                        <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                                            <span className="text-gray-700">Min: ₹{filters.minPrice}</span>
                                            <button
                                                onClick={() => handlePriceChange('', filters.maxPrice)}
                                                className="text-gray-400 hover:text-gray-600 text-[10px]"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                    {filters.maxPrice && (
                                        <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                                            <span className="text-gray-700">Max: ₹{filters.maxPrice}</span>
                                            <button
                                                onClick={() => handlePriceChange(filters.minPrice, '')}
                                                className="text-gray-400 hover:text-gray-600 text-[10px]"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* MOBILE FILTERS MODAL */}
                        {showMobileFilters && (
                            <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
                                {/* Header */}
                                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
                                    <h3 className="text-base font-light tracking-widest uppercase">Filters</h3>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={handleClearFilters}
                                            className="text-xs text-gray-500 hover:text-gray-700"
                                        >
                                            Clear All
                                        </button>
                                        <button
                                            onClick={() => setShowMobileFilters(false)}
                                            className="p-1 hover:bg-gray-100 rounded-full"
                                        >
                                            <FiX className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Filters Content */}
                                <div className="p-4 space-y-4 pb-20">
                                    {/* Brands Filter */}
                                    {availableBrands.length > 0 && (
                                        <div className="border-b border-gray-200 pb-3">
                                            <button
                                                onClick={() => toggleSection('brands')}
                                                className="flex items-center justify-between w-full text-left mb-2"
                                            >
                                                <h4 className="text-gray-900 text-sm font-medium">
                                                    BRANDS ({availableBrands.length})
                                                </h4>
                                                {expandedSections.brands ? (
                                                    <FiChevronUp className="w-4 h-4 text-gray-500" />
                                                ) : (
                                                    <FiChevronDown className="w-4 h-4 text-gray-500" />
                                                )}
                                            </button>
                                            
                                            {expandedSections.brands && (
                                                <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                                                    {availableBrands.map(brand => (
                                                        <label key={brand} className="flex items-center space-x-2 cursor-pointer group py-0.5">
                                                            <input
                                                                type="checkbox"
                                                                checked={filters.brands.includes(brand)}
                                                                onChange={() => handleBrandChange(brand)}
                                                                className="w-3.5 h-3.5 text-black border-gray-300 rounded focus:ring-black"
                                                            />
                                                            <span className="text-gray-600 text-xs font-light group-hover:text-gray-900 transition-colors truncate">
                                                                {brand}
                                                            </span>
                                                            <span className="text-gray-400 text-[10px] ml-auto">
                                                                ({products.filter(p => p.brand === brand).length})
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Condition Filter */}
                                    {availableConditions.length > 0 && (
                                        <div className="border-b border-gray-200 pb-3">
                                            <button
                                                onClick={() => toggleSection('conditions')}
                                                className="flex items-center justify-between w-full text-left mb-2"
                                            >
                                                <h4 className="text-gray-900 text-sm font-medium">
                                                    CONDITION ({availableConditions.length})
                                                </h4>
                                                {expandedSections.conditions ? (
                                                    <FiChevronUp className="w-4 h-4 text-gray-500" />
                                                ) : (
                                                    <FiChevronDown className="w-4 h-4 text-gray-500" />
                                                )}
                                            </button>
                                            
                                            {expandedSections.conditions && (
                                                <div className="space-y-1">
                                                    {availableConditions.map(condition => (
                                                        <label key={condition} className="flex items-center space-x-2 cursor-pointer group py-0.5">
                                                            <input
                                                                type="checkbox"
                                                                checked={filters.conditions.includes(condition)}
                                                                onChange={() => handleConditionChange(condition)}
                                                                className="w-3.5 h-3.5 text-black border-gray-300 rounded focus:ring-black"
                                                            />
                                                            <span className="text-gray-600 text-xs font-light group-hover:text-gray-900 transition-colors">
                                                                {condition}
                                                            </span>
                                                            <span className="text-gray-400 text-[10px] ml-auto">
                                                                ({products.filter(p => p.condition === condition).length})
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Price Filter */}
                                    <div className="border-b border-gray-200 pb-3">
                                        <button
                                            onClick={() => toggleSection('price')}
                                            className="flex items-center justify-between w-full text-left mb-2"
                                        >
                                            <h4 className="text-gray-900 text-sm font-medium">
                                                PRICE RANGE
                                            </h4>
                                            {expandedSections.price ? (
                                                <FiChevronUp className="w-4 h-4 text-gray-500" />
                                            ) : (
                                                <FiChevronDown className="w-4 h-4 text-gray-500" />
                                            )}
                                        </button>
                                        
                                        {expandedSections.price && (
                                            <div className="space-y-3">
                                                <div className="flex gap-2">
                                                    <div className="flex-1">
                                                        <label className="text-[10px] text-gray-500 block mb-1">Min</label>
                                                        <input
                                                            type="number"
                                                            placeholder="₹0"
                                                            value={filters.minPrice}
                                                            onChange={(e) => handlePriceChange(e.target.value, filters.maxPrice)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-black"
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-[10px] text-gray-500 block mb-1">Max</label>
                                                        <input
                                                            type="number"
                                                            placeholder="₹100000"
                                                            value={filters.maxPrice}
                                                            onChange={(e) => handlePriceChange(filters.minPrice, e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-black"
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Apply Button */}
                                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3">
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="w-full bg-black text-white py-2.5 rounded-lg text-xs font-light tracking-widest uppercase hover:bg-gray-800 transition-colors"
                                    >
                                        Apply Filters ({activeFiltersCount})
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                            {/* ✅ DESKTOP Sidebar Filters */}
                            <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
                                <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 sticky top-36">

                                    {/* Filters Header */}
                                    <div className="flex justify-between items-center mb-4 lg:mb-6">
                                        <h3 className="text-gray-900 text-base lg:text-lg font-light tracking-widest uppercase">
                                            FILTERS
                                        </h3>
                                        <button
                                            onClick={handleClearFilters}
                                            className="text-xs lg:text-sm text-gray-500 hover:text-gray-700"
                                        >
                                            Clear All
                                        </button>
                                    </div>

                                    {/* Brands Filter */}
                                    {availableBrands.length > 0 && (
                                        <div className="mb-6 lg:mb-8">
                                            <h4 className="text-gray-700 text-xs lg:text-sm font-medium mb-2 lg:mb-3">
                                                BRANDS ({availableBrands.length})
                                            </h4>
                                            <div className="space-y-1 lg:space-y-2 max-h-48 lg:max-h-60 overflow-y-auto pr-2">
                                                {availableBrands.map(brand => (
                                                    <label key={brand} className="flex items-center space-x-2 lg:space-x-3 cursor-pointer group py-0.5 lg:py-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={filters.brands.includes(brand)}
                                                            onChange={() => handleBrandChange(brand)}
                                                            className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-black border-gray-300 rounded focus:ring-black"
                                                        />
                                                        <span className="text-gray-600 text-xs lg:text-sm font-light group-hover:text-gray-900 transition-colors truncate">
                                                            {brand}
                                                        </span>
                                                        <span className="text-gray-400 text-[10px] lg:text-xs ml-auto">
                                                            ({products.filter(p => p.brand === brand).length})
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Condition Filter */}
                                    {availableConditions.length > 0 && (
                                        <div className="mb-6 lg:mb-8">
                                            <h4 className="text-gray-700 text-xs lg:text-sm font-medium mb-2 lg:mb-3">
                                                CONDITION ({availableConditions.length})
                                            </h4>
                                            <div className="space-y-1 lg:space-y-2">
                                                {availableConditions.map(condition => (
                                                    <label key={condition} className="flex items-center space-x-2 lg:space-x-3 cursor-pointer group py-0.5 lg:py-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={filters.conditions.includes(condition)}
                                                            onChange={() => handleConditionChange(condition)}
                                                            className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-black border-gray-300 rounded focus:ring-black"
                                                        />
                                                        <span className="text-gray-600 text-xs lg:text-sm font-light group-hover:text-gray-900 transition-colors">
                                                            {condition}
                                                        </span>
                                                        <span className="text-gray-400 text-[10px] lg:text-xs ml-auto">
                                                            ({products.filter(p => p.condition === condition).length})
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Price Filter */}
                                    <div>
                                        <h4 className="text-gray-700 text-xs lg:text-sm font-medium mb-2 lg:mb-3">
                                            PRICE RANGE
                                        </h4>
                                        <div className="space-y-3 lg:space-y-4">
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <label className="text-[10px] lg:text-xs text-gray-500 block mb-1">Min</label>
                                                    <input
                                                        type="number"
                                                        placeholder="₹0"
                                                        value={filters.minPrice}
                                                        onChange={(e) => handlePriceChange(e.target.value, filters.maxPrice)}
                                                        className="w-full px-2 lg:px-3 py-1.5 lg:py-2 border border-gray-300 rounded-lg text-xs lg:text-sm focus:outline-none focus:border-black"
                                                        min="0"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-[10px] lg:text-xs text-gray-500 block mb-1">Max</label>
                                                    <input
                                                        type="number"
                                                        placeholder="₹100000"
                                                        value={filters.maxPrice}
                                                        onChange={(e) => handlePriceChange(filters.minPrice, e.target.value)}
                                                        className="w-full px-2 lg:px-3 py-1.5 lg:py-2 border border-gray-300 rounded-lg text-xs lg:text-sm focus:outline-none focus:border-black"
                                                        min="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Active Filters Summary */}
                                    {(filters.brands.length > 0 || filters.conditions.length > 0 || filters.minPrice || filters.maxPrice) && (
                                        <div className="mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-200">
                                            <h4 className="text-gray-700 text-xs lg:text-sm font-medium mb-1 lg:mb-2">
                                                ACTIVE FILTERS
                                            </h4>
                                            <div className="flex flex-wrap gap-1 lg:gap-2">
                                                {filters.brands.map(brand => (
                                                    <div key={brand} className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded text-xs">
                                                        <span className="text-gray-700 truncate max-w-[80px] lg:max-w-none">{brand}</span>
                                                        <button
                                                            onClick={() => handleBrandChange(brand)}
                                                            className="text-gray-400 hover:text-gray-600 text-[10px] lg:text-xs"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                                {filters.conditions.map(condition => (
                                                    <div key={condition} className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded text-xs">
                                                        <span className="text-gray-700 truncate max-w-[80px] lg:max-w-none">{condition}</span>
                                                        <button
                                                            onClick={() => handleConditionChange(condition)}
                                                            className="text-gray-400 hover:text-gray-600 text-[10px] lg:text-xs"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                                {filters.minPrice && (
                                                    <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded text-xs">
                                                        <span className="text-gray-700">Min: ₹{filters.minPrice}</span>
                                                        <button
                                                            onClick={() => handlePriceChange('', filters.maxPrice)}
                                                            className="text-gray-400 hover:text-gray-600 text-[10px] lg:text-xs"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )}
                                                {filters.maxPrice && (
                                                    <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 lg:px-2 lg:py-1 rounded text-xs">
                                                        <span className="text-gray-700">Max: ₹{filters.maxPrice}</span>
                                                        <button
                                                            onClick={() => handlePriceChange(filters.minPrice, '')}
                                                            className="text-gray-400 hover:text-gray-600 text-[10px] lg:text-xs"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>

                            {/* ✅ Products Grid */}
                            <div className="flex-1">

                                {/* DESKTOP Header with Stats */}
                                <div className="hidden lg:flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 lg:mb-8 gap-4">
                                    <div>
                                        <h2 className="text-gray-900 text-xl lg:text-2xl font-light tracking-widest uppercase mb-1">
                                            {config.title || 'PRODUCTS'}
                                        </h2>
                                        <p className="text-gray-600 text-sm font-light">
                                            Showing {sortedProducts.length} of {products.length} products
                                            {loading && ' • Loading...'}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 lg:gap-4">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="border border-gray-300 rounded-lg px-3 lg:px-4 py-1.5 lg:py-2 text-sm focus:outline-none focus:border-black bg-white"
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                        </select>

                                        <button
                                            onClick={handleSellItems}
                                            className="bg-black text-white px-4 lg:px-6 py-1.5 lg:py-2 rounded-lg text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-colors whitespace-nowrap"
                                        >
                                            + SELL ITEM
                                        </button>
                                    </div>
                                </div>

                                {/* MOBILE Header Title - COMPACT */}
                                <div className="lg:hidden mb-4">
                                    <h2 className="text-gray-900 text-lg font-light tracking-widest uppercase mb-0.5">
                                        {config.title || 'PRODUCTS'}
                                    </h2>
                                    <p className="text-gray-600 text-xs font-light">
                                        {sortedProducts.length} products • {loading && 'Loading...'}
                                    </p>
                                </div>

                                {/* Loading State */}
                                {loading ? (
                                    <LoadingSkeleton />
                                ) :

                                    sortedProducts.length === 0 ? (
                                        <div className="text-center py-8 lg:py-12">
                                            <div className="text-gray-400 mb-3 lg:mb-4">
                                                <svg className="w-12 h-12 lg:w-16 lg:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 text-base lg:text-lg mb-1 lg:mb-2">No products found.</p>
                                            <p className="text-gray-400 text-xs lg:text-sm mb-4 lg:mb-6">
                                                {products.length === 0
                                                    ? 'No products available in this category.'
                                                    : 'No products match your filters.'}
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-2 lg:gap-4 justify-center">
                                                <button
                                                    onClick={handleClearFilters}
                                                    className="border-2 border-black text-black px-4 py-1.5 lg:px-6 lg:py-2 rounded-lg text-xs lg:text-sm font-light tracking-widest uppercase hover:bg-black hover:text-white transition-all"
                                                >
                                                    Clear Filters
                                                </button>
                                                <button
                                                    onClick={handleSellItems}
                                                    className="bg-black text-white px-4 py-1.5 lg:px-6 lg:py-2 rounded-lg text-xs lg:text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-all"
                                                >
                                                    Sell Items
                                                </button>
                                            </div>
                                        </div>
                                    ) :

                                        /* ✅ Products Grid - COMPACT FOR MOBILE */
                                        (
                                            <>
                                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
                                                    {sortedProducts.map(product => (
                                                        <ProductCard key={product._id} product={product} />
                                                    ))}
                                                </div>

                                                {/* Load More Button */}
                                                {hasMore && !loading && sortedProducts.length > 0 && (
                                                    <div className="text-center mt-8 lg:mt-12">
                                                        <button
                                                            onClick={handleLoadMore}
                                                            disabled={loadingMore}
                                                            className={`border-2 border-black text-black px-6 lg:px-8 py-2 lg:py-3 text-xs lg:text-sm font-light tracking-widest uppercase transition-all duration-300 rounded-full ${loadingMore ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:text-white'}`}
                                                        >
                                                            {loadingMore ? 'Loading...' : 'LOAD MORE PRODUCTS'}
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ✅ Why Shop Section - MOBILE: Reduced padding */}
                <section className="py-8 lg:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-8 lg:mb-12">
                            <h2 className="text-gray-900 text-xl lg:text-2xl xl:text-3xl font-light tracking-widest uppercase mb-3 lg:mb-4">
                                {config.whyTitle || 'WHY SHOP AT JUST BECHO'}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                            {(config.features || []).map((feature, index) => (
                                <div key={index} className="text-center p-4 lg:p-6">
                                    <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 rounded-full bg-black flex items-center justify-center">
                                        <span className="text-white text-xl lg:text-2xl">{feature.icon || '✨'}</span>
                                    </div>
                                    <h3 className="text-gray-900 text-sm lg:text-base xl:text-lg font-light tracking-widest uppercase mb-1 lg:mb-2">
                                        {feature.title || 'FEATURE'}
                                    </h3>
                                    <p className="text-gray-600 text-xs lg:text-sm">
                                        {feature.description || 'Premium service and quality guaranteed'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            <Footer />

            {/* ✅ Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={handleAuthModalClose}
            />
        </>
    )
}