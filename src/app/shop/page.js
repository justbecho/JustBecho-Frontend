'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ShopPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const budgetFilter = searchParams.get('budget') || 'all'

    const [activeFilter, setActiveFilter] = useState(budgetFilter)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    // Budget configurations
    const budgetConfigs = {
        'under-20k': {
            title: "PRODUCTS UNDER ₹20K",
            subtitle: "Affordable luxury items under ₹20,000",
            banner: "/banners/budget-20k.jpg",
            maxPrice: 20000,
        },
        'under-40k': {
            title: "PRODUCTS UNDER ₹40K", 
            subtitle: "Premium items under ₹40,000",
            banner: "/banners/budget-40k.jpg",
            maxPrice: 40000,
        },
        'under-60k': {
            title: "PRODUCTS UNDER ₹60K",
            subtitle: "High-end luxury under ₹60,000",
            banner: "/banners/budget-60k.jpg",
            maxPrice: 60000,
        },
        'all': {
            title: "ALL PRODUCTS",
            subtitle: "Explore our complete luxury collection",
            banner: "/banners/all-products.jpg",
            maxPrice: null,
        }
    }

    const config = budgetConfigs[activeFilter] || budgetConfigs.all

    // Simple product fetching
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const apiUrl = `https://just-becho-backend.vercel.app/api/products?limit=12`
                const response = await fetch(apiUrl)
                const data = await response.json()
                
                if (data.success && data.products) {
                    // Apply budget filter
                    const filtered = data.products.filter(product => {
                        if (!config.maxPrice) return true
                        const price = product.finalPrice || 0
                        return price <= config.maxPrice
                    })
                    setProducts(filtered)
                }
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [activeFilter])

    // Handle budget filter change
    const handleBudgetChange = (budgetType) => {
        setActiveFilter(budgetType)
        router.push(`/shop?budget=${budgetType}`, { scroll: false })
    }

    return (
        <>
            <Header />
            
            <div className="bg-white">
                <div className="pt-32 md:pt-36"></div>

                {/* Hero Banner */}
                <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
                    <div className="absolute inset-0">
                        <Image
                            src={config.banner || '/banners/default-banner.jpg'}
                            alt={config.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-widest uppercase text-center mb-4">
                                {config.title}
                            </h1>
                            <p className="text-md md:text-lg text-center max-w-2xl mx-auto">
                                {config.subtitle}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Budget Filter Tabs */}
                <section className="py-6 bg-gray-50 border-b">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
                            {Object.keys(budgetConfigs).map(budgetType => (
                                <button
                                    key={budgetType}
                                    onClick={() => handleBudgetChange(budgetType)}
                                    className={`px-4 py-2 rounded-full text-sm font-light tracking-widest uppercase transition-all ${activeFilter === budgetType ? 'bg-black text-white' : 'bg-white text-gray-700 border hover:bg-gray-100'}`}
                                >
                                    {budgetConfigs[budgetType].title}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Products Section */}
                <section className="py-12 md:py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading products...</p>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map(product => (
                                    <Link
                                        key={product._id}
                                        href={`/products/${product._id}`}
                                        className="group block cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="relative w-full aspect-square overflow-hidden mb-3 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                                            <Image
                                                src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                                                alt={product.productName}
                                                fill
                                                className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="text-left space-y-2">
                                            <h3 className="text-gray-900 text-sm font-light tracking-widest uppercase line-clamp-2">
                                                {product.productName?.toUpperCase()}
                                            </h3>
                                            <p className="text-gray-900 text-base font-light">
                                                ₹{(product.finalPrice || 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    No products found {config.maxPrice ? `under ₹${config.maxPrice.toLocaleString()}` : ''}
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
            
            <Footer />
        </>
    )
}