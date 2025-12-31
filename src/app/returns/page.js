// app/refund-return-policy/page.js - MOBILE RESPONSIVE VERSION
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { FiChevronRight, FiChevronDown, FiChevronUp, FiHome, FiMail, FiPhone, FiClock, FiFileText, FiShield, FiPackage } from 'react-icons/fi'

export default function RefundReturnPolicyPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Mobile Header Component
  const MobileHeader = () => (
    <div className="fixed top-0 left-0 right-0 z-40 bg-gray-900 text-white">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {showMobileNav ? (
              <FiChevronUp className="w-6 h-6" />
            ) : (
              <FiChevronDown className="w-6 h-6" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <FiShield className="w-5 h-5" />
            <span className="text-sm font-medium">Refund Policy</span>
          </div>
        </div>
        
        <button
          onClick={() => window.location.href = '/'}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <FiHome className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {showMobileNav && (
        <div className="px-4 pb-4">
          <div className="bg-white rounded-lg shadow-lg max-h-[70vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <p className="text-gray-600 text-sm">Jump to Section:</p>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { id: 'section1', title: '1. Refund Eligibility Criteria' },
                { id: 'section2', title: '2. Becho Protect' },
                { id: 'section3', title: '3. All Sales Are Final' },
                { id: 'section4', title: '4. Required Documentation' },
                { id: 'section5', title: '5. Unboxing Video Requirements' },
                { id: 'section6', title: '6. Refund Process Timeline' },
                { id: 'section7', title: '7. Non-Qualifying Situations' },
                { id: 'section8', title: '8. Cancellation Policy' },
                { id: 'section9', title: '9. Contact for Refund Queries' }
              ].map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setShowMobileNav(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {section.id.replace('section', '')}
                    </div>
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      <Header />
      
      {/* Main content with proper header padding */}
      <main className="min-h-screen bg-white pt-16 md:pt-[140px]">
        {/* Mobile Header */}
        {isMobile && <MobileHeader />}

        {/* Hero Section - Simplified Black/White */}
        <section className={`${isMobile ? 'pt-16' : ''} bg-gradient-to-r from-gray-900 to-black text-white`}>
          <div className={`${isMobile ? 'px-4 py-8' : 'px-6 lg:px-8 py-16'}`}>
            <div className={`${isMobile ? '' : 'max-w-7xl'} mx-auto text-center`}>
              <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl md:text-5xl'} font-light tracking-widest uppercase mb-3`}>
                REFUND & RETURN POLICY
              </h1>
              <div className="bg-gray-800 inline-block px-4 py-2 rounded-lg mt-4">
                <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-gray-200`}>Last Updated: {currentDate}</p>
              </div>
              <p className={`${isMobile ? 'text-sm mt-3' : 'text-lg mt-6'} text-gray-300 max-w-3xl mx-auto`}>
                Clear guidelines for refunds and returns to ensure a fair and transparent experience for all users.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className={`${isMobile ? 'py-6' : 'py-16'}`}>
          <div className={`${isMobile ? 'px-4' : 'px-6 lg:px-8'}`}>
            <div className={`${isMobile ? '' : 'max-w-7xl'} mx-auto`}>
              {/* Important Notice Box - Simplified */}
              <div className={`${isMobile ? 'mb-6 p-4' : 'mb-12 p-6'} bg-gray-50 border-l-4 border-gray-800 rounded-r-lg`}>
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0">
                    <div className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} bg-gray-100 rounded-full flex items-center justify-center`}>
                      <FiShield className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} text-gray-800`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-base md:text-lg mb-1 md:mb-2">
                      IMPORTANT POLICY NOTICE
                    </p>
                    <p className="text-gray-700 text-sm md:text-base">
                      This Refund & Return Policy governs all transactions on <span className="font-semibold">Just Becho</span> platform. We strongly encourage buyers to review product details carefully before purchase. Except where stated, all sales are final.
                    </p>
                    <div className="mt-3 md:mt-4 p-2 md:p-3 bg-gray-100 border border-gray-200 rounded">
                      <p className="text-gray-900 font-semibold text-sm md:text-base">
                        🔒 Refunds are processed under specific conditions outlined in this policy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
                {/* Left Sidebar - Navigation */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 md:top-32 bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 text-sm md:text-base mb-3 md:mb-4">Quick Navigation</h3>
                    <div className="space-y-1 md:space-y-2">
                      {[
                        { id: 'section1', title: '1. Refund Eligibility Criteria' },
                        { id: 'section2', title: '2. Becho Protect' },
                        { id: 'section3', title: '3. All Sales Are Final' },
                        { id: 'section4', title: '4. Required Documentation' },
                        { id: 'section5', title: '5. Unboxing Video Requirements' },
                        { id: 'section6', title: '6. Refund Process Timeline' },
                        { id: 'section7', title: '7. Non-Qualifying Situations' },
                        { id: 'section8', title: '8. Cancellation Policy' },
                        { id: 'section9', title: '9. Contact for Refund Queries' }
                      ].map((section) => (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          className="block text-xs md:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-1.5 md:p-2 rounded transition-colors"
                        >
                          {section.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                  <div className="space-y-8 md:space-y-12">
                    {/* Section 1: Refund Eligibility Criteria */}
                    <div id="section1" className="scroll-mt-24 md:scroll-mt-32">
                      <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm md:text-lg font-bold">
                          1
                        </div>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Refund Eligibility Criteria</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3 md:mb-4">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-800 font-bold text-sm md:text-base">📋</span>
                          </div>
                          <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-800">Qualifying Conditions</h3>
                        </div>
                        
                        <div className="space-y-4 md:space-y-6">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                            <div className="text-center p-2 md:p-4 bg-gray-50 rounded-lg">
                              <div className="text-xl md:text-2xl mb-1 md:mb-2">🔍</div>
                              <p className="font-bold text-gray-800 text-xs md:text-sm">Authentication Failure</p>
                              <p className="text-gray-700 text-xs md:text-sm mt-0.5 md:mt-1">Product proven counterfeit</p>
                            </div>
                            <div className="text-center p-2 md:p-4 bg-gray-50 rounded-lg">
                              <div className="text-xl md:text-2xl mb-1 md:mb-2">📷</div>
                              <p className="font-bold text-gray-800 text-xs md:text-sm">Major Misrepresentation</p>
                              <p className="text-gray-700 text-xs md:text-sm mt-0.5 md:mt-1">Significantly different condition</p>
                            </div>
                            <div className="text-center p-2 md:p-4 bg-gray-50 rounded-lg col-span-2 md:col-span-1">
                              <div className="text-xl md:text-2xl mb-1 md:mb-2">📄</div>
                              <p className="font-bold text-gray-800 text-xs md:text-sm">Description Mismatch</p>
                              <p className="text-gray-700 text-xs md:text-sm mt-0.5 md:mt-1">Doesn't match listing details</p>
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4">
                            <h4 className="font-bold text-gray-800 text-sm md:text-base mb-2 md:mb-3">Evidence Requirements:</h4>
                            <div className="space-y-2 md:space-y-3">
                              <div className="flex items-start gap-2 md:gap-3">
                                <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1">
                                  <span className="text-gray-700 text-xs md:text-sm">1</span>
                                </div>
                                <div>
                                  <p className="font-bold text-gray-800 text-sm md:text-base">Clear Documentation</p>
                                  <p className="text-gray-700 text-xs md:text-sm">High-quality photos/videos showing issues</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2 md:gap-3">
                                <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1">
                                  <span className="text-gray-700 text-xs md:text-sm">2</span>
                                </div>
                                <div>
                                  <p className="font-bold text-gray-800 text-sm md:text-base">Comparative Evidence</p>
                                  <p className="text-gray-700 text-xs md:text-sm">Comparison with original listing</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2 md:gap-3">
                                <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1">
                                  <span className="text-gray-700 text-xs md:text-sm">3</span>
                                </div>
                                <div>
                                  <p className="font-bold text-gray-800 text-sm md:text-base">Timely Submission</p>
                                  <p className="text-gray-700 text-xs md:text-sm">Within 24 hours of delivery</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 md:p-4">
                            <div className="flex items-start gap-2 md:gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-gray-700 text-sm md:text-base">⚖️</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-800 font-semibold text-sm md:text-base mb-1 md:mb-2">Final Decision Authority:</p>
                                <p className="text-gray-700 text-xs md:text-sm">
                                  JustBecho reserves the exclusive right to review all evidence and make the final determination regarding refund eligibility. Our decision is final and binding.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Becho Protect */}
                    <div id="section2" className="scroll-mt-24 md:scroll-mt-32">
                      <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm md:text-lg font-bold">
                          2
                        </div>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Becho Protect</h2>
                      </div>
                      
                      <div className="space-y-4 md:space-y-8">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
                          <div className="flex items-center gap-3 mb-3 md:mb-4">
                            <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-gray-800 font-bold text-sm md:text-base">🛡️</span>
                            </div>
                            <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-800">Becho Protect Coverage</h3>
                          </div>
                          <div className="mb-3 md:mb-4">
                            <p className="text-gray-700 text-sm md:text-base mb-3 md:mb-4">
                              Refunds will be considered <span className="font-bold text-gray-900">ONLY</span> in the following exceptional cases, provided the order was placed under Becho Protect:
                            </p>
                            
                            <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                              <p className="font-bold text-gray-800 text-sm md:text-base mb-2 md:mb-3">Applicable ONLY under Becho Protect:</p>
                              <div className="space-y-2 md:space-y-3">
                                <div className="flex items-start gap-2 md:gap-3">
                                  <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1">
                                    <span className="text-gray-700 text-xs md:text-sm">✓</span>
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-800 text-sm md:text-base">Item Fails Authentication</p>
                                    <p className="text-gray-700 text-xs md:text-sm">Product is proven to be counterfeit or fake</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2 md:gap-3">
                                  <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1">
                                    <span className="text-gray-700 text-xs md:text-sm">✓</span>
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-800 text-sm md:text-base">Significant Misrepresentation</p>
                                    <p className="text-gray-700 text-xs md:text-sm">Major difference from advertised condition</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2 md:gap-3">
                                  <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 md:mt-1">
                                    <span className="text-gray-700 text-xs md:text-sm">✓</span>
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-800 text-sm md:text-base">Description Mismatch</p>
                                    <p className="text-gray-700 text-xs md:text-sm">Item doesn't match seller's description</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2 md:mb-3">
                                <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-gray-700 text-xs md:text-sm">✅</span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm md:text-base">With Becho Protect</h4>
                              </div>
                              <ul className="list-disc pl-5 md:pl-6 text-gray-700 text-xs md:text-sm space-y-1 md:space-y-2">
                                <li>Refund eligibility for specific cases</li>
                                <li>Authenticity guarantee</li>
                                <li>Condition verification</li>
                                <li>Platform protection</li>
                              </ul>
                            </div>
                            
                            <div className="bg-gray-100 p-3 md:p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2 md:mb-3">
                                <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                  <span className="text-gray-700 text-xs md:text-sm">❌</span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm md:text-base">Without Becho Protect</h4>
                              </div>
                              <ul className="list-disc pl-5 md:pl-6 text-gray-700 text-xs md:text-sm space-y-1 md:space-y-2">
                                <li>No refunds under any circumstances</li>
                                <li>No authenticity verification</li>
                                <li>No condition guarantees</li>
                                <li>Buyer assumes all risks</li>
                              </ul>
                            </div>
                          </div>

                          <div className="mt-4 md:mt-6 bg-gray-100 border border-gray-300 rounded-lg p-3 md:p-4">
                            <div className="flex items-start gap-2 md:gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-gray-700 text-sm md:text-base">⚠️</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-800 font-semibold text-sm md:text-base mb-1 md:mb-2">Critical Reminder:</p>
                                <p className="text-gray-700 text-xs md:text-sm">
                                  Becho Protect must be selected at checkout to be eligible for any refund consideration. No exceptions will be made for orders placed without Becho Protect.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: All Sales Are Final */}
                    <div id="section3" className="scroll-mt-24 md:scroll-mt-32">
                      <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm md:text-lg font-bold">
                          3
                        </div>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">All Sales Are Final</h2>
                      </div>
                      
                      <div className="space-y-4 md:space-y-8">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
                          <div className="flex items-center gap-3 mb-3 md:mb-4">
                            <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-gray-800 font-bold text-sm md:text-base">🔒</span>
                            </div>
                            <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-800">No Refunds, Returns, or Exchanges</h3>
                          </div>
                          <p className="text-gray-700 text-sm md:text-base mb-4 md:mb-6">
                            At JustBecho, all purchases made on the platform are final. We operate on a "sold as seen" basis to maintain fairness and transparency for both buyers and sellers.
                          </p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                            <div className="text-center p-2 md:p-4 bg-gray-50 rounded-lg">
                              <div className="text-xl md:text-2xl mb-1 md:mb-2">❌</div>
                              <p className="font-bold text-gray-800 text-xs md:text-sm">Non-Refundable</p>
                              <p className="text-gray-700 text-xs md:text-sm mt-0.5 md:mt-1">Items cannot be returned for refunds</p>
                            </div>
                            <div className="text-center p-2 md:p-4 bg-gray-50 rounded-lg">
                              <div className="text-xl md:text-2xl mb-1 md:mb-2">🚫</div>
                              <p className="font-bold text-gray-800 text-xs md:text-sm">Non-Returnable</p>
                              <p className="text-gray-700 text-xs md:text-sm mt-0.5 md:mt-1">Items cannot be sent back</p>
                            </div>
                            <div className="text-center p-2 md:p-4 bg-gray-50 rounded-lg col-span-2 md:col-span-1">
                              <div className="text-xl md:text-2xl mb-1 md:mb-2">🔄</div>
                              <p className="font-bold text-gray-800 text-xs md:text-sm">Non-Exchangeable</p>
                              <p className="text-gray-700 text-xs md:text-sm mt-0.5 md:mt-1">Items cannot be exchanged</p>
                            </div>
                          </div>

                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4">
                            <div className="flex items-start gap-2 md:gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                  <span className="text-gray-700 text-sm md:text-base">📋</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-800 font-semibold text-sm md:text-base mb-1 md:mb-2">Buyer Responsibility:</p>
                                <p className="text-gray-700 text-xs md:text-sm">
                                  We strongly encourage buyers to carefully review all product details, images, descriptions, and seller ratings before placing an order. Ask questions to sellers before purchasing if you need clarification.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Required Documentation */}
                    <div id="section4" className="scroll-mt-24 md:scroll-mt-32">
                      <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm md:text-lg font-bold">
                          4
                        </div>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Required Documentation</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3 md:mb-4">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-800 font-bold text-sm md:text-base">📸</span>
                          </div>
                          <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-800">Evidence Collection</h3>
                        </div>
                        
                        <div className="space-y-4 md:space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                              <h4 className="font-bold text-gray-800 text-sm md:text-base mb-2 md:mb-3">Mandatory Evidence:</h4>
                              <ul className="list-disc pl-5 md:pl-6 text-gray-700 text-xs md:text-sm space-y-1 md:space-y-2">
                                <li>Clear unboxing video (required)</li>
                                <li>Multiple high-resolution photos</li>
                                <li>Close-ups of defect areas</li>
                                <li>Package condition evidence</li>
                                <li>Shipping label details</li>
                              </ul>
                            </div>
                            
                            <div className="bg-gray-100 p-3 md:p-4 rounded-lg">
                              <h4 className="font-bold text-gray-800 text-sm md:text-base mb-2 md:mb-3">Additional Evidence:</h4>
                              <ul className="list-disc pl-5 md:pl-6 text-gray-700 text-xs md:text-sm space-y-1 md:space-y-2">
                                <li>Expert authentication reports</li>
                                <li>Manufacturer verification</li>
                                <li>Comparative images with listing</li>
                                <li>Third-party appraisal</li>
                              </ul>
                            </div>
                          </div>

                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4">
                            <div className="flex items-start gap-2 md:gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                  <span className="text-gray-700 text-sm md:text-base">💡</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-800 font-semibold text-sm md:text-base mb-1 md:mb-2">Evidence Guidelines:</p>
                                <p className="text-gray-700 text-xs md:text-sm">
                                  All evidence must be clear, unedited, and timestamped. Blurry, incomplete, or manipulated evidence will result in immediate rejection of the refund request.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 5: Unboxing Video Requirements */}
                    <div id="section5" className="scroll-mt-24 md:scroll-mt-32">
                      <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm md:text-lg font-bold">
                          5
                        </div>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Unboxing Video Requirements</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3 md:mb-4">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-800 font-bold text-sm md:text-base">🎥</span>
                          </div>
                          <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-800">Mandatory Video Documentation</h3>
                        </div>
                        
                        <div className="space-y-4 md:space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div>
                              <h4 className="font-bold text-gray-800 text-sm md:text-base mb-2 md:mb-3">Video Requirements:</h4>
                              <ul className="list-disc pl-5 md:pl-6 text-gray-700 text-xs md:text-sm space-y-1 md:space-y-2">
                                <li>Single continuous, unedited video</li>
                                <li>Clear view of package before opening</li>
                                <li>Show shipping label and seals</li>
                                <li>Document entire unboxing process</li>
                                <li>Show all sides of the product</li>
                                <li>Highlight any visible issues</li>
                              </ul>
                            </div>
                            
                            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2 md:mb-3">
                                <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-gray-700 text-xs md:text-sm">✅</span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm md:text-base">Video Must Show:</h4>
                              </div>
                              <ul className="list-disc pl-5 md:pl-6 text-gray-700 text-xs md:text-sm space-y-1 md:space-y-2">
                                <li>Package condition upon arrival</li>
                                <li>Seal integrity before opening</li>
                                <li>Product in original packaging</li>
                                <li>All accessories and documents</li>
                                <li>Clear close-ups of any defects</li>
                              </ul>
                            </div>
                          </div>

                          <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 md:p-4">
                            <div className="flex items-start gap-2 md:gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-gray-700 text-sm md:text-base">🚫</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-800 font-semibold text-sm md:text-base mb-1 md:mb-2">Important:</p>
                                <p className="text-gray-700 text-xs md:text-sm">
                                  The unboxing video must be submitted to the satisfaction of JustBecho. Without a proper unboxing video, refund requests will be automatically rejected regardless of other evidence.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 6: Refund Process Timeline */}
                    <div id="section6" className="scroll-mt-24 md:scroll-mt-32">
                      <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm md:text-lg font-bold">
                          6
                        </div>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Refund Process Timeline</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3 md:mb-4">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-800 font-bold text-sm md:text-base">⏱️</span>
                          </div>
                          <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-800">Processing Steps & Duration</h3>
                        </div>
                        
                        <div className="space-y-4 md:space-y-6">
                          <div className="space-y-3 md:space-y-4">
                            {[
                              { step: '1', title: 'Refund Request Submission', desc: 'Within 24 hours of delivery + unboxing video' },
                              { step: '2', title: 'Initial Review', desc: '2-3 business days for evidence verification' },
                              { step: '3', title: 'Detailed Investigation', desc: '2-3 business days for thorough analysis' },
                              { step: '4', title: 'Decision Communication', desc: 'Within 3-4 days of submission' },
                              { step: '5', title: 'Refund Processing', desc: '5-10 business days after approval' }
                            ].map((item, index) => (
                              <div key={index} className="flex items-start gap-2 md:gap-3">
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-gray-800 font-bold text-xs md:text-sm">{item.step}</span>
                                </div>
                                <div>
                                  <p className="font-bold text-gray-800 text-sm md:text-base mb-0.5 md:mb-1">{item.title}</p>
                                  <p className="text-gray-700 text-xs md:text-sm">{item.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
                            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                              <div className="text-center">
                                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 md:mb-2">7-10</div>
                                <p className="font-bold text-gray-800 text-sm md:text-base">Total Business Days</p>
                                <p className="text-gray-700 text-xs md:text-sm mt-0.5 md:mt-1">From submission to refund</p>
                              </div>
                            </div>
                            
                            <div className="bg-gray-100 p-3 md:p-4 rounded-lg">
                              <div className="text-center">
                                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 md:mb-2">24</div>
                                <p className="font-bold text-gray-800 text-sm md:text-base">Hours to Report</p>
                                <p className="text-gray-700 text-xs md:text-sm mt-0.5 md:mt-1">From delivery time</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 7: Non-Qualifying Situations */}
                    <div id="section7" className="scroll-mt-24 md:scroll-mt-32">
                      <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm md:text-lg font-bold">
                          7
                        </div>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Non-Qualifying Situations</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3 md:mb-4">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-800 font-bold text-sm md:text-base">🚫</span>
                          </div>
                          <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-800">Situations Not Eligible for Refund</h3>
                        </div>
                        
                        <div className="space-y-4 md:space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                              <h4 className="font-bold text-gray-800 text-sm md:text-base mb-2 md:mb-3">Product-Related:</h4>
                              <ul className="list-disc pl-5 md:pl-6 text-gray-700 text-xs md:text-sm space-y-1 md:space-y-2">
                                <li>Minor cosmetic differences</li>
                                <li>Change of mind or remorse</li>
                                <li>Found better price elsewhere</li>
                                <li>Product fit or size issues</li>
                                <li>Personal dislike of the item</li>
                              </ul>
                            </div>
                            
                            <div className="bg-gray-100 p-3 md:p-4 rounded-lg">
                              <h4 className="font-bold text-gray-800 text-sm md:text-base mb-2 md:mb-3">Buyer-Related:</h4>
                              <ul className="list-disc pl-5 md:pl-6 text-gray-700 text-xs md:text-sm space-y-1 md:space-y-2">
                                <li>Failure to read description</li>
                                <li>Misunderstanding of condition</li>
                                <li>Incorrect assumptions</li>
                                <li>No unboxing video</li>
                                <li>Late claim submission</li>
                              </ul>
                            </div>
                          </div>

                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4">
                            <div className="flex items-start gap-2 md:gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                  <span className="text-gray-700 text-sm md:text-base">💡</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-800 font-semibold text-sm md:text-base mb-1 md:mb-2">Understanding Condition Ratings:</p>
                                <p className="text-gray-700 text-xs md:text-sm">
                                  Items are sold as per their condition rating. "Like New" means minimal signs of use, "Good" means visible wear, and "Fair" means significant wear. Ensure you understand these ratings before purchasing.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 md:p-4">
                            <div className="flex items-start gap-2 md:gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-gray-700 text-sm md:text-base">⚖️</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-800 font-semibold text-sm md:text-base mb-1 md:mb-2">Platform Integrity:</p>
                                <p className="text-gray-700 text-xs md:text-sm">
                                  JustBecho operates as a peer-to-peer marketplace. The "all sales final" policy protects both buyers and sellers by ensuring transactions are conducted with due diligence and transparency.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 8: Cancellation Policy */}
                    <div id="section8" className="scroll-mt-24 md:scroll-mt-32">
                      <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm md:text-lg font-bold">
                          8
                        </div>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Cancellation Policy</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3 md:mb-4">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-800 font-bold text-sm md:text-base">✖️</span>
                          </div>
                          <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-800">Order Cancellation Guidelines</h3>
                        </div>
                        
                        <div className="space-y-4 md:space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2 md:mb-3">
                                <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-gray-700 text-xs md:text-sm">✅</span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm md:text-base">Buyer Cancellation</h4>
                              </div>
                              <ul className="list-disc pl-5 md:pl-6 text-gray-700 text-xs md:text-sm space-y-1 md:space-y-2">
                                <li>Before seller dispatches: Full refund</li>
                                <li>After seller dispatches: No cancellation</li>
                                <li>Processing fees may apply</li>
                                <li>Via "My Orders" section only</li>
                              </ul>
                            </div>
                            
                            <div className="bg-gray-100 p-3 md:p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2 md:mb-3">
                                <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                  <span className="text-gray-700 text-xs md:text-sm">❌</span>
                                </div>
                                <h4 className="font-bold text-gray-800 text-sm md:text-base">Seller Cancellation</h4>
                              </div>
                              <ul className="list-disc pl-5 md:pl-6 text-gray-700 text-xs md:text-sm space-y-1 md:space-y-2">
                                <li>Allowed only under exceptional circumstances</li>
                                <li>Buyer notified immediately</li>
                                <li>Full refund to buyer</li>
                                <li>Seller may face penalties</li>
                              </ul>
                            </div>
                          </div>

                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4">
                            <div className="flex items-start gap-2 md:gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                  <span className="text-gray-700 text-sm md:text-base">⏱️</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-800 font-semibold text-sm md:text-base mb-1 md:mb-2">Cancellation Timeline:</p>
                                <p className="text-gray-700 text-xs md:text-sm">
                                  Buyers may cancel orders within 1 hour of placing them, provided the seller has not yet marked the item as "dispatched." After dispatch, cancellations are not permitted under any circumstances.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 md:p-4">
                            <div className="flex items-start gap-2 md:gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-gray-700 text-sm md:text-base">💸</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-800 font-semibold text-sm md:text-base mb-1 md:mb-2">Refund Processing:</p>
                                <p className="text-gray-700 text-xs md:text-sm">
                                  Approved refunds will be processed to the original payment method. Processing time depends on your bank/payment provider and typically takes 5-10 business days after approval.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 9: Contact for Refund Queries */}
                    <div id="section9" className="scroll-mt-24 md:scroll-mt-32">
                      <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm md:text-lg font-bold">
                          9
                        </div>
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Contact for Refund Queries</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 shadow-sm">
                        <div className="text-center">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                            <span className="text-gray-800 text-xl md:text-2xl">📞</span>
                          </div>
                          <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-4 md:mb-6">For refund inquiries, claims submission, or policy questions:</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                            <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                                <span className="text-gray-800 text-lg md:text-xl">📧</span>
                              </div>
                              <p className="font-bold text-gray-800 text-sm md:text-base mb-1">Refund Inquiries</p>
                              <p className="text-gray-600 text-base md:text-lg">support@justbecho.com</p>
                            </div>
                            <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                                <span className="text-gray-800 text-lg md:text-xl">📱</span>
                              </div>
                              <p className="font-bold text-gray-800 text-sm md:text-base mb-1">Support Number</p>
                              <p className="text-gray-600 text-base md:text-lg">+91-93018-47748</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                            <div className="text-center p-2 md:p-3 bg-gray-50 rounded">
                              <div className="text-lg md:text-xl mb-1 md:mb-2">⏰</div>
                              <p className="font-bold text-gray-800 text-xs md:text-sm">Support Hours</p>
                              <p className="text-gray-600 text-xs">10 AM - 6 PM, Mon-Sat</p>
                            </div>
                            <div className="text-center p-2 md:p-3 bg-gray-50 rounded">
                              <div className="text-lg md:text-xl mb-1 md:mb-2">📝</div>
                              <p className="font-bold text-gray-800 text-xs md:text-sm">Claim Portal</p>
                              <p className="text-gray-600 text-xs">Submit via website & app</p>
                            </div>
                            <div className="text-center p-2 md:p-3 bg-gray-50 rounded col-span-2 md:col-span-1">
                              <div className="text-lg md:text-xl mb-1 md:mb-2">✉️</div>
                              <p className="font-bold text-gray-800 text-xs md:text-sm">Response Time</p>
                              <p className="text-gray-600 text-xs">Within 48 hours</p>
                            </div>
                          </div>
                          
                          <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg">
                            <p className="font-bold text-base md:text-lg mb-1 md:mb-2">Policy Acknowledgement</p>
                            <p className="text-gray-300 text-sm md:text-base">
                              By making a purchase on Just Becho, you acknowledge that you have read, understood, and agree to be bound by this Refund & Return Policy.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200 gap-3 md:gap-4">
                <Link 
                  href="/shipping" 
                  className="text-gray-600 hover:text-gray-900 font-semibold text-sm md:text-base flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <span>←</span> Shipping Policy
                </Link>
                <div className="flex items-center gap-2 md:gap-4">
                  <Link 
                    href="/privacy-policy" 
                    className="text-gray-600 hover:text-gray-900 font-semibold text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Privacy Policy
                  </Link>
                  <Link 
                    href="/contact-us" 
                    className="text-gray-600 hover:text-gray-900 font-semibold text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Back to Top */}
        {isMobile && (
          <div className="sticky bottom-4 left-0 right-0 px-4 z-30">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full bg-gradient-to-r from-gray-800 to-black text-white py-3 rounded-lg font-medium shadow-lg"
            >
              Back to Top
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}