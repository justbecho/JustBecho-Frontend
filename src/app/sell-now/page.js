'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function SellNowPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    category: '',
    productType: '',
    purchaseYear: '',
    condition: '',
    description: '',
    askingPrice: '',
    images: []
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [justBechoPrice, setJustBechoPrice] = useState(0)
  const [platformFee, setPlatformFee] = useState(0)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [productTypes, setProductTypes] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // ✅ STRICT CATEGORY MAPPING - UPDATED
  const strictCategoryMap = useCallback(() => {
    return {
      // Men's - All variations mapped to EXACT database name
      "Men's Fashion": "Men's Fashion",
      "Mens Fashion": "Men's Fashion",
      "Mens": "Men's Fashion",
      "Men": "Men's Fashion",
      "men": "Men's Fashion",
      "mens": "Men's Fashion",
      "men-fashion": "Men's Fashion",
      "men's": "Men's Fashion",
      
      // Women's - All variations mapped to EXACT database name
      "Women's Fashion": "Women's Fashion",
      "Womens Fashion": "Women's Fashion",
      "Womens": "Women's Fashion",
      "Women": "Women's Fashion",
      "women": "Women's Fashion",
      "womens": "Women's Fashion",
      "women-fashion": "Women's Fashion",
      "women's": "Women's Fashion",
      
      // Others - EXACT names as stored in database
      "Footwear": "Footwear",
      "footwear": "Footwear",
      "Shoes": "Footwear",
      "shoes": "Footwear",
      
      "Accessories": "Accessories",
      "accessories": "Accessories",
      
      "Watches": "Watches",
      "watches": "Watches",
      
      "Perfumes": "Perfumes",
      "perfumes": "Perfumes",
      
      "TOYS & COLLECTIBLES": "TOYS & COLLECTIBLES",
      "Toys & Collectibles": "TOYS & COLLECTIBLES",
      "toys": "TOYS & COLLECTIBLES",
      
      // ✅ UPDATED: KID'S FASHION mapping
      "KID'S FASHION": "KID'S FASHION",
      "Kids Fashion": "KID'S FASHION",
      "Kids": "KID'S FASHION",
      "kids": "KID'S FASHION",
      "kid's fashion": "KID'S FASHION",
      "kids fashion": "KID'S FASHION"
    }
  }, [])

  // ✅ FIXED: Safe localStorage access
  const getLocalStorage = (key) => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Error accessing localStorage:', error)
      return null
    }
  }

  // ✅ FIXED: Safe JSON parsing
  const parseUserData = (data) => {
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }

  // ✅ Brand input handler - Capitalize first letter
  const handleBrandInput = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    if (value.trim()) {
      processedValue = value
        .toLowerCase()
        .split(' ')
        .map(word => {
          if (word.includes('&')) {
            return word.toUpperCase();
          }
          
          if (word.length <= 3 && !['the', 'and', 'for', 'but', 'nor', 'yet', 'so'].includes(word)) {
            return word.toUpperCase();
          }
          
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
        
      const specialBrands = {
        'mcqueen': 'McQueen',
        'mcm': 'MCM',
        'lv': 'Louis Vuitton',
        'gucci': 'Gucci',
        'nike': 'Nike',
        'adidas': 'Adidas',
        'puma': 'Puma',
        'armani': 'Armani',
        'dior': 'Dior',
        'chanel': 'Chanel',
        'versace': 'Versace',
        'prada': 'Prada',
        'burberry': 'Burberry',
        'balenciaga': 'Balenciaga',
        'hermes': 'Hermes',
        'cartier': 'Cartier',
        'rolex': 'Rolex',
        'omega': 'Omega',
        'ray-ban': 'Ray-Ban',
        'louis vuitton': 'Louis Vuitton',
        'dolce & gabbana': 'Dolce & Gabbana',
        'alexander mcqueen': 'Alexander McQueen',
        'yves saint laurent': 'Yves Saint Laurent',
        'ysl': 'YSL',
        'tom ford': 'Tom Ford',
        'calvin klein': 'Calvin Klein',
        'ck': 'Calvin Klein',
        'hugo boss': 'Hugo Boss',
        'ralph lauren': 'Ralph Lauren',
        'tiffany & co': 'Tiffany & Co.',
        'tiffany': 'Tiffany & Co.',
        'bvlgari': 'Bvlgari',
        'bottega veneta': 'Bottega Veneta',
        'ferragamo': 'Ferragamo',
        'givenchy': 'Givenchy',
        'jimmy choo': 'Jimmy Choo',
        'tod\'s': 'Tod\'s',
        'valentino': 'Valentino',
        'zara': 'Zara',
        'h&m': 'H&M',
        'uniqlo': 'Uniqlo',
        'levi\'s': 'Levi\'s',
        'wrangler': 'Wrangler',
        'reebok': 'Reebok',
        'converse': 'Converse',
        'vans': 'Vans',
        'new balance': 'New Balance',
        'under armour': 'Under Armour',
        'lululemon': 'Lululemon',
        'fila': 'Fila',
        'skechers': 'Skechers',
        'woodland': 'Woodland'
      };
      
      const lowerValue = value.toLowerCase().trim();
      if (specialBrands[lowerValue]) {
        processedValue = specialBrands[lowerValue];
      }
      
      if (processedValue.includes('Mc') && processedValue.length > 2) {
        processedValue = processedValue.replace(/Mc([a-z])/g, (match, p1) => `Mc${p1.toUpperCase()}`);
      }
      
      if (processedValue.includes('\'s')) {
        processedValue = processedValue.replace(/'s/gi, '\'s');
      }
      
      processedValue = processedValue.replace(/\s+/g, ' ').trim();
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  // ✅ General input handler with CATEGORY FIX
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      // ✅ Apply strict category mapping
      const mappedValue = strictCategoryMap()[value] || value;
      console.log(`🗺️ Category mapping: "${value}" → "${mappedValue}"`);
      
      setFormData(prev => ({
        ...prev,
        [name]: mappedValue
      }));
    } else if (name === 'productName') {
      let processedValue = value;
      if (value.trim()) {
        processedValue = value
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // ✅ FETCH CATEGORIES FROM BACKEND
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true)
      console.log('📡 Fetching categories from backend...')
      
      const response = await fetch('https://just-becho-backend.vercel.app/api/categories')
      const data = await response.json()
      
      if (data.success) {
        console.log('✅ Categories fetched:', data.categories.length)
        
        // ✅ Apply strict mapping to fetched categories
        const mappedCategories = data.categories.map(cat => {
          const mappedName = strictCategoryMap()[cat.name] || cat.name;
          return {
            ...cat,
            name: mappedName
          };
        });
        
        setCategories(mappedCategories)
      } else {
        console.error('Failed to fetch categories:', data.message)
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    } finally {
      setLoadingCategories(false)
    }
  }, [strictCategoryMap])

  // ✅ TRANSFORM CATEGORIES FOR SELECT
  const transformCategoriesForSelect = useCallback((backendCategories) => {
    // Get unique categories after mapping
    const uniqueCategories = [];
    const seen = new Set();
    
    backendCategories.forEach(category => {
      if (!seen.has(category.name)) {
        seen.add(category.name);
        uniqueCategories.push({
          name: category.name,
          value: category.name,
          subCategories: category.subCategories || []
        });
      }
    });
    
    return uniqueCategories.sort((a, b) => a.name.localeCompare(b.name));
  }, [])

  // ✅ GET PRODUCT TYPES BASED ON SELECTED CATEGORY
  const getProductTypesForCategory = useCallback((selectedCategory) => {
    if (!selectedCategory || !categories.length) return []
    
    const category = categories.find(cat => cat.name === selectedCategory)
    if (!category || !category.subCategories) return []
    
    const excludedSectionTitles = [
      'POPULAR BRANDS',
      'FEATURES',
      'STYLE FEATURES'
    ]
    
    const allItems = []
    
    category.subCategories.forEach(subCategory => {
      const sectionTitle = subCategory.title || ''
      
      const shouldExclude = excludedSectionTitles.includes(sectionTitle.toUpperCase())
      
      if (!shouldExclude && 
          subCategory.items && 
          Array.isArray(subCategory.items)) {
        allItems.push(...subCategory.items)
      }
    })
    
    const uniqueItems = [...new Set(allItems)].filter(item => 
      item && typeof item === 'string' && item.trim() !== ''
    )
    
    console.log(`📊 Product types for ${selectedCategory}:`, uniqueItems.length, 'items')
    return uniqueItems
  }, [categories])

  const conditions = [
    'Brand New With Tag',
    'Brand New Without Tag',
    'Like New',
    'Fairly Used',
    'Excellent',
    'Good'
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i)

  // Calculate Just Becho Price based on asking price
  useEffect(() => {
    if (formData.askingPrice) {
      const price = parseInt(formData.askingPrice)
      let feePercentage = 0

      if (price <= 2000) {
        feePercentage = 30
      } else if (price >= 2001 && price <= 5000) {
        feePercentage = 28
      } else if (price >= 5001 && price <= 10000) {
        feePercentage = 25
      } else if (price >= 10001 && price <= 15000) {
        feePercentage = 20
      } else {
        feePercentage = 15
      }

      const feeAmount = (price * feePercentage) / 100
      const finalPrice = Math.ceil(price + feeAmount)

      setPlatformFee(feePercentage)
      setJustBechoPrice(finalPrice)
    } else {
      setJustBechoPrice(0)
      setPlatformFee(0)
    }
  }, [formData.askingPrice])

  // ✅ UPDATE PRODUCT TYPES WHEN CATEGORY CHANGES
  useEffect(() => {
    if (formData.category) {
      const types = getProductTypesForCategory(formData.category)
      setProductTypes(types)
      
      if (formData.productType && !types.includes(formData.productType)) {
        setFormData(prev => ({ ...prev, productType: '' }))
      }
    } else {
      setProductTypes([])
    }
  }, [formData.category, getProductTypesForCategory])

  // ✅ Check user authentication and seller verification
  useEffect(() => {
    const checkUserAuth = async () => {
      console.log('🔄 Checking user auth for sell now...')

      try {
        const token = getLocalStorage('token')
        const userData = getLocalStorage('user')

        if (!token) {
          console.log('❌ No token, redirecting to login')
          setError('Please login to sell products')
          setTimeout(() => {
            router.push('/login?redirect=/sell-now')
          }, 2000)
          return
        }

        if (userData) {
          const userObj = parseUserData(userData)

          if (!userObj) {
            console.log('❌ Invalid user data')
            setError('Invalid user data. Please login again.')
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setTimeout(() => {
              router.push('/login')
            }, 2000)
            return
          }

          setUser(userObj)

          if (userObj.role !== 'seller') {
            console.log('❌ Not a seller, checking if wants to become seller...')

            const shouldBecomeSeller = window.confirm('You need to be a seller to list products. Would you like to become a seller?');
            if (shouldBecomeSeller) {
              localStorage.setItem('changingRoleToSeller', 'true');
              router.push('/complete-profile?role=seller');
            } else {
              router.push('/');
            }
            return;
          }

          if (!userObj.sellerVerified) {
            console.log('❌ Seller not verified, checking status...')

            try {
              const response = await fetch('https://just-becho-backend.vercel.app/api/auth/profile-status', {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (response.ok) {
                const data = await response.json();

                if (data.success && data.sellerVerified) {
                  const updatedUser = { ...userObj, ...data };
                  localStorage.setItem('user', JSON.stringify(updatedUser));
                  setUser(updatedUser);
                  console.log('✅ Seller is now verified!');
                } else {
                  setError('Your seller account is pending approval. You cannot list products until approved.');
                  setTimeout(() => {
                    router.push('/dashboard')
                  }, 3000)
                  return
                }
              } else {
                setError('Your seller account is pending approval. You cannot list products until approved.');
                setTimeout(() => {
                  router.push('/dashboard')
                }, 3000)
                return
              }
            } catch (statusError) {
              console.error('Error checking seller status:', statusError)
              setError('Your seller account is pending approval. You cannot list products until approved.');
              setTimeout(() => {
                router.push('/dashboard')
              }, 3000)
              return
            }
          }

          console.log('✅ Seller auth check passed - VERIFIED SELLER')
        } else {
          console.log('❌ No user data, redirecting to login')
          setError('Please login to sell products')
          setTimeout(() => {
            router.push('/login?redirect=/sell-now')
          }, 2000)
          return
        }

      } catch (error) {
        console.error('❌ Error in auth check:', error)
        setError('An error occurred. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
    checkUserAuth()
  }, [router, fetchCategories])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - formData.images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    let validFiles = [];
    let errors = [];

    filesToAdd.forEach(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type. Use JPG, PNG, WebP.`);
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        errors.push(`${file.name}: File too large (max 5MB).`);
        return;
      }

      const minSize = 10 * 1024;
      if (file.size < minSize) {
        errors.push(`${file.name}: File too small (min 10KB).`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      alert('Upload errors:\n' + errors.join('\n'));
    }

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles]
      }));
    }
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const nextStep = () => {
    setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = getLocalStorage('token');

      if (!token) {
        alert('Please login to list a product');
        return;
      }

      const userData = getLocalStorage('user');
      if (!userData) {
        alert('Please login to list a product');
        router.push('/login?redirect=/sell-now');
        return;
      }

      const userObj = parseUserData(userData);
      if (!userObj || userObj.role !== 'seller') {
        alert('You need to be a seller to list products. Please complete your profile.');
        router.push('/complete-profile');
        return;
      }

      if (!userObj.sellerVerified) {
        alert('Your seller account is pending approval. You cannot list products until approved.');
        router.push('/dashboard');
        return;
      }

      if (formData.images.length === 0) {
        alert('Please upload at least one product image');
        return;
      }

      // ✅ STRICT CATEGORY MAPPING before sending to backend
      const mappedCategory = strictCategoryMap()[formData.category] || formData.category;
      console.log(`🚀 Submitting with category: "${formData.category}" → "${mappedCategory}"`);

      const submitFormData = new FormData();

      // Add product data with MAPPED category
      submitFormData.append('productName', formData.productName);
      submitFormData.append('brand', formData.brand);
      submitFormData.append('category', mappedCategory); // ✅ MAPPED CATEGORY
      submitFormData.append('productType', formData.productType);
      submitFormData.append('purchaseYear', formData.purchaseYear || '');
      submitFormData.append('condition', formData.condition);
      submitFormData.append('description', formData.description);
      submitFormData.append('askingPrice', formData.askingPrice);
      submitFormData.append('platformFee', platformFee.toString());
      submitFormData.append('finalPrice', justBechoPrice.toString());

      // Add images
      formData.images.forEach((image, index) => {
        submitFormData.append('images', image, image.name);
      });

      console.log('📤 Submitting form data:', {
        productName: formData.productName,
        brand: formData.brand,
        category: mappedCategory,
        productType: formData.productType,
        askingPrice: formData.askingPrice
      });

      const response = await fetch('https://just-becho-backend.vercel.app/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitFormData
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message?.includes('image is required')) {
          throw new Error('Please upload at least one product image');
        }
        throw new Error(data.message || `Upload failed: ${response.status}`);
      }

      alert('Product listed successfully!');
      router.push('/dashboard?section=listings');

    } catch (error) {
      console.error('Error:', error);

      if (error.message.includes('image is required')) {
        alert('❌ Please upload at least one product image');
      } else if (error.message.includes('Server error')) {
        alert('🚨 Server issue. Please try again or contact support.');
      } else {
        alert(error.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const transformedCategories = transformCategoriesForSelect(categories);

  // ✅ Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 md:pt-40 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 md:h-12 w-8 md:w-12 border-b-2 border-gray-900 mx-auto mb-3 md:mb-4"></div>
            <p className="text-gray-600 text-sm md:text-base">Checking seller status...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // ✅ Error state
  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-20 md:pt-40 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 md:mb-2">Access Denied</h3>
            <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 md:px-6 md:py-2 bg-gray-900 text-white text-sm md:text-base rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // ✅ Main form
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20 md:pt-40">
        {user?.sellerVerified && (
          <div className="bg-green-50 border-b border-green-200 py-2 md:py-3">
            <div className="max-w-[1700px] mx-auto px-3 md:px-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 text-green-800 text-xs md:text-sm">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">✅ Seller Verified</span>
                <span>|</span>
                <span className="truncate">Username: {user?.username}</span>
                <span>|</span>
                <span className="hidden sm:inline">You can now list products on JustBecho!</span>
                <span className="sm:hidden">Ready to list!</span>
              </div>
            </div>
          </div>
        )}

        <section className="bg-white border-b border-gray-200">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-4 md:py-8">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-light tracking-widest uppercase text-gray-900">
                SELL YOUR ITEM
              </h1>
              <p className="text-gray-600 mt-1 md:mt-3 text-sm md:text-lg font-light">
                List your Luxury items and get the best value
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-3 md:px-4 sm:px-6">
            <div className="py-6 md:py-12">
              <div className="flex items-center justify-center">
                {[
                  { number: 1, label: 'Product Details' },
                  { number: 2, label: 'Pricing & Images' },
                  { number: 3, label: 'Review & Submit' }
                ].map((step, index, array) => (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep >= step.number
                          ? 'bg-gray-900 border-gray-900 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                        {currentStep > step.number ? (
                          <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-xs md:text-sm font-medium">{step.number}</span>
                        )}
                      </div>
                      <span className={`mt-1 md:mt-3 text-xs font-medium whitespace-nowrap ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                        {step.label}
                      </span>
                    </div>

                    {index < array.length - 1 && (
                      <div className={`w-12 md:w-24 h-0.5 mx-4 md:mx-8 ${currentStep > step.number ? 'bg-gray-900' : 'bg-gray-200'
                        }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-16">
          <div className="max-w-4xl mx-auto px-3 md:px-4 sm:px-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 lg:p-8">

              {currentStep === 1 && (
                <div className="space-y-6 md:space-y-8">
                  <div className="text-center border-b border-gray-200 pb-4 md:pb-6">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-light text-gray-900">Product Information</h2>
                    <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Tell us about your item</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-4 md:space-y-6">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                          Product Name *
                          <span className="text-xs text-gray-500 ml-1">(Auto-capitalized)</span>
                        </label>
                        <input
                          type="text"
                          name="productName"
                          value={formData.productName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm md:text-base"
                          placeholder="e.g., Nike Air Jordan 1"
                        />
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                          Select Category *
                        </label>
                        {loadingCategories ? (
                          <div className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg bg-gray-50">
                            <p className="text-gray-500 text-xs md:text-sm">Loading categories...</p>
                          </div>
                        ) : transformedCategories.length > 0 ? (
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm md:text-base"
                          >
                            <option value="">Select Category</option>
                            {transformedCategories.map(category => (
                              <option key={category.value} value={category.value}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg bg-yellow-50">
                            <p className="text-yellow-700 text-xs md:text-sm">No categories available. Please try refreshing.</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                          Purchase Year
                        </label>
                        <select
                          name="purchaseYear"
                          value={formData.purchaseYear}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm md:text-base"
                        >
                          <option value="">Select Year</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                          Brand *
                          <span className="text-xs text-gray-500 ml-1">(Auto-formatted)</span>
                        </label>
                        <input
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleBrandInput}
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              handleBrandInput(e);
                            }
                          }}
                          required
                          className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm md:text-base"
                          placeholder="e.g., Nike, Adidas, Louis Vuitton"
                          autoComplete="off"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Type brand name (e.g., "nike" becomes "Nike", "louis vuitton" becomes "Louis Vuitton")
                        </p>
                      </div>

                      {formData.category && productTypes.length > 0 && (
                        <div>
                          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                            Select Product Type *
                          </label>
                          <select
                            name="productType"
                            value={formData.productType}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm md:text-base"
                          >
                            <option value="">Select Type</option>
                            {productTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            {productTypes.length} product types available
                          </p>
                        </div>
                      )}

                      {formData.category && productTypes.length === 0 && (
                        <div className="p-2 md:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-yellow-700 text-xs md:text-sm">
                            No product types available for this category. Please enter a custom product type below:
                          </p>
                          <input
                            type="text"
                            name="productType"
                            value={formData.productType}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g., Custom Type"
                            className="w-full mt-2 px-2 py-1.5 md:px-3 md:py-2 border border-gray-300 rounded text-xs md:text-sm"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                          Select Condition *
                        </label>
                        <select
                          name="condition"
                          value={formData.condition}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm md:text-base"
                        >
                          <option value="">Select Condition</option>
                          {conditions.map(condition => (
                            <option key={condition} value={condition}>{condition}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      Product Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm md:text-base"
                      placeholder="Describe your item in detail... Include features, specifications, size, color, and any notable aspects."
                    />

                    <div className="mt-2 flex items-start gap-2 p-2 md:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-yellow-800 text-xs md:text-sm font-medium">Your description is being monitored</p>
                        <p className="text-yellow-700 text-xs mt-0.5 md:mt-1">
                          All product descriptions are reviewed by our team. Inaccurate or misleading descriptions may lead to:
                          <ul className="list-disc pl-3 md:pl-4 mt-0.5 md:mt-1 space-y-0.5 md:space-y-1">
                            <li>Listing removal</li>
                            <li>Account warnings</li>
                            <li>Suspension of selling privileges</li>
                          </ul>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3 md:pt-4">
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!formData.productName || !formData.brand || !formData.category || !formData.productType || !formData.condition || !formData.description}
                      className="bg-gray-900 text-white text-sm md:text-base px-4 py-2 md:px-8 md:py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Pricing & Images
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 md:space-y-8">
                  <div className="text-center border-b border-gray-200 pb-4 md:pb-6">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-light text-gray-900">Pricing & Images</h2>
                    <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Set your price and upload images</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex items-center gap-2">
                        <label className="block text-xs md:text-sm font-medium text-gray-700">
                          Your Asking Price (₹) *
                        </label>
                        <div className="relative group">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                          </button>

                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 md:w-64 bg-gray-900 text-white text-xs rounded-lg p-2 md:p-3 z-10">
                            <div className="font-medium mb-1">Platform Fee Structure:</div>
                            <div className="space-y-0.5 md:space-y-1">
                              <div className="flex justify-between">
                                <span>₹0 - ₹2,000</span>
                                <span>30% fee</span>
                              </div>
                              <div className="flex justify-between">
                                <span>₹2,001 - ₹5,000</span>
                                <span>28% fee</span>
                              </div>
                              <div className="flex justify-between">
                                <span>₹5,001 - ₹10,000</span>
                                <span>25% fee</span>
                              </div>
                              <div className="flex justify-between">
                                <span>₹10,001 - ₹15,000</span>
                                <span>20% fee</span>
                              </div>
                              <div className="flex justify-between">
                                <span>₹15,000+</span>
                                <span>15% fee</span>
                              </div>
                            </div>
                            <div className="border-t border-gray-700 mt-1 md:mt-2 pt-1 md:pt-2 text-gray-300 text-xs">
                              Final price includes platform fees for marketing, payment processing, and buyer protection.
                            </div>

                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>

                      <input
                        type="number"
                        name="askingPrice"
                        value={formData.askingPrice}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-base md:text-lg font-medium"
                        placeholder="e.g., 5000"
                      />
                      <p className="text-xs text-gray-500">Enter the price you want to sell for</p>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <div className="flex items-center gap-2">
                        <label className="block text-xs md:text-sm font-medium text-gray-700">
                          Just Becho Pricing (₹)
                        </label>
                        <div className="relative group">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                          </button>

                          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 md:w-64 bg-gray-900 text-white text-xs rounded-lg p-2 md:p-3 z-10">
                            <div className="font-medium mb-1">Price Calculation:</div>
                            <div className="space-y-0.5 md:space-y-1">
                              <div className="flex justify-between">
                                <span>Your Asking Price:</span>
                                <span>₹{parseInt(formData.askingPrice || 0).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Platform Fee ({platformFee}%):</span>
                                <span>₹{((parseInt(formData.askingPrice || 0) * platformFee) / 100).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between border-t border-gray-700 pt-0.5 md:pt-1">
                                <span className="font-medium">Final Price:</span>
                                <span className="font-medium">₹{justBechoPrice.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="border-t border-gray-700 mt-1 md:mt-2 pt-1 md:pt-2 text-gray-300 text-xs">
                              This is the price buyers will see. Platform fees help us provide better service and buyer protection.
                            </div>

                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full px-3 py-2 md:px-4 md:py-3 border border-green-300 bg-green-50 rounded-lg text-base md:text-lg font-medium text-green-800">
                        ₹{justBechoPrice.toLocaleString()}
                      </div>
                      <p className="text-xs text-green-600">
                        Includes {platformFee}% platform fee
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 md:pt-8 border-t border-gray-200">
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-3 md:mb-4">
                      Product Images * (Max 5 images)
                    </label>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 lg:p-8 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer block">
                        <div className="text-gray-400 mb-2 md:mb-3">
                          <svg className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-600 text-sm md:text-base lg:text-lg font-medium">Click to upload images</p>
                        <p className="text-gray-400 text-xs md:text-sm mt-1 md:mt-2">PNG, JPG, JPEG up to 5MB each</p>
                        <p className="text-gray-400 text-xs mt-0.5 md:mt-1">Upload clear, well-lit photos from different angles</p>
                      </label>
                    </div>

                    {formData.images.length > 0 && (
                      <div className="mt-4 md:mt-6">
                        <h4 className="text-xs md:text-sm font-medium text-gray-700 mb-3 md:mb-4">
                          Uploaded Images ({formData.images.length}/5)
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-16 md:h-20 lg:h-24 object-cover rounded-lg border border-gray-200 group-hover:opacity-75 transition-opacity"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 bg-red-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          ))}

                          {formData.images.length < 5 && (
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <div className="w-full h-16 md:h-20 lg:h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors">
                                <svg className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 mb-0.5 md:mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-xs">Add More</span>
                              </div>
                            </label>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 md:mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                      <div className="flex items-start gap-2 md:gap-3">
                        <div className="w-4 h-4 md:w-5 md:h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs">💡</span>
                        </div>
                        <div>
                          <p className="text-blue-800 font-medium text-xs md:text-sm">Guidelines</p>
                          <ul className="text-blue-700 text-xs md:text-sm mt-0.5 md:mt-1 space-y-0.5 md:space-y-1">
                            <li>• Upload clear, high-quality photos</li>
                            <li>• Include photos from all angles</li>
                            <li>• Show any tags, labels, or authenticity marks</li>
                            <li>• Capture any imperfections or wear</li>
                            <li>• Competitive Pricing makes items sell faster</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 md:pt-8 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 md:px-6 md:py-3 border border-gray-300 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!formData.askingPrice || formData.images.length === 0}
                      className="bg-gray-900 text-white text-sm md:text-base px-4 py-2 md:px-8 md:py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Review Listing
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 md:space-y-8">
                  <div className="text-center border-b border-gray-200 pb-4 md:pb-6">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-light text-gray-900">Review & Submit</h2>
                    <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Review your listing before publishing</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 border-b pb-3 md:pb-4 text-center">
                      Listing Summary
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                      <div className="space-y-4 md:space-y-6">
                        <h4 className="font-medium text-gray-900 text-base md:text-lg">Product Information</h4>

                        <div className="space-y-2 md:space-y-4">
                          <div className="flex justify-between border-b pb-2 md:pb-3">
                            <span className="text-gray-600 text-sm md:text-base">Product Name:</span>
                            <span className="font-medium text-gray-900 text-sm md:text-base">{formData.productName}</span>
                          </div>
                          <div className="flex justify-between border-b pb-2 md:pb-3">
                            <span className="text-gray-600 text-sm md:text-base">Brand:</span>
                            <span className="font-medium text-gray-900 text-sm md:text-base">{formData.brand}</span>
                          </div>
                          <div className="flex justify-between border-b pb-2 md:pb-3">
                            <span className="text-gray-600 text-sm md:text-base">Category:</span>
                            <span className="font-medium text-gray-900 text-sm md:text-base">{formData.category}</span>
                          </div>
                          <div className="flex justify-between border-b pb-2 md:pb-3">
                            <span className="text-gray-600 text-sm md:text-base">Product Type:</span>
                            <span className="font-medium text-gray-900 text-sm md:text-base">{formData.productType}</span>
                          </div>
                          <div className="flex justify-between border-b pb-2 md:pb-3">
                            <span className="text-gray-600 text-sm md:text-base">Condition:</span>
                            <span className="font-medium text-gray-900 text-sm md:text-base">{formData.condition}</span>
                          </div>
                          <div className="flex justify-between border-b pb-2 md:pb-3">
                            <span className="text-gray-600 text-sm md:text-base">Purchase Year:</span>
                            <span className="font-medium text-gray-900 text-sm md:text-base">{formData.purchaseYear || 'Not specified'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 md:space-y-6">
                        <h4 className="font-medium text-gray-900 text-base md:text-lg">Pricing & Media</h4>

                        <div className="space-y-2 md:space-y-4">
                          <div className="flex justify-between border-b pb-2 md:pb-3">
                            <span className="text-gray-600 text-sm md:text-base">Your Asking Price:</span>
                            <span className="font-medium text-gray-900 text-sm md:text-base">₹{parseInt(formData.askingPrice).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-b pb-2 md:pb-3">
                            <span className="text-gray-600 text-sm md:text-base">Platform Fee:</span>
                            <span className="font-medium text-red-600 text-sm md:text-base">{platformFee}%</span>
                          </div>
                          <div className="flex justify-between border-b pb-2 md:pb-3">
                            <span className="text-gray-600 text-sm md:text-base">Fee Amount:</span>
                            <span className="font-medium text-red-600 text-sm md:text-base">
                              ₹{((parseInt(formData.askingPrice) * platformFee) / 100).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between border-b pb-2 md:pb-3">
                            <span className="text-gray-600 font-semibold text-sm md:text-base">Final Selling Price:</span>
                            <span className="font-bold text-green-600 text-base md:text-lg">
                              ₹{justBechoPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between border-b pb-2 md:pb-3">
                            <span className="text-gray-600 text-sm md:text-base">Images Uploaded:</span>
                            <span className="font-medium text-gray-900 text-sm md:text-base">{formData.images.length} photos</span>
                          </div>
                        </div>

                        {formData.images.length > 0 && (
                          <div className="mt-3 md:mt-4">
                            <h5 className="font-medium text-gray-900 text-sm md:text-base mb-2 md:mb-3">Image Preview</h5>
                            <div className="grid grid-cols-3 gap-2 md:gap-3">
                              {formData.images.slice(0, 3).map((image, index) => (
                                <img
                                  key={index}
                                  src={URL.createObjectURL(image)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-14 md:h-16 lg:h-20 object-cover rounded border border-gray-200"
                                />
                              ))}
                              {formData.images.length > 3 && (
                                <div className="w-full h-14 md:h-16 lg:h-20 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500 text-xs md:text-sm">+{formData.images.length - 3} more</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2 md:mb-3 text-center text-sm md:text-base">Product Description</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200 text-sm md:text-base">
                        {formData.description}
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 md:p-6">
                    <h3 className="font-semibold text-yellow-900 mb-3 md:mb-4 text-base md:text-lg text-center">Final Price Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex justify-between">
                          <span className="text-yellow-800 text-sm md:text-base">Your Asking Price</span>
                          <span className="font-medium text-sm md:text-base">₹{parseInt(formData.askingPrice).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-yellow-800 text-sm md:text-base">Platform Fee ({platformFee}%)</span>
                          <span className="font-medium text-red-600 text-sm md:text-base">
                            ₹{((parseInt(formData.askingPrice) * platformFee) / 100).toLocaleString()}
                          </span>
                        </div>
                        <div className="border-t border-yellow-200 pt-1 md:pt-2 flex justify-between">
                          <span className="text-yellow-900 font-semibold text-sm md:text-base">You Will Receive</span>
                          <span className="text-yellow-900 font-bold text-sm md:text-base">₹{parseInt(formData.askingPrice).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 md:p-4 border border-yellow-300">
                        <p className="text-yellow-800 text-xs md:text-sm">
                          <span className="font-semibold">Note:</span> The platform fee covers marketing,
                          payment processing, customer support, and buyer protection services.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-3 md:pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 md:px-6 md:py-3 border border-gray-300 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-green-600 text-white text-sm md:text-base px-4 py-2 md:px-8 md:py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {isSubmitting ? 'Publishing Listing...' : 'Publish Listing'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}