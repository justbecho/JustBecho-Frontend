'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Eye, Search, ChevronDown, ChevronUp, List, Tag } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [expandedCategories, setExpandedCategories] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    href: '',
    isActive: true
  })
  const [subcategoryForm, setSubcategoryForm] = useState({
    title: '',
    slug: '',
    items: []
  })
  const [newItem, setNewItem] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [search])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      
      let url = 'https://just-becho-backend.vercel.app/api/admin/dashboard/categories'
      if (search) url += `?search=${encodeURIComponent(search)}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setCategories(data.categories || [])
      } else {
        toast.error(data.message || 'Failed to fetch categories')
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }
    
    try {
      const token = localStorage.getItem('adminToken')
      const url = editingCategory
        ? `https://just-becho-backend.vercel.app/api/admin/dashboard/categories/${editingCategory._id}`
        : 'https://just-becho-backend.vercel.app/api/admin/dashboard/categories'
      
      const method = editingCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(editingCategory ? 'Category updated successfully' : 'Category created successfully')
        setShowAddModal(false)
        setEditingCategory(null)
        setFormData({
          name: '',
          description: '',
          image: '',
          href: '',
          isActive: true
        })
        fetchCategories()
      } else {
        toast.error(data.message || 'Failed to save category')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Failed to save category')
    }
  }

  const handleDelete = async (categoryId, categoryName) => {
    if (!categoryId) {
      toast.error('Invalid category ID')
      return
    }

    if (!confirm(`Are you sure you want to delete category "${categoryName}"? This will also delete all subcategories.`)) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`https://just-becho-backend.vercel.app/api/admin/dashboard/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Category deleted successfully')
        fetchCategories()
      } else {
        toast.error(data.message || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    }
  }

  const handleEdit = (category) => {
    if (!category) return
    
    setEditingCategory(category)
    setFormData({
      name: category.name || '',
      description: category.description || '',
      image: category.image || '',
      href: category.href || '',
      isActive: category.isActive !== undefined ? category.isActive : true
    })
    setShowAddModal(true)
  }

  const handleManageSubcategories = (category) => {
    setSelectedCategory(category)
    setShowSubcategoryModal(true)
  }

  const handleAddSubcategory = async (e) => {
    e.preventDefault()
    
    if (!subcategoryForm.title.trim() || !subcategoryForm.slug.trim()) {
      toast.error('Title and slug are required')
      return
    }
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(
        `https://just-becho-backend.vercel.app/api/admin/dashboard/categories/${selectedCategory._id}/subcategories`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(subcategoryForm)
        }
      )

      const data = await response.json()
      
      if (data.success) {
        toast.success('Subcategory added successfully')
        setSubcategoryForm({
          title: '',
          slug: '',
          items: []
        })
        setNewItem('')
        // Refresh categories
        fetchCategories()
      } else {
        toast.error(data.message || 'Failed to add subcategory')
      }
    } catch (error) {
      console.error('Error adding subcategory:', error)
      toast.error('Failed to add subcategory')
    }
  }

  const handleAddItem = async () => {
    if (!newItem.trim()) {
      toast.error('Item name is required')
      return
    }
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(
        `https://just-becho-backend.vercel.app/api/admin/dashboard/categories/${selectedCategory._id}/subcategories/${subcategoryForm.slug}/items`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ item: newItem.trim() })
        }
      )

      const data = await response.json()
      
      if (data.success) {
        toast.success('Item added successfully')
        setNewItem('')
        // Refresh categories
        fetchCategories()
      } else {
        toast.error(data.message || 'Failed to add item')
      }
    } catch (error) {
      console.error('Error adding item:', error)
      toast.error('Failed to add item')
    }
  }

  const handleDeleteSubcategory = async (subSlug) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) {
      return
    }
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(
        `https://just-becho-backend.vercel.app/api/admin/dashboard/categories/${selectedCategory._id}/subcategories/${subSlug}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const data = await response.json()
      
      if (data.success) {
        toast.success('Subcategory deleted successfully')
        // Refresh categories
        fetchCategories()
      } else {
        toast.error(data.message || 'Failed to delete subcategory')
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      toast.error('Failed to delete subcategory')
    }
  }

  const handleDeleteItem = async (subSlug, item) => {
    if (!confirm(`Are you sure you want to remove "${item}"?`)) {
      return
    }
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(
        `https://just-becho-backend.vercel.app/api/admin/dashboard/categories/${selectedCategory._id}/subcategories/${subSlug}/items/${encodeURIComponent(item)}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const data = await response.json()
      
      if (data.success) {
        toast.success('Item removed successfully')
        // Refresh categories
        fetchCategories()
      } else {
        toast.error(data.message || 'Failed to remove item')
      }
    } catch (error) {
      console.error('Error removing item:', error)
      toast.error('Failed to remove item')
    }
  }

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  const getCategorySlug = (category) => {
    if (!category) return ''
    
    if (category.href) return category.href
    
    if (category.name) {
      return category.name.toLowerCase().replace(/\s+/g, '-')
    }
    
    return ''
  }

  const filteredCategories = categories.filter(category => {
    if (!category) return false
    
    const nameMatch = category.name?.toLowerCase().includes(search.toLowerCase()) || false
    const descMatch = category.description?.toLowerCase().includes(search.toLowerCase()) || false
    
    return nameMatch || descMatch
  })

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Category Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage product categories and subcategories
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => {
                setEditingCategory(null)
                setFormData({
                  name: '',
                  description: '',
                  image: '',
                  href: '',
                  isActive: true
                })
                setShowAddModal(true)
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Categories List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading categories...</p>
          </div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No categories found</p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-2 text-blue-600 hover:text-blue-500"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleCategoryExpansion(category._id)}
                        className="mr-2 text-gray-500 hover:text-gray-700"
                      >
                        {expandedCategories[category._id] ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                      <h3 className="text-lg font-medium text-gray-900">
                        {category.name || 'Unnamed Category'}
                      </h3>
                    </div>
                    {category.description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {category.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        category.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {category.subCategories && category.subCategories.length > 0 && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {category.subCategories.length} Subcategories
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {category.name && (
                    <Link
                      href={`/categories/${getCategorySlug(category)}`}
                      target="_blank"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 ml-4"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  )}
                </div>

                {/* Subcategories - Expanded View */}
                {expandedCategories[category._id] && category.subCategories && (
                  <div className="mt-4 pl-7 border-l-2 border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">Subcategories:</h4>
                    {category.subCategories.length === 0 ? (
                      <p className="text-sm text-gray-500">No subcategories yet</p>
                    ) : (
                      <div className="space-y-2">
                        {category.subCategories.map((sub) => (
                          <div key={sub.slug} className="bg-gray-50 rounded p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-medium">{sub.title}</span>
                                <span className="text-sm text-gray-500 ml-2">({sub.slug})</span>
                              </div>
                              <button
                                onClick={() => handleDeleteItem(sub.slug, 'test')}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            {sub.items && sub.items.length > 0 && (
                              <div className="mt-2">
                                <div className="text-sm text-gray-600">Items:</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {sub.items.map((item, idx) => (
                                    <span 
                                      key={idx}
                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                                    >
                                      <Tag className="h-3 w-3 mr-1" />
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleManageSubcategories(category)}
                      className="inline-flex items-center px-3 py-2 border border-purple-300 shadow-sm text-sm leading-4 font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <List className="h-4 w-4 mr-1" />
                      Subcategories
                    </button>
                    
                    <button
                      onClick={() => handleDelete(category._id, category.name)}
                      className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Slug: {getCategorySlug(category)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.href}
                    onChange={(e) => setFormData({...formData, href: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="category-name"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Leave empty to auto-generate from name
                  </p>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Active (visible on website)
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingCategory(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategory Management Modal */}
      {showSubcategoryModal && selectedCategory && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Manage Subcategories: {selectedCategory.name}
                </h3>
                <button
                  onClick={() => {
                    setShowSubcategoryModal(false)
                    setSelectedCategory(null)
                    setSubcategoryForm({ title: '', slug: '', items: [] })
                    setNewItem('')
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Existing Subcategories */}
              <div className="mb-8">
                <h4 className="font-medium text-gray-700 mb-4">Existing Subcategories</h4>
                {selectedCategory.subCategories && selectedCategory.subCategories.length > 0 ? (
                  <div className="space-y-4">
                    {selectedCategory.subCategories.map((sub) => (
                      <div key={sub.slug} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium">{sub.title}</div>
                            <div className="text-sm text-gray-500">Slug: {sub.slug}</div>
                          </div>
                          <button
                            onClick={() => handleDeleteSubcategory(sub.slug)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-sm text-gray-600 mb-2">Items:</div>
                          {sub.items && sub.items.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {sub.items.map((item, idx) => (
                                <div key={idx} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                  <span className="text-sm">{item}</span>
                                  <button
                                    onClick={() => handleDeleteItem(sub.slug, item)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No items yet</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No subcategories yet</p>
                )}
              </div>

              {/* Add New Subcategory */}
              <div>
                <h4 className="font-medium text-gray-700 mb-4">Add New Subcategory</h4>
                <form onSubmit={handleAddSubcategory} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={subcategoryForm.title}
                        onChange={(e) => setSubcategoryForm({...subcategoryForm, title: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Slug (URL) *
                      </label>
                      <input
                        type="text"
                        value={subcategoryForm.slug}
                        onChange={(e) => setSubcategoryForm({...subcategoryForm, slug: e.target.value.toLowerCase()})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Add Items */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Items
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="e.g., T-shirts, Jeans, Jackets"
                        className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50"
                      >
                        Add Item
                      </button>
                    </div>
                    {subcategoryForm.items.length > 0 && (
                      <div className="mt-3">
                        <div className="text-sm text-gray-600 mb-2">Items to add:</div>
                        <div className="flex flex-wrap gap-2">
                          {subcategoryForm.items.map((item, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                            >
                              {item}
                              <button
                                type="button"
                                onClick={() => {
                                  setSubcategoryForm({
                                    ...subcategoryForm,
                                    items: subcategoryForm.items.filter((_, i) => i !== idx)
                                  })
                                }}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSubcategoryModal(false)
                        setSelectedCategory(null)
                        setSubcategoryForm({ title: '', slug: '', items: [] })
                        setNewItem('')
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                    >
                      Add Subcategory
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}