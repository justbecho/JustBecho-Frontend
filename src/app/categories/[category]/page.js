import CategoryClient from './CategoryClient'
import { notFound } from 'next/navigation'

// ✅ Static params for pre-rendering
export async function generateStaticParams() {
  return [
    { category: 'men' },
    { category: 'women' },
    { category: 'footwear' },
    { category: 'accessories' },
    { category: 'watches' },
    { category: 'perfumes' },
    { category: 'toys' },
    { category: 'kids-fashion' }
  ]
}

// ✅ Metadata for SEO
export async function generateMetadata({ params }) {
  try {
    const { category } = params
    
    const categoryConfig = getCategoryConfig(category)
    
    return {
      title: `${categoryConfig.title} | Just Becho - Luxury Pre-Loved Fashion`,
      description: categoryConfig.subtitle,
      keywords: `${categoryConfig.title}, pre-loved fashion, luxury brands, second hand, ${category}`,
      openGraph: {
        title: categoryConfig.title,
        description: categoryConfig.subtitle,
        images: [categoryConfig.banner],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: categoryConfig.title,
        description: categoryConfig.subtitle,
        images: [categoryConfig.banner],
      }
    }
  } catch (error) {
    return {
      title: 'Luxury Fashion | Just Becho',
      description: 'Discover premium pre-loved luxury fashion',
    }
  }
}

// ✅ Helper function for category configuration
function getCategoryConfig(categorySlug) {
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
    'Influencer-only': {
      title: "INFLUENCER'S ONLY",
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

// ✅ Default config for unknown categories
function getDefaultConfig(categorySlug) {
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

// ✅ Fetch products from API - FIXED ENDPOINT
async function fetchCategoryProducts(apiSlug, sortBy = 'newest') {
  try {
    // ✅ CORRECT API ENDPOINT: Use /api/products with category parameter
const apiUrl = `https://just-becho-backend.vercel.app/api/products?category=${encodeURIComponent(apiSlug)}&sort=${sortBy}&limit=50`
    
    console.log('📡 [SERVER] Fetching products from:', apiUrl)
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }
    })
    
    if (!response.ok) {
      console.log('⚠️ [SERVER] Products endpoint failed')
      return []
    }
    
    const data = await response.json()
    
    if (data.success && data.products) {
      console.log(`✅ [SERVER] Found ${data.products.length} products for ${apiSlug}`)
      return data.products
    }
    
    return []
  } catch (error) {
    console.error('❌ [SERVER] Error fetching products:', error)
    return []
  }
}

// ✅ Main Server Component
export default async function CategoryPage({ params }) {
  try {
    const { category } = params
    
    console.log('🎯 Category Page - Slug:', category)
    
    if (!category) {
      notFound()
    }
    
    // ✅ Get category configuration
    const config = getCategoryConfig(category)
    
    // ✅ Fetch products using correct API slug
    const initialProducts = await fetchCategoryProducts(config.apiSlug, 'newest')
    
    // ✅ Calculate filters
    const brands = [...new Set(initialProducts
      .map(p => p.brand)
      .filter(brand => brand && typeof brand === 'string')
      .map(brand => brand.trim())
    )].sort()
    
    const conditions = [...new Set(initialProducts
      .map(p => p.condition)
      .filter(condition => condition && typeof condition === 'string')
      .map(condition => condition.trim())
    )].sort()
    
    // ✅ Prepare props
    const clientProps = {
      categorySlug: category,
      apiCategory: config.apiSlug,  // ✅ Correct API slug for client
      config: {
        ...config,
        initialProductsCount: initialProducts.length,
        initialFilters: {
          brands,
          conditions,
          priceRange: {
            min: initialProducts.length > 0 ? Math.min(...initialProducts.map(p => p.finalPrice || 0)) : 0,
            max: initialProducts.length > 0 ? Math.max(...initialProducts.map(p => p.finalPrice || 0)) : 100000
          }
        }
      }
    }
    
    console.log(`✅ ${category.toUpperCase()} Page - Ready with ${initialProducts.length} products`)
    
    return <CategoryClient {...clientProps} />
    
  } catch (error) {
    console.error('💥 Error in CategoryPage:', error)
    
    return (
      <div className="min-h-screen bg-white">
        <div className="pt-32 md:pt-36"></div>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-8">
              We're having trouble loading this category. Please try again.
            </p>
            <a 
              href="/"
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    )
  }
}