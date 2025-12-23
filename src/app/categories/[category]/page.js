import CategoryClient from './CategoryClient'
import { notFound } from 'next/navigation'

// ✅ Static params for pre-rendering - ADDED COMMON CATEGORIES
export async function generateStaticParams() {
  return [
    { category: 'men' },
    { category: 'women' },
    { category: 'footwear' },
    { category: 'accessories' },
    { category: 'watches' },
    { category: 'perfumes' },
    { category: 'toys' },
    { category: 'kids-fashion' },
    { category: 'bags' },
    { category: 'jewelry' },
    { category: 'electronics' },
    { category: 'home-decor' }
  ].map(({ category }) => ({ category }))
}

// ✅ Metadata for SEO - IMPROVED FOR MOBILE
export async function generateMetadata({ params }) {
  try {
    const { category } = params
    
    const categoryConfig = getCategoryConfig(category)
    
    return {
      title: `${categoryConfig.title} | Just Becho - Luxury Pre-Loved Fashion`,
      description: categoryConfig.subtitle,
      keywords: categoryConfig.seoKeywords.join(', '),
      authors: [{ name: 'Just Becho' }],
      creator: 'Just Becho',
      publisher: 'Just Becho',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 5,
      },
      openGraph: {
        title: categoryConfig.metaTitle || categoryConfig.title,
        description: categoryConfig.metaDescription || categoryConfig.subtitle,
        url: `https://justbecho.com/category/${category}`,
        siteName: 'Just Becho',
        images: [
          {
            url: categoryConfig.banner,
            width: 1200,
            height: 630,
            alt: categoryConfig.title,
          },
        ],
        locale: 'en_IN',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: categoryConfig.metaTitle || categoryConfig.title,
        description: categoryConfig.metaDescription || categoryConfig.subtitle,
        images: [categoryConfig.banner],
        creator: '@justbecho',
      },
      alternates: {
        canonical: `https://justbecho.com/category/${category}`,
      },
    }
  } catch (error) {
    return {
      title: 'Luxury Fashion | Just Becho',
      description: 'Discover premium pre-loved luxury fashion at amazing prices',
      robots: {
        index: true,
        follow: true,
      },
    }
  }
}

// ✅ Enhanced category configuration with responsive info
function getCategoryConfig(categorySlug) {
  const configs = {
    'men': {
      title: "MEN'S FASHION",
      subtitle: 'Discover luxury pre-loved fashion for men - Premium brands at amazing prices',
      banner: '/banners/mens new.jpeg',
      mobileBanner: '/banners/mens-mobile.jpg', // Add mobile-optimized banner
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
        },
        {
          icon: '💳',
          title: 'EASY RETURNS',
          description: '14-day return policy on all items'
        }
      ],
      apiSlug: 'Men',
      seoKeywords: ['mens fashion', 'pre-loved men', 'luxury brands', 'designer clothes', 'second hand', 'mens wear'],
      popularBrands: ['Nike', 'Adidas', 'Zara', 'H&M', 'Louis Vuitton', 'Gucci'],
      colorPalette: ['#1a1a1a', '#4a5568', '#718096'] // For UI theming
    },
    'women': {
      title: "WOMEN'S FASHION",
      subtitle: 'Explore curated luxury fashion for women - Designer pieces reimagined',
      banner: '/banners/womens new.png',
      mobileBanner: '/banners/womens-mobile.jpg',
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
        },
        {
          icon: '💳',
          title: 'EASY RETURNS',
          description: '14-day return policy on all items'
        }
      ],
      apiSlug: 'Women',
      seoKeywords: ['womens fashion', 'designer dresses', 'luxury handbags', 'pre-loved women', 'fashion accessories'],
      popularBrands: ['Zara', 'H&M', 'Mango', 'Forever 21', 'Gucci', 'Chanel'],
      colorPalette: ['#4a154b', '#e53e3e', '#f56565']
    },
    'footwear': {
      title: 'FOOTWEAR',
      subtitle: 'Step into style with luxury pre-loved footwear',
      banner: '/banners/footwear new.png',
      mobileBanner: '/banners/footwear-mobile.jpg',
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
        },
        {
          icon: '📏',
          title: 'SIZE GUIDE',
          description: 'Detailed size charts available'
        }
      ],
      apiSlug: 'Footwear',
      seoKeywords: ['designer shoes', 'luxury sneakers', 'pre-loved footwear', 'branded shoes', 'footwear'],
      popularBrands: ['Nike', 'Adidas', 'Puma', 'Converse', 'Gucci', 'Prada'],
      colorPalette: ['#2d3748', '#4a5568', '#a0aec0']
    },
    'accessories': {
      title: 'ACCESSORIES',
      subtitle: 'Complete your look with luxury accessories',
      banner: '/banners/accessories new.png',
      mobileBanner: '/banners/accessories-mobile.jpg',
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
        },
        {
          icon: '🎁',
          title: 'GIFT READY',
          description: 'Perfect for gifting, comes with packaging'
        }
      ],
      apiSlug: 'Accessories',
      seoKeywords: ['luxury accessories', 'designer bags', 'pre-loved jewelry', 'fashion accessories', 'belts'],
      popularBrands: ['Louis Vuitton', 'Gucci', 'Chanel', 'Prada', 'Michael Kors'],
      colorPalette: ['#744210', '#d69e2e', '#ed8936']
    },
    'watches': {
      title: 'WATCHES',
      subtitle: 'Timeless luxury timepieces',
      banner: '/banners/watches new.png',
      mobileBanner: '/banners/watches-mobile.jpg',
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
        },
        {
          icon: '⏱️',
          title: 'SERVICED',
          description: 'All watches are serviced and cleaned'
        }
      ],
      apiSlug: 'Watches',
      seoKeywords: ['luxury watches', 'rolex', 'designer watches', 'pre-loved watches', 'timepieces'],
      popularBrands: ['Rolex', 'Omega', 'Tag Heuer', 'Casio', 'Fossil', 'Titan'],
      colorPalette: ['#1a202c', '#2d3748', '#4a5568']
    },
    'perfumes': {
      title: 'PERFUMES',
      subtitle: 'Signature scents and luxury fragrances',
      banner: '/banners/perfumes new.png',
      mobileBanner: '/banners/perfumes-mobile.jpg',
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
        },
        {
          icon: '🧪',
          title: 'ORIGINAL SEAL',
          description: 'All perfumes come with original seal'
        }
      ],
      apiSlug: 'Perfumes',
      seoKeywords: ['designer perfumes', 'luxury fragrances', 'cologne', 'perfume', 'scents'],
      popularBrands: ['Chanel', 'Dior', 'Gucci', 'Versace', 'Calvin Klein', 'Davidoff'],
      colorPalette: ['#805ad5', '#9f7aea', '#d6bcfa']
    },
    'toys': {
      title: 'TOYS & COLLECTIBLES',
      subtitle: 'Luxury toys and collectible treasures',
      banner: '/banners/Toys and Figurines.png',
      mobileBanner: '/banners/toys-mobile.jpg',
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
        },
        {
          icon: '🧼',
          title: 'SANITIZED',
          description: 'All toys are thoroughly cleaned and sanitized'
        }
      ],
      apiSlug: 'Toys',
      seoKeywords: ['luxury toys', 'collectibles', 'figurines', 'pre-loved toys', 'rare toys'],
      popularBrands: ['LEGO', 'Funko', 'Hasbro', 'Mattel', 'Hot Wheels'],
      colorPalette: ['#e53e3e', '#f56565', '#fed7d7']
    },
    'kids-fashion': {
      title: "KID'S FASHION",
      subtitle: 'Adorable luxury fashion for kids',
      banner: '/banners/kids new.png',
      mobileBanner: '/banners/kids-mobile.jpg',
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
        },
        {
          icon: '👶',
          title: 'KID-FRIENDLY',
          description: 'All materials are child-safe and non-toxic'
        }
      ],
      apiSlug: 'Kids',
      seoKeywords: ['kids fashion', 'children clothes', 'designer kids', 'pre-loved kids', 'baby clothes'],
      popularBrands: ['Carter\'s', 'Gap Kids', 'H&M Kids', 'Zara Kids', 'Mothercare'],
      colorPalette: ['#3182ce', '#63b3ed', '#bee3f8']
    }
  }

  return configs[categorySlug] || getDefaultConfig(categorySlug)
}

// ✅ Enhanced default configuration
function getDefaultConfig(categorySlug) {
  const formattedName = categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  
  return {
    title: formattedName.toUpperCase(),
    subtitle: `Discover premium ${formattedName.toLowerCase()} at amazing prices`,
    banner: '/banners/default-banner.jpg',
    mobileBanner: '/banners/default-banner-mobile.jpg',
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
      },
      {
        icon: '💳',
        title: 'EASY RETURNS',
        description: '14-day return policy on all items'
      }
    ],
    apiSlug: formattedName,
    seoKeywords: [formattedName.toLowerCase(), 'pre-loved', 'luxury', 'designer', 'second hand'],
    popularBrands: [],
    colorPalette: ['#1a1a1a', '#4a5568', '#718096']
  }
}

// ✅ Optimized product fetching with pagination support
async function fetchCategoryProducts(apiSlug, sortBy = 'newest', page = 1, limit = 24) {
  try {
    const apiUrl = `https://just-becho-backend.vercel.app/api/products?category=${encodeURIComponent(apiSlug)}&sort=${sortBy}&page=${page}&limit=${limit}`
    
    console.log('📡 [SERVER] Fetching products from:', apiUrl)
    
    const response = await fetch(apiUrl, {
      next: { 
        revalidate: 3600, // Revalidate every hour
        tags: [`category-${apiSlug}`] // Add cache tag for revalidation
      },
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })
    
    if (!response.ok) {
      console.log('⚠️ [SERVER] Products endpoint failed with status:', response.status)
      return []
    }
    
    const data = await response.json()
    
    if (data.success && data.products) {
      console.log(`✅ [SERVER] Found ${data.products.length} products for ${apiSlug}`)
      
      // Transform product data for better frontend performance
      return data.products.map(product => ({
        ...product,
        // Add responsive image URLs if available
        images: product.images?.map(img => ({
          ...img,
          responsiveUrls: {
            thumb: img.url + '?w=300&h=300&fit=crop',
            medium: img.url + '?w=600&h=600&fit=crop',
            large: img.url + '?w=1200&h=1200&fit=crop'
          }
        })) || []
      }))
    }
    
    return []
  } catch (error) {
    console.error('❌ [SERVER] Error fetching products:', error)
    return []
  }
}

// ✅ Fetch initial data for better performance
async function fetchInitialCategoryData(apiSlug) {
  try {
    // Fetch products and filters in parallel
    const [products, filters] = await Promise.allSettled([
      fetchCategoryProducts(apiSlug, 'newest', 1, 48),
      fetchCategoryFilters(apiSlug)
    ])

    return {
      products: products.status === 'fulfilled' ? products.value : [],
      filters: filters.status === 'fulfilled' ? filters.value : {
        brands: [],
        conditions: [],
        priceRange: { min: 0, max: 100000 }
      }
    }
  } catch (error) {
    console.error('❌ [SERVER] Error fetching initial data:', error)
    return {
      products: [],
      filters: {
        brands: [],
        conditions: [],
        priceRange: { min: 0, max: 100000 }
      }
    }
  }
}

// ✅ Fetch filters separately for better performance
async function fetchCategoryFilters(apiSlug) {
  try {
    const apiUrl = `https://just-becho-backend.vercel.app/api/products/filters?category=${encodeURIComponent(apiSlug)}`
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 7200 } // Revalidate every 2 hours
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch filters')
    }
    
    const data = await response.json()
    
    if (data.success) {
      return {
        brands: data.brands || [],
        conditions: data.conditions || [],
        priceRange: data.priceRange || { min: 0, max: 100000 }
      }
    }
    
    throw new Error('Invalid filters response')
  } catch (error) {
    console.error('❌ [SERVER] Error fetching filters:', error)
    return {
      brands: [],
      conditions: [],
      priceRange: { min: 0, max: 100000 }
    }
  }
}

// ✅ Main Server Component with loading states
export default async function CategoryPage({ params, searchParams }) {
  try {
    const { category } = params
    const { sort = 'newest', page = '1' } = searchParams
    
    console.log('🎯 Category Page - Slug:', category, 'Sort:', sort, 'Page:', page)
    
    if (!category) {
      notFound()
    }
    
    // ✅ Get category configuration
    const config = getCategoryConfig(category)
    
    // ✅ Fetch initial data
    const { products, filters } = await fetchInitialCategoryData(config.apiSlug)
    
    // ✅ Calculate additional stats
    const productStats = {
      totalProducts: products.length,
      priceStats: {
        average: products.length > 0 
          ? Math.round(products.reduce((sum, p) => sum + (p.finalPrice || 0), 0) / products.length)
          : 0,
        lowest: products.length > 0 
          ? Math.min(...products.map(p => p.finalPrice || 0))
          : 0,
        highest: products.length > 0 
          ? Math.max(...products.map(p => p.finalPrice || 0))
          : 0
      },
      conditionDistribution: products.reduce((acc, product) => {
        const condition = product.condition || 'Unknown'
        acc[condition] = (acc[condition] || 0) + 1
        return acc
      }, {}),
      brandDistribution: products.reduce((acc, product) => {
        const brand = product.brand || 'Unknown'
        acc[brand] = (acc[brand] || 0) + 1
        return acc
      }, {})
    }
    
    // ✅ Prepare optimized props for client component
    const clientProps = {
      categorySlug: category,
      apiCategory: config.apiSlug,
      config: {
        ...config,
        // Add mobile-specific configuration
        mobileConfig: {
          banner: config.mobileBanner || config.banner,
          featuresPerRow: 2, // Mobile shows 2 features per row
          showStats: false, // Hide stats on mobile
        },
        initialProductStats: productStats,
        initialFilters: filters,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(products.length / 24),
          hasNextPage: products.length >= 24,
          hasPrevPage: parseInt(page) > 1
        }
      },
      initialProducts: products.slice(0, 24), // Only send first page initially
      searchParams: {
        sort,
        page: parseInt(page)
      }
    }
    
    console.log(`✅ ${category.toUpperCase()} Page - Ready with ${products.length} products`)
    
    return <CategoryClient {...clientProps} />
    
  } catch (error) {
    console.error('💥 Error in CategoryPage:', error)
    
    // ✅ Enhanced error page with responsive design
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="pt-24 md:pt-32"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 md:py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-red-100 rounded-full mb-6 md:mb-8">
              <span className="text-3xl md:text-4xl">⚠️</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-6 md:mb-8 max-w-md mx-auto text-sm sm:text-base">
              We're having trouble loading this category. Please try again or check back later.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <a 
                href="/"
                className="inline-flex items-center justify-center bg-black text-white px-6 md:px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm md:text-base"
              >
                Return to Home
              </a>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-6 md:px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm md:text-base"
              >
                Try Again
              </button>
            </div>
            
            {/* Help Section */}
            <div className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-gray-200 max-w-lg mx-auto">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Need Help?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <a 
                  href="/contact" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Contact Support
                </a>
                <a 
                  href="/faq" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  View FAQs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// ✅ Optional: Pre-fetch popular categories
export async function generatePopularCategories() {
  const popularCategories = ['men', 'women', 'footwear', 'accessories']
  
  return await Promise.all(
    popularCategories.map(async (category) => {
      const config = getCategoryConfig(category)
      const products = await fetchCategoryProducts(config.apiSlug, 'popular', 1, 8)
      return {
        category,
        config,
        products: products.slice(0, 4) // Only need few for preview
      }
    })
  )
}