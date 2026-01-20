'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  Folder,
  BarChart3,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  DollarSign,
  FileText
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/categories', icon: Folder, label: 'Categories' },
    { path: '/admin/sales', icon: BarChart3, label: 'Sales Reports' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    window.location.href = '/admin/login'
  }

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              {!collapsed && (
                <>
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">JB</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">JustBecho</span>
                  <span className="ml-2 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Admin
                  </span>
                </>
              )}
              {collapsed && (
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-sm">JB</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Collapse Button (Desktop only) */}
          <div className="hidden lg:flex justify-end p-2 border-b border-gray-200">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center ${collapsed ? 'justify-center px-2' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={collapsed ? item.label : ''}
                  onClick={onClose}
                >
                  <item.icon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  {!collapsed && item.label}
                </Link>
              )
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-gray-200 p-4">
            {!collapsed ? (
              <>
                <div className="flex items-center px-2 py-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500 truncate">admin@justbecho.com</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-red-600 hover:bg-red-50"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar