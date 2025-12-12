'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RoleSelectionModal from './RoleSelectionModal' // Make sure this exists

export default function AuthModal({ isOpen, onClose }) {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  // ✅ NEW: Role selection modal state
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [googleUserData, setGoogleUserData] = useState(null)

  // ✅ UPDATED: Handle Google OAuth redirect
  useEffect(() => {
    if (isOpen) {
      const checkGoogleAuth = () => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const name = urlParams.get('name')
        const email = urlParams.get('email')
        const source = urlParams.get('source')
        const newUser = urlParams.get('newUser') === 'true'
        
        if (token && source === 'google') {
          console.log('✅ Google OAuth completed')
          console.log('📱 Token:', token.substring(0, 30) + '...')
          console.log('👤 Name:', name)
          console.log('📧 Email:', email)
          console.log('🆕 New User:', newUser)
          
          // Save token
          localStorage.setItem('token', token)
          localStorage.setItem('isGoogleSignup', 'true')
          
          // Decode token to get user info
          try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            console.log('🔍 Token payload:', payload)
            
            const tempUser = {
              id: payload.userId || 'temp-google-id',
              email: email || payload.email,
              name: name || payload.name || email?.split('@')[0],
              profileCompleted: payload.profileCompleted || false,
              role: payload.role || 'user',
              isGoogleUser: true,
              isNewUser: payload.isNewUser || newUser
            }
            
            localStorage.setItem('user', JSON.stringify(tempUser))
            window.dispatchEvent(new Event('authChange'))
            
            // ✅ CRITICAL: Check if new user
            if (tempUser.isNewUser) {
              console.log('👶 New Google user detected, showing role selection')
              setGoogleUserData({
                token: token,
                email: tempUser.email,
                name: tempUser.name,
                userRole: tempUser.role
              })
              setShowRoleModal(true)
              // Don't close auth modal yet
            } else {
              // Existing user
              if (tempUser.profileCompleted) {
                console.log('🚀 Existing user with completed profile, redirecting home')
                onClose()
                router.push('/')
              } else {
                console.log('🔄 Existing user needs profile completion')
                onClose()
                router.push('/complete-profile')
              }
            }
            
          } catch (error) {
            console.warn('Could not parse token:', error)
            // Fallback
            onClose()
            router.push('/complete-profile')
          }
          
          // Clear URL parameters
          const cleanUrl = window.location.pathname
          window.history.replaceState({}, document.title, cleanUrl)
          
          // Only close modal if not showing role selection
          if (!newUser) {
            onClose()
          }
        }
      }

      checkGoogleAuth()
    }
  }, [isOpen, onClose, router])

  // ✅ Role selection modal close handler
  const handleRoleModalClose = () => {
    setShowRoleModal(false)
    setGoogleUserData(null)
    onClose() // Close auth modal
  }

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (!isLogin) {
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    
    try {
      const endpoint = isLogin 
        ? 'https://just-becho-backend.vercel.app/api/auth/login' 
        : 'https://just-becho-backend.vercel.app/api/auth/signup'
      
      const payload = { 
        email: formData.email, 
        password: formData.password 
      }
      
      console.log(`📤 Sending ${isLogin ? 'login' : 'signup'} request to:`, endpoint)
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      })

      const responseText = await response.text()
      
      let data;
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
          throw new Error('Server error: Please check backend server')
        } else {
          throw new Error('Invalid response from server')
        }
      }

      if (!response.ok) {
        if (response.status === 400 && data.message?.includes('Invalid email or password')) {
          throw new Error('Account not found. Please sign up first.')
        }
        throw new Error(data.message || `Server error: ${response.status}`)
      }
      
      console.log('✅ Auth successful:', data.message)
      
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.removeItem('changingRoleToSeller')
        window.dispatchEvent(new Event('authChange'))
      }

      onClose()
      
      // Handle redirection based on profile status
      setTimeout(async () => {
        const token = data.token || localStorage.getItem('token');
        
        if (!token) {
          console.error('❌ No token found after auth')
          router.push('/')
          return
        }
        
        try {
          const statusResponse = await fetch('https://just-becho-backend.vercel.app/api/auth/profile-status', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const statusData = await statusResponse.json();
          
          if (statusData.success) {
            if (!statusData.profileCompleted) {
              console.log('🔄 Profile not completed, redirecting...')
              router.push('/complete-profile');
            } else {
              if (statusData.role === 'seller') {
                if (statusData.sellerVerified) {
                  router.push('/dashboard');
                } else {
                  router.push('/dashboard?section=listings');
                }
              } else {
                router.push('/dashboard');
              }
            }
          } else {
            console.error('❌ Failed to check profile status')
            router.push('/complete-profile');
          }
        } catch (error) {
          console.error('Profile status check error:', error);
          router.push('/complete-profile');
        }
      }, 100);
      
    } catch (error) {
      console.error('Auth error:', error)
      
      let errorMessage = error.message || 'Something went wrong. Please try again.'
      
      if (error.message.includes('Please sign up first')) {
        setErrors({ 
          submit: errorMessage,
          email: 'Account not found',
          password: 'Please sign up first'
        })
      } else if (error.message.includes('Server error')) {
        setErrors({ submit: 'Server error. Please try again later.' })
      } else {
        setErrors({ submit: errorMessage })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ UPDATED: Google Auth function
  const handleGoogleAuth = () => {
    try {
      console.log('🚀 Initiating Google OAuth...')
      
      // Get current page URL for redirect back
      const currentUrl = window.location.origin + window.location.pathname
      console.log('📍 Current URL for redirect:', currentUrl)
      
      // Set flags
      localStorage.setItem('isGoogleSignup', 'true')
      localStorage.removeItem('changingRoleToSeller')
      
      // ✅ Add frontend URL as parameter so backend knows where to redirect back
      const encodedUrl = encodeURIComponent(currentUrl)
      const googleAuthUrl = `https://just-becho-backend.vercel.app/api/auth/google?frontend=${encodedUrl}`
      
      console.log('🌐 Full Google Auth URL:', googleAuthUrl)
      console.log('📤 Redirecting to backend...')
      
      window.location.href = googleAuthUrl
      
    } catch (error) {
      console.error('❌ Google auth error:', error)
      setErrors({ submit: 'Google authentication failed. Please try again.' })
    }
  }

  const resetForm = () => {
    setFormData({ email: '', password: '', confirmPassword: '' })
    setErrors({})
  }

  const handleToggleMode = () => {
    setIsLogin(!isLogin)
    resetForm()
  }

  const showSignUpPrompt = errors.submit?.includes('Please sign up first')

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-black rounded-t-3xl p-8 text-center">
            <div className="flex justify-between items-center mb-2">
              <div className="w-8"></div>
              <h2 className="text-2xl font-light tracking-widest uppercase text-white">
                {isLogin ? 'WELCOME BACK' : 'JOIN US'}
              </h2>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-white/70 text-sm font-light">
              {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="you@example.com"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                    disabled={isLoading}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password (Sign Up Only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ${
                        errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className={`p-4 rounded-xl ${showSignUpPrompt ? 'bg-blue-50 border border-blue-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`text-sm ${showSignUpPrompt ? 'text-blue-700' : 'text-red-600'}`}>
                    {errors.submit}
                  </p>
                  {showSignUpPrompt && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(false)
                        resetForm()
                        setErrors({})
                      }}
                      className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Click here to sign up →
                    </button>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-3 px-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Toggle Mode */}
              <div className="text-center pt-4">
                <p className="text-gray-600 text-sm">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={handleToggleMode}
                    className="text-gray-900 font-medium hover:underline transition-colors"
                    disabled={isLoading}
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ✅ Role Selection Modal */}
      {showRoleModal && googleUserData && (
        <RoleSelectionModal
          isOpen={showRoleModal}
          onClose={handleRoleModalClose}
          token={googleUserData.token}
          userEmail={googleUserData.email}
          userRole={googleUserData.userRole}
        />
      )}
    </>
  )
}