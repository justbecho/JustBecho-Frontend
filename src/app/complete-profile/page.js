'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import RoleSelectionModal from '@/components/ui/RoleSelectionModal'

export default function CompleteProfile() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState('')
  const [convertingToSeller, setConvertingToSeller] = useState(false)

  useEffect(() => {
    const initialize = async () => {
      try {
        const tokenFromUrl = searchParams.get('token')
        const tokenFromStorage = localStorage.getItem('token')
        const currentToken = tokenFromUrl || tokenFromStorage
        
        if (!currentToken) {
          console.log('❌ No token found')
          router.push('/login')
          return
        }

        setToken(currentToken)

        // Check if converting to seller
        const isConverting = searchParams.get('convertingToSeller') === 'true' || 
                           localStorage.getItem('changingRoleToSeller') === 'true' ||
                           localStorage.getItem('sellerConversionInProgress') === 'true';
        
        setConvertingToSeller(isConverting)

        // Get user data
        const userResponse = await fetch('https://just-becho-backend.vercel.app/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          if (userData.success && userData.user) {
            setUserEmail(userData.user.email)
            setUserRole(userData.user.role)
            localStorage.setItem('user', JSON.stringify(userData.user))
            
            // If converting to seller, automatically set role to seller
            if (isConverting && userData.user.role === 'seller') {
              // Auto-select seller role in modal
              console.log('🔄 User is converting to seller')
            }
            
            // Check if profile already completed
            if (userData.user.profileCompleted && userData.user.role !== 'seller') {
              // If profile completed and not seller, redirect to dashboard
              router.push('/dashboard')
              return
            }
            
            // If profile completed but seller, still show modal for seller details
            if (userData.user.profileCompleted && userData.user.role === 'seller' && !userData.user.sellerVerified) {
              // Seller needs to complete seller profile (bank details, etc.)
              console.log('🏪 Seller needs to complete seller profile')
            }
          }
        }

        setIsModalOpen(true)
      } catch (error) {
        console.error('Error:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [searchParams, router])

  const handleModalClose = () => {
    // Clear conversion flags
    localStorage.removeItem('changingRoleToSeller')
    localStorage.removeItem('sellerConversionInProgress')
    
    setIsModalOpen(false)
    
    // Redirect based on user role
    if (userRole === 'seller') {
      router.push('/dashboard?section=listings')
    } else {
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isModalOpen && (
        <RoleSelectionModal 
          isOpen={isModalOpen}
          onClose={handleModalClose}
          token={token}
          userEmail={userEmail}
          userRole={userRole}
          convertingToSeller={convertingToSeller}
        />
      )}
    </div>
  )
}