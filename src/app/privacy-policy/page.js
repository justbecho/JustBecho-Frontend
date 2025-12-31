// app/privacy-policy/page.js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiHome,
  FiMail,
  FiPhone,
  FiAlertTriangle,
  FiLock,
  FiGlobe,
  FiShield,
  FiFileText,
  FiUserCheck,
  FiClock
} from 'react-icons/fi'

export default function PrivacyPolicyPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [expandedSections, setExpandedSections] = useState(new Set())
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

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const sections = [
    {
      id: 'section1',
      number: '1',
      title: 'What Kind of Data We Collect?',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-bold text-green-800 mb-2">A. Data From Buyers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
              </ul>
              <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                <li>Delivery address</li>
                <li>Payment details</li>
                <li>Device data & IP</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 mb-2">B. Data From Sellers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
              </ul>
              <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm">
                <li>Business address</li>
                <li>Device and IP data</li>
                <li>Bank details</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-bold text-purple-800 mb-2">C. Platform Interactions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2 bg-white rounded text-center">
                <p className="font-semibold text-purple-700 text-sm">Customer Support</p>
              </div>
              <div className="p-2 bg-white rounded text-center">
                <p className="font-semibold text-purple-700 text-sm">Feedback</p>
              </div>
              <div className="p-2 bg-white rounded text-center">
                <p className="font-semibold text-purple-700 text-sm">Analytics</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'section2',
      number: '2',
      title: 'Why Do We Collect Data?',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-bold text-green-800 mb-2">For Buyers</h4>
            <ul className="list-disc pl-5 text-gray-700 space-y-2 text-sm">
              <li>Create and maintain accounts</li>
              <li>Process and deliver orders</li>
              <li>Secure payment processing</li>
              <li>Customer support</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 mb-2">For Sellers</h4>
            <ul className="list-disc pl-5 text-gray-700 space-y-2 text-sm">
              <li>Register and verify accounts</li>
              <li>Enable product listings</li>
              <li>Process orders</li>
              <li>Settle payments</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'section3',
      number: '3',
      title: 'Data Retention & Storage',
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <FiClock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-semibold mb-1">Retention Period</p>
                <p className="text-yellow-700 text-sm">
                  Data retained for as long as your account is active. Post-deletion retention for 1+ year for legal compliance.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl mb-2">🌐</div>
              <p className="font-bold text-blue-800 text-sm">Netlify</p>
              <p className="text-blue-700 text-xs">Hosting</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl mb-2">🗄️</div>
              <p className="font-bold text-green-800 text-sm">MongoDB</p>
              <p className="text-green-700 text-xs">Database</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xl mb-2">🌍</div>
              <p className="font-bold text-purple-800 text-sm">GoDaddy</p>
              <p className="text-purple-700 text-xs">Domain</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'section4',
      number: '4',
      title: 'Third-Party Data Sharing',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-bold text-green-800 mb-2">Payment Gateway (Goquik)</h4>
            <p className="text-green-700 text-sm">Processes payments and settlements</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 mb-2">Logistics Partners</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-blue-700 text-xs">Bluedart</p>
              </div>
              <div className="text-center">
                <p className="text-blue-700 text-xs">Delhivery</p>
              </div>
              <div className="text-center">
                <p className="text-blue-700 text-xs">Local Couriers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <FiAlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold mb-1">Important Notice</p>
                <p className="text-red-700 text-sm">
                  Third parties operate under their own policies. Just Becho not liable for breaches on their end.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'section5',
      number: '5',
      title: 'International Data Transfer',
      content: (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FiGlobe className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-gray-700 text-sm">
                Data may be stored on servers outside India. All transfers comply with DPDPA 2023 requirements.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'section6',
      number: '6',
      title: 'Your Rights Under DPDPA 2023',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs font-bold">A</span>
              </div>
              <p className="font-semibold text-green-800 text-sm">Right to Access</p>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs font-bold">B</span>
              </div>
              <p className="font-semibold text-blue-800 text-sm">Right to Correction</p>
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs font-bold">C</span>
              </div>
              <p className="font-semibold text-purple-800 text-sm">Right to Erasure</p>
            </div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-xs font-bold">D</span>
              </div>
              <p className="font-semibold text-yellow-800 text-sm">Right to Withdraw Consent</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'section7',
      number: '7',
      title: 'How to Exercise Your Rights',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiMail className="w-4 h-4 text-blue-600" />
                <p className="font-bold text-blue-800 text-sm">Email</p>
              </div>
              <p className="text-blue-600 text-sm">support@justbecho.com</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiPhone className="w-4 h-4 text-blue-600" />
                <p className="font-bold text-blue-800 text-sm">Phone</p>
              </div>
              <p className="text-blue-600 text-sm">+91-93018-47748</p>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm font-semibold">
              We respond within 30 days as per DPDPA guidelines
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'section8',
      number: '8',
      title: 'Data Breach Notification',
      content: (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FiAlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-gray-700 text-sm mb-2">
                In case of a data breach, we will notify you within 72 hours with details including nature of breach, affected data, and mitigation steps.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'section9',
      number: '9',
      title: 'Grievance Redressal',
      content: (
        <div className="space-y-3">
          {[
            'Submit complaint via email/phone',
            'Acknowledgement within 5 days',
            'Resolution within 30-45 days',
            'Escalation to Data Protection Board if needed'
          ].map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
              </div>
              <p className="text-gray-700 text-sm">{step}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'section10',
      number: '10',
      title: 'Governing Law & Jurisdiction',
      content: (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FiFileText className="w-4 h-4 text-gray-600" />
              <p className="text-gray-700 text-sm">Governing Law: Laws of India</p>
            </div>
            <div className="flex items-center gap-2">
              <FiShield className="w-4 h-4 text-gray-600" />
              <p className="text-gray-700 text-sm">DPDPA 2023 compliant</p>
            </div>
            <div className="flex items-center gap-2">
              <FiHome className="w-4 h-4 text-gray-600" />
              <p className="text-gray-700 text-sm">Jurisdiction: Indore, MP courts</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'section11',
      number: '11',
      title: 'Policy Updates',
      content: (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600">🔄</span>
              </div>
            </div>
            <div>
              <p className="text-gray-700 text-sm mb-2">
                Policy updates will be notified via website alerts and emails. Continued use after updates implies acceptance.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'section12',
      number: '12',
      title: 'Contact Information',
      content: (
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-blue-600 text-xl">📞</span>
          </div>
          <p className="text-gray-700 text-sm mb-4">
            For data protection queries and complaints:
          </p>
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-bold text-blue-800 text-sm">Email</p>
              <p className="text-blue-600">support@justbecho.com</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-bold text-blue-800 text-sm">Phone</p>
              <p className="text-blue-600">+91-93018-47748</p>
            </div>
          </div>
        </div>
      )
    }
  ]

  // Mobile section navigation
  const mobileNavItems = sections.map(section => ({
    id: section.id,
    number: section.number,
    title: section.title
  }))

  // Mobile Header
  const MobileHeader = () => (
    <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
          >
            {showMobileNav ? (
              <FiChevronUp className="w-6 h-6" />
            ) : (
              <FiChevronDown className="w-6 h-6" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <FiLock className="w-5 h-5" />
            <span className="text-sm font-medium">Privacy Policy</span>
          </div>
        </div>
        
        <button
          onClick={() => window.location.href = '/'}
          className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
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
              {mobileNavItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setShowMobileNav(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {item.number}
                    </div>
                    <span className="text-sm font-medium">{item.title}</span>
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
      
      {/* Main content with proper padding for header */}
      <main className="min-h-screen bg-white pt-16 md:pt-[140px]">
        {/* Mobile Header - Fixed at top */}
        {isMobile && <MobileHeader />}

        {/* Hero Section */}
        <section className={`${isMobile ? 'pt-16' : ''} bg-gradient-to-r from-blue-900 to-indigo-900 text-white`}>
          <div className={`${isMobile ? 'px-4 py-8' : 'px-6 lg:px-8 py-16'}`}>
            <div className={`${isMobile ? '' : 'max-w-7xl'} mx-auto text-center`}>
              <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl md:text-5xl'} font-light tracking-widest uppercase mb-3`}>
                PRIVACY POLICY
              </h1>
              <div className={`${isMobile ? 'px-4 py-1.5' : 'px-6 py-2'} bg-blue-800 inline-block rounded-lg`}>
                <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-blue-100`}>Last Updated: {currentDate}</p>
              </div>
              <p className={`${isMobile ? 'text-sm mt-3' : 'text-lg mt-6'} text-blue-200 max-w-3xl mx-auto`}>
                Protecting your privacy is our priority. This policy explains how we collect, use, and protect your data.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className={`${isMobile ? 'py-6' : 'py-16'}`}>
          <div className={`${isMobile ? 'px-4' : 'px-6 lg:px-8'}`}>
            <div className={`${isMobile ? '' : 'max-w-7xl'} mx-auto`}>
              {/* Important Notice */}
              <div className={`${isMobile ? 'mb-6 p-4' : 'mb-12 p-6'} bg-blue-50 border-l-4 border-blue-500 rounded-r-lg`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} bg-blue-100 rounded-full flex items-center justify-center`}>
                      <FiLock className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} text-blue-600`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-blue-800 font-bold mb-1">PRIVACY NOTICE</p>
                    <p className="text-blue-700 text-sm">
                      This describes how Just Becho collects, uses, stores, shares, and protects your personal data in compliance with DPDPA 2023.
                    </p>
                    <div className="mt-3 p-2 bg-blue-100 border border-blue-200 rounded text-sm">
                      <p className="text-blue-800 font-semibold">
                        ⚠️ By using our platform, you agree to the practices described here.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} id={section.id} className="scroll-mt-24">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                            {section.number}
                          </div>
                          <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-900`}>
                            {section.title}
                          </h2>
                        </div>
                        {isMobile ? (
                          expandedSections.has(section.id) ? (
                            <FiChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <FiChevronDown className="w-5 h-5 text-gray-500" />
                          )
                        ) : (
                          <FiChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      
                      {(!isMobile || expandedSections.has(section.id)) && (
                        <div className={`${isMobile ? 'mt-3' : 'mt-4'}`}>
                          {section.content}
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Quick Contact Info - Mobile */}
              {isMobile && (
                <div className="mt-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-lg p-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiUserCheck className="w-5 h-5" />
                    </div>
                    <p className="font-bold mb-2">Need Help?</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <FiMail className="w-4 h-4" />
                        <p className="text-sm">support@justbecho.com</p>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <FiPhone className="w-4 h-4" />
                        <p className="text-sm">+91-93018-47748</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className={`flex flex-col ${isMobile ? 'mt-6' : 'mt-12'} pt-6 border-t border-gray-200 gap-4`}>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <Link 
                    href="/terms/buyer-terms" 
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto justify-center"
                  >
                    <span>←</span> Buyer Terms
                  </Link>
                  
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Link 
                      href="/terms/seller-terms" 
                      className="flex-1 sm:flex-none text-center text-blue-600 hover:text-blue-800 font-medium text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Seller Terms
                    </Link>
                    <Link 
                      href="/contact" 
                      className="flex-1 sm:flex-none text-center text-blue-600 hover:text-blue-800 font-medium text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Contact Us
                    </Link>
                  </div>
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
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium shadow-lg"
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