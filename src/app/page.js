import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {

  // Category-wise brands data with proper folder structure
  const categoryBrands = {
    "Men's Fashion": [
      { name: "Balenciaga", logo: "/brandslogo/mens-fashion/balenciaga.png" },
      { name: "Armani", logo: "/brandslogo/mens-fashion/armani.png" },
      { name: "Prada", logo: "/brandslogo/mens-fashion/prada.png" },
      { name: "Versace", logo: "/brandslogo/mens-fashion/versace.png" },
      { name: "Louis Vuitton", logo: "/brandslogo/mens-fashion/Louis Vuitton.png" },
      { name: "Gucci", logo: "/brandslogo/mens-fashion/gucci.png" },
      { name: "Burberry", logo: "/brandslogo/mens-fashion/burberry.png" },
      { name: "Fendi", logo: "/brandslogo/mens-fashion/fendi.png" }
    ],
    "Women's Fashion": [
      { name: "Balenciaga", logo: "/brandslogo/womens-fashion/Balenciaga.png" },
      { name: "Dior", logo: "/brandslogo/womens-fashion/Dior.png" },
      { name: "Chanel", logo: "/brandslogo/womens-fashion/Chanel.png" },
      { name: "Louis Vuitton", logo: "/brandslogo/womens-fashion/Louis Vuitton.png" },
      { name: "Gucci", logo: "/brandslogo/womens-fashion/Gucci.png" },
      { name: "Givenchy", logo: "/brandslogo/womens-fashion/Givenchy.png" },
      { name: "Dolce & Gabbana", logo: "/brandslogo/womens-fashion/Dolce & Gabbana.png" }
    ],
    "Footwear": [
      { name: "Balenciaga", logo: "/brandslogo/footwear/Balenciaga.png" },
      { name: "Jimmy Choo", logo: "/brandslogo/footwear/Jimmy Choo.png" },
      { name: "Prada", logo: "/brandslogo/footwear/Prada.png" },
      { name: "Puma", logo: "/brandslogo/footwear/Puma.png" },
      { name: "Gucci", logo: "/brandslogo/footwear/Gucci.png" },
      { name: "Reebok", logo: "/brandslogo/footwear/Reebok.png" }
    ],
    "Accessories": [
      { name: "Woodland", logo: "/brandslogo/accessories/Woodland.png" },
      { name: "Baggit", logo: "/brandslogo/accessories/Baggit.png" },
      
      { name: "Ray-Ban", logo: "/brandslogo/accessories/Ray-Ban.png" },
      { name: "Wildhorn", logo: "/brandslogo/accessories/Wildhorn.jpg" },
      { name: "Nike", logo: "/brandslogo/accessories/Nike.png" }
    ],
    "Electronics": [
      { name: "Apple", logo: "/brandslogo/electronics/Apple.png" },
      { name: "Samsung", logo: "/brandslogo/electronics/Samsung.jpg" },
      { name: "Sony", logo: "/brandslogo/electronics/Sony.png" },
      { name: "JBL", logo: "/brandslogo/electronics/JBL.png" },
      { name: "LG", logo: "/brandslogo/electronics/LG.png" }
    ]
  }

  // Category-wise products
  const categorySections = [
    {
      name: "Men's Fashion",
      href: '/categories/men',
      brands: ["Balenciaga", "Armani", "Prada", "Versace", "Louis Vuitton", "Gucci", "Burberry", "Fendi"],
      products: [
        { id: 1, name: "Zara Leather Jacket", price: "₹8,499", image: "/products/bag.jpg", isBestseller: true },
        { id: 2, name: "Denim Shirt", price: "₹2,499", image: "/products/bag.jpg", isBestseller: false },
        { id: 3, name: "Casual Trousers", price: "₹1,999", image: "/products/bag.jpg", isBestseller: true },
        { id: 4, name: "Formal Blazer", price: "₹5,999", image: "/products/bag.jpg", isBestseller: false },
      ]
    },
    {
      name: "Women's Fashion",
      href: '/categories/women',
      brands: ["H&M", "Zara", "Chanel", "Louis Vuitton", "Gucci", "Nike", "Adidas"],
      products: [
        { id: 1, name: "H&M Summer Dress", price: "₹2,499", image: "/products/bag.jpg", isBestseller: true },
        { id: 2, name: "Designer Saree", price: "₹3,999", image: "/products/bag.jpg", isBestseller: false },
        { id: 3, name: "Casual Top", price: "₹1,299", image: "/products/bag.jpg", isBestseller: true },
        { id: 4, name: "Designer Kurti", price: "₹2,199", image: "/products/bag.jpg", isBestseller: false },
      ]
    },
    {
      name: "Footwear",
      href: '/categories/footwear',
      brands: ["Nike", "Adidas", "Jordan", "Puma", "Gucci", "Louis Vuitton"],
      products: [
        { id: 1, name: "Nike Air Jordan 1", price: "₹12,499", image: "/products/bag.jpg", isBestseller: true },
        { id: 2, name: "Adidas Running Shoes", price: "₹8,999", image: "/products/bag.jpg", isBestseller: false },
        { id: 3, name: "Formal Leather Shoes", price: "₹6,499", image: "/products/bag.jpg", isBestseller: true },
        { id: 4, name: "Casual Sneakers", price: "₹3,999", image: "/products/bag.jpg", isBestseller: false },
      ]
    },
    {
      name: "Accessories",
      href: '/categories/accessories',
      brands: ["Chanel", "Louis Vuitton", "Gucci", "Apple", "Samsung", "Sony"],
      products: [
        { id: 1, name: "Leather Handbag", price: "₹4,999", image: "/products/bag.jpg", isBestseller: true },
        { id: 2, name: "Sunglasses", price: "₹1,999", image: "/products/bag.jpg", isBestseller: false },
        { id: 3, name: "Silver Necklace", price: "₹2,499", image: "/products/bag.jpg", isBestseller: true },
        { id: 4, name: "Designer Watch", price: "₹7,999", image: "/products/bag.jpg", isBestseller: false },
      ]
    },
    {
      name: "Electronics",
      href: '/categories/electronics',
      brands: ["Apple", "Samsung", "Sony", "Nike", "Adidas"],
      products: [
        { id: 1, name: "Apple AirPods Pro", price: "₹18,999", image: "/products/bag.jpg", isBestseller: true },
        { id: 2, name: "Smart Watch", price: "₹5,999", image: "/products/bag.jpg", isBestseller: false },
        { id: 3, name: "Bluetooth Speaker", price: "₹3,499", image: "/products/bag.jpg", isBestseller: true },
        { id: 4, name: "Gaming Headphones", price: "₹6,999", image: "/products/bag.jpg", isBestseller: false },
      ]
    }
  ]

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[60vh] sm:h-[75vh] md:h-[85vh] overflow-hidden">
          <Header />

          <div className="absolute inset-0 z-0">
            <Image
              src="/2_5.webp.jpeg"
              alt="Just Becho - Buy and Sell Pre-loved Items"
              fill
              className="object-cover object-center brightness-110 contrast-105 saturate-110"
              priority
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
            <div className="w-5 h-8 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white rounded-full mt-1"></div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            
            {/* Section Heading - SAME STYLE WITHOUT UNDERLINE */}
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-gray-900 text-3xl sm:text-5xl font-light tracking-widest uppercase">
                EXPLORE CATEGORIES
              </h2>
              <p className="text-gray-900 text-lg sm:text-xl font-light tracking-widest uppercase mt-4">
                DISCOVER PRE-LOVED LUXURY ITEMS
              </p>
            </div>

            {/* Circular Category Cards */}
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-8 sm:gap-10 lg:gap-12">
              {[
                { name: "MEN'S FASHION", img: '/categories/backpacks.jpg', href: '/categories/men' },
                { name: "WOMEN'S FASHION", img: '/categories/doffel.jpg', href: '/categories/women' },
                { name: 'FOOTWEAR', img: '/categories/drinkware.jpg', href: '/categories/footwear' },
                { name: 'ACCESSORIES', img: '/categories/handbag.jpg', href: '/categories/accessories' },
                { name: 'HOME & LIVING', img: '/categories/planter.jpg', href: '/categories/home' },
                { name: 'WATCHES', img: '/categories/planter.jpg', href: '/categories/watches' },
                { name: 'ELECTRONICS', img: '/categories/handbag.jpg', href: '/categories/electronics' },
              ].map((cat, index) => (
                <Link
                  href={cat.href}
                  key={index}
                  className="group flex flex-col items-center text-center transition-all duration-500 transform hover:-translate-y-3"
                >
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 xl:w-52 xl:h-52 rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500">
                    <Image
                      src={cat.img}
                      alt={cat.name}
                      fill
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
                  </div>
                  {/* SAME STYLE WITHOUT UNDERLINE */}
                  <h3 className="text-gray-900 text-sm sm:text-base font-light tracking-widest uppercase mt-6 sm:mt-8">
                    {cat.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Category-wise Sections with Brand Carousels */}
        {categorySections.map((category) => {
          // Get brands for this specific category from categoryBrands object
          const categoryBrandsData = categoryBrands[category.name] || []
          const duplicatedCategoryBrands = [...categoryBrandsData, ...categoryBrandsData, ...categoryBrandsData]

          return (
            <section key={category.name} className="py-16 sm:py-24 bg-white border-t border-gray-100">
              <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
                {/* SAME HEADING STYLE WITHOUT UNDERLINE */}
                <div className="text-center mb-16 sm:mb-20">
                  <h2 className="text-gray-900 text-3xl sm:text-5xl font-light tracking-widest uppercase">
                    {category.name.toUpperCase()}
                  </h2>
                  <p className="text-gray-900 text-lg sm:text-xl font-light tracking-widest uppercase mt-4">
                    EXPLORE OUR CURATED COLLECTION
                  </p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
                  {category.products.map((item) => (
                    <div
                      key={item.id}
                      className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
                    >
                      {/* Image Container */}
                      <div className="relative w-full aspect-square overflow-hidden mb-4 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Bestseller Badge - SAME STYLE WITHOUT UNDERLINE */}
                        {item.isBestseller && (
                          <div className="absolute top-3 left-3">
                            <span className="text-gray-900 text-xs font-light tracking-widest uppercase bg-white px-3 py-2 rounded-full">
                              BESTSELLER
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Info - SAME STYLE WITHOUT UNDERLINE */}
                      <div className="text-left px-2">
                        <h3 className="text-gray-800 text-base sm:text-lg font-light tracking-widest uppercase mb-2">
                          {item.name.toUpperCase()}
                        </h3>
                        <p className="text-gray-900 text-lg sm:text-xl font-light tracking-widest uppercase">
                          {item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Popular Brands Carousel - WORKING VERSION */}
                <div className="mt-20 sm:mt-24">
                  <div className="text-center mb-12">
                    <h3 className="text-gray-900 text-2xl sm:text-4xl font-light tracking-widest uppercase">
                      POPULAR BRANDS IN {category.name.toUpperCase()}
                    </h3>
                    <p className="text-gray-900 text-lg font-light tracking-widest uppercase mt-4">
                      AUTHENTIC LUXURY BRANDS YOU CAN TRUST
                    </p>
                  </div>
                  
                  {/* Logo Carousel - WORKING VERSION */}
                  <div className="w-full overflow-hidden py-4">
                    <div className="flex animate-marquee-mobile sm:animate-marquee whitespace-nowrap">
                      {duplicatedCategoryBrands.map((brand, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center justify-center mx-8 sm:mx-12 group"
                        >
                          <div className="flex items-center justify-center p-4 group-hover:scale-110 transition-all duration-500">
                            {/* SIMPLE LOGO WITH VISIBLE STYLING */}
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="h-20 w-auto sm:h-24 md:h-28 object-contain transition-all duration-500"
                              style={{ 
                                minWidth: '80px',
                                maxWidth: '120px'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* VIEW MORE BUTTON - ONLY THIS HAS UNDERLINE */}
                <div className="text-center mt-16 sm:mt-20">
                  <Link
                    href={category.href}
                    className="text-gray-900 text-xl font-light hover:text-gray-700 transition-all duration-500 tracking-widest uppercase group relative"
                  >
                    <span className="relative">
                      → {category.name.toUpperCase()}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-gray-900 group-hover:w-full transition-all duration-700 group-hover:delay-100"></span>
                    </span>
                  </Link>
                </div>
              </div>
            </section>
          )
        })}

      </main>

      <Footer />
    </>
  )
}