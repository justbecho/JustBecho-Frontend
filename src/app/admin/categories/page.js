'use client'

import { useEffect, useState } from 'react'
import { 
  Plus, Edit, Trash2, Eye, Search, ChevronDown, ChevronUp, 
  List, Tag, Grid, List as ListIcon, RefreshCw, Download,
  CheckCircle, XCircle, Filter, MoreVertical
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [expandedCategories, setExpandedCategories] = useState({})
  const [viewMode, setViewMode] = useState('grid')
  const [activeFilter, setActiveFilter] = useState('all')
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    href: '',
    isActive: true,
    subCategories: []
  })
  
  const [subcategoryForm, setSubcategoryForm] = useState({
    title: '',
    slug: '',
    items: []
  })
  
  const [newItem, setNewItem] = useState('')
  const [editingSubcategory, setEditingSubcategory] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [search, activeFilter])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      
      let url = 'https://just-becho-backend.vercel.app/api/admin/dashboard/categories'
      const params = []
      
      if (search) params.push(`search=${encodeURIComponent(search)}`)
      
      if (params.length > 0) {
        url += `?${params.join('&')}`
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (data.success) {
        let filteredCategories = data.categories || []
        
        if (activeFilter === 'active') {
          filteredCategories = filteredCategories.filter(cat => cat.isActive)
        } else if (activeFilter === 'inactive') {
          filteredCategories = filteredCategories.filter(cat => !cat.isActive)
        }
        
        setCategories(filteredCategories)
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
          isActive: true,
          subCategories: []
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

  const handleDelete = async () => {
    if (!categoryToDelete) return
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(
        `https://just-becho-backend.vercel.app/api/admin/dashboard/categories/${categoryToDelete._id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const data = await response.json()
      
      if (data.success) {
        toast.success('Category deleted successfully')
        setShowDeleteModal(false)
        setCategoryToDelete(null)
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
      isActive: category.isActive !== undefined ? category.isActive : true,
      subCategories: category.subCategories || []
    })
    setShowAddModal(true)
  }

  const handleManageSubcategories = (category) => {
    setSelectedCategory(category)
    setSubcategoryForm({
      title: '',
      slug: '',
      items: []
    })
    setNewItem('')
    setEditingSubcategory(null)
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
      
      let url, method, body
      
      if (editingSubcategory) {
        url = `https://just-becho-backend.vercel.app/api/admin/dashboard/categories/${selectedCategory._id}/subcategories/${editingSubcategory.slug}`
        method = 'PUT'
        body = {
          title: subcategoryForm.title,
          newSlug: subcategoryForm.slug,
          items: subcategoryForm.items
        }
      } else {
        url = `https://just-becho-backend.vercel.app/api/admin/dashboard/categories/${selectedCategory._id}/subcategories`
        method = 'POST'
        body = subcategoryForm
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(editingSubcategory ? 'Subcategory updated successfully' : 'Subcategory added successfully')
        setSubcategoryForm({
          title: '',
          slug: '',
          items: []
        })
        setNewItem('')
        setEditingSubcategory(null)
        fetchCategories()
      } else {
        toast.error(data.message || 'Failed to save subcategory')
      }
    } catch (error) {
      console.error('Error saving subcategory:', error)
      toast.error('Failed to save subcategory')
    }
  }

  const handleAddItem = () => {
    if (!newItem.trim()) {
      toast.error('Item name is required')
      return
    }
    
    if (!subcategoryForm.items.includes(newItem.trim())) {
      setSubcategoryForm({
        ...subcategoryForm,
        items: [...subcategoryForm.items, newItem.trim()]
      })
      setNewItem('')
    } else {
      toast.error('Item already exists')
    }
  }

  const handleRemoveItem = (itemToRemove) => {
    setSubcategoryForm({
      ...subcategoryForm,
      items: subcategoryForm.items.filter(item => item !== itemToRemove)
    })
  }

  const handleEditSubcategory = (subcategory) => {
    setEditingSubcategory(subcategory)
    setSubcategoryForm({
      title: subcategory.title,
      slug: subcategory.slug,
      items: [...subcategory.items]
    })
  }

  // ✅ FIXED: Delete Subcategory Function
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
        // Update selected category with fresh data
        setSelectedCategory(data.category)
        // Refresh main categories list
        fetchCategories()
      } else {
        toast.error(data.message || 'Failed to delete subcategory')
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      toast.error('Failed to delete subcategory')
    }
  }

  const handleDeleteItemFromSubcategory = async (subSlug, item) => {
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
        // Update selected category
        setSelectedCategory(data.category)
        fetchCategories()
      } else {
        toast.error(data.message || 'Failed to remove item')
      }
    } catch (error) {
      console.error('Error removing item:', error)
      toast.error('Failed to remove item')
    }
  }

  const handleToggleStatus = async (categoryId, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(
        `https://just-becho-backend.vercel.app/api/admin/dashboard/categories/${categoryId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            isActive: !currentStatus
          })
        }
      )

      const data = await response.json()
      
      if (data.success) {
        toast.success(`Category ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
        fetchCategories()
      } else {
        toast.error(data.message || 'Failed to update status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
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

  const exportCategories = () => {
    const dataStr = JSON.stringify(categories, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `categories-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Category Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage product categories and subcategories ({categories.length} total)
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button
            onClick={exportCategories}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={fetchCategories}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => {
              setEditingCategory(null)
              setFormData({
                name: '',
                description: '',
                image: '',
                href: '',
                isActive: true,
                subCategories: []
              })
              setShowAddModal(true)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative w-full md:w-64">
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
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'}`}
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading categories...</p>
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
          <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
            <List className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500 mb-4">
            {search ? 'Try adjusting your search or filter' : 'Get started by creating your first category'}
          </p>
          <div className="space-x-3">
            {search && (
              <button
                onClick={() => setSearch('')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={() => {
                setEditingCategory(null)
                setFormData({
                  name: '',
                  description: '',
                  image: '',
                  href: '',
                  isActive: true,
                  subCategories: []
                })
                setShowAddModal(true)
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {category.name || 'Unnamed Category'}
                    </h3>
                    {category.description && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleStatus(category._id, category.isActive)}
                      className={`p-1 rounded-full ${category.isActive ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}`}
                    >
                      {category.isActive ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Slug:</span>
                    <span className="font-medium">{getCategorySlug(category)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subcategories:</span>
                    <span className="font-medium">
                      {category.subCategories?.length || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      category.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {category.image && (
                  <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={category.image}
                      alt={category.name || 'Category image'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.classList.add('bg-gray-200')
                      }}
                    />
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleEdit(category)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleManageSubcategories(category)}
                      className="inline-flex items-center px-3 py-2 border border-purple-300 shadow-sm text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50"
                    >
                      <List className="h-4 w-4 mr-1" />
                      Subcats
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {category.name && (
                      <Link
                        href={`/categories/${getCategorySlug(category)}`}
                        target="_blank"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        setCategoryToDelete(category)
                        setShowDeleteModal(true)
                      }}
                      className="inline-flex items-center text-sm text-red-600 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subcategories
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
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
                        <div>
                          <div className="font-medium text-gray-900">{category.name}</div>
                          {category.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Expanded View - Subcategories */}
                      {expandedCategories[category._id] && category.subCategories && category.subCategories.length > 0 && (
                        <div className="ml-7 mt-2 border-l-2 border-gray-200 pl-4">
                          <div className="text-sm font-medium text-gray-700 mb-1">Subcategories:</div>
                          <div className="space-y-1">
                            {category.subCategories.map((sub) => (
                              <div key={sub.slug} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1">
                                <div>
                                  <span className="font-medium">{sub.title}</span>
                                  <span className="text-xs text-gray-500 ml-2">({sub.slug})</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">
                                    {sub.items?.length || 0} items
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCategorySlug(category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.subCategories?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(category._id, category.isActive)}
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          category.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleManageSubcategories(category)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Subcats
                        </button>
                        <button
                          onClick={() => {
                            setCategoryToDelete(category)
                            setShowDeleteModal(true)
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>
                
                <div className="space-y-4">
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
                  
                  {/* Subcategories in Category Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategories
                    </label>
                    <div className="space-y-2">
                      {formData.subCategories?.map((sub, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={sub.title}
                              onChange={(e) => {
                                const newSubs = [...formData.subCategories]
                                newSubs[index].title = e.target.value
                                setFormData({...formData, subCategories: newSubs})
                              }}
                              placeholder="Subcategory title"
                              className="w-full border border-gray-300 rounded py-1 px-2 text-sm"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newSubs = formData.subCategories.filter((_, i) => i !== index)
                              setFormData({...formData, subCategories: newSubs})
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const newSubs = [...(formData.subCategories || []), { title: '', slug: '', items: [] }]
                          setFormData({...formData, subCategories: newSubs})
                        }}
                        className="text-sm text-blue-600 hover:text-blue-500"
                      >
                        + Add Subcategory
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingCategory(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
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
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingSubcategory ? 'Edit Subcategory' : 'Add Subcategory'} - {selectedCategory.name}
                </h3>
                <button
                  onClick={() => {
                    setShowSubcategoryModal(false)
                    setSelectedCategory(null)
                    setSubcategoryForm({ title: '', slug: '', items: [] })
                    setNewItem('')
                    setEditingSubcategory(null)
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Existing Subcategories */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">Existing Subcategories</h4>
                  {selectedCategory.subCategories && selectedCategory.subCategories.length > 0 ? (
                    <div className="space-y-3">
                      {selectedCategory.subCategories.map((sub) => (
                        <div key={sub.slug} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="font-medium">{sub.title}</div>
                              <div className="text-sm text-gray-500">Slug: {sub.slug}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditSubcategory(sub)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Edit
                              </button>
                              {/* ✅ FIXED: Delete Button */}
                              <button
                                onClick={() => handleDeleteSubcategory(sub.slug)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm text-gray-600 mb-2">Items:</div>
                            {sub.items && sub.items.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {sub.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                                    <span className="text-sm">{item}</span>
                                    <button
                                      onClick={() => handleDeleteItemFromSubcategory(sub.slug, item)}
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

                {/* Right Column - Add/Edit Form */}
                <div>
                  <form onSubmit={handleAddSubcategory} className="space-y-6">
                    <div className="space-y-4">
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

                      {/* Add Items */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Items
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddItem()
                              }
                            }}
                            placeholder="e.g., T-shirts, Jeans, Jackets"
                            className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                          <button
                            type="button"
                            onClick={handleAddItem}
                            className="px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50"
                          >
                            Add
                          </button>
                        </div>
                        
                        {subcategoryForm.items.length > 0 && (
                          <div className="mt-4">
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
                                    onClick={() => handleRemoveItem(item)}
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
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setShowSubcategoryModal(false)
                          setSelectedCategory(null)
                          setSubcategoryForm({ title: '', slug: '', items: [] })
                          setNewItem('')
                          setEditingSubcategory(null)
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                      >
                        {editingSubcategory ? 'Update Subcategory' : 'Add Subcategory'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Delete Category
              </h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete the category <strong>"{categoryToDelete.name}"</strong>?
              </p>
              <p className="mt-2 text-sm text-gray-500">
                This action cannot be undone. All subcategories and associated data will be permanently removed.
              </p>
              
              {categoryToDelete.subCategories?.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    ⚠️ This category has {categoryToDelete.subCategories.length} subcategories that will also be deleted.
                  </p>
                </div>
              )}
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false)
                    setCategoryToDelete(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Delete Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}