'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import RoleSelectionModal from '@/components/ui/RoleSelectionModal'

// ✅ Add dynamic export
export const dynamic = 'force-dynamic'

function CompleteProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState('')
  const [convertingToSeller, setConvertingToSeller] = useState(false)
  const [isGoogleUser, setIsGoogleUser] = useState(false)

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        console.log('🔄 Initializing complete profile page...')
        
        // Get parameters from URL
        const tokenFromUrl = searchParams.get('token')
        const nameFromUrl = searchParams.get('name')
        const emailFromUrl = searchParams.get('email')
        
        // Get from localStorage
        const tokenFromStorage = localStorage.getItem('token')
        const userFromStorage = localStorage.getItem('user')
        
        // Determine which token to use
        const currentToken = tokenFromUrl || tokenFromStorage
        const isGoogleSignup = localStorage.getItem('isGoogleSignup') === 'true'
        
        console.log('🔍 Token sources:', {
          fromUrl: !!tokenFromUrl,
          fromStorage: !!tokenFromStorage,
          isGoogleSignup,
          nameFromUrl,
          emailFromUrl
        })
        
        if (!currentToken) {
          console.log('❌ No token found anywhere')
          router.push('/login')
          return
        }

        setToken(currentToken)
        setIsGoogleUser(isGoogleSignup)
        
        // If we have name/email from URL (Google OAuth), use them
        if (nameFromUrl && emailFromUrl) {
          setUserName(nameFromUrl)
          setUserEmail(emailFromUrl)
          
          // Create temp user object for Google users
          const tempUser = {
            id: 'temp-google-id',
            email: emailFromUrl,
            name: nameFromUrl,
            profileCompleted: false,
            role: 'user',
            isGoogleUser: true
          }
          localStorage.setItem('user', JSON.stringify(tempUser))
          
          // Clear URL parameters
          const cleanUrl = window.location.pathname
          window.history.replaceState({}, document.title, cleanUrl)
        }

        // Check if converting to seller
        const isConverting = searchParams.get('convertingToSeller') === 'true' || 
                           localStorage.getItem('changingRoleToSeller') === 'true' ||
                           localStorage.getItem('sellerConversionInProgress') === 'true'
        
        setConvertingToSeller(isConverting)
        
        if (isConverting) {
          console.log('🔄 User is converting to seller process')
        }

        // Try to fetch user data from backend
        try {
          const userResponse = await fetch('https://just-becho-backend.vercel.app/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${currentToken}`,
              'Content-Type': 'application/json'
            }
          })

          if (userResponse.ok) {
            const userData = await userResponse.json()
            
            if (userData.success && userData.user) {
              console.log('✅ User data fetched from backend:', userData.user.email)
              
              setUserEmail(userData.user.email || emailFromUrl || '')
              setUserName(userData.user.name || nameFromUrl || '')
              setUserRole(userData.user.role || 'user')
              
              // Update localStorage with real user data
              localStorage.setItem('user', JSON.stringify(userData.user))
              
              // Check if profile already completed
              if (userData.user.profileCompleted && userData.user.role !== 'seller') {
                console.log('✅ Profile already completed, redirecting to dashboard')
                router.push('/dashboard')
                return
              }
              
              // If profile completed but seller, still show modal for seller details
              if (userData.user.profileCompleted && userData.user.role === 'seller' && !userData.user.sellerVerified) {
                console.log('🏪 Seller needs to complete seller profile verification')
              }
            }
          } else {
            console.log('⚠️ Could not fetch user data from backend, using local data')
            
            // If we can't fetch from backend but have local data
            if (userFromStorage) {
              const parsedUser = JSON.parse(userFromStorage)
              setUserEmail(parsedUser.email || '')
              setUserName(parsedUser.name || '')
              setUserRole(parsedUser.role || 'user')
            }
          }
        } catch (fetchError) {
          console.error('Error fetching user data:', fetchError)
          // Continue with local data
        }

        // Open the role selection modal
        console.log('🎯 Opening role selection modal')
        setIsModalOpen(true)
        
      } catch (error) {
        console.error('❌ Error in profile initialization:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    initializeProfile()
  }, [searchParams, router])

  const handleModalClose = () => {
    console.log('🗑️ Cleaning up conversion flags...')
    
    // Clean up conversion flags
    localStorage.removeItem('changingRoleToSeller')
    localStorage.removeItem('sellerConversionInProgress')
    localStorage.removeItem('isGoogleSignup')
    
    setIsModalOpen(false)
    
    // Determine where to redirect
    if (userRole === 'seller') {
      console.log('🏪 Redirecting seller to dashboard listings')
      router.push('/dashboard?section=listings')
    } else {
      console.log('🏠 Redirecting to home')
      router.push('/')
    }
  }

  const handleRoleSelected = (selectedRole) => {
    console.log(`🎯 User selected role: ${selectedRole}`)
    setUserRole(selectedRole)
    
    // Update user object in localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    currentUser.role = selectedRole
    localStorage.setItem('user', JSON.stringify(currentUser))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-gray-900 mx-auto mb-6"></div>
          <p className="text-gray-700 text-lg font-medium">Setting up your profile...</p>
          <p className="text-gray-500 text-sm mt-2">Just a moment please</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {isModalOpen && (
        <RoleSelectionModal 
          isOpen={isModalOpen}
          onClose={handleModalClose}
          token={token}
          userEmail={userEmail}
          userName={userName}
          userRole={userRole}
          convertingToSeller={convertingToSeller}
          isGoogleUser={isGoogleUser}
          onRoleSelect={handleRoleSelected}
        />
      )}
    </div>
  )
}

// ✅ Main component with Suspense wrapper
export default function CompleteProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-gray-900 mx-auto mb-6"></div>
          <p className="text-gray-700 text-lg font-medium">Loading your profile...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait</p>
        </div>
      </div>
    }>
      <CompleteProfileContent />
    </Suspense>
  )
}