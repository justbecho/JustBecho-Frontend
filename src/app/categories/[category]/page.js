// app/categories/[category]/page.js - SERVER COMPONENT
import CategoryClient from './CategoryClient'

// ✅ Server-side function for static generation
export async function generateStaticParams() {
  try {
    // ✅ Backend se available categories fetch karte hain
    const apiUrl = 'https://just-becho-backend.vercel.app/api/products/categories'
    console.log('📡 Fetching categories from:', apiUrl)
    
    const response = await fetch(apiUrl, { cache: 'force-cache' })
    
    if (response.ok) {
      const data = await response.json()
      
      if (data.success && data.categories) {
        console.log('✅ Categories found:', data.categories)
        
        // ✅ Category names ko URL-friendly slugs mein convert karte hain
        const categories = data.categories.map(cat => {
          // Slug mapping for common categories
          const slugMapping = {
            "men's fashion": "men",
            "women's fashion": "women",
            "footwear": "footwear",
            "accessories": "accessories",
            "watches": "watches",
            "perfumes": "perfumes",
            "toys & collectibles": "toys",
            "kids fashion": "kids"
          }
          
          return { 
            category: slugMapping[cat] || cat.toLowerCase().replace(/\s+/g, '-')
          }
        })
        
        return categories
      }
    }
  } catch (error) {
    console.error('💥 Error fetching categories:', error)
  }
  
  // ✅ Fallback to default categories
  return [
    { category: 'accessories' },
    { category: 'footwear' },
    { category: 'men' },
    { category: 'women' },
    { category: 'watches' },
    { category: 'kids' },
    { category: 'toys' },
    { category: 'perfumes' }
  ]
}

// ✅ Server Component - yeh client component ko pass karega
export default async function CategoryPage({ params }) {
  // ✅ Pehle params ko await karo (Next.js 13+ mein params Promise hota hai)
  const { category } = await params
  
  // ✅ Pehle URL slug ko backend category name mein convert karo
  const getApiCategoryName = (slug) => {
    const slugMapping = {
      'men': "men's fashion",
      'women': "women's fashion", 
      'footwear': 'footwear',
      'accessories': 'accessories',
      'watches': 'watches',
      'perfumes': 'perfumes',
      'toys': 'toys & collectibles',
      'kids': 'kids fashion'
    }
    return slugMapping[slug] || slug
  }

  const apiCategory = getApiCategoryName(category)
  
  // ✅ Category configuration - CORRECT IMAGE PATHS
  const categoryConfig = {
    "men's fashion": {
      title: "MEN'S FASHION",
      subtitle: 'Discover luxury fashion for men',
      banner: '/categories/men-fashion.jpg', // ✅ Corrected path
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
      banner: '/categories/women-fashion.jpg', // ✅ Corrected path
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
      banner: '/categories/footwear.jpg',
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
      banner: '/categories/accessories.jpg',
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
      banner: '/categories/watches.jpg',
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
      banner: '/categories/perfumes.jpg',
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
      banner: '/categories/toys-collectibles.jpg',
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
      banner: '/categories/kids-fashion.jpg',
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

  const getConfig = (apiCatName) => {
    // ✅ Pehle check karo apiCatName defined hai
    if (!apiCatName || typeof apiCatName !== 'string') {
      apiCatName = 'accessories' // Default value
    }
    
    // Direct match dekhte hain
    if (categoryConfig[apiCatName]) {
      return categoryConfig[apiCatName]
    }
    
    // ✅ Safe check for toUpperCase
    const safeApiCatName = apiCatName || 'accessories'
    
    // ✅ Use placeholder image agar actual image na mile
    const bannerPath = '/categories/default-banner.jpg'
    
    // Agar direct match na mile, toh slug se guess karte hain
    const defaultConfig = {
      title: safeApiCatName.toUpperCase(),
      subtitle: `Discover premium ${safeApiCatName}`,
      banner: bannerPath, // ✅ Use placeholder
      whyTitle: `WHY SHOP ${safeApiCatName.toUpperCase()} AT JUST BECHO`,
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

  // ✅ Props bana kar client component ko pass karo
  return <CategoryClient 
    categorySlug={category}
    apiCategory={apiCategory}
    config={config}
  />
}