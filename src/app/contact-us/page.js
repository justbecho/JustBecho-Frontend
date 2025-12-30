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
  FiClock,
  FiHelpCircle,
  FiBriefcase,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiMapPin,
  FiGlobe,
  FiShield,
  FiPackage
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactType: 'general'
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success message
      setIsSubmitted(true)
      
      // Reset form
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        subject: '', 
        message: '',
        contactType: 'general'
      })
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
      
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
      answer: "ALL SALES ARE FINAL. However, if a seller ships a counterfeit, an incorrect or a wrong item, your money is perfectly safeguarded by-BECHO PROTECT"
    }
  ]

  const contactMethods = [
    {
      title: "Customer Support",
      description: "For order queries, product issues, returns, and customer assistance",
      email: "support@justbecho.com",
      icon: FiHelpCircle,
      color: "blue",
      bgColor: "from-blue-50 to-blue-100",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      contactNumber: "+91 9301847748",
      whatsapp: "+919301847748",
      workingHours: "Mon-Sat, 9AM - 6PM"
    },
    {
      title: "Business & Bulk Sellers",
      description: "For partnership inquiries, bulk selling, and business collaborations",
      email: "connect@justbecho.com",
      icon: FiBriefcase,
      color: "green",
      bgColor: "from-green-50 to-green-100",
      iconBg: "bg-gradient-to-br from-green-500 to-green-600",
      contactNumber: "+91 9301847748",
      workingHours: "Mon-Fri, 10AM - 5PM"
    },
    {
      title: "General Inquiries",
      description: "For general questions, feedback, and suggestions",
      email: "info@justbecho.com",
      icon: FiGlobe,
      color: "purple",
      bgColor: "from-purple-50 to-purple-100",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      workingHours: "Mon-Sat, 9AM - 6PM"
    }
  ]

  return (
    <>
      <Header />
      
      {/* Enhanced Hero Section with Gradient */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
          {/* Decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          </div>
          
          <div className="relative pt-[5rem] md:pt-[8rem] pb-8 md:pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
                  Contact Us
                </h1>
                <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto px-4">
                  We're here to help. Reach out through the right channel for your needs and get timely assistance.
                </p>
                
                {/* Quick Stats */}
                <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-4 md:gap-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
                    <p className="text-white text-sm">Response Time</p>
                    <p className="text-white font-bold text-xl">Within 24 Hours</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
                    <p className="text-white text-sm">Support Available</p>
                    <p className="text-white font-bold text-xl">6 Days a Week</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
                    <p className="text-white text-sm">Customer Rating</p>
                    <p className="text-white font-bold text-xl">4.8/5 Stars</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 -mt-4">
          {/* Success Message - Floating */}
          {isSubmitted && (
            <div className="max-w-2xl mx-auto mb-8 animate-fade-in-up">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiCheckCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">Message Sent Successfully!</h3>
                    <p className="text-green-100">We'll get back to you within 24 hours. Check your email for confirmation.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Methods Grid - Enhanced */}
          <div className="max-w-7xl mx-auto mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
              Quick Contact Channels
            </h2>
            <p className="text-gray-600 text-center mb-8 md:mb-12 max-w-3xl mx-auto">
              Choose the right contact method based on your query type for faster resolution
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {contactMethods.map((method, index) => {
                const Icon = method.icon
                return (
                  <div 
                    key={index} 
                    className={`bg-gradient-to-br ${method.bgColor} border border-gray-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                  >
                    <div className="flex flex-col h-full">
                      {/* Icon Header */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`${method.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-xl mb-2">
                            {method.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {method.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Contact Details */}
                      <div className="space-y-4 mb-6 flex-1">
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <FiMail className="w-4 h-4" />
                            <span>Email</span>
                          </div>
                          <a 
                            href={`mailto:${method.email}`}
                            className="font-medium text-gray-900 hover:text-blue-600 transition-colors break-all text-lg"
                          >
                            {method.email}
                          </a>
                        </div>
                        
                        {method.contactNumber && (
                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                              <FiPhone className="w-4 h-4" />
                              <span>Phone</span>
                            </div>
                            <a 
                              href={`tel:${method.contactNumber}`}
                              className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-lg"
                            >
                              {method.contactNumber}
                            </a>
                          </div>
                        )}
                        
                        {method.workingHours && (
                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                              <FiClock className="w-4 h-4" />
                              <span>Working Hours</span>
                            </div>
                            <p className="font-medium text-gray-900 text-lg">
                              {method.workingHours}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="space-y-3 pt-4 border-t border-gray-200/50">
                        <a 
                          href={`mailto:${method.email}`}
                          className="block w-full bg-white border-2 border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400 py-3 px-4 rounded-xl font-medium transition-all text-center"
                        >
                          Send Email
                        </a>
                        
                        {method.whatsapp && (
                          <a 
                            href={`https://wa.me/${method.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 py-3 px-4 rounded-xl font-medium transition-all"
                          >
                            <FaWhatsapp className="w-5 h-5" />
                            Message on WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Main Content Grid - Contact Form & Info Side by Side */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
              {/* Contact Form - Takes 2 columns */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FiMessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      Send Us a Message
                    </h2>
                    <p className="text-gray-600">
                      Fill out the form below and we'll respond as soon as possible
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="flex items-center gap-2">
                            <FiUser className="w-4 h-4" />
                            Your Name *
                          </span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="flex items-center gap-2">
                            <FiMail className="w-4 h-4" />
                            Email Address *
                          </span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="flex items-center gap-2">
                            <FiPhone className="w-4 h-4" />
                            Phone Number (Optional)
                          </span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="+91 9876543210"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Query Type
                        </label>
                        <select
                          name="contactType"
                          value={formData.contactType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="support">Customer Support</option>
                          <option value="seller">Seller/Business</option>
                          <option value="technical">Technical Issue</option>
                          <option value="feedback">Feedback/Suggestion</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Brief description of your query"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={isMobile ? 5 : 6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                        placeholder="Please provide detailed information about your query..."
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-white flex items-center justify-center transition-all duration-300 ${
                        isSubmitting 
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-[0.98] shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
                          Sending Your Message...
                        </>
                      ) : (
                        <>
                          <FiSend className="w-6 h-6 mr-3" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
              
              {/* Contact Info Sidebar - Takes 1 column */}
              <div className="space-y-8">
                {/* Contact Info Card */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 md:p-8 text-white">
                  <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiPhone className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg mb-1">Phone Support</p>
                        <a 
                          href="tel:+919301847748"
                          className="text-blue-300 hover:text-blue-200 text-lg font-medium"
                        >
                          +91 9301847748
                        </a>
                        <p className="text-gray-300 text-sm mt-1">
                          Monday to Saturday, 9AM - 6PM
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiMapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg mb-1">Office Address</p>
                        <p className="text-gray-300">
                          Registered Office: 11 USHAGANJ 1ST FLOOR BETALA COMPLEX, INDORE, M.P – 452001
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiShield className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg mb-1">Support Guarantee</p>
                        <p className="text-gray-300">
                          We guarantee a response within 24 hours on business days
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Emergency Contact Button */}
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <a 
                      href="tel:+919301847748"
                      className="block w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-bold text-center transition-all"
                    >
                      Emergency Contact
                    </a>
                  </div>
                </div>
                
                {/* WhatsApp Quick Contact */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                      <FaWhatsapp className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">WhatsApp Support</h4>
                      <p className="text-gray-600 text-sm">Instant messaging support</p>
                    </div>
                  </div>
                  
                  <a 
                    href="https://wa.me/919301847748"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section - Enhanced */}
          <div className="max-w-4xl mx-auto mt-16 md:mt-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find quick answers to common questions about our services and support
              </p>
            </div>
            
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        expandedFaq === index 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-900 text-base md:text-lg pr-4">
                        {item.question}
                      </span>
                    </div>
                    {expandedFaq === index ? (
                      <FiChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <FiChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedFaq === index && (
                    <div className="px-6 pb-6 animate-fade-in">
                      <div className="pl-12 border-l-2 border-blue-500">
                        <p className="text-gray-600">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Still have questions */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Still have questions? We're here to help!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a 
                  href="mailto:support@justbecho.com"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white hover:bg-black py-3 px-6 rounded-xl font-medium transition-all"
                >
                  <FiMail className="w-5 h-5" />
                  Email Us
                </a>
                <a 
                  href="tel:+919301847748"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 py-3 px-6 rounded-xl font-medium transition-all"
                >
                  <FiPhone className="w-5 h-5" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}