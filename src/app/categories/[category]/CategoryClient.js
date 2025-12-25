'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AuthModal from '@/components/ui/AuthModal'
import { useRouter } from 'next/navigation'

// ✅ Category Configuration Function
const getCategoryConfig = (categorySlug) => {
    const configs = {
        'men': {
            title: "MEN'S FASHION",
            subtitle: 'Discover luxury pre-loved fashion for men - Premium brands at amazing prices',
            banner: '/banners/mens new.jpeg',
            metaTitle: "Men's Luxury Fashion | Pre-Loved Designer Brands",
            metaDescription: 'Shop authentic pre-loved luxury fashion for men. Designer brands at 50-80% off. Verified authenticity.',
            whyTitle: "WHY SHOP MEN'S FASHION AT JUST BECHO",
            features: [
                {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every item undergoes 7-point verification by luxury experts'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only gently used items in excellent condition'
                },
                {
                    icon: '🚚',
                    title: 'FREE SHIPPING',
                    description: 'Free shipping on all orders above ₹1999'
                }
            ],
            apiSlug: 'Men',
            seoKeywords: ['mens fashion', 'pre-loved men', 'luxury brands', 'designer clothes', 'second hand']
        },
        'women': {
            title: "WOMEN'S FASHION",
            subtitle: 'Explore curated luxury fashion for women - Designer pieces reimagined',
            banner: '/banners/womens new.png',
            metaTitle: "Women's Luxury Fashion | Pre-Loved Designer Collection",
            metaDescription: 'Discover authentic pre-loved luxury fashion for women. Premium brands at unbeatable prices.',
            whyTitle: "WHY SHOP WOMEN'S FASHION AT JUST BECHO",
            features: [
                {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every women\'s fashion item verified by our experts'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only genuine luxury women\'s fashion'
                },
                {
                    icon: '🚚',
                    title: 'FREE SHIPPING',
                    description: 'Free shipping on all orders above ₹1999'
                }
            ],
            apiSlug: 'Women',
            seoKeywords: ['womens fashion', 'designer dresses', 'luxury handbags', 'pre-loved women', 'fashion accessories']
        },
        'footwear': {
            title: 'FOOTWEAR',
            subtitle: 'Step into style with luxury pre-loved footwear',
            banner: '/banners/footwear new.png',
            metaTitle: 'Luxury Footwear | Pre-Loved Designer Shoes',
            metaDescription: 'Authentic pre-loved luxury footwear. From sneakers to formal shoes, all verified.',
            whyTitle: 'WHY SHOP FOOTWEAR AT JUST BECHO',
            features: [
                {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every pair verified by footwear experts'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only genuine luxury footwear in perfect condition'
                },
                {
                    icon: '🚚',
                    title: 'FREE SHIPPING',
                    description: 'Free shipping on all orders above ₹1999'
                }
            ],
            apiSlug: 'Footwear',
            seoKeywords: ['designer shoes', 'luxury sneakers', 'pre-loved footwear', 'branded shoes', 'footwear']
        },
        'accessories': {
            title: 'ACCESSORIES',
            subtitle: 'Complete your look with luxury accessories',
            banner: '/banners/accessories new.png',
            metaTitle: 'Luxury Accessories | Pre-Loved Designer Accessories',
            metaDescription: 'Authentic pre-loved luxury accessories. Bags, belts, jewelry and more.',
            whyTitle: 'WHY SHOP ACCESSORIES AT JUST BECHO',
            features: [
                {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every accessory verified by our experts'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only genuine luxury accessories'
                },
                {
                    icon: '🚚',
                    title: 'FREE SHIPPING',
                    description: 'Free shipping on all orders above ₹1499'
                }
            ],
            apiSlug: 'Accessories',
            seoKeywords: ['luxury accessories', 'designer bags', 'pre-loved jewelry', 'fashion accessories', 'belts']
        },
        'watches': {
            title: 'WATCHES',
            subtitle: 'Timeless luxury timepieces',
            banner: '/banners/watches new.png',
            metaTitle: 'Luxury Watches | Pre-Loved Designer Watches',
            metaDescription: 'Authentic pre-loved luxury watches. Rolex, Omega, Tag Heuer and more.',
            whyTitle: 'WHY SHOP WATCHES AT JUST BECHO',
            features: [
                {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every watch verified by horology experts'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only genuine luxury watches'
                },
                {
                    icon: '🚚',
                    title: 'FREE SHIPPING',
                    description: 'Free shipping on all orders above ₹2999'
                }
            ],
            apiSlug: 'Watches',
            seoKeywords: ['luxury watches', 'rolex', 'designer watches', 'pre-loved watches', 'timepieces']
        },
        'perfumes': {
            title: 'PERFUMES',
            subtitle: 'Signature scents and luxury fragrances',
            banner: '/banners/perfumes new.png',
            metaTitle: 'Luxury Perfumes | Designer Fragrances',
            metaDescription: 'Authentic luxury perfumes and fragrances. Chanel, Dior, Gucci and more.',
            whyTitle: 'WHY SHOP PERFUMES AT JUST BECHO',
            features: [
                {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every perfume verified by fragrance experts'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only genuine luxury fragrances'
                },
                {
                    icon: '🚚',
                    title: 'FREE SHIPPING',
                    description: 'Free shipping on all orders above ₹1499'
                }
            ],
            apiSlug: 'Perfumes',
            seoKeywords: ['designer perfumes', 'luxury fragrances', 'cologne', 'perfume', 'scents']
        },
        'toys': {
            title: 'TOYS & COLLECTIBLES',
            subtitle: 'Luxury toys and collectible treasures',
            banner: '/banners/Toys and Figurines.png',
            metaTitle: 'Luxury Toys | Collectibles & Figurines',
            metaDescription: 'Rare and luxury toys & collectibles. Authentic items at great prices.',
            whyTitle: 'WHY SHOP TOYS AT JUST BECHO',
            features: [
                {
                    icon: '🛡️',
                    title: 'SAFETY GUARANTEED',
                    description: 'Every item verified for quality and safety'
                },
                {
                    icon: '💎',
                    title: 'GENTLY USED',
                    description: 'Only gently used toys and collectibles'
                },
                {
                    icon: '🚚',
                    title: 'FREE SHIPPING',
                    description: 'Free shipping on all orders above ₹1299'
                }
            ],
            apiSlug: 'Toys',
            seoKeywords: ['luxury toys', 'collectibles', 'figurines', 'pre-loved toys', 'rare toys']
        },
        'kids-fashion': {
            title: "KID'S FASHION",
            subtitle: 'Adorable luxury fashion for kids',
            banner: '/banners/kids new.png',
            metaTitle: 'Kids Luxury Fashion | Designer Kids Clothes',
            metaDescription: 'Authentic pre-loved luxury fashion for kids. Premium brands for children.',
            whyTitle: "WHY SHOP KIDS FASHION AT JUST BECHO",
            features: [
                {
                    icon: '🛡️',
                    title: 'SAFETY GUARANTEED',
                    description: 'Every kids item verified for safety and quality standards'
                },
                {
                    icon: '💎',
                    title: 'GENTLY USED',
                    description: 'Only gently used kids fashion items in perfect condition'
                },
                {
                    icon: '🚚',
                    title: 'FREE SHIPPING',
                    description: 'Free shipping on all orders above ₹1499'
                }
            ],
            apiSlug: 'Kids',
            seoKeywords: ['kids fashion', 'children clothes', 'designer kids', 'pre-loved kids', 'baby clothes']
        },
    'Influencer': {
      title: "INFLUENCER ONLY",
      subtitle: 'Adorable luxury Influencer fashion',
      banner: '/banners/influencer.jpeg',
      metaTitle: 'Influencer Fashion | Designer Influencer Clothes',
      metaDescription: 'Authentic pre-loved luxury fashion for influencers. Premium brands for influencers.',
      whyTitle: "WHY SHOP INFLUENCER'S ONLY AT JUST BECHO",
      features: [ 
        {
          icon: '🛡️',
          title: 'SAFETY GUARANTEED',
          description: 'Every kids item verified for safety and quality standards'
        },
        {
          icon: '💎',
          title: 'GENTLY USED',
          description: 'Only gently used kids fashion items in perfect condition'
        },
        {
          icon: '🚚',
          title: 'FREE SHIPPING',
          description: 'Free shipping on all orders above ₹1499'
        }
      ],
      apiSlug: 'influencer',
      seoKeywords: ['influencer fashion', 'influencer', 'designer influencer', 'pre-loved influencer']
    }
    }

    return configs[categorySlug] || getDefaultConfig(categorySlug)
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
                description: 'Every item undergoes rigorous verification'
            },
            {
                icon: '💎',
                title: 'PREMIUM QUALITY',
                description: 'Only gently used items in excellent condition'
            },
            {
                icon: '🚚',
                title: 'FREE SHIPPING',
                description: 'Free shipping on all orders above ₹1499'
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

    // ✅ NEW: Auth Modal state
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
    }

    const handleLoadMore = () => {
        fetchProducts(page + 1, true)
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
            <div className="relative w-full aspect-square overflow-hidden mb-3 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                <Image
                    src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                    alt={product.productName}
                    fill
                    className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                        <span className="text-white text-xs bg-black/70 px-2 py-1 rounded-full">
                            👁️ {product.views}
                        </span>
                    </div>
                )}

                {/* Likes Count */}
                {product.likes > 0 && (
                    <div className="absolute bottom-2 right-2">
                        <span className="text-white text-xs bg-red-500/70 px-2 py-1 rounded-full">
                            ❤️ {product.likes}
                        </span>
                    </div>
                )}
            </div>

            <div className="text-left px-1 space-y-2">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
            ))}
        </div>
    )

    return (
        <>
            <Header />

            <div className="bg-white">
                <div className="pt-32 md:pt-36"></div>

                {/* ✅ Hero Banner */}
                <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>

                    {/* Banner Image with object-fit: cover */}
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

                    {/* Content */}
                    <div className="relative z-20 h-full flex flex-col justify-center items-center text-white px-4">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
                            {config.title || 'CATEGORY'}
                        </h1>
                        <p className="text-lg md:text-xl text-center max-w-2xl mb-8">
                            {config.subtitle || 'Explore our collection'}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                                className="bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
                            >
                                SHOP NOW
                            </button>
                            <button
                                onClick={handleSellItems}
                                className="border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-gray-900 transition-colors text-center"
                            >
                                SELL ITEMS
                            </button>
                        </div>
                    </div>
                </div>

                {/* ✅ Products Section */}
                <section id="products" className="py-12 md:py-16">
                    <div className="max-w-[1700px] mx-auto px-4 sm:px-6">

                        {/* ✅ Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center gap-2 text-red-700">
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                </div>
                                <button
                                    onClick={() => fetchProducts(1, false)}
                                    className="mt-2 text-red-600 underline text-sm"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        <div className="flex flex-col lg:flex-row gap-8">

                            {/* ✅ Sidebar Filters */}
                            <div className="lg:w-80 flex-shrink-0">
                                <div className="bg-gray-50 rounded-2xl p-6 sticky top-44">

                                    {/* Filters Header */}
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-gray-900 text-lg font-light tracking-widest uppercase">
                                            FILTERS
                                        </h3>
                                        <button
                                            onClick={handleClearFilters}
                                            className="text-sm text-gray-500 hover:text-gray-700"
                                        >
                                            Clear All
                                        </button>
                                    </div>

                                    {/* Brands Filter */}
                                    {availableBrands.length > 0 && (
                                        <div className="mb-8">
                                            <h4 className="text-gray-700 text-sm font-medium mb-3">
                                                BRANDS ({availableBrands.length})
                                            </h4>
                                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                                {availableBrands.map(brand => (
                                                    <label key={brand} className="flex items-center space-x-3 cursor-pointer group py-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={filters.brands.includes(brand)}
                                                            onChange={() => handleBrandChange(brand)}
                                                            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                                                        />
                                                        <span className="text-gray-600 text-sm font-light group-hover:text-gray-900 transition-colors">
                                                            {brand}
                                                        </span>
                                                        <span className="text-gray-400 text-xs ml-auto">
                                                            ({products.filter(p => p.brand === brand).length})
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Condition Filter */}
                                    {availableConditions.length > 0 && (
                                        <div className="mb-8">
                                            <h4 className="text-gray-700 text-sm font-medium mb-3">
                                                CONDITION ({availableConditions.length})
                                            </h4>
                                            <div className="space-y-2">
                                                {availableConditions.map(condition => (
                                                    <label key={condition} className="flex items-center space-x-3 cursor-pointer group py-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={filters.conditions.includes(condition)}
                                                            onChange={() => handleConditionChange(condition)}
                                                            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                                                        />
                                                        <span className="text-gray-600 text-sm font-light group-hover:text-gray-900 transition-colors">
                                                            {condition}
                                                        </span>
                                                        <span className="text-gray-400 text-xs ml-auto">
                                                            ({products.filter(p => p.condition === condition).length})
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Price Filter */}
                                    <div>
                                        <h4 className="text-gray-700 text-sm font-medium mb-3">
                                            PRICE RANGE
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-500 block mb-1">Min</label>
                                                    <input
                                                        type="number"
                                                        placeholder="₹0"
                                                        value={filters.minPrice}
                                                        onChange={(e) => handlePriceChange(e.target.value, filters.maxPrice)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                                                        min="0"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-500 block mb-1">Max</label>
                                                    <input
                                                        type="number"
                                                        placeholder="₹100000"
                                                        value={filters.maxPrice}
                                                        onChange={(e) => handlePriceChange(filters.minPrice, e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                                                        min="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Active Filters Summary */}
                                    {(filters.brands.length > 0 || filters.conditions.length > 0 || filters.minPrice || filters.maxPrice) && (
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <h4 className="text-gray-700 text-sm font-medium mb-2">
                                                ACTIVE FILTERS
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {filters.brands.map(brand => (
                                                    <div key={brand} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                                                        <span className="text-gray-700">{brand}</span>
                                                        <button
                                                            onClick={() => handleBrandChange(brand)}
                                                            className="text-gray-400 hover:text-gray-600 text-xs"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                                {filters.conditions.map(condition => (
                                                    <div key={condition} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                                                        <span className="text-gray-700">{condition}</span>
                                                        <button
                                                            onClick={() => handleConditionChange(condition)}
                                                            className="text-gray-400 hover:text-gray-600 text-xs"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                                {filters.minPrice && (
                                                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                                                        <span className="text-gray-700">Min: ₹{filters.minPrice}</span>
                                                        <button
                                                            onClick={() => handlePriceChange('', filters.maxPrice)}
                                                            className="text-gray-400 hover:text-gray-600 text-xs"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )}
                                                {filters.maxPrice && (
                                                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                                                        <span className="text-gray-700">Max: ₹{filters.maxPrice}</span>
                                                        <button
                                                            onClick={() => handlePriceChange(filters.minPrice, '')}
                                                            className="text-gray-400 hover:text-gray-600 text-xs"
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

                                {/* Header with Stats */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                                    <div>
                                        <h2 className="text-gray-900 text-2xl font-light tracking-widest uppercase mb-1">
                                            {config.title || 'PRODUCTS'}
                                        </h2>
                                        <p className="text-gray-600 text-sm font-light">
                                            Showing {sortedProducts.length} of {products.length} products
                                            {loading && ' • Loading...'}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black bg-white"
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                            <option value="popular">Most Popular</option>
                                        </select>

                                        <button
                                            onClick={handleSellItems}
                                            className="bg-black text-white px-6 py-2 rounded-lg text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-colors whitespace-nowrap"
                                        >
                                            + SELL ITEM
                                        </button>
                                    </div>
                                </div>

                                {/* Loading State */}
                                {loading ? (
                                    <LoadingSkeleton />
                                ) :

                                    sortedProducts.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="text-gray-400 mb-4">
                                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 text-lg mb-2">No products found.</p>
                                            <p className="text-gray-400 text-sm mb-6">
                                                {products.length === 0
                                                    ? 'No products available in this category.'
                                                    : 'No products match your filters.'}
                                            </p>
                                            <div className="flex gap-4 justify-center">
                                                <button
                                                    onClick={handleClearFilters}
                                                    className="border-2 border-black text-black px-6 py-2 rounded-lg font-light tracking-widest uppercase hover:bg-black hover:text-white transition-all"
                                                >
                                                    Clear Filters
                                                </button>
                                                <button
                                                    onClick={handleSellItems}
                                                    className="bg-black text-white px-6 py-2 rounded-lg font-light tracking-widest uppercase hover:bg-gray-800 transition-all"
                                                >
                                                    Sell Items
                                                </button>
                                            </div>
                                        </div>
                                    ) :

                                        /* Products Grid */
                                        (
                                            <>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {sortedProducts.map(product => (
                                                        <ProductCard key={product._id} product={product} />
                                                    ))}
                                                </div>

                                                {/* Load More Button */}
                                                {hasMore && !loading && sortedProducts.length > 0 && (
                                                    <div className="text-center mt-12">
                                                        <button
                                                            onClick={handleLoadMore}
                                                            disabled={loadingMore}
                                                            className={`border-2 border-black text-black px-8 py-3 font-light tracking-widest uppercase transition-all duration-300 rounded-full ${loadingMore ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:text-white'}`}
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

                {/* ✅ Why Shop Section */}
                <section className="py-12 md:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-gray-900 text-3xl sm:text-4xl font-light tracking-widest uppercase mb-4">
                                {config.whyTitle || 'WHY SHOP AT JUST BECHO'}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {(config.features || []).map((feature, index) => (
                                <div key={index} className="text-center p-6">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-900 flex items-center justify-center">
                                        <span className="text-white text-2xl">{feature.icon || '✨'}</span>
                                    </div>
                                    <h3 className="text-gray-900 text-lg font-light tracking-widest uppercase mb-2">
                                        {feature.title || 'FEATURE'}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
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