// app/contact-us/page.jsx
'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  FiMail, 
  FiPhone, 
  FiSend, 
  FiUser, 
  FiMessageCircle, 
  FiArrowLeft,
  FiClock,
  FiHelpCircle,
  FiBriefcase,
  FiCheckCircle,
  FiHome,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState(null)

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      setTimeout(() => {
        setIsSubmitted(false)
      }, 4000)
      
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const faqItems = [
    {
      question: "How long does it take to get a response?",
      answer: "We respond to all inquiries within 24 hours on business days (Monday to Saturday)."
    },
    {
      question: "What should I include in my message?",
      answer: "Include your order ID (if applicable), product details, and any relevant information to help us assist you faster."
    },
    {
      question: "How do I become a bulk seller?",
      answer: "Email us at connect@justbecho.com with your business details and product catalog for review."
    },
    {
      question: "What are your business hours?",
      answer: "Our support is available Monday to Saturday from 9:00 AM to 6:00 PM."
    },
    {
      question: "Do you offer phone support?",
      answer: "Yes, you can call us at +91 9301847748 during business hours for immediate assistance."
    },
    {
      question: "What's your return policy?",
      answer: "We offer a 7-day return policy on all items. Please contact support for return requests."
    }
  ]

  const contactMethods = [
    {
      title: "Customer Support",
      description: "For order queries, product issues, returns, and customer assistance",
      email: "support@justbecho.com",
      icon: FiHelpCircle,
      color: "blue"
    },
    {
      title: "Business & Bulk Sellers",
      description: "For partnership inquiries, bulk selling, and business collaborations",
      email: "connect@justbecho.com",
      icon: FiBriefcase,
      color: "green"
    }
    
  ]

  const handleBack = () => {
    window.history.back()
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-white">
        {/* Mobile Header */}
        {isMobile && (
          <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back</span>
              </button>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiMessageCircle className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Contact Us</span>
              </div>
              
              <button
                onClick={() => window.location.href = '/'}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiHome className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}

        <div className="pt-4 md:pt-24 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8">
        
          

          {/* Page Header */}
          <div className={`text-center mb-8 md:mb-16 ${isMobile ? 'px-2' : ''}`}>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Contact Us
            </h1>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
              We're here to help. Get in touch with us through the right channel for your needs.
            </p>
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <div className="max-w-md mx-auto mb-6 md:mb-8 px-2">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Message Sent!</h3>
                    <p className="text-gray-600 text-sm">We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Methods */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mb-6 text-center px-2">
              Quick Contact Channels
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2">
              {contactMethods.map((method, index) => {
                const Icon = method.icon
                const colorClasses = {
                  blue: 'bg-blue-50 text-blue-600',
                  green: 'bg-green-50 text-green-600',
                  purple: 'bg-purple-50 text-purple-600'
                }
                
                return (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-start gap-3 md:gap-4 mb-3">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${colorClasses[method.color]}`}>
                          <Icon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-base md:text-lg mb-1">
                            {method.title}
                          </h3>
                          <p className="text-gray-600 text-xs md:text-sm">
                            {method.description}
                          </p>
                        </div>
                      </div>
                      
                      <a 
                        href={`mailto:${method.email}`}
                        className="mt-3 text-sm md:text-base font-medium text-gray-900 hover:text-blue-600 transition-colors break-all"
                      >
                        {method.email}
                      </a>
                      
                      <button
                        onClick={() => window.location.href = `mailto:${method.email}`}
                        className="mt-3 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors w-full"
                      >
                        Send Email
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Contact Form */}
          <div className="mb-10 md:mb-12">
            <div className={`bg-gray-50 border border-gray-200 rounded-xl ${isMobile ? 'p-4' : 'p-6 md:p-8'}`}>
              <div className={`text-center mb-6 ${isMobile ? 'px-2' : ''}`}>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <FiMessageCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Send a Message
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  Fill out the form and we'll respond as soon as possible
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <FiUser className="w-4 h-4 mr-2 flex-shrink-0" />
                        Your Name *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm md:text-base"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <FiMail className="w-4 h-4 mr-2 flex-shrink-0" />
                        Email Address *
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm md:text-base"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm md:text-base"
                    placeholder="What is this regarding?"
                  />
                </div>
                
                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={isMobile ? 4 : 5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm md:text-base"
                    placeholder="How can we help you? Please provide details..."
                    required
                  />
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 md:py-3.5 px-6 rounded-lg font-medium text-white flex items-center justify-center transition-all ${
                    isSubmitting 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-[0.98]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-10 md:mb-12">
            <div className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl ${isMobile ? 'p-4' : 'p-6 md:p-8'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiPhone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Phone Support</p>
                        <a 
                          href="tel:+919301847748"
                          className="text-gray-600 hover:text-blue-600 text-sm md:text-base"
                        >
                          +91 9301847748
                        </a>
                        <p className="text-gray-500 text-xs md:text-sm mt-1">
                          Monday to Saturday, 9AM - 6PM
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiClock className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Response Time</p>
                        <p className="text-gray-600 text-sm md:text-base">
                          Within 24 hours
                        </p>
                        <p className="text-gray-500 text-xs md:text-sm mt-1">
                          For all email inquiries
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                    Business Address
                  </h3>
                  <div className="bg-white rounded-lg p-4">
                    
                    <p className="text-gray-600 text-sm md:text-base">
                      Registered Office: 11 USHAGANJ 1ST FLOOR BETALA COMPLEX, INDORE, M.P – 452001
                    </p>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className={`${isMobile ? 'px-2' : ''}`}>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 text-center">
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-3 md:space-y-4 max-w-3xl mx-auto">
              {faqItems.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-4 py-4 md:px-6 md:py-5 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900 text-sm md:text-base pr-4">
                      {item.question}
                    </span>
                    {expandedFaq === index ? (
                      <FiChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <FiChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedFaq === index && (
                    <div className="px-4 md:px-6 pb-4 md:pb-5">
                      <p className="text-gray-600 text-sm md:text-base">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Bottom CTA */}
          {isMobile && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
              <div className="flex gap-3">
                <a 
                  href="tel:+919301847748"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium text-center flex items-center justify-center gap-2"
                >
                  <FiPhone className="w-5 h-5" />
                  Call
                </a>
                <a 
                  href="mailto:support@justbecho.com"
                  className="flex-1 bg-gradient-to-r from-gray-900 to-black text-white py-3 rounded-xl font-medium text-center flex items-center justify-center gap-2"
                >
                  <FiMail className="w-5 h-5" />
                  Email
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}