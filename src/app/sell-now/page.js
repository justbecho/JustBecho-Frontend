'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
  const [isMobile, setIsMobile] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({
    isUploading: false,
    uploaded: 0,
    total: 0,
    percent: 0,
    currentFile: ''
  })

  // ✅ Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
      setIsMobile(isMobileDevice)
      console.log('📱 Device:', isMobileDevice ? 'Mobile' : 'Desktop')
    }
    
    checkMobile()
  }, [])

  // ✅ STRICT CATEGORY MAPPING - UPDATED
  const strictCategoryMap = useCallback(() => {
    return {
      "Men's Fashion": "Men's Fashion",
      "Mens Fashion": "Men's Fashion",
      "Mens": "Men's Fashion",
      "Men": "Men's Fashion",
      "men": "Men's Fashion",
      "mens": "Men's Fashion",
      "men-fashion": "Men's Fashion",
      "men's": "Men's Fashion",
      
      "Women's Fashion": "Women's Fashion",
      "Womens Fashion": "Women's Fashion",
      "Womens": "Women's Fashion",
      "Women": "Women's Fashion",
      "women": "Women's Fashion",
      "womens": "Women's Fashion",
      "women-fashion": "Women's Fashion",
      "women's": "Women's Fashion",
      
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
    const { name, value } = e.target
    
    let processedValue = value
    
    if (value.trim()) {
      processedValue = value
        .toLowerCase()
        .split(' ')
        .map(word => {
          if (word.includes('&')) {
            return word.toUpperCase()
          }
          
          if (word.length <= 3 && !['the', 'and', 'for', 'but', 'nor', 'yet', 'so'].includes(word)) {
            return word.toUpperCase()
          }
          
          return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .join(' ')
        
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
      }
      
      const lowerValue = value.toLowerCase().trim()
      if (specialBrands[lowerValue]) {
        processedValue = specialBrands[lowerValue]
      }
      
      if (processedValue.includes('Mc') && processedValue.length > 2) {
        processedValue = processedValue.replace(/Mc([a-z])/g, (match, p1) => `Mc${p1.toUpperCase()}`)
      }
      
      if (processedValue.includes('\'s')) {
        processedValue = processedValue.replace(/'s/gi, '\'s')
      }
      
      processedValue = processedValue.replace(/\s+/g, ' ').trim()
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
  }

  // ✅ General input handler with CATEGORY FIX
  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'category') {
      // ✅ Apply strict category mapping
      const mappedValue = strictCategoryMap()[value] || value
      console.log(`🗺️ Category mapping: "${value}" → "${mappedValue}"`)
      
      setFormData(prev => ({
        ...prev,
        [name]: mappedValue
      }))
    } else if (name === 'productName') {
      let processedValue = value
      if (value.trim()) {
        processedValue = value
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

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
          const mappedName = strictCategoryMap()[cat.name] || cat.name
          return {
            ...cat,
            name: mappedName
          }
        })
        
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
    const uniqueCategories = []
    const seen = new Set()
    
    backendCategories.forEach(category => {
      if (!seen.has(category.name)) {
        seen.add(category.name)
        uniqueCategories.push({
          name: category.name,
          value: category.name,
          subCategories: category.subCategories || []
        })
      }
    })
    
    return uniqueCategories.sort((a, b) => a.name.localeCompare(b.name))
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

  // ✅ MOBILE IMAGE COMPRESSION
  const compressImageForMobile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_SIZE = 1024 // Max dimension for mobile
          
          let width = img.width
          let height = img.height
          
          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width
              width = MAX_SIZE
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height
              height = MAX_SIZE
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          
          // Adjust quality based on file size
          let quality = 0.8
          if (file.size > 2 * 1024 * 1024) quality = 0.7
          if (file.size > 5 * 1024 * 1024) quality = 0.6
          
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          }, 'image/jpeg', quality)
        }
        img.onerror = reject
      }
      reader.onerror = reject
    })
  }

  const conditions = [
    'Brand New With Tag',
    'Brand New Without Tag',
    'Like New',
    'Excellent',
    'Fairly Used',
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

            const shouldBecomeSeller = window.confirm('You need to be a seller to list products. Would you like to become a seller?')
            if (shouldBecomeSeller) {
              localStorage.setItem('changingRoleToSeller', 'true')
              router.push('/complete-profile?role=seller')
            } else {
              router.push('/')
            }
            return
          }

          if (!userObj.sellerVerified) {
            console.log('❌ Seller not verified, checking status...')

            try {
              const response = await fetch('https://just-becho-backend.vercel.app/api/auth/profile-status', {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              })

              if (response.ok) {
                const data = await response.json()

                if (data.success && data.sellerVerified) {
                  const updatedUser = { ...userObj, ...data }
                  localStorage.setItem('user', JSON.stringify(updatedUser))
                  setUser(updatedUser)
                  console.log('✅ Seller is now verified!')
                } else {
                  setError('Your seller account is pending approval. You cannot list products until approved.')
                  setTimeout(() => {
                    router.push('/dashboard')
                  }, 3000)
                  return
                }
              } else {
                setError('Your seller account is pending approval. You cannot list products until approved.')
                setTimeout(() => {
                  router.push('/dashboard')
                }, 3000)
                return
              }
            } catch (statusError) {
              console.error('Error checking seller status:', statusError)
              setError('Your seller account is pending approval. You cannot list products until approved.')
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

  // ✅ UPDATED: MOBILE OPTIMIZED IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    // ✅ FIX: Check if event and files exist
    if (!e || !e.target || !e.target.files) {
      console.error('❌ Invalid file upload event:', e);
      return;
    }
    
    const files = Array.from(e.target.files);
    
    if (!files || files.length === 0) {
      console.warn('No files selected');
      return;
    }
    
    // Set limits
    const maxFiles = isMobile ? 3 : 5;
    const remainingSlots = maxFiles - (formData?.images?.length || 0);
    const filesToAdd = files.slice(0, remainingSlots);
    
    if (filesToAdd.length === 0) {
      alert(`You can upload maximum ${maxFiles} images${isMobile ? ' on mobile' : ''}`);
      return;
    }
    
    // ✅ FIX: Initialize images array if it doesn't exist
    const currentImages = Array.isArray(formData?.images) ? formData.images : [];
    
    // Set size limits based on device
    const maxSizePerFile = isMobile ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    
    let validFiles = [];
    let errors = [];
    let totalSize = 0;

    console.log(`📱 Mobile: ${isMobile}, Files to process: ${filesToAdd.length}`);

    for (const file of filesToAdd) {
      try {
        // Validate file
        if (!file || typeof file !== 'object') {
          errors.push('Invalid file');
          continue;
        }
        
        // Check file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          errors.push(`${file.name}: Invalid file type. Use JPG, PNG, WebP.`);
          continue;
        }

        // Check size per file
        if (file.size > maxSizePerFile) {
          errors.push(`${file.name}: File too large (max ${isMobile ? '5MB' : '10MB'} per image).`);
          continue;
        }

        const minSize = 10 * 1024; // 10KB
        if (file.size < minSize) {
          errors.push(`${file.name}: File too small (min 10KB).`);
          continue;
        }

        // Compress for mobile if needed
        let processedFile = file;
        if (isMobile && file.size > 1 * 1024 * 1024) { // Compress if > 1MB on mobile
          try {
            console.log(`📱 Compressing ${file.name} for mobile...`);
            processedFile = await compressImageForMobile(file);
            console.log(`✅ Compressed: ${(file.size/(1024*1024)).toFixed(2)}MB → ${(processedFile.size/(1024*1024)).toFixed(2)}MB`);
          } catch (compressError) {
            console.warn(`⚠️ Compression failed for ${file.name}, using original`);
          }
        }

        // Check total size limit
        const newTotalSize = totalSize + processedFile.size;
        const maxTotalSize = isMobile ? 15 * 1024 * 1024 : 50 * 1024 * 1024;
        
        if (newTotalSize > maxTotalSize) {
          errors.push(`${file.name}: Total size would exceed ${isMobile ? '15MB' : '50MB'} limit.`);
          continue;
        }

        totalSize = newTotalSize;
        validFiles.push(processedFile);
        
      } catch (fileError) {
        console.error(`Error processing ${file.name}:`, fileError);
        errors.push(`${file.name}: Processing error`);
      }
    }

    if (errors.length > 0) {
      alert('Upload issues:\n' + errors.join('\n'));
    }

    // ✅ FIX: Update formData safely
    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...currentImages, ...validFiles]
      }));
      
      // Show mobile warning
      if (isMobile && validFiles.length > 0) {
        const finalTotalSize = [...currentImages, ...validFiles].reduce((sum, img) => sum + img.size, 0);
        console.log(`📱 Mobile upload: ${currentImages.length + validFiles.length} images, total ${(finalTotalSize/(1024*1024)).toFixed(2)}MB`);
      }
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

  // ✅ UPDATED: XHR UPLOAD FOR MOBILE (MOST RELIABLE)
  const uploadWithXHR = (token, formDataToSend) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = 'https://just-becho-backend.vercel.app/api/products';
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      
      // Timeout settings
      xhr.timeout = isMobile ? 300000 : 180000;
      xhr.responseType = 'json';
      
      // Progress tracking
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress({
            isUploading: true,
            uploaded: event.loaded,
            total: event.total,
            percent: percent,
            currentFile: `Uploading... ${percent}%`
          });
        }
      };
      
      xhr.onload = () => {
        setUploadProgress({
          isUploading: false,
          uploaded: 0,
          total: 0,
          percent: 0,
          currentFile: ''
        });
        
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      };
      
      xhr.onerror = () => {
        setUploadProgress({
          isUploading: false,
          uploaded: 0,
          total: 0,
          percent: 0,
          currentFile: ''
        });
        reject(new Error('Network error. Please check your connection.'));
      };
      
      xhr.ontimeout = () => {
        setUploadProgress({
          isUploading: false,
          uploaded: 0,
          total: 0,
          percent: 0,
          currentFile: ''
        });
        reject(new Error('Upload timeout. Please try again.'));
      };
      
      // Send request
      console.log(`🚀 ${isMobile ? 'Mobile' : 'Desktop'} upload starting...`);
      xhr.send(formDataToSend);
    });
  };

  // ✅ UPDATED: HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ FIX 1: Validate images array
    if (!formData || !formData.images || !Array.isArray(formData.images)) {
      console.error('❌ FormData or images array is invalid:', formData);
      alert('Form data error. Please refresh the page and try again.');
      return;
    }
    
    // ✅ FIX 2: Check if images exist
    if (formData.images.length === 0) {
      alert('❌ Please upload at least one product image');
      return;
    }
    
    // ✅ FIX 3: Validate each image
    let hasInvalidImages = false;
    formData.images.forEach((image, index) => {
      if (!image || typeof image !== 'object' || !image.name || !image.size) {
        console.error(`❌ Invalid image at index ${index}:`, image);
        hasInvalidImages = true;
      }
    });
    
    if (hasInvalidImages) {
      alert('❌ Some images are invalid. Please remove and re-upload them.');
      return;
    }
    
    // ✅ FIX 4: Mobile pre-check
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      const totalSize = formData.images.reduce((sum, img) => sum + (img?.size || 0), 0);
      
      if (totalSize > 15 * 1024 * 1024) {
        alert(`❌ Mobile Upload Limit\n\nTotal size: ${(totalSize/(1024*1024)).toFixed(2)}MB\nMobile limit: 15MB\n\nPlease reduce image sizes.`);
        return;
      }
      
      const mobileConfirm = confirm(
        `📱 Mobile Upload Notice\n\n` +
        `IMPORTANT: Keep this screen open until upload completes.\n\n` +
        `Do NOT:\n` +
        `• Switch to another app\n` +
        `• Lock your phone\n` +
        `• Turn off screen\n` +
        `• Lose network connection\n\n` +
        `Uploading ${formData.images.length} image(s) (${(totalSize/(1024*1024)).toFixed(2)}MB)\n\n` +
        `Continue with upload?`
      );
      
      if (!mobileConfirm) return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = getLocalStorage('token');
      const userData = getLocalStorage('user');
      
      if (!token) {
        alert('Please login to list a product');
        router.push('/login?redirect=/sell-now');
        return;
      }
      
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
      
      // ✅ FIX 5: Prepare form data safely
      const submitFormData = new FormData();
      
      // Add product data
      const mappedCategory = strictCategoryMap()[formData.category] || formData.category;
      submitFormData.append('productName', formData.productName || '');
      submitFormData.append('brand', formData.brand || '');
      submitFormData.append('category', mappedCategory || '');
      submitFormData.append('productType', formData.productType || '');
      submitFormData.append('purchaseYear', formData.purchaseYear || '');
      submitFormData.append('condition', formData.condition || '');
      submitFormData.append('description', formData.description || '');
      submitFormData.append('askingPrice', formData.askingPrice || '0');
      submitFormData.append('platformFee', platformFee.toString());
      submitFormData.append('finalPrice', justBechoPrice.toString());
      
      // ✅ FIX 6: Add images safely
      console.log('📦 Adding images to FormData:', formData.images.length);
      
      formData.images.forEach((image, index) => {
        if (image && image.name && image.size) {
          const fileName = isMobile 
            ? `mobile_${Date.now()}_${index}_${image.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
            : image.name;
          submitFormData.append('images', image, fileName);
          console.log(`  Added image ${index + 1}: ${image.name} (${(image.size/(1024*1024)).toFixed(2)}MB)`);
        } else {
          console.warn(`  Skipping invalid image at index ${index}:`, image);
        }
      });
      
      // ✅ FIX 7: Check if any images were added
      const imageCount = Array.from(submitFormData.entries()).filter(([key]) => key === 'images').length;
      if (imageCount === 0) {
        throw new Error('No valid images to upload');
      }
      
      console.log(`🚀 Starting upload with ${imageCount} images...`);
      
      // Use XHR for upload
      const result = await uploadWithXHR(token, submitFormData);
      
      if (result.success) {
        alert('✅ Product listed successfully!');
        router.push('/dashboard?section=listings');
      } else {
        throw new Error(result.message || 'Upload failed');
      }
      
    } catch (error) {
      console.error('❌ Upload error:', error);
      
      if (isMobile) {
        if (error.message.includes('No valid images')) {
          alert('❌ No valid images found. Please upload images again.');
        } else if (error.message.includes('timeout') || error.message.includes('Timeout')) {
          alert('❌ Upload timeout. Try with Wi-Fi and fewer images.');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
          alert('❌ Network error. Check connection and try again.');
        } else {
          alert(`❌ Upload failed: ${error.message}`);
        }
      } else {
        alert(error.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const transformedCategories = transformCategoriesForSelect(categories)

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

  // ✅ Upload Progress Overlay
  const UploadProgressOverlay = () => {
    if (!uploadProgress.isUploading) return null
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isMobile ? '📱 Uploading from Mobile...' : 'Uploading Product...'}
            </h3>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress.percent}%` }}
              ></div>
            </div>
            
            <p className="text-gray-700 mb-2">{uploadProgress.currentFile}</p>
            
            {uploadProgress.total > 0 && (
              <p className="text-sm text-gray-500 mb-2">
                {Math.round(uploadProgress.uploaded / 1024)} KB / {Math.round(uploadProgress.total / 1024)} KB
              </p>
            )}
            
            {isMobile && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Important: Keep screen ON and stay on this page
                </p>
              </div>
            )}
            
            <p className="text-xs text-gray-400 mt-3">
              Please don't close or refresh this page...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ✅ Main form
  return (
    <>
      <Header />
      <UploadProgressOverlay />
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
                              handleBrandInput(e)
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
                      Product Images * 
                      <span className="text-xs text-gray-500 ml-1">
                        (Max {isMobile ? '3' : '5'} images, {isMobile ? '5MB' : '10MB'} each, {isMobile ? '15MB' : '50MB'} total)
                      </span>
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
                        <p className="text-gray-400 text-xs md:text-sm mt-1 md:mt-2">
                          {isMobile ? 'PNG, JPG up to 5MB each' : 'PNG, JPG, JPEG up to 10MB each'}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5 md:mt-1">
                          Maximum {isMobile ? '3' : '5'} images, total under {isMobile ? '15MB' : '50MB'}
                        </p>
                        {isMobile && (
                          <p className="text-blue-500 text-xs mt-0.5 md:mt-1">
                            📱 Large images are automatically compressed for mobile
                          </p>
                        )}
                      </label>
                    </div>

                    {formData.images.length > 0 && (
                      <div className="mt-4 md:mt-6">
                        <h4 className="text-xs md:text-sm font-medium text-gray-700 mb-3 md:mb-4">
                          Uploaded Images ({formData.images.length}/{isMobile ? '3' : '5'})
                          {isMobile && <span className="text-blue-500 ml-2">📱</span>}
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
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                                {(image.size/(1024*1024)).toFixed(1)}MB
                              </div>
                            </div>
                          ))}

                          {formData.images.length < (isMobile ? 3 : 5) && (
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
                        
                        {/* Total Size Display */}
                        <div className="mt-3 md:mt-4 p-2 md:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-blue-800 text-xs md:text-sm font-medium">
                              Total Size: {formData.images.reduce((sum, img) => sum + img.size, 0) / (1024*1024) > 1 
                                ? `${(formData.images.reduce((sum, img) => sum + img.size, 0) / (1024*1024)).toFixed(2)}MB`
                                : `${Math.round(formData.images.reduce((sum, img) => sum + img.size, 0) / 1024)}KB`
                              }
                            </span>
                            <span className="text-xs text-blue-600">
                              Limit: {isMobile ? '15MB' : '50MB'} ({Math.round((formData.images.reduce((sum, img) => sum + img.size, 0) / ((isMobile ? 15 : 50) * 1024 * 1024)) * 100)}% used)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 md:mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4">
                      <div className="flex items-start gap-2 md:gap-3">
                        <div className="w-4 h-4 md:w-5 md:h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs">💡</span>
                        </div>
                        <div>
                          <p className="text-yellow-800 font-medium text-xs md:text-sm">Upload Tips {isMobile && 'for Mobile'}</p>
                          <ul className="text-yellow-700 text-xs md:text-sm mt-0.5 md:mt-1 space-y-0.5 md:space-y-1">
                            <li>• Upload clear, high-quality photos</li>
                            <li>• Include photos from all angles</li>
                            <li>• Show any tags, labels, or authenticity marks</li>
                            <li>• Capture any imperfections or wear</li>
                            {isMobile && <li>• Use Wi-Fi for best results on mobile</li>}
                            {isMobile && <li>• Large images are automatically compressed</li>}
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
                      Listing Summary {isMobile && '📱'}
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
                            <span className="font-medium text-gray-900 text-sm md:text-base">
                              {formData.images.length} photo{formData.images.length !== 1 ? 's' : ''}
                              {isMobile && ' 📱'}
                            </span>
                          </div>
                          <div className="flex justify-between border-b pb-2 md:pb-3">
                            <span className="text-gray-600 text-sm md:text-base">Total Size:</span>
                            <span className="font-medium text-gray-900 text-sm md:text-base">
                              {formData.images.reduce((sum, img) => sum + img.size, 0) / (1024*1024) > 1 
                                ? `${(formData.images.reduce((sum, img) => sum + img.size, 0) / (1024*1024)).toFixed(2)}MB`
                                : `${Math.round(formData.images.reduce((sum, img) => sum + img.size, 0) / 1024)}KB`
                              }
                            </span>
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
                        {isMobile && (
                          <p className="text-blue-600 text-xs mt-2">
                            📱 <span className="font-semibold">Mobile Upload:</span> Images are optimized for mobile upload.
                          </p>
                        )}
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
                      className="bg-green-600 text-white text-sm md:text-base px-4 py-2 md:px-8 md:py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {isMobile ? 'Uploading...' : 'Publishing...'}
                        </>
                      ) : (
                        `Publish Listing${isMobile ? ' 📱' : ''}`
                      )}
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