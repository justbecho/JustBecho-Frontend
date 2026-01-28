'use client'

import { useState, useEffect, useCallback } from 'react'

export default function AdminProductForm({ 
  initialData = null,
  onSubmit,
  onCancel
}) {
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    category: '',
    productType: '',
    purchaseYear: '',
    condition: '',
    description: '',
    askingPrice: '',
    images: [],
    status: 'active',
    sellerId: '' // Admin can specify seller ID
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [justBechoPrice, setJustBechoPrice] = useState(0)
  const [platformFee, setPlatformFee] = useState(10) // Fixed 10%
  const [categories, setCategories] = useState([])
  const [productTypes, setProductTypes] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [sellers, setSellers] = useState([])
  const [loadingSellers, setLoadingSellers] = useState(false)

  // ✅ STRICT CATEGORY MAPPING (Same as Sell Now)
  const strictCategoryMap = useCallback(() => {
    return {
      "Men's Fashion": "MEN'S FASHION",
      "Mens Fashion": "MEN'S FASHION",
      "Men": "MEN'S FASHION",
      "men": "MEN'S FASHION",
      "mens": "MEN'S FASHION",
      
      "Women's Fashion": "WOMEN'S FASHION",
      "Womens Fashion": "WOMEN'S FASHION",
      "Women": "WOMEN'S FASHION",
      "women": "WOMEN'S FASHION",
      "womens": "WOMEN'S FASHION",
      
      "Footwear": "FOOTWEAR",
      "footwear": "FOOTWEAR",
      "Shoes": "FOOTWEAR",
      
      "Accessories": "ACCESSORIES",
      "accessories": "ACCESSORIES",
      
      "Watches": "WATCHES",
      "watches": "WATCHES",
      
      "Perfumes": "PERFUMES",
      "perfumes": "PERFUMES",
      
      "Toys & Collectibles": "TOYS & COLLECTIBLES",
      "toys": "TOYS & COLLECTIBLES",
      
      "Kids Fashion": "KIDS",
      "Kids": "KIDS",
      "kids": "KIDS"
    }
  }, [])

  // ✅ Initialize form
  useEffect(() => {
    if (initialData) {
      setFormData({
        productName: initialData.productName || '',
        brand: initialData.brand || '',
        category: initialData.category || '',
        productType: initialData.productType || '',
        purchaseYear: initialData.purchaseYear || '',
        condition: initialData.condition || '',
        description: initialData.description || '',
        askingPrice: initialData.askingPrice || '',
        images: initialData.images || [],
        status: initialData.status || 'active',
        sellerId: initialData.seller?._id || ''
      })
      
      if (initialData.askingPrice) {
        const price = parseInt(initialData.askingPrice);
        const feeAmount = (price * 10) / 100;
        setJustBechoPrice(Math.ceil(price + feeAmount));
      }
    }
  }, [initialData])

  // ✅ Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true)
      const response = await fetch('https://just-becho-backend.vercel.app/api/categories')
      const data = await response.json()
      
      if (data.success) {
        const mappedCategories = data.categories.map(cat => {
          const mappedName = strictCategoryMap()[cat.name] || cat.name
          return {
            ...cat,
            name: mappedName
          }
        })
        
        setCategories(mappedCategories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoadingCategories(false)
    }
  }, [strictCategoryMap])

  // ✅ Fetch sellers (for admin to assign product)
  const fetchSellers = useCallback(async () => {
    try {
      setLoadingSellers(true)
      const token = localStorage.getItem('adminToken')
      const response = await fetch('https://just-becho-backend.vercel.app/api/admin/dashboard/users?role=seller', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setSellers(data.users)
      }
    } catch (error) {
      console.error('Error fetching sellers:', error)
    } finally {
      setLoadingSellers(false)
    }
  }, [])

  // ✅ Get product types
  const getProductTypesForCategory = useCallback((selectedCategory) => {
    if (!selectedCategory || !categories.length) return []
    
    const category = categories.find(cat => cat.name === selectedCategory)
    if (!category || !category.subCategories) return []
    
    const allItems = []
    
    category.subCategories.forEach(subCategory => {
      if (subCategory.items && Array.isArray(subCategory.items)) {
        allItems.push(...subCategory.items)
      }
    })
    
    return [...new Set(allItems)].filter(item => item && typeof item === 'string')
  }, [categories])

  // ✅ Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'category') {
      const mappedValue = strictCategoryMap()[value] || value
      
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
    } else if (name === 'askingPrice') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
      
      // Calculate price
      if (value) {
        const price = parseInt(value)
        const feeAmount = (price * 10) / 100
        setJustBechoPrice(Math.ceil(price + feeAmount))
      } else {
        setJustBechoPrice(0)
      }
    } else if (name === 'brand') {
      let processedValue = value
      
      if (value.trim()) {
        processedValue = value
          .toLowerCase()
          .split(' ')
          .map(word => {
            if (word.includes('&')) return word.toUpperCase()
            if (word.length <= 3) return word.toUpperCase()
            return word.charAt(0).toUpperCase() + word.slice(1)
          })
          .join(' ')
        
        // Special brand formatting
        const specialBrands = {
          'nike': 'Nike',
          'adidas': 'Adidas',
          'gucci': 'Gucci',
          'lv': 'Louis Vuitton',
          'louis vuitton': 'Louis Vuitton',
          'dolce & gabbana': 'Dolce & Gabbana',
          'dior': 'Dior',
          'chanel': 'Chanel'
        }
        
        const lowerValue = value.toLowerCase().trim()
        if (specialBrands[lowerValue]) {
          processedValue = specialBrands[lowerValue]
        }
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

  // ✅ Handle image upload
  const handleImageUpload = async (e) => {
    if (!e?.target?.files) return
    
    const files = Array.from(e.target.files)
    const maxFiles = 5
    const currentImages = formData.images || []
    const remainingSlots = maxFiles - currentImages.length
    
    const filesToAdd = files.slice(0, remainingSlots)
    
    if (filesToAdd.length === 0) {
      alert(`Maximum ${maxFiles} images allowed`)
      return
    }
    
    // Validate and add files
    const validFiles = []
    
    for (const file of filesToAdd) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      const isHEIF = file.type.includes('heif') || file.type.includes('heic') || 
                    file.name.toLowerCase().endsWith('.heif') || 
                    file.name.toLowerCase().endsWith('.heic')
      
      if (!validTypes.includes(file.type) && !isHEIF) {
        alert(`${file.name}: Only JPG, PNG, WebP, HEIF/HEIC allowed`)
        continue
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name}: File too large (max 10MB)`)
        continue
      }
      
      validFiles.push(file)
    }
    
    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...currentImages, ...validFiles]
      }))
    }
  }

  // ✅ Remove image
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // ✅ Handle form submit
  const handleSubmitForm = async (e) => {
    e.preventDefault()
    
    if (!onSubmit) {
      console.error('No onSubmit handler provided')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Submit error:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ✅ Conditions list
  const conditions = [
    'Brand New With Tag',
    'Brand New Without Tag',
    'Like New',
    'Excellent',
    'Fairly Used',
    'Good'
  ]

  // ✅ Status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'sold', label: 'Sold' }
  ]

  // ✅ Current year for purchase year
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i)

  // ✅ Update product types when category changes
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

  // ✅ Fetch data on mount
  useEffect(() => {
    fetchCategories()
    fetchSellers()
  }, [fetchCategories, fetchSellers])

  // ✅ Transform categories for select
  const transformedCategories = categories
    .filter((cat, index, self) => 
      index === self.findIndex(c => c.name === cat.name)
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  // ✅ Total size calculation
  const totalSizeMB = formData.images.reduce((sum, img) => sum + (img.size || 0), 0) / (1024 * 1024)

  // ✅ Navigation functions
  const nextStep = () => setCurrentStep(prev => prev + 1)
  const prevStep = () => setCurrentStep(prev => prev - 1)

  // ✅ STEP 1: Product Information
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center border-b border-gray-200 pb-6">
        <h2 className="text-xl font-light text-gray-900">Product Information</h2>
        <p className="text-gray-600 mt-2">Enter product details</p>
      </div>

      {/* Seller Selection - Admin Only */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-blue-800 mb-2">
          Select Seller (Optional - Leave empty for yourself)
        </label>
        <select
          name="sellerId"
          value={formData.sellerId}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">Select Seller (or leave for yourself)</option>
          <option value="admin">List as Admin (Yourself)</option>
          {loadingSellers ? (
            <option disabled>Loading sellers...</option>
          ) : (
            sellers.map(seller => (
              <option key={seller._id} value={seller._id}>
                {seller.name} ({seller.email}) - {seller.sellerVerified ? '✅ Verified' : '⏳ Pending'}
              </option>
            ))
          )}
        </select>
        <p className="text-sm text-blue-600 mt-1">
          Leave empty to list the product under your admin account
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="e.g., Nike Air Jordan 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Category *
            </label>
            {loadingCategories ? (
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                <p className="text-gray-500">Loading categories...</p>
              </div>
            ) : (
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {transformedCategories.map(category => (
                  <option key={category._id || category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Year
            </label>
            <select
              name="purchaseYear"
              value={formData.purchaseYear}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="">Select Year</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="e.g., Nike, Adidas, Louis Vuitton"
            />
          </div>

          {formData.category && productTypes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type *
              </label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">Select Type</option>
                {productTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition *
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="Describe your item in detail..."
        />
      </div>

      {/* Admin-only status field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status *
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={nextStep}
          disabled={!formData.productName || !formData.brand || !formData.category || !formData.productType || !formData.condition || !formData.description}
          className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
        >
          Continue to Pricing
        </button>
      </div>
    </div>
  )

  // ✅ STEP 2: Pricing & Images
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center border-b border-gray-200 pb-6">
        <h2 className="text-xl font-light text-gray-900">Pricing & Images</h2>
        <p className="text-gray-600 mt-2">Set price and upload images</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Asking Price (₹) *
          </label>
          <input
            type="number"
            name="askingPrice"
            value={formData.askingPrice}
            onChange={handleInputChange}
            required
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent text-lg font-medium"
            placeholder="e.g., 5000"
          />
          <p className="text-sm text-gray-500">Enter the selling price</p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Final Price (₹) - with 10% fee
          </label>
          <div className="w-full px-4 py-3 border border-green-300 bg-green-50 rounded-lg text-lg font-medium text-green-800">
            ₹{justBechoPrice.toLocaleString()}
          </div>
          <p className="text-sm text-green-600">
            Includes {platformFee}% platform fee
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Product Images * (Max 5 images, 10MB each)
        </label>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer block">
            <div className="text-gray-400 mb-3">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg font-medium">Click to upload images</p>
            <p className="text-gray-400 text-sm mt-2">
              JPG, PNG, WebP up to 10MB each
            </p>
          </label>
        </div>

        {formData.images.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">
              Uploaded Images ({formData.images.length}/5)
            </h4>
            <div className="grid grid-cols-5 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-blue-800 text-sm font-medium">
                  Total Size: {totalSizeMB.toFixed(2)}MB / 50MB
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={!formData.askingPrice || formData.images.length === 0}
          className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
        >
          Review & Submit
        </button>
      </div>
    </div>
  )

  // ✅ STEP 3: Review & Submit
  const renderStep3 = () => {
    const selectedSeller = sellers.find(s => s._id === formData.sellerId)
    
    return (
      <div className="space-y-6">
        <div className="text-center border-b border-gray-200 pb-6">
          <h2 className="text-xl font-light text-gray-900">Review & Submit</h2>
          <p className="text-gray-600 mt-2">Review product before adding</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-4 text-center">
            Product Summary
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Product Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">Seller:</span>
                  <span className="font-medium text-gray-900">
                    {selectedSeller ? `${selectedSeller.name} (${selectedSeller.email})` : 'Admin'}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-gray-900">
                    {statusOptions.find(s => s.value === formData.status)?.label}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">Product Name:</span>
                  <span className="font-medium text-gray-900">{formData.productName}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">Brand:</span>
                  <span className="font-medium text-gray-900">{formData.brand}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900">{formData.category}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">Product Type:</span>
                  <span className="font-medium text-gray-900">{formData.productType}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Pricing & Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-medium text-gray-900">{formData.condition}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">Purchase Year:</span>
                  <span className="font-medium text-gray-900">{formData.purchaseYear || 'Not specified'}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">Asking Price:</span>
                  <span className="font-medium text-gray-900">₹{parseInt(formData.askingPrice || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">Platform Fee:</span>
                  <span className="font-medium text-red-600">{platformFee}%</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600 font-semibold">Final Price:</span>
                  <span className="font-bold text-green-600">₹{justBechoPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">Images:</span>
                  <span className="font-medium text-gray-900">
                    {formData.images.length} image{formData.images.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {formData.images.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-3">Image Preview</h5>
                  <div className="grid grid-cols-3 gap-3">
                    {formData.images.slice(0, 3).map((image, index) => (
                      <img
                        key={index}
                        src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded border border-gray-200"
                      />
                    ))}
                    {formData.images.length > 3 && (
                      <div className="w-full h-20 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">+{formData.images.length - 3} more</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3 text-center">Description</h4>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {formData.description}
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back
          </button>
          <button
            type="submit"
            onClick={handleSubmitForm}
            disabled={isSubmitting}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </div>
    )
  }

  // ✅ Progress Steps
  const ProgressSteps = () => (
    <div className="flex items-center justify-center mb-12">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              currentStep >= step
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-gray-300 text-gray-400'
            }`}>
              {currentStep > step ? '✓' : step}
            </div>
            <span className={`mt-3 text-xs font-medium ${
              currentStep >= step ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step === 1 ? 'Product Details' : 
               step === 2 ? 'Pricing & Images' : 'Review & Submit'}
            </span>
          </div>
          
          {step < 3 && (
            <div className={`w-24 h-0.5 mx-8 ${
              currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
            }`}></div>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <form onSubmit={handleSubmitForm} className="max-w-4xl mx-auto">
      <ProgressSteps />
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>
    </form>
  )
}