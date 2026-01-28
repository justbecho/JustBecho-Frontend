'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminAddProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    category: '',
    productType: '',
    purchaseYear: '',
    condition: '',
    description: '',
    askingPrice: '',
    status: 'active',
    sellerId: '',
    images: []
  })

  const [categories, setCategories] = useState([])
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [justBechoPrice, setJustBechoPrice] = useState(0)
  const [platformFee] = useState(10)

  // Fetch categories and sellers
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const catRes = await fetch('https://just-becho-backend.vercel.app/api/categories')
        const catData = await catRes.json()
        if (catData.success) setCategories(catData.categories)

        // Fetch sellers
        const token = localStorage.getItem('adminToken')
        const sellerRes = await fetch('https://just-becho-backend.vercel.app/api/admin/users?role=seller', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const sellerData = await sellerRes.json()
        if (sellerData.success) setSellers(sellerData.users)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate price
  const calculatePrice = (price) => {
    if (price) {
      const feeAmount = (parseFloat(price) * 10) / 100
      setJustBechoPrice(Math.ceil(parseFloat(price) + feeAmount))
    } else {
      setJustBechoPrice(0)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (name === 'askingPrice') {
      calculatePrice(value)
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files.slice(0, 5 - prev.images.length)]
    }))
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.productName || !formData.brand || !formData.category || 
        !formData.productType || !formData.condition || !formData.description || 
        !formData.askingPrice || formData.images.length === 0) {
      toast.error('Please fill all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('adminToken')
      
      if (!token) {
        toast.error('Please login as admin')
        router.push('/admin/login')
        return
      }

      const submitFormData = new FormData()
      
      // Add all fields
      submitFormData.append('productName', formData.productName)
      submitFormData.append('brand', formData.brand)
      submitFormData.append('category', formData.category)
      submitFormData.append('productType', formData.productType)
      submitFormData.append('condition', formData.condition)
      submitFormData.append('description', formData.description)
      submitFormData.append('askingPrice', formData.askingPrice)
      submitFormData.append('status', formData.status)
      
      if (formData.purchaseYear) {
        submitFormData.append('purchaseYear', formData.purchaseYear)
      }
      
      if (formData.sellerId) {
        submitFormData.append('sellerId', formData.sellerId)
      }

      // Add images
      formData.images.forEach((image, index) => {
        submitFormData.append('images', image)
      })

      const response = await fetch('https://just-becho-backend.vercel.app/api/admin/products/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitFormData
      })

      const data = await response.json()

      if (data.success) {
        toast.success('✅ Product added successfully!')
        router.push('/admin/products')
      } else {
        throw new Error(data.message || 'Failed to add product')
      }
    } catch (error) {
      console.error('Add product error:', error)
      toast.error(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const conditions = [
    'Brand New With Tag',
    'Brand New Without Tag',
    'Like New',
    'Excellent',
    'Fairly Used',
    'Good'
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
            <p className="mt-1 text-sm text-gray-600">
              Add a new product to the store (Admin)
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 p-6">
        {/* Seller Selection */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
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
            {sellers.map(seller => (
              <option key={seller._id} value={seller._id}>
                {seller.name} ({seller.email}) - {seller.sellerVerified ? '✅ Verified' : '⏳ Pending'}
              </option>
            ))}
          </select>
          <p className="text-sm text-blue-600 mt-1">
            Leave empty to list the product under your admin account
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              Brand *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="e.g., Nike, Adidas"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Type *
            </label>
            <input
              type="text"
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="e.g., Sneakers, T-Shirt"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Year
            </label>
            <input
              type="number"
              name="purchaseYear"
              value={formData.purchaseYear}
              onChange={handleInputChange}
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="e.g., 2023"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asking Price (₹) *
            </label>
            <input
              type="number"
              name="askingPrice"
              value={formData.askingPrice}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="e.g., 5000"
            />
            <p className="text-sm text-gray-500 mt-1">
              Final Price: <span className="font-bold text-green-600">₹{justBechoPrice}</span> (Includes {platformFee}% fee)
            </p>
          </div>
        </div>

        <div className="mb-6">
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
            placeholder="Describe the product in detail..."
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images * (Max 5 images)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
              <p className="text-gray-400 text-sm mt-2">JPG, PNG, WebP up to 10MB each</p>
            </label>
          </div>

          {formData.images.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Uploaded Images ({formData.images.length}/5)
              </h4>
              <div className="grid grid-cols-5 gap-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
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
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </>
  )
}