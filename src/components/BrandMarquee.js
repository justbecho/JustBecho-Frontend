'use client'

import { useMemo, useEffect, useRef } from 'react'

export default function BrandMarquee() {
  const marqueeRef = useRef(null)
  
  const allBrands = useMemo(() => [
    { name: "Balenciaga", logo: "/brandslogo/mens-fashion/Balenciaga.png", fallback: "/brandslogo/mens-fashion/Balenciaga.png" },
    { name: "Armani", logo: "/brandslogo/mens-fashion/Armani.png", fallback: "/brandslogo/mens-fashion/Armani.png" },
    { name: "Prada", logo: "/brandslogo/mens-fashion/Prada.png", fallback: "/brandslogo/mens-fashion/Prada.png" },
    { name: "Versace", logo: "/brandslogo/mens-fashion/Versace.png", fallback: "/brandslogo/mens-fashion/Versace.png" },
    { name: "Louis Vuitton", logo: "/brandslogo/mens-fashion/Louis Vuitton.png", fallback: "/brandslogo/mens-fashion/Louis Vuitton.png" },
    { name: "Gucci", logo: "/brandslogo/mens-fashion/Gucci.png", fallback: "/brandslogo/mens-fashion/Gucci.png" },
    { name: "Burberry", logo: "/brandslogo/mens-fashion/Burberry.png", fallback: "/brands/burberry.png" },
    { name: "Fendi", logo: "/brandslogo/mens-fashion/Fendi.png", fallback: "/brandslogo/mens-fashion/Fendi.png" },
    { name: "Alexander McQueen", logo: "/brandslogo/womens-fashion/Alexander McQueen.png", fallback: "/brandslogo/womens-fashion/Alexander McQueen.png" },
    { name: "Dior", logo: "/brandslogo/womens-fashion/Dior.png", fallback: "/brandslogo/womens-fashion/Dior.png" },
    { name: "Chanel", logo: "/brandslogo/womens-fashion/Chanel.png", fallback: "/brandslogo/womens-fashion/Chanel.png" },
    { name: "Off-White", logo: "/brandslogo/womens-fashion/Off-White.png", fallback: "/brandslogo/womens-fashion/Off-White.png" },
    { name: "Gucci", logo: "/brandslogo/womens-fashion/Gucci.png", fallback: "/brandslogo/womens-fashion/Gucci.png" },
    { name: "Givenchy", logo: "/brandslogo/womens-fashion/Givenchy.png", fallback: "/brandslogo/womens-fashion/Givenchy.png" },
    { name: "Dolce & Gabbana", logo: "/brandslogo/womens-fashion/Dolce & Gabbana.png", fallback: "/brandslogo/womens-fashion/Dolce & Gabbana.png" },
    
    { name: "Nike", logo: "/brandslogo/footwear/Nike.png", fallback: "/brandslogo/footwear/Nike.png" },
    { name: "Adidas", logo: "/brandslogo/footwear/Adidas.png", fallback: "/brandslogo/footwear/Adidas.png" },
    { name: "BALMAIN", logo: "/brandslogo/footwear/BALMAIN.png", fallback: "/brandslogo/footwear/BALMAIN.png" },
    { name: "Converse", logo: "/brandslogo/footwear/Converse.png", fallback: "/brandslogo/footwear/Converse.png" },
    { name: "Crocs", logo: "/brandslogo/footwear/Crocs.png", fallback: "/brandslogo/footwear/Crocs.png" },
    { name: "Descente", logo: "/brandslogo/footwear/Descente.png", fallback: "/brandslogo/footwear/Descente.png" },
    
    { name: "Cartier", logo: "/brandslogo/Accessories/Cartier.jpg", fallback: "/brandslogo/Accessories/Cartier.jpg" },
    { name: "Chloe", logo: "/brandslogo/Accessories/Chloe.png", fallback: "/brands/Chloe.png" },
    { name: "Apm Monaco", logo: "/brandslogo/Accessories/Apm Monaco.png", fallback: "/brands/Apm Monaco.png" },
    
    { name: "Rolex", logo: "/brandslogo/watches/rolexx.jpeg", fallback: "brandslogo/watches/rolexx.jpeg" },
    { name: "Omega", logo: "/brandslogo/watches/OMEGA.png", fallback: "/brandslogo/watches/OMEGA.png" },
    { name: "Armani", logo: "/brandslogo/watches/Armani.png", fallback: "/brandslogo/watches/Armani.png" },
    
    { name: "Bvlgari", logo: "/brandslogo/perfumes/Bvlgari.png", fallback: "/brandslogo/perfumes/Bvlgari.png" },
    { name: "Clinique", logo: "/brandslogo/perfumes/Clinique.png", fallback: "/brandslogo/perfumes/Clinique.png" },
    { name: "Filorga", logo: "/brandslogo/perfumes/Filorga.png", fallback: "/brandslogo/perfumes/Filorga.png" },
    
    { name: "Bearbrick", logo: "/brandslogo/toys/Bearbrick.png", fallback: "/brandslogo/toys/Bearbrick.png" },
    { name: "KAWS", logo: "/brandslogo/toys/KAWS.png", fallback: "/brandslogo/toys/KAWS.png" },
    
    { name: "Pokemon", logo: "/brandslogo/toys/Pokemon.png", fallback: "/brandslogo/toys/Pokemon.png" }
  ], [])

  // ✅ Create 3 sets of brands for seamless loop
  const duplicatedBrands = useMemo(() => {
    return [...allBrands, ...allBrands, ...allBrands];
  }, [allBrands]);

  // ✅ MANUAL ANIMATION using requestAnimationFrame - NO CSS ANIMATION
  useEffect(() => {
    if (!marqueeRef.current) return;

    const marqueeElement = marqueeRef.current;
    let animationId = null;
    let position = 0;
    const speed = 0.8; // Pixels per frame
    let isPaused = false;
    let lastTimestamp = 0;

    // Calculate total width (1/3rd of total content since we duplicated 3 times)
    const totalWidth = marqueeElement.scrollWidth / 3;

    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      
      if (!isPaused) {
        const deltaTime = timestamp - lastTimestamp;
        position -= speed * (deltaTime / 16); // Normalize to 60fps
        
        // Reset position when we've scrolled one full set
        if (Math.abs(position) >= totalWidth) {
          position = 0;
        }
        
        marqueeElement.style.transform = `translateX(${position}px)`;
      }
      
      lastTimestamp = timestamp;
      animationId = requestAnimationFrame(animate);
    };

    // Start animation
    animationId = requestAnimationFrame(animate);

    // Pause on hover
    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    marqueeElement.addEventListener('mouseenter', handleMouseEnter);
    marqueeElement.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      marqueeElement.removeEventListener('mouseenter', handleMouseEnter);
      marqueeElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="w-full overflow-hidden py-3 sm:py-4 bg-gray-100 border-y border-gray-200">
      <div className="relative">
        {/* Gradient overlays - thinner for mobile */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-20 bg-gradient-to-r from-gray-100 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-20 bg-gradient-to-l from-gray-100 to-transparent z-10 pointer-events-none"></div>
        
        {/* ✅ MANUAL ANIMATION TRACK - NO CSS ANIMATION */}
        <div 
          ref={marqueeRef}
          className="flex"
          style={{ 
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        >
          {duplicatedBrands.map((brand, idx) => (
            <div 
              key={`${brand.name}-${idx}`} 
              // ✅ REDUCED GAP: Mobile: px-3, Tablet: px-4, Desktop: px-6
              className="flex-shrink-0 px-3 sm:px-4 md:px-6"
            >
              {/* ✅ Logo container with responsive sizing */}
              <div className="relative h-8 w-16 sm:h-10 sm:w-20 md:h-12 md:w-24 lg:h-14 lg:w-28 flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-full max-w-full w-auto h-auto object-contain transition-all duration-300 grayscale hover:grayscale-0 opacity-80 hover:opacity-100 hover:scale-105"
                  onError={(e) => {
                    e.target.src = brand.fallback || '/images/placeholder.jpg';
                  }}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}