'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

  useEffect(() => {
    if (isOpen) {
      const checkGoogleAuth = () => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        
        if (token) {
          localStorage.setItem('token', token)
          localStorage.setItem('isGoogleSignup', 'true')
          localStorage.removeItem('changingRoleToSeller') // Clear any previous role change flags
          fetchUserData(token)
          window.history.replaceState({}, document.title, window.location.pathname)
          onClose()
        }
      }

      checkGoogleAuth()
    }
  }, [isOpen, onClose])

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
      const endpoint = isLogin ? 'https://just-becho-backend.vercel.app/api/auth/login' : 'https://just-becho-backend.vercel.app/api/auth/signup'
      const payload = { email: formData.email, password: formData.password }
      
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
      
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.removeItem('changingRoleToSeller') // Clear role change flag
        window.dispatchEvent(new Event('authChange'))
      }

      onClose()
      
      setTimeout(async () => {
        const token = data.token;
        
        try {
          const statusResponse = await fetch('https://just-becho-backend.vercel.app/api/auth/profile-status', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const statusData = await statusResponse.json();
          
          if (statusData.success) {
            // ✅ Check if profile is completed
            if (!statusData.profileCompleted) {
              // Profile not completed, redirect to complete-profile
              router.push('/complete-profile');
            } else {
              // Profile completed, check if user is seller and verified
              if (statusData.role === 'seller') {
                if (statusData.sellerVerified) {
                  // Seller verified, go to home
                  router.push('/');
                } else {
                  // Seller not verified, go to dashboard with seller pending status
                  router.push('/dashboard?section=listings');
                }
              } else {
                // Buyer or influencer, go to home
                router.push('/');
              }
            }
          } else {
            throw new Error('Failed to check profile status');
          }
        } catch (error) {
          console.error('Profile status check error:', error);
          router.push('/');
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

  const handleGoogleAuth = () => {
    try {
      localStorage.setItem('isGoogleSignup', 'true');
      localStorage.removeItem('changingRoleToSeller'); // Clear role change flag
      window.location.href = 'https://just-becho-backend.vercel.app/api/auth/google'
    } catch (error) {
      console.error('Google auth error:', error)
      setErrors({ submit: 'Google authentication failed' })
    }
  }

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('https://just-becho-backend.vercel.app/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.removeItem('changingRoleToSeller'); // Clear role change flag
        window.dispatchEvent(new Event('authChange'));
        
        // Check if user is from Google signup
        const isGoogleSignup = localStorage.getItem('isGoogleSignup') === 'true';
        
        if (isGoogleSignup) {
          // Google signup users को हमेशा complete-profile पर भेजें
          localStorage.removeItem('isGoogleSignup');
          router.push('/complete-profile');
          return;
        }
        
        // Regular users के लिए profile status check
        const statusResponse = await fetch('https://just-becho-backend.vercel.app/api/auth/profile-status', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const statusData = await statusResponse.json();
        
        if (statusData.success) {
          if (!statusData.profileCompleted) {
            router.push('/complete-profile');
          } else {
            // Profile completed, check seller status
            if (statusData.role === 'seller') {
              if (statusData.sellerVerified) {
                router.push('/');
              } else {
                router.push('/dashboard?section=listings');
              }
            } else {
              router.push('/');
            }
          }
        }
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data after Google auth:', error);
      router.push('/');
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
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
                    errors.email ? 'border-red-500 bg-red-50' : 
                    showSignUpPrompt ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className={`text-sm flex items-center gap-1 ${
                  showSignUpPrompt ? 'text-orange-600' : 'text-red-600'
                }`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
                    errors.password ? 'border-red-500 bg-red-50' : 
                    showSignUpPrompt ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                />
              </div>
              {errors.password && (
                <p className={`text-sm flex items-center gap-1 ${
                  showSignUpPrompt ? 'text-orange-600' : 'text-red-600'
                }`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-gray-900 to-black text-white py-4 rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>

            {/* Error Messages */}
            {errors.submit && (
              <div className={`rounded-xl p-4 ${
                showSignUpPrompt ? 'bg-orange-50 border border-orange-200' : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm text-center flex items-center justify-center gap-2 ${
                  showSignUpPrompt ? 'text-orange-700' : 'text-red-700'
                }`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.submit}
                </p>
                
                {/* Sign Up Prompt Button */}
                {showSignUpPrompt && (
                  <div className="mt-3 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(false)
                        resetForm()
                        setErrors({})
                      }}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                    >
                      Create Account Now
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 text-gray-700 py-3.5 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="group-hover:scale-105 transition-transform">{isLogin ? 'Sign in with Google' : 'Sign up with Google'}</span>
          </button>
        </div>

        {/* Toggle */}
        <div className="px-8 py-6 bg-gray-50 rounded-b-3xl border-t border-gray-100">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={handleToggleMode} className="text-gray-900 font-semibold hover:text-gray-700 transition-colors duration-200 underline underline-offset-4">
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}