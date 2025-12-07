'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RoleSelectionModal({ isOpen, onClose, token, userEmail, userRole }) {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState('')
  const [instaId, setInstaId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    
    // Seller specific
    accountNumber: '',
    ifscCode: '',
    accountName: '',
  })

  const [step, setStep] = useState(1)

  useEffect(() => {
    if (userEmail) {
      setFormData(prev => ({
        ...prev,
        email: userEmail
      }))
    }
    
    // 🔴 AUTO-SELECT SELLER IF USER IS CONVERTING FROM BUYER
    if (userRole === 'seller') {
      setSelectedRole('seller');
      console.log('🔄 Auto-selected seller role for converted user');
    }
  }, [userEmail, userRole])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setErrors({})
  }

  // ✅ Handle checkbox change
  const handleCheckboxChange = (e) => {
    setAcceptedTerms(e.target.checked)
    // Clear terms error when user checks
    if (errors.terms) {
      setErrors(prev => ({ ...prev, terms: '' }))
    }
  }

  const validateStep1 = () => {
    const newErrors = {}
    
    if (!selectedRole) {
      newErrors.role = 'Please select a role'
    }

    if (selectedRole === 'influencer' && !instaId.trim()) {
      newErrors.instaId = 'Instagram ID is required for influencers'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    
    // ✅ Validate ALL fields are filled
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Valid 10-digit phone number required'
    
    if (!formData.street.trim()) newErrors.street = 'Street address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required'
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Valid 6-digit pincode required'
    
    // ✅ Seller specific validation (MUST FILL ALL BANK DETAILS)
    if (selectedRole === 'seller') {
      if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required'
      else if (!/^\d{9,18}$/.test(formData.accountNumber)) newErrors.accountNumber = 'Valid account number required (9-18 digits)'
      
      if (!formData.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required'
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) newErrors.ifscCode = 'Valid IFSC code required (e.g., SBIN0001234)'
      
      if (!formData.accountName.trim()) newErrors.accountName = 'Account holder name is required'
    }
    
    // ✅ TERMS CHECKBOX VALIDATION (ONLY for buyer and seller)
    if (selectedRole !== 'influencer' && !acceptedTerms) {
      newErrors.terms = 'You must accept the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
    setAcceptedTerms(false)
  }

  // ✅ Check if ALL required fields are filled (for button disabling)
  const isFormComplete = () => {
    // Check basic fields
    const basicFieldsFilled = 
      formData.name.trim() && 
      formData.phone.trim() && 
      /^\d{10}$/.test(formData.phone) &&
      formData.street.trim() && 
      formData.city.trim() && 
      formData.state.trim() && 
      formData.pincode.trim() && 
      /^\d{6}$/.test(formData.pincode);
    
    // Check seller specific fields
    let sellerFieldsFilled = true;
    if (selectedRole === 'seller') {
      sellerFieldsFilled = 
        formData.accountNumber.trim() && 
        /^\d{9,18}$/.test(formData.accountNumber) &&
        formData.ifscCode.trim() && 
        /^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode) &&
        formData.accountName.trim();
    }
    
    // Check terms
    const termsAccepted = selectedRole === 'influencer' || acceptedTerms;
    
    return basicFieldsFilled && sellerFieldsFilled && termsAccepted;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      // Show alert if validation fails
      alert('Please fill all required fields and accept terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        role: selectedRole,
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        email: userEmail,
        acceptedTerms: selectedRole !== 'influencer',
        termsAcceptedAt: selectedRole !== 'influencer' ? new Date().toISOString() : null
      }

      // Add role-specific fields
      if (selectedRole === 'influencer') {
        payload.instaId = instaId
      }

      if (selectedRole === 'seller') {
        payload.bankDetails = {
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          accountName: formData.accountName
        }
      }

      console.log('📤 Submitting to backend:', payload)

      const response = await fetch('https://just-becho-backend.vercel.app/api/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          console.log('❌ Unauthorized, redirecting to login')
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          alert('Session expired. Please login again.');
          router.push('/login');
          return;
        }
        throw new Error(data.message || 'Failed to complete profile')
      }

      // ✅ User data save karo with token
      if (data.user) {
        const userData = {
          ...data.user,
          email: userEmail,
          role: selectedRole,
          status: selectedRole === 'seller' ? 'pending' : 'active'
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Token save karo
        const authToken = data.token || token;
        if (authToken) {
          localStorage.setItem('token', authToken);
        }
        
        // Seller ke liye verification ID save
        if (selectedRole === 'seller' && data.user.verificationId) {
          localStorage.setItem('verificationId', data.user.verificationId);
        }
      }

      // Success message
      if (selectedRole === 'seller') {
        const verificationMsg = data.user.verificationId 
          ? `📱 Verification ID: ${data.user.verificationId}`
          : '📱 Verification ID will be sent';
          
        alert(`✅ Seller profile submitted!\n\n${verificationMsg}\n\nYour request has been sent to admin for approval. You will be notified once approved.`);
      } else {
        alert('✅ Profile completed successfully!');
      }

      // Modal close karo
      onClose();

      // ✅ Different redirect based on role
      setTimeout(() => {
        if (selectedRole === 'seller') {
          router.push('/dashboard?section=listings');
        } else if (selectedRole === 'buyer') {
          router.push('/');
        } else {
          router.push('/');
        }
        
        // Force reload to update user state
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }, 1000);

    } catch (error) {
      console.error('❌ Error:', error)
      setErrors({ submit: error.message })
      alert(`❌ ${error.message}`)
      
      if (error.message.includes('unauthorized') || error.message.includes('token') || error.message.includes('401')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Get terms text based on role
  const getTermsText = () => {
    switch(selectedRole) {
      case 'buyer':
        return 'I accept the Buyer Terms and Conditions';
      case 'seller':
        return 'I accept the Seller Terms and Conditions';
      default:
        return 'I accept the Terms and Conditions';
    }
  }

  // ✅ Get terms description based on role
  const getTermsDescription = () => {
    switch(selectedRole) {
      case 'buyer':
        return 'By accepting, you agree to our buyer policies, return/refund procedures, and privacy terms.';
      case 'seller':
        return 'By accepting, you agree to our seller policies, commission rates, listing guidelines, and payout terms.';
      default:
        return 'By accepting, you agree to our terms and conditions.';
    }
  }

  // ✅ Show relevant terms links based on role
  const renderTermsLinks = () => {
    switch(selectedRole) {
      case 'buyer':
        return (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-600">Read our policies:</p>
            <div className="flex flex-wrap gap-3">
              <a 
                href="/terms/buyer-terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
              >
                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Buyer Terms
              </a>
              <a 
                href="/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
              >
                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Privacy Policy
              </a>
            </div>
          </div>
        );
      case 'seller':
        return (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-600">Read our policies:</p>
            <div className="flex flex-wrap gap-3">
              <a 
                href="/terms/seller-terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
              >
                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Seller Terms
              </a>
              <a 
                href="/terms/seller-terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
              >
                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Payout Policy
              </a>
              <a 
                href="/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
              >
                <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Privacy Policy
              </a>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  // ✅ Render terms checkbox component (ONLY for buyer and seller)
  const renderTermsCheckbox = () => {
    // Influencer ke liye checkbox show nahi karna
    if (selectedRole === 'influencer') return null;
    
    return (
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptedTerms}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-gray-900 bg-white border-gray-300 rounded focus:ring-gray-900 focus:ring-2"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="acceptTerms" className="text-sm font-medium text-gray-900 cursor-pointer">
                {getTermsText()}
              </label>
              <p className="text-xs text-gray-600 mt-2">
                {getTermsDescription()}
              </p>
              {errors.terms && (
                <p className="text-red-600 text-xs mt-2">{errors.terms}</p>
              )}
            </div>
          </div>
          
          {/* Role-specific terms links with better design */}
          <div className="mt-4">
            {renderTermsLinks()}
          </div>
        </div>
      </div>
    );
  }

  // ✅ Get role-specific title for step 2
  const getStep2Title = () => {
    switch(selectedRole) {
      case 'buyer':
        return 'Complete Your Buyer Profile';
      case 'seller':
        return 'Complete Your Seller Profile';
      case 'influencer':
        return 'Complete Your Influencer Profile';
      default:
        return 'Complete Your Profile';
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {['buyer', 'seller', 'influencer'].map((role) => (
          <div 
            key={role}
            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
              selectedRole === role ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
            }`}
            onClick={() => handleRoleSelect(role)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedRole === role ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
              }`}>
                {selectedRole === role && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 capitalize">{role}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {role === 'buyer' && 'I want to browse and purchase products'}
                  {role === 'seller' && 'I want to sell my products - Admin approval required '}
                  {role === 'influencer' && 'I want to collaborate and promote products'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedRole === 'influencer' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instagram ID *
          </label>
          <input
            type="text"
            value={instaId}
            onChange={(e) => setInstaId(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-900 ${errors.instaId ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="your_instagram_username"
          />
          <p className="text-sm text-gray-500 mt-1">
            Drop your Instagram ID and we'll contact you
          </p>
          {errors.instaId && <p className="text-red-500 text-xs mt-1">{errors.instaId}</p>}
        </div>
      )}

      {errors.role && (
        <p className="text-red-600 text-sm">{errors.role}</p>
      )}

      <button 
        type="button"
        onClick={handleNextStep}
        className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
      >
        Continue to Details
      </button>
    </div>
  )

  const renderStep2 = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {getStep2Title()}
      </h3>

      {/* Telegram Approval Info for Seller */}
      {selectedRole === 'seller' && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-1.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Approval Required</h4>
              <p className="text-blue-800 text-sm">
                After submitting, your verification will be sent to admin for approval.
                You'll get a @justbecho username once approved. You'll receive real-time notifications.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Basic Information for all roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="10-digit mobile number"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address *
          </label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="House no., Building, Street"
          />
          {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="City"
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="State"
            />
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode *
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="6-digit pincode"
            />
            {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
          </div>
        </div>
      </div>

      {/* Seller Specific - Bank Details */}
      {selectedRole === 'seller' && (
        <div className="border-t pt-6 mt-6">
          <h4 className="font-medium text-gray-900 mb-4 text-lg">Bank Details (For Payouts) *</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Holder Name *
              </label>
              <input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${errors.accountName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Name as per bank account"
              />
              {errors.accountName && <p className="text-red-500 text-xs mt-1">{errors.accountName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number *
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="9-18 digit account number"
              />
              {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IFSC Code *
              </label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${errors.ifscCode ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., SBIN0001234"
              />
              {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>}
            </div>
          </div>
        </div>
      )}

      {/* ✅ TERMS CHECKBOX (ONLY for buyer and seller, NOT for influencer) */}
      {renderTermsCheckbox()}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={handlePrevStep}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
        >
          Back
        </button>
        <button 
          type="submit" 
          disabled={!isFormComplete() || isLoading}
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            isFormComplete() && !isLoading
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {selectedRole === 'seller' ? 'Sending to Admin...' : 'Submitting...'}
            </span>
          ) : (
            selectedRole === 'seller' ? 'Submit for Approval' : 'Complete Profile'
          )}
        </button>
      </div>

      {errors.submit && (
        <p className="text-red-600 text-center text-sm">{errors.submit}</p>
      )}
    </form>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-t-3xl p-8 text-center sticky top-0 z-10">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-light tracking-widest uppercase text-white">
              COMPLETE PROFILE
            </h2>
            <div className="w-6"></div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className={`w-8 h-1 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`}></div>
            <div className={`w-8 h-1 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`}></div>
          </div>
        </div>

        <div className="p-8">
          {step === 1 ? renderStep1() : renderStep2()}
        </div>
      </div>
    </div>
  )
}