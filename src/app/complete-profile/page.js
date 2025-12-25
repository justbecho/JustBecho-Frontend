'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import RoleSelectionModal from '@/components/ui/RoleSelectionModal'
import { 
  FiLoader, 
  FiUser, 
  FiMail, 
  FiSmartphone,
  FiCheck,
  FiArrowLeft,
  FiHome
} from 'react-icons/fi'

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
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
          router.push('/')
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

        // Open the role selection modal after a small delay for better UX
        setTimeout(() => {
          console.log('🎯 Opening role selection modal')
          setIsModalOpen(true)
        }, 500)
        
      } catch (error) {
        console.error('❌ Error in profile initialization:', error)
        router.push('/')
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

  // Mobile back handler
  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
        {/* Mobile Back Button */}
        {isMobile && (
          <div className="absolute top-6 left-4 z-10">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
        )}
        
        <div className="text-center max-w-sm w-full">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-gray-900 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FiUser className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Setting up your profile</h2>
            <p className="text-gray-600 text-sm">We're getting everything ready for you</p>
            
            {/* Loading Steps */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Loading user data</span>
                <FiCheck className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Initializing preferences</span>
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-gray-600"></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Preparing options</span>
                <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Mobile Header */}
      {isMobile && !isModalOpen && (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <FiUser className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Profile Setup</span>
            </div>
            
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiHome className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>
      )}

      {/* User Info Card (Mobile) */}
      {isMobile && !isModalOpen && (
        <div className="p-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{userName || 'User'}</h3>
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <FiMail className="w-3 h-3" />
                  <span className="truncate">{userEmail}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Account Status</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  Setup Required
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Login Method</span>
                <span className="text-gray-900 font-medium">
                  {isGoogleUser ? 'Google' : 'Email'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Welcome Section */}
      {!isMobile && !isModalOpen && (
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
              <FiUser className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Just Becho, {userName?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Let's set up your profile to get started with your luxury shopping journey
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Type</p>
                  <p className="font-semibold text-gray-900">
                    {convertingToSeller ? 'Upgrading to Seller' : 'New User'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiMail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900 truncate">{userEmail}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiSmartphone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Login Method</p>
                  <p className="font-semibold text-gray-900">
                    {isGoogleUser ? 'Google Account' : 'Email & Password'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/80 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🎯</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Choose Your Role</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Select whether you want to shop as a buyer or sell items as a seller
                </p>
              </div>

              <div className="bg-white/80 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">⚙️</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Complete Profile</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Fill in your details, shipping address, and preferences
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Instructions */}
      {isMobile && !isModalOpen && (
        <div className="px-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Next Steps</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">1</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Choose your role (Buyer or Seller)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">2</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Complete your profile details
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs">3</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Start shopping or selling
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Action Button */}
      {isMobile && !isModalOpen && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
          >
            Continue Setup
          </button>
        </div>
      )}

      {/* Desktop Continue Button */}
      {!isMobile && !isModalOpen && (
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-gray-900 to-black text-white px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all hover:scale-[1.02]"
            >
              Start Profile Setup
            </button>
            <p className="text-gray-500 text-sm mt-3">
              Click above to choose your role and complete your profile
            </p>
          </div>
        </div>
      )}

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
          isMobile={isMobile}
        />
      )}
    </div>
  )
}

// ✅ Main component with Suspense wrapper
export default function CompleteProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="animate-spin rounded-full h-full w-full border-4 border-gray-200 border-t-gray-900"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FiLoader className="w-8 h-8 text-gray-400 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Preparing Your Profile</h2>
            <p className="text-gray-600 text-sm">Please wait while we load your information</p>
            
            {/* Progress bar for mobile */}
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse"
                  style={{ width: '60%' }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Loading user data...</p>
            </div>
          </div>
        </div>
      </div>
    }>
      <CompleteProfileContent />
    </Suspense>
  )
}