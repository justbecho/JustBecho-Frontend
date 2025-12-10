'use client'

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function CategoryClient({ 
  categorySlug, 
  apiCategory, 
  config 
}) {
  const router = useRouter();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        
        const queryParams = new URLSearchParams({
          category: apiCategory || categorySlug,
          page: currentPage,
          limit: 20,
          sort: sortBy
        });
        
        // Add active filters to query
        Object.entries(activeFilters).forEach(([key, value]) => {
          if (value && value !== 'all') {
            queryParams.append(key, value);
          }
        });
        
        const response = await fetch(
          `https://just-becho-backend.vercel.app/api/products?${queryParams}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products || []);
          setFilteredProducts(data.products || []);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalProducts(data.pagination?.total || 0);
        } else {
          setError(data.message || 'No products found');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (apiCategory || categorySlug) {
      fetchProducts();
    }
  }, [apiCategory, categorySlug, activeFilters, sortBy, currentPage]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // Render product card
  const renderProductCard = (product) => {
    if (!product || !product._id) return null;
    
    const productName = product.productName || 'Product';
    const safeProductName = typeof productName === 'string' ? productName : 'Product';
    const safeCondition = product.condition && typeof product.condition === 'string' ? product.condition : '';
    const primaryImage = product.images?.[0]?.url || '/images/placeholder.jpg';
    
    return (
      <Link 
        href={`/products/${product._id}`}
        key={product._id}
        className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-300 block"
      >
        <div className="relative w-full aspect-square overflow-hidden mb-3 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
          <Image
            src={primaryImage}
            alt={safeProductName}
            fill
            className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
              e.target.onerror = null;
            }}
          />
          {safeCondition && (
            <div className="absolute top-2 left-2 z-10">
              <span className="text-gray-900 text-xs font-light tracking-widest uppercase bg-white px-2 py-1 rounded-full">
                {safeCondition.toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="text-left px-1">
          <h3 className="text-gray-800 text-sm font-light tracking-widest uppercase mb-1 line-clamp-2">
            {safeProductName.toUpperCase()}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-gray-900 text-base font-light tracking-widest uppercase">
              ₹{product.finalPrice?.toLocaleString() || '0'}
            </p>
          </div>
          {product.originalPrice && product.originalPrice > product.finalPrice && (
            <p className="text-gray-500 text-sm line-through">
              ₹{product.originalPrice.toLocaleString()}
            </p>
          )}
        </div>
      </Link>
    )
  }

  // Brand logos for category
  const categoryBrands = useMemo(() => ({
    "men's fashion": [
      { name: "Balenciaga", logo: "/brandslogo/mens-fashion/Balenciaga.png", fallback: "/brands/balenciaga.png" },
      { name: "Armani", logo: "/brandslogo/mens-fashion/Armani.png", fallback: "/brands/armani.png" },
      { name: "Prada", logo: "/brandslogo/mens-fashion/Prada.png", fallback: "/brands/prada.png" },
      { name: "Versace", logo: "/brandslogo/mens-fashion/Versace.png", fallback: "/brands/versace.png" },
      { name: "Louis Vuitton", logo: "/brandslogo/mens-fashion/Louis Vuitton.png", fallback: "/brands/louis-vuitton.png" },
      { name: "Gucci", logo: "/brandslogo/mens-fashion/Gucci.png", fallback: "/brands/gucci.png" },
      { name: "Burberry", logo: "/brandslogo/mens-fashion/Burberry.png", fallback: "/brands/burberry.png" },
      { name: "Fendi", logo: "/brandslogo/mens-fashion/Fendi.png", fallback: "/brands/fendi.png" }
    ],
    "women's fashion": [
      { name: "Balenciaga", logo: "/brandslogo/womens-fashion/Balenciaga.png", fallback: "/brands/balenciaga.png" },
      { name: "Dior", logo: "/brandslogo/womens-fashion/Dior.png", fallback: "/brands/dior.png" },
      { name: "Chanel", logo: "/brandslogo/womens-fashion/Chanel.png", fallback: "/brands/chanel.png" },
      { name: "Louis Vuitton", logo: "/brandslogo/womens-fashion/Louis Vuitton.png", fallback: "/brands/louis-vuitton.png" },
      { name: "Gucci", logo: "/brandslogo/womens-fashion/Gucci.png", fallback: "/brands/gucci.png" },
      { name: "Givenchy", logo: "/brandslogo/womens-fashion/Givenchy.png", fallback: "/brands/givenchy.png" },
      { name: "Dolce & Gabbana", logo: "/brandslogo/womens-fashion/Dolce & Gabbana.png", fallback: "/brands/dolce-gabbana.png" }
    ],
    // Add more categories as needed
  }), []);

  // Get category brands
  const getCategoryBrands = (categoryName) => {
    if (!categoryName) return [];
    return categoryBrands[categoryName] || [];
  };

  const currentBrands = getCategoryBrands(apiCategory);
  const duplicatedBrands = currentBrands.length > 0 
    ? [...currentBrands, ...currentBrands, ...currentBrands]
    : [];

  if (error && !loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-16">
            <div className="text-center">
              <h1 className="text-2xl sm:text-4xl font-light tracking-widest uppercase text-gray-900 mb-4">
                {config.title}
              </h1>
              <p className="text-red-600 mb-8">{error}</p>
              <button
                onClick={() => router.push('/')}
                className="inline-block bg-gray-900 text-white px-6 py-3 rounded-full font-light tracking-widest uppercase hover:bg-gray-800 transition-all duration-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white">
        {/* Category Hero */}
        <section className="relative h-64 md:h-80 bg-gradient-to-r from-gray-900 to-black overflow-hidden">
          {config.banner && (
            <Image
              src={config.banner}
              alt={config.title}
              fill
              className="object-cover object-center"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-3xl md:text-5xl font-light tracking-widest uppercase mb-4">
                {config.title}
              </h1>
              <p className="text-lg md:text-xl font-light tracking-widest uppercase opacity-90">
                {config.subtitle}
              </p>
              <p className="text-sm mt-4 opacity-75">
                {totalProducts} Products Available
              </p>
            </div>
          </div>
        </section>

        {/* Filters and Sort */}
        <section className="bg-gray-50 py-6 border-b border-gray-200">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Active Filters */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(activeFilters).map(([key, value]) => {
                  if (!value || value === 'all') return null;
                  
                  return (
                    <div
                      key={key}
                      className="bg-white border border-gray-300 rounded-full px-3 py-1 text-sm flex items-center gap-2"
                    >
                      <span className="font-light">
                        {key}: {value}
                      </span>
                      <button
                        onClick={() => handleFilterChange(key, 'all')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-light text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-light bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="latest">Latest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8 md:py-12">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="w-full aspect-square bg-gray-200 rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-light tracking-widest uppercase text-gray-900">
                    Featured Products
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Showing {filteredProducts.length} of {totalProducts} products
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map(renderProductCard)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg font-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-light ${
                            currentPage === pageNum
                              ? 'bg-gray-900 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg font-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any products matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setActiveFilters({});
                    setCurrentPage(1);
                  }}
                  className="inline-block bg-gray-900 text-white px-6 py-3 rounded-full font-light tracking-widest uppercase hover:bg-gray-800 transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Popular Brands */}
        {currentBrands.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
              <div className="text-center mb-8">
                <h2 className="text-xl sm:text-3xl font-light tracking-widest uppercase text-gray-900">
                  POPULAR BRANDS IN {config.title}
                </h2>
                <p className="text-gray-600 mt-2">
                  Authentic luxury brands you can trust
                </p>
              </div>

              <div className="w-full overflow-hidden py-4">
                <div className="flex animate-faster-marquee-mobile sm:animate-faster-marquee whitespace-nowrap items-center">
                  {duplicatedBrands.map((brand, index) => (
                    <div key={index} className="flex-shrink-0 px-4 sm:px-6 md:px-8">
                      <div className="relative h-12 w-28 sm:h-14 sm:w-32 md:h-16 md:w-36 flex items-center justify-center">
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          width={120}
                          height={60}
                          className="object-contain grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
                          onError={(e) => {
                            e.target.src = brand.fallback || '/images/brand-placeholder.png';
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Why Shop Section */}
        {config.features && (
          <section className="py-12 bg-white">
            <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-light tracking-widest uppercase text-gray-900">
                  {config.whyTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {config.features.map((feature, index) => (
                  <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-900 flex items-center justify-center">
                      <span className="text-white text-2xl">{feature.icon}</span>
                    </div>
                    <h3 className="text-lg font-light text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}