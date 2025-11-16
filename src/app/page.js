"use client"

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Home() {
  const [testimonialIndex, setTestimonialIndex] = useState(0)

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

  // Featured Collections - PREMIUM LAYOUT
  const featuredCollections = [
    {
      title: "LUXURY TIMEPIECES",
      description: "Elevate your style with iconic watches",
      image: "/products/bag.jpg",
      href: "/collections/watches"
    },
    {
      title: "DESIGNER HANDBAGS", 
      description: "Carry timeless elegance",
      image: "/products/bag.jpg",
      href: "/collections/bags"
    },
    {
      title: "SMART TECHNOLOGY",
      description: "Innovation meets luxury",
      image: "/products/bag.jpg",
      href: "/collections/electronics"
    }
  ]

  // How It Works Steps - PREMIUM LAYOUT
  const howItWorks = [
    {
      step: "01",
      title: "LIST YOUR ITEM",
      description: "Sellers list luxury items with detailed photos and descriptions",
      icon: "📱"
    },
    {
      step: "02", 
      title: "SECURE PAYMENT",
      description: "Buyers place orders with 100% secure advance payment",
      icon: "💳"
    },
    {
      step: "03",
      title: "DISPATCH TO US",
      description: "Seller ships to our authentication center with video proof",
      icon: "📦"
    },
    {
      step: "04",
      title: "AUTHENTICATION",
      description: "Our experts verify product authenticity and condition",
      icon: "🔍"
    },
    {
      step: "05",
      title: "DELIVER WITH TRUST",
      description: "We ship with authenticity certificate to the buyer",
      icon: "✅"
    }
  ]

  // Why Choose Us features - PREMIUM LAYOUT
  const features = [
    {
      icon: "🛡️",
      title: "AUTHENTICITY GUARANTEED",
      description: "Every product verified by luxury experts"
    },
    {
      icon: "💎", 
      title: "PREMIUM QUALITY",
      description: "Only genuine pre-loved luxury items"
    },
    {
      icon: "🔒",
      title: "SECURE TRANSACTIONS",
      description: "100% safe and encrypted payments"
    },
    {
      icon: "🚚",
      title: "WHITE GLOVE DELIVERY",
      description: "Premium packaging and insured shipping"
    }
  ]

  // Testimonials - PREMIUM LAYOUT
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      comment: "Sold my Chanel bag effortlessly! The authentication process was smooth and payment was instant after verification.",
      avatar: "👩‍💼",
      role: "Seller"
    },
    {
      name: "Rahul Mehta",
      location: "Delhi",
      comment: "Bought a Rolex watch. The authenticity certificate gave me complete confidence. Amazing service!", 
      avatar: "👨‍💼",
      role: "Buyer"
    },
    {
      name: "Ananya Patel",
      location: "Bangalore",
      comment: "As both buyer and seller, Just Becho's managed process makes luxury trading completely secure.",
      avatar: "👩‍🎓",
      role: "Both"
    },
    {
      name: "Vikram Singh",
      location: "Chennai",
      comment: "The dispatching video requirement ensures transparency. Received my Gucci bag in perfect condition.",
      avatar: "👨‍⚕️",
      role: "Buyer"
    }
  ]

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Hero Section - CLEAN WITHOUT CONTENT */}
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

        {/* How It Works - PREMIUM LAYOUT */}
        <section className="py-20 bg-white">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-gray-900 text-3xl sm:text-5xl font-light tracking-widest uppercase mb-4">
                HOW IT WORKS
              </h2>
              <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
                Experience seamless luxury trading with our managed marketplace
              </p>
            </div>

            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-gray-200 hidden lg:block"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
                {howItWorks.map((step, index) => (
                  <div key={index} className="text-center relative group">
                    {/* Step Number and Icon */}
                    <div className="relative mb-8">
                      <div className="w-20 h-20 mx-auto rounded-full bg-white border-2 border-gray-900 flex items-center justify-center group-hover:bg-gray-900 group-hover:scale-110 transition-all duration-500 z-10 relative">
                        <span className="text-gray-900 text-2xl group-hover:text-white transition-colors duration-500">{step.icon}</span>
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center z-20">
                        <span className="text-white text-sm font-light">{step.step}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="px-4">
                      <h3 className="text-gray-900 text-lg font-light tracking-widest uppercase mb-3 group-hover:text-gray-700 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm font-light leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us - PREMIUM LAYOUT */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-gray-900 text-3xl sm:text-5xl font-light tracking-widest uppercase mb-4">
                WHY CHOOSE JUST BECHO
              </h2>
              <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
                Experience luxury redefined with our curated collection of authenticated pre-loved items
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl font-light">{feature.icon}</span>
                  </div>
                  <h3 className="text-gray-900 text-lg font-light tracking-widest uppercase mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-white">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-gray-900 text-3xl sm:text-5xl font-light tracking-widest uppercase">
                EXPLORE CATEGORIES
              </h2>
              <p className="text-gray-900 text-lg sm:text-xl font-light tracking-widest uppercase mt-4">
                DISCOVER PRE-LOVED LUXURY ITEMS
              </p>
            </div>

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
                  <h3 className="text-gray-900 text-sm sm:text-base font-light tracking-widest uppercase mt-6 sm:mt-8">
                    {cat.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Collections - PREMIUM LAYOUT */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-gray-900 text-3xl sm:text-5xl font-light tracking-widest uppercase mb-4">
                CURATED COLLECTIONS
              </h2>
              <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
                Handpicked luxury items curated by our experts for the discerning shopper
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredCollections.map((collection, index) => (
                <Link
                  key={index}
                  href={collection.href}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-96"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 to-gray-600/50 z-10" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex items-end p-8 z-20">
                    <div className="text-white">
                      <h3 className="text-2xl font-light tracking-widest uppercase mb-2">
                        {collection.title}
                      </h3>
                      <p className="text-gray-200 font-light mb-4">
                        {collection.description}
                      </p>
                      <div className="w-12 h-px bg-white transform group-hover:scale-x-150 transition-transform duration-500"></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Category-wise Sections with Brand Carousels */}
        {categorySections.map((category) => {
          const categoryBrandsData = categoryBrands[category.name] || []
          const duplicatedCategoryBrands = [...categoryBrandsData, ...categoryBrandsData, ...categoryBrandsData]

          return (
            <section key={category.name} className="py-20 bg-white border-t border-gray-100">
              <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                  <h2 className="text-gray-900 text-3xl sm:text-5xl font-light tracking-widest uppercase">
                    {category.name.toUpperCase()}
                  </h2>
                  <p className="text-gray-900 text-lg sm:text-xl font-light tracking-widest uppercase mt-4">
                    EXPLORE OUR CURATED {category.name.toUpperCase()} COLLECTION
                  </p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
                  {category.products.map((item) => (
                    <div
                      key={item.id}
                      className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
                    >
                      <div className="relative w-full aspect-square overflow-hidden mb-4 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                        />
                        {item.isBestseller && (
                          <div className="absolute top-3 left-3">
                            <span className="text-gray-900 text-xs font-light tracking-widest uppercase bg-white px-3 py-2 rounded-full">
                              BESTSELLER
                            </span>
                          </div>
                        )}
                      </div>
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

                {/* Popular Brands Carousel */}
                <div className="mt-20">
                  <div className="text-center mb-12">
                    <h3 className="text-gray-900 text-2xl sm:text-4xl font-light tracking-widest uppercase">
                      POPULAR BRANDS IN {category.name.toUpperCase()}
                    </h3>
                    <p className="text-gray-900 text-lg font-light tracking-widest uppercase mt-4">
                      AUTHENTIC LUXURY BRANDS YOU CAN TRUST
                    </p>
                  </div>

                  <div className="w-full overflow-hidden py-4">
                    <div className="flex animate-marquee-mobile sm:animate-marquee whitespace-nowrap">
                      {duplicatedCategoryBrands.map((brand, index) => (
                        <div key={index} className="mx-10 sm:mx-14">
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: "120px",
                              height: "60px",
                            }}
                          >
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-16">
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

        {/* Testimonials - PREMIUM LAYOUT WITH ARROWS */}
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-gray-900 text-3xl sm:text-5xl font-light tracking-widest uppercase mb-4">
                CLIENT TESTIMONIALS
              </h2>
              <p className="text-gray-600 text-lg font-light max-w-2xl mx-auto">
                Discover what our discerning clients have to say about their Just Becho journey
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              {/* Navigation Arrows */}
              <button 
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-300 shadow-lg z-10"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button 
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-300 shadow-lg z-10"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Testimonial Card */}
              <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-lg">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200 flex-shrink-0">
                    <span className="text-gray-600 text-2xl">{testimonials[testimonialIndex].avatar}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex justify-center lg:justify-start mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">★</span>
                      ))}
                    </div>
                    
                    <p className="text-gray-600 text-lg leading-relaxed italic mb-6">
                      "{testimonials[testimonialIndex].comment}"
                    </p>
                    
                    <div>
                      <h4 className="text-gray-900 text-xl font-light tracking-wide">{testimonials[testimonialIndex].name}</h4>
                      <p className="text-gray-500">{testimonials[testimonialIndex].location}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        {testimonials[testimonialIndex].role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setTestimonialIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === testimonialIndex ? 'bg-gray-900' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-5xl font-light tracking-widest uppercase mb-6">
              READY TO EXPERIENCE SECURE LUXURY TRADING?
            </h2>
            <p className="text-xl font-light tracking-widest uppercase mb-8 opacity-90 max-w-2xl mx-auto">
              Join India's most trusted managed marketplace for pre-loved luxury
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="bg-white text-gray-900 px-8 py-4 font-light tracking-widest uppercase hover:bg-gray-100 transition-all duration-300 rounded-full text-lg"
              >
                SHOP VERIFIED LUXURY
              </Link>
              <Link
                href="/sell"
                className="border-2 border-white text-white px-8 py-4 font-light tracking-widest uppercase hover:bg-white hover:text-gray-900 transition-all duration-300 rounded-full text-lg"
              >
                SELL WITH CONFIDENCE
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}