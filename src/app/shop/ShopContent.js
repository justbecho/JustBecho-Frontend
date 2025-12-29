'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AuthModal from '@/components/ui/AuthModal'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'

export default function ShopContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const budgetFilter = searchParams.get('budget') || 'all'

    // ✅ Auth Modal state
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [authAction, setAuthAction] = useState(null)

    // State Management
    const [activeFilter, setActiveFilter] = useState(budgetFilter)
    const [sortBy, setSortBy] = useState('newest')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    // ✅ NEW: Mobile filter state (category page जैसा)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [expandedSections, setExpandedSections] = useState({
        brands: false,
        categories: false,
        conditions: false,
        price: false
    })

    // Filters
    const [filters, setFilters] = useState({
        brands: [],
        categories: [],
        conditions: [],
        minPrice: '',
        maxPrice: '',
        search: ''
    })

    const [availableBrands, setAvailableBrands] = useState([])
    const [availableCategories, setAvailableCategories] = useState([])
    const [availableConditions, setAvailableConditions] = useState([])
    const [error, setError] = useState(null)

    // Budget configurations
    const budgetConfigs = {
        'under-20k': {
            title: "PRODUCTS UNDER ₹20K",
            subtitle: "Affordable luxury items under ₹20,000",
            banner: "/banners/budget-20k.jpg",
            maxPrice: 20000,
            whyTitle: "WHY SHOP UNDER ₹20K AT JUST BECHO",
            features: [
                {
                    icon: '💰',
                    title: 'AFFORDABLE LUXURY',
                    description: 'Get authentic luxury items at 50-80% off retail prices'
                },
                {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every item verified by our luxury experts'
                },
                {
                    icon: '🚚',
                    title: 'FREE SHIPPING',
                    description: 'Free shipping on all orders above ₹1999'
                }
            ],
            color: 'bg-yellow-600'
        },
        'under-40k': {
            title: "PRODUCTS UNDER ₹40K", 
            subtitle: "Premium items under ₹40,000",
            banner: "/banners/budget-40k.jpg",
            maxPrice: 40000,
            whyTitle: "WHY SHOP UNDER ₹40K AT JUST BECHO",
            features: [
                {
                    icon: '💎',
                    title: 'PREMIUM LUXURY',
                    description: 'Get premium luxury items at 50-70% off retail prices'
                },
                {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every item verified by our luxury experts'
                },
                {
                    icon: '🚚',
                    title: 'FREE SHIPPING',
                    description: 'Free shipping on all orders above ₹1999'
                }
            ],
            color: 'bg-blue-600'
        },
        'under-60k': {
            title: "PRODUCTS UNDER ₹60K",
            subtitle: "High-end luxury under ₹60,000",
            banner: "/banners/budget-60k.jpg",
            maxPrice: 60000,
            whyTitle: "WHY SHOP UNDER ₹60K AT JUST BECHO",
            features: [
                {
                    icon: '👑',
                    title: 'HIGH-END LUXURY',
                    description: 'Get high-end luxury items at 40-60% off retail prices'
                },
                {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every item verified by our luxury experts'
                },
                {
                    icon: '🚚',
                    title: 'FREE SHIPPING',
                    description: 'Free shipping on all orders above ₹1999'
                }
            ],
            color: 'bg-purple-600'
        },
        'all': {
            title: "ALL PRODUCTS",
            subtitle: "Explore our complete luxury collection",
            banner: "/banners/all-products.jpg",
            maxPrice: null,
            whyTitle: "WHY SHOP AT JUST BECHO",
            features: [
                {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every product verified by luxury experts'
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
            color: 'bg-gray-900'
        }
    }

    const config = budgetConfigs[activeFilter] || budgetConfigs.all

    // ✅ Reset filters when budget changes
    useEffect(() => {
        if (config.maxPrice) {
            setFilters(prev => ({
                ...prev,
                maxPrice: config.maxPrice.toString()
            }))
        } else {
            setFilters(prev => ({
                ...prev,
                maxPrice: ''
            }))
        }
    }, [activeFilter])

    // ✅ Auth Modal close handler
    const handleAuthModalClose = () => {
        setShowAuthModal(false)
        setAuthAction(null)
    }

    // ✅ SELL ITEMS button handler
    const handleSellItems = () => {
        const token = localStorage.getItem('token')
        if (!token) {
            setAuthAction('sell')
            setShowAuthModal(true)
            return
        }
        router.push('/sell-now')
    }

    // ✅ Handle budget filter change
    const handleBudgetChange = (budgetType) => {
        setActiveFilter(budgetType)
        setPage(1)
        router.push(`/shop?budget=${budgetType}`, { scroll: false })
    }

    // ✅ FIXED: Optimized product fetching with budget filter
    const fetchProducts = useCallback(async (pageNum = 1, isLoadMore = false) => {
        try {
            if (pageNum === 1) {
                setLoading(true)
            } else {
                setLoadingMore(true)
            }

            setError(null)

            const queryParams = new URLSearchParams()
            queryParams.append('sort', sortBy)
            queryParams.append('page', pageNum)
            queryParams.append('limit', 12)

            if (filters.brands.length > 0) {
                queryParams.append('brand', filters.brands.join(','))
            }

            if (filters.categories.length > 0) {
                queryParams.append('category', filters.categories.join(','))
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

            const apiUrl = `https://just-becho-backend.vercel.app/api/products?${queryParams.toString()}`

            console.log('📡 [SHOP PAGE] Fetching products from:', apiUrl)

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

                if (pageNum === 1) {
                    const brands = [...new Set(data.products.map(p => p.brand).filter(Boolean))]
                    const categories = [...new Set(data.products.map(p => p.category).filter(Boolean))]
                    const conditions = [...new Set(data.products.map(p => p.condition).filter(Boolean))]

                    setAvailableBrands(brands)
                    setAvailableCategories(categories)
                    setAvailableConditions(conditions)
                }

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
    }, [sortBy, filters])

    // ✅ Initial fetch and filter/sort changes
    useEffect(() => {
        console.log('🔄 Triggering product fetch for budget:', activeFilter, 'filters:', filters)
        fetchProducts(1, false)
    }, [activeFilter, sortBy, filters.brands, filters.categories, filters.conditions, filters.minPrice, filters.maxPrice])

    // ✅ Update active filter when URL changes
    useEffect(() => {
        setActiveFilter(budgetFilter)
    }, [budgetFilter])

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

    const handleCategoryChange = (category) => {
        setFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
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
        if (config.maxPrice) {
            setFilters({
                brands: [],
                categories: [],
                conditions: [],
                minPrice: '',
                maxPrice: config.maxPrice.toString(),
                search: ''
            })
        } else {
            setFilters({
                brands: [],
                categories: [],
                conditions: [],
                minPrice: '',
                maxPrice: '',
                search: ''
            })
        }
        setPage(1)
        setShowMobileFilters(false)
    }

    const handleLoadMore = () => {
        fetchProducts(page + 1, true)
    }

    // ✅ Toggle section expansion for mobile (category page जैसा)
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    // ✅ Filtered and sorted products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
                return false
            }

            if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
                return false
            }

            if (filters.conditions.length > 0 && !filters.conditions.includes(product.condition)) {
                return false
            }

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

    // ✅ UPDATED: Sorting logic with all options
    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            switch (sortBy) {
                case 'alphabetical-az':
                    return (a.productName || '').localeCompare(b.productName || '')
                case 'alphabetical-za':
                    return (b.productName || '').localeCompare(a.productName || '')
                case 'price-low':
                    return (a.finalPrice || 0) - (b.finalPrice || 0)
                case 'price-high':
                    return (b.finalPrice || 0) - (a.finalPrice || 0)
                case 'newest':
                default:
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            }
        })
    }, [filteredProducts, sortBy])

    // ✅ Active filters count (category page जैसा)
    const activeFiltersCount = (
        (filters.brands.length > 0 ? 1 : 0) +
        (filters.categories.length > 0 ? 1 : 0) +
        (filters.conditions.length > 0 ? 1 : 0) +
        (filters.minPrice ? 1 : 0) +
        (filters.maxPrice ? 1 : 0)
    )

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
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    onError={(e) => {
                        e.target.src = '/placeholder-image.jpg'
                    }}
                />

                {product.condition && (
                    <div className="absolute top-2 left-2">
                        <span className="text-gray-900 text-xs font-light tracking-widest uppercase bg-white px-2 py-1 rounded-full">
                            {product.condition}
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

    return (
        <>
            <Header />

            <div className="bg-white">
                <div className="pt-32 md:pt-36"></div>

                {/* ✅ Hero Banner */}
                <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
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
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-widest uppercase text-center mb-4">
                                {config.title}
                            </h1>
                            <p className="text-lg md:text-xl text-center max-w-2xl mx-auto">
                                {config.subtitle}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ✅ Budget Filter Tabs */}
                <section className="py-6 bg-gray-50 border-b">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
                            <button
                                onClick={() => handleBudgetChange('all')}
                                className={`px-4 py-2 rounded-full text-sm font-light tracking-widest uppercase transition-all ${activeFilter === 'all' ? 'bg-black text-white' : 'bg-white text-gray-700 border hover:bg-gray-100'}`}
                            >
                                ALL PRODUCTS
                            </button>
                            <button
                                onClick={() => handleBudgetChange('under-20k')}
                                className={`px-4 py-2 rounded-full text-sm font-light tracking-widest uppercase transition-all ${activeFilter === 'under-20k' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-100'}`}
                            >
                                UNDER ₹20K
                            </button>
                            <button
                                onClick={() => handleBudgetChange('under-40k')}
                                className={`px-4 py-2 rounded-full text-sm font-light tracking-widest uppercase transition-all ${activeFilter === 'under-40k' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-100'}`}
                            >
                                UNDER ₹40K
                            </button>
                            <button
                                onClick={() => handleBudgetChange('under-60k')}
                                className={`px-4 py-2 rounded-full text-sm font-light tracking-widest uppercase transition-all ${activeFilter === 'under-60k' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-100'}`}
                            >
                                UNDER ₹60K
                            </button>
                        </div>
                    </div>
                </section>

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

                        {/* ✅ MOBILE FILTERS TOGGLE (category page जैसा) */}
                        <div className="lg:hidden mb-6">
                            <div className="flex items-center justify-between gap-4">
                                <button
                                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-light tracking-widest uppercase hover:bg-gray-50 transition-colors"
                                >
                                    <FiFilter className="w-4 h-4" />
                                    Filters
                                    {activeFiltersCount > 0 && (
                                        <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </button>
                                
                                {/* ✅ UPDATED: Mobile sorting dropdown */}
                                <div className="flex-1">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black bg-white"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="alphabetical-az">Alphabetical A-Z</option>
                                        <option value="alphabetical-za">Alphabetical Z-A</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                    </select>
                                </div>
                                
                                <button
                                    onClick={handleSellItems}
                                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-colors whitespace-nowrap"
                                >
                                    + SELL
                                </button>
                            </div>

                            {/* Active Filters Badges - Mobile */}
                            {(filters.brands.length > 0 || filters.categories.length > 0 || filters.conditions.length > 0 || filters.minPrice || filters.maxPrice) && (
                                <div className="mt-3 flex flex-wrap gap-2">
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
                                    {filters.categories.map(category => (
                                        <div key={category} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                                            <span className="text-gray-700">{category}</span>
                                            <button
                                                onClick={() => handleCategoryChange(category)}
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
                            )}
                        </div>

                        {/* ✅ MOBILE FILTERS MODAL (category page जैसा) */}
                        {showMobileFilters && (
                            <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
                                {/* Header */}
                                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
                                    <h3 className="text-lg font-light tracking-widest uppercase">Filters</h3>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={handleClearFilters}
                                            className="text-sm text-gray-500 hover:text-gray-700"
                                        >
                                            Clear All
                                        </button>
                                        <button
                                            onClick={() => setShowMobileFilters(false)}
                                            className="p-1 hover:bg-gray-100 rounded-full"
                                        >
                                            <FiX className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Filters Content */}
                                <div className="p-4 space-y-6 pb-24">
                                   

                                    {/* Brands Filter */}
                                    {availableBrands.length > 0 && (
                                        <div className="border-b border-gray-200 pb-4">
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
                                            )}
                                        </div>
                                    )}

                                    {/* Categories Filter */}
                                    {availableCategories.length > 0 && (
                                        <div className="border-b border-gray-200 pb-4">
                                            <button
                                                onClick={() => toggleSection('categories')}
                                                className="flex items-center justify-between w-full text-left mb-2"
                                            >
                                                <h4 className="text-gray-900 text-sm font-medium">
                                                    CATEGORIES ({availableCategories.length})
                                                </h4>
                                                {expandedSections.categories ? (
                                                    <FiChevronUp className="w-4 h-4 text-gray-500" />
                                                ) : (
                                                    <FiChevronDown className="w-4 h-4 text-gray-500" />
                                                )}
                                            </button>
                                            
                                            {expandedSections.categories && (
                                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                                    {availableCategories.map(category => (
                                                        <label key={category} className="flex items-center space-x-3 cursor-pointer group py-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={filters.categories.includes(category)}
                                                                onChange={() => handleCategoryChange(category)}
                                                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                                                            />
                                                            <span className="text-gray-600 text-sm font-light group-hover:text-gray-900 transition-colors">
                                                                {category}
                                                            </span>
                                                            <span className="text-gray-400 text-xs ml-auto">
                                                                ({products.filter(p => p.category === category).length})
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Condition Filter */}
                                    {availableConditions.length > 0 && (
                                        <div className="border-b border-gray-200 pb-4">
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
                                            )}
                                        </div>
                                    )}

                                    {/* Price Filter */}
                                    <div className="border-b border-gray-200 pb-4">
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
                                                            max={filters.maxPrice ? filters.maxPrice - 1 : ''}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-xs text-gray-500 block mb-1">Max</label>
                                                        <input
                                                            type="number"
                                                            placeholder={config.maxPrice ? `₹${config.maxPrice}` : '₹100000'}
                                                            value={filters.maxPrice}
                                                            onChange={(e) => handlePriceChange(filters.minPrice, e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                                                            min="0"
                                                            max={config.maxPrice || 1000000}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    <p>
                                                        Price Range: ₹{filters.minPrice || 0} - ₹{filters.maxPrice || (config.maxPrice ? config.maxPrice.toLocaleString() : 'Any')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Apply Button */}
                                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="w-full bg-black text-white py-3 rounded-lg text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-colors"
                                    >
                                        Apply Filters ({activeFiltersCount})
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* ✅ DESKTOP Sidebar Filters */}
                            <div className="hidden lg:block lg:w-80 flex-shrink-0">
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

                                    {/* Categories Filter */}
                                    {availableCategories.length > 0 && (
                                        <div className="mb-8">
                                            <h4 className="text-gray-700 text-sm font-medium mb-3">
                                                CATEGORIES ({availableCategories.length})
                                            </h4>
                                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                                {availableCategories.map(category => (
                                                    <label key={category} className="flex items-center space-x-3 cursor-pointer group py-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={filters.categories.includes(category)}
                                                            onChange={() => handleCategoryChange(category)}
                                                            className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                                                        />
                                                        <span className="text-gray-600 text-sm font-light group-hover:text-gray-900 transition-colors">
                                                            {category}
                                                        </span>
                                                        <span className="text-gray-400 text-xs ml-auto">
                                                            ({products.filter(p => p.category === category).length})
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
                                                        max={filters.maxPrice ? filters.maxPrice - 1 : ''}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs text-gray-500 block mb-1">Max</label>
                                                    <input
                                                        type="number"
                                                        placeholder={config.maxPrice ? `₹${config.maxPrice}` : '₹100000'}
                                                        value={filters.maxPrice}
                                                        onChange={(e) => handlePriceChange(filters.minPrice, e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
                                                        min="0"
                                                        max={config.maxPrice || 1000000}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                <p>
                                                    Price Range: ₹{filters.minPrice || 0} - ₹{filters.maxPrice || (config.maxPrice ? config.maxPrice.toLocaleString() : 'Any')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Active Filters Summary */}
                                    {(filters.brands.length > 0 || filters.categories.length > 0 || filters.conditions.length > 0 || filters.minPrice || filters.maxPrice) && (
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
                                                {filters.categories.map(category => (
                                                    <div key={category} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                                                        <span className="text-gray-700">{category}</span>
                                                        <button
                                                            onClick={() => handleCategoryChange(category)}
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

                                {/* DESKTOP Header with Stats */}
                                <div className="hidden lg:flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                                    <div>
                                        <h2 className="text-gray-900 text-2xl font-light tracking-widest uppercase mb-1">
                                            {config.title}
                                        </h2>
                                        <p className="text-gray-600 text-sm font-light">
                                            Showing {sortedProducts.length} of {products.length} products
                                            {config.maxPrice && ` under ₹${config.maxPrice.toLocaleString()}`}
                                            {loading && ' • Loading...'}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* ✅ UPDATED: Desktop sorting dropdown */}
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black bg-white"
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="alphabetical-az">Alphabetical A-Z</option>
                                            <option value="alphabetical-za">Alphabetical Z-A</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                        </select>

                                        <button
                                            onClick={handleSellItems}
                                            className="bg-black text-white px-6 py-2 rounded-lg text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-colors whitespace-nowrap"
                                        >
                                            + SELL ITEM
                                        </button>
                                    </div>
                                </div>

                                {/* MOBILE Header Title */}
                                <div className="lg:hidden mb-6">
                                    <h2 className="text-gray-900 text-xl font-light tracking-widest uppercase mb-1">
                                        {config.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm font-light">
                                        Showing {sortedProducts.length} of {products.length} products
                                        {config.maxPrice && ` under ₹${config.maxPrice.toLocaleString()}`}
                                        {loading && ' • Loading...'}
                                    </p>
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
                                            <p className="text-gray-500 text-lg mb-2">
                                                {config.maxPrice 
                                                    ? `No products found under ₹${config.maxPrice.toLocaleString()}.`
                                                    : 'No products found.'
                                                }
                                            </p>
                                            <p className="text-gray-400 text-sm mb-6">
                                                {products.length === 0
                                                    ? 'No products available in this price range.'
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

                                        /* ✅ UPDATED: Products Grid - Mobile: 2 columns, Desktop: 3 columns (category page जैसा) */
                                        (
                                            <>
                                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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
                                {config.whyTitle}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {config.features.map((feature, index) => (
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

                {/* ✅ Explore Categories Section */}
                <section className="py-12 md:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-8">
                            <h2 className="text-gray-900 text-2xl font-light tracking-widest uppercase mb-2">
                                EXPLORE CATEGORIES
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Discover more luxury items by category
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link
                                href="/categories/men"
                                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                            >
                                <div className="relative h-48 w-full">
                                    <Image
                                        src="/banners/mens new.jpeg"
                                        alt="Men's Fashion"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <h3 className="text-lg font-light tracking-widest uppercase mb-1">
                                            MEN'S FASHION
                                        </h3>
                                        <p className="text-xs opacity-90">
                                            Premium men's luxury items
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/categories/women"
                                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                            >
                                <div className="relative h-48 w-full">
                                    <Image
                                        src="/banners/womens new.png"
                                        alt="Women's Fashion"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <h3 className="text-lg font-light tracking-widest uppercase mb-1">
                                            WOMEN'S FASHION
                                        </h3>
                                        <p className="text-xs opacity-90">
                                            Luxury women's collections
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/categories/footwear"
                                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                            >
                                <div className="relative h-48 w-full">
                                    <Image
                                        src="/banners/footwear new.png"
                                        alt="Footwear"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <h3 className="text-lg font-light tracking-widest uppercase mb-1">
                                            FOOTWEAR
                                        </h3>
                                        <p className="text-xs opacity-90">
                                            Luxury shoes and sneakers
                                        </p>
                                    </div>
                                </div>
                            </Link>
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