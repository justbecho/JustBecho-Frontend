// app/categories/[category]/page.js - UPDATED SERVER COMPONENT
import CategoryClient from './CategoryClient'

// ✅ Server-side function for static generation
export async function generateStaticParams() {
    try {
        // ✅ Categories fetch karne ke liye correct API endpoint
        const apiUrl = 'https://just-becho-backend.vercel.app/api/categories'
        console.log('📡 Fetching categories from:', apiUrl)

        const response = await fetch(apiUrl, {
            next: { revalidate: 3600 } // 1 hour cache
        })

        if (response.ok) {
            const data = await response.json()

            if (data.success && data.categories) {
                console.log('✅ Categories found:', data.categories)

                // ✅ Backend categories ko slug mein convert karte hain
                const categories = data.categories.map(cat => {
                    // Category name ko slug mein convert
                    const categoryName = cat.name || cat

                    // Slug mapping for common categories
                    const slugMapping = {
                        "men's fashion": "men",
                        "men's clothing": "men",
                        "men": "men",
                        "women's fashion": "women",
                        "women's clothing": "women",
                        "women": "women",
                        "footwear": "footwear",
                        "shoes": "footwear",
                        "accessories": "accessories",
                        "watches": "watches",
                        "perfumes": "perfumes",
                        "fragrances": "perfumes",
                        "toys & collectibles": "toys",
                        "toys": "toys",
                        "collectibles": "toys",
                        "kids fashion": "kids",
                        "kids": "kids",
                        "children": "kids"
                    }

                    // Check slug mapping ya fir direct convert
                    const slug = slugMapping[categoryName.toLowerCase()] ||
                        categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

                    return {
                        category: slug
                    }
                })

                // Unique categories return karo
                const uniqueCategories = Array.from(
                    new Map(categories.map(item => [item.category, item])).values()
                )

                console.log('📋 Generated static params:', uniqueCategories)
                return uniqueCategories
            }
        } else {
            console.error('❌ Failed to fetch categories:', response.status)
        }
    } catch (error) {
        console.error('💥 Error fetching categories:', error)
    }

    // ✅ Fallback to default categories
    console.log('🔄 Using fallback categories')
    return [
        { category: 'men' },
        { category: 'women' },
        { category: 'footwear' },
        { category: 'accessories' },
        { category: 'watches' },
        { category: 'perfumes' },
        { category: 'toys' },
        { category: 'kids' }
    ]
}

// ✅ Server Component
export default async function CategoryPage({ params }) {
    try {
        // ✅ Pehle params ko await karo
        const { category } = await params
        console.log('📋 Received params:', { category })

        if (!category) {
            throw new Error('Category parameter is required')
        }

        // ✅ URL slug ko backend category name mein convert karo
        const getApiCategoryName = (slug) => {
            const slugMapping = {
                'men': "men's fashion",
                'mens': "men's fashion",
                'men-fashion': "men's fashion",
                'women': "women's fashion",
                'womens': "women's fashion",
                'women-fashion': "women's fashion",
                'footwear': 'footwear',
                'shoes': 'footwear',
                'sneakers': 'footwear',
                'accessories': 'accessories',
                'watches': 'watches',
                'perfumes': 'perfumes',
                'fragrances': 'perfumes',
                'toys': 'toys & collectibles',
                'collectibles': 'toys & collectibles',
                'kids': 'kids fashion',
                'children': 'kids fashion'
            }

            return slugMapping[slug] || slug.replace(/-/g, ' ')
        }

        const apiCategory = getApiCategoryName(category)
        console.log('🎯 API Category:', apiCategory)

        // ✅ Category configuration
        const categoryConfig = {
            "men's fashion": {
                title: "MEN'S FASHION",
                subtitle: 'Discover luxury fashion for men',
                banner: '/banners/Men_s Fashion.png',
                whyTitle: "WHY SHOP MEN'S FASHION AT JUST BECHO",
                features: [
                    {
                        icon: '🛡️',
                        title: 'AUTHENTICITY GUARANTEED',
                        description: 'Every men\'s fashion item verified by our luxury experts'
                    },
                    {
                        icon: '💎',
                        title: 'PREMIUM QUALITY',
                        description: 'Only genuine luxury men\'s fashion'
                    },
                    {
                        icon: '🚚',
                        title: 'FREE SHIPPING',
                        description: 'Free shipping on all orders above ₹1999'
                    }
                ]
            },
            "women's fashion": {
                title: "WOMEN'S FASHION",
                subtitle: 'Explore curated luxury for women',
                banner: '/banners/Women_s Fashion.png',
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
                ]
            },
            'footwear': {
                title: 'FOOTWEAR',
                subtitle: 'Step into style with luxury footwear',
                banner: '/banners/DIOR LOAFERS.png',
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
                        description: 'Only genuine luxury footwear'
                    },
                    {
                        icon: '🚚',
                        title: 'FREE SHIPPING',
                        description: 'Free shipping on all orders above ₹1999'
                    }
                ]
            },
            'accessories': {
                title: 'ACCESSORIES',
                subtitle: 'Complete your look with luxury accessories',
                banner: '/banners/Fashion Accessories.png',
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
                ]
            },
            'watches': {
                title: 'WATCHES',
                subtitle: 'Timeless luxury timepieces',
                banner: '/banners/Rolex.png',
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
                ]
            },
            'perfumes': {
                title: 'PERFUMES',
                subtitle: 'Signature scents and luxury fragrances',
                banner: '/banners/perfumes.png',
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
                ]
            },
            'toys & collectibles': {
                title: 'TOYS & COLLECTIBLES',
                subtitle: 'Luxury toys and collectible treasures',
                banner: '/banners/Toys and Figurines.png',
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
                ]
            },
            'kids fashion': {
                title: 'KIDS FASHION',
                subtitle: 'Adorable luxury fashion for kids',
                banner: '/banners/Kids Fashion.png',
                whyTitle: 'WHY SHOP KIDS FASHION AT JUST BECHO',
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
                ]
            }
        }

        // ✅ Configuration get function
        const getConfig = (apiCatName) => {
            if (!apiCatName || typeof apiCatName !== 'string') {
                apiCatName = 'accessories'
            }

            // Direct match dekhte hain
            if (categoryConfig[apiCatName]) {
                return categoryConfig[apiCatName]
            }

            // Partial match try karo
            const matchingKey = Object.keys(categoryConfig).find(key =>
                apiCatName.toLowerCase().includes(key.toLowerCase()) ||
                key.toLowerCase().includes(apiCatName.toLowerCase())
            )

            if (matchingKey) {
                return categoryConfig[matchingKey]
            }

            // ✅ Default configuration
            const bannerPath = '/categories/default-banner.jpg'

            const defaultConfig = {
                title: apiCatName.toUpperCase(),
                subtitle: `Discover premium ${apiCatName}`,
                banner: bannerPath,
                whyTitle: `WHY SHOP ${apiCatName.toUpperCase()} AT JUST BECHO`,
                features: [
                    {
                        icon: '🛡️',
                        title: 'AUTHENTICITY GUARANTEED',
                        description: 'Every item verified by our experts'
                    },
                    {
                        icon: '💎',
                        title: 'PREMIUM QUALITY',
                        description: 'Only genuine luxury items'
                    },
                    {
                        icon: '🚚',
                        title: 'FREE SHIPPING',
                        description: 'Free shipping on all orders above ₹1499'
                    }
                ]
            }

            return defaultConfig
        }

        const config = getConfig(apiCategory)
        console.log('🎨 Config loaded for category:', config.title)

        // ✅ Client component ko props pass karo
        return <CategoryClient
            categorySlug={category}
            apiCategory={apiCategory}
            config={config}
        />

    } catch (error) {
        console.error('❌ Error in CategoryPage:', error)

        // ✅ Error fallback
        const errorConfig = {
            title: 'CATEGORY',
            subtitle: 'Explore our collection',
            banner: '/categories/default-banner.jpg',
            whyTitle: 'WHY SHOP AT JUST BECHO',
            features: [
                {
                    icon: '🛡️',
                    title: 'AUTHENTICITY GUARANTEED',
                    description: 'Every item verified by our experts'
                },
                {
                    icon: '💎',
                    title: 'PREMIUM QUALITY',
                    description: 'Only genuine luxury items'
                },
                {
                    icon: '🚚',
                    title: 'FREE SHIPPING',
                    description: 'Free shipping on all orders above ₹1499'
                }
            ]
        }

        return <CategoryClient
            categorySlug={category || 'accessories'}
            apiCategory={category || 'accessories'}
            config={errorConfig}
        />
    }
}