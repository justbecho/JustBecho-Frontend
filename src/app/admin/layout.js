'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('adminToken')
        const userData = localStorage.getItem('adminUser')
        
        if (!token || !userData) {
          if (pathname !== '/admin/login') {
            router.push('/admin/login')
          }
          setLoading(false)
          return
        }

        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)

        if (pathname === '/admin/login') {
          router.push('/admin/dashboard')
        }
      } catch (error) {
        console.error('Auth error:', error)
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
    
    const handleStorageChange = (e) => {
      if (e.key === 'adminToken' && !e.newValue) {
        router.push('/admin/login')
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return (
      <>
        <Toaster position="top-right" />
        {children}
      </>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Layout Container */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Full height */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        </aside>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header - Fixed at top */}
          <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
            <Header 
              user={user}
              onToggleSidebar={toggleSidebar}
              onLogout={handleLogout}
            />
          </header>
          
          {/* Main Content - Scrollable */}
          <main className="flex-1 overflow-y-auto bg-gray-100">
            <div className="py-6">
              <div className="max-w-full px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
            
            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
              <div className="max-w-full mx-auto py-4 px-4 sm:px-6 md:px-8">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} JustBecho Admin Panel. All rights reserved.
                  </p>
                  <p className="text-sm text-gray-500">
                    Version 1.0.0
                  </p>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  )
}