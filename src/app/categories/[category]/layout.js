export async function generateMetadata({ params }) {
  // ✅ Pehle params ko await karo (Next.js 13+ mein params Promise hota hai)
  const { category } = await params
  
  // ✅ Slug to category name mapping
  const slugToCategory = {
    'men': "men's fashion",
    'women': "women's fashion", 
    'footwear': 'footwear',
    'accessories': 'accessories',
    'watches': 'watches',
    'perfumes': 'perfumes',
    'toys': 'toys & collectibles',
    'kids': 'kids fashion'
  }
  
  // ✅ Ensure category slug exists
  const categorySlug = category || 'accessories'
  const categoryName = slugToCategory[categorySlug] || categorySlug
  
  // ✅ Category-wise meta configuration
  const metaConfig = {
    "men's fashion": {
      title: "Men's Fashion - Just Becho | Luxury Men's Clothing",
      description: "Shop luxury men's fashion at Just Becho. Designer suits, shirts, jackets with authenticity guarantee.",
      keywords: "men's fashion, men's clothing, suits, shirts, jackets, luxury fashion"
    },
    "women's fashion": {
      title: "Women's Fashion - Just Becho | Luxury Women's Clothing",
      description: "Discover luxury women's fashion at Just Becho. Designer dresses, handbags, jewelry with premium quality.",
      keywords: "women's fashion, women's clothing, dresses, handbags, jewelry, luxury fashion"
    },
    'footwear': {
      title: 'Footwear - Just Becho | Luxury Shoes Collection',
      description: 'Explore premium footwear at Just Becho. Luxury shoes, sneakers, formal shoes with authenticity verification.',
      keywords: 'footwear, luxury shoes, sneakers, formal shoes, premium footwear'
    },
    'accessories': {
      title: 'Accessories - Just Becho | Luxury Accessories Collection',
      description: 'Shop premium accessories at Just Becho. Discover luxury bags, watches, jewelry and more with authenticity guarantee.',
      keywords: 'accessories, luxury bags, watches, jewelry, luxury accessories'
    },
    'watches': {
      title: 'Watches - Just Becho | Luxury Timepieces Collection',
      description: 'Explore luxury watches at Just Becho. Premium timepieces with horology expert verification.',
      keywords: 'watches, luxury watches, timepieces, horology, premium watches'
    },
    'perfumes': {
      title: 'Perfumes - Just Becho | Luxury Fragrances Collection',
      description: 'Shop luxury perfumes and fragrances at Just Becho. Premium perfumes with authenticity guarantee from fragrance experts.',
      keywords: 'perfumes, luxury fragrances, designer perfumes, premium scents, perfumes collection'
    },
    'toys & collectibles': {
      title: 'Toys & Collectibles - Just Becho | Luxury Toys Collection',
      description: 'Discover premium toys and collectibles at Just Becho. Luxury toys with safety guarantee.',
      keywords: 'toys, collectibles, luxury toys, premium toys, collectible items'
    },
    'kids fashion': {
      title: 'Kids Fashion - Just Becho | Luxury Kids Clothing',
      description: 'Shop luxury kids fashion at Just Becho. Premium kids clothing with safety verification.',
      keywords: 'kids fashion, kids clothing, children wear, baby clothes, luxury kids'
    }
  }

  // ✅ Safety check - agar categoryName undefined ho
  const safeCategoryName = categoryName || 'accessories'
  
  // ✅ Get meta config or use default
  const config = metaConfig[safeCategoryName] || {
    title: `${safeCategoryName.toUpperCase()} - Just Becho`,
    description: `Shop premium ${safeCategoryName} at Just Becho. Luxury items with authenticity guarantee.`,
    keywords: `${safeCategoryName}, luxury items, premium products`
  }

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
    }
  }
}

export default function CategoryLayout({ children }) {
  return <>{children}</>
}