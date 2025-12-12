// app/categories/[category]/page.js - SIMPLIFIED VERSION
import CategoryClient from './CategoryClient'

// ✅ Static params - SIMPLE
export async function generateStaticParams() {
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

// ✅ Server Component - SIMPLIFIED
export default async function CategoryPage({ params }) {
    try {
        // ✅ DIRECT - No complex mapping
        const { category } = await params
        
        console.log('📋 Category Page - Slug:', category)
        
        if (!category) {
            throw new Error('Category parameter is required')
        }

        // ✅ DIRECT MAPPING - Backend expects these exact slugs
        const apiCategory = category // Just pass the slug as is
        
        // ✅ SIMPLE CONFIG
        const categoryConfig = {
            'men': {
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
            'women': {
                title: "WOMEN'S FASHION",
                subtitle: 'Explore curated luxury for women',
                banner: '/banners/bagu.jpeg',
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
                banner: '/banners/rolex.jpg',
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
            'toys': {
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
            'kids': {
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

        // ✅ Get config or use default
        const config = categoryConfig[category] || {
            title: category.toUpperCase(),
            subtitle: `Discover premium ${category}`,
            banner: '/banners/default-banner.jpg',
            whyTitle: `WHY SHOP ${category.toUpperCase()} AT JUST BECHO`,
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

        console.log('🎨 Config for category:', config.title)

        // ✅ Pass to client component
        return <CategoryClient
            categorySlug={category}
            apiCategory={apiCategory} // This is just 'men', 'women', etc.
            config={config}
        />

    } catch (error) {
        console.error('❌ Error in CategoryPage:', error)
        
        // Fallback
        return <CategoryClient
            categorySlug="men"
            apiCategory="men"
            config={{
                title: 'CATEGORY',
                subtitle: 'Explore our collection',
                banner: '/banners/default-banner.jpg',
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
            }}
        />
    }
}