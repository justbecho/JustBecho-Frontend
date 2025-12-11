// app/contact-us/page.jsx
'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiSend, 
  FiUser,
  FiMessageSquare,
  FiClock,
  FiCheckCircle
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
  const [errors, setErrors] = useState({})

  const contactDetails = [
    {
      title: "Customer Support",
      email: "support@justbecho.com",
      description: "For order queries, product issues, returns, and general customer assistance",
      icon: <FiMessageSquare className="w-5 h-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Business & Bulk Sellers",
      email: "connect@justbecho.com",
      description: "For partnership inquiries, bulk selling, vendor registration, and business collaborations",
      icon: <FiMail className="w-5 h-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Please enter a subject'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In production:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      
      setTimeout(() => {
        setIsSubmitted(false)
      }, 4000)
      
    } catch (error) {
      console.error('Error:', error)
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact <span className="text-blue-600">Just Becho</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're here to help you. Whether you're a customer with a query or a business looking to partner with us, 
              get in touch through the appropriate channel below.
            </p>
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center">
                <FiCheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">Thank you for your message!</p>
                  <p className="text-green-600 text-sm mt-1">
                    We've received your inquiry and will respond within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                  Get in Touch
                </h2>
                
                <div className="space-y-8">
                  {contactDetails.map((contact, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-lg ${contact.bgColor} mr-4`}>
                          <div className={contact.color}>
                            {contact.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{contact.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{contact.description}</p>
                          <a 
                            href={`mailto:${contact.email}`}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-2 inline-block"
                          >
                            {contact.email}
                          </a>
                        </div>
                      </div>
                      {index < contactDetails.length - 1 && (
                        <div className="border-b border-gray-100"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Additional Contact Info */}
                <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-4">
                      <FiPhone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Call us at</p>
                      <p className="font-medium text-gray-900">+91 98765 43210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-4">
                      <FiClock className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Response time</p>
                      <p className="font-medium text-gray-900">Within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-4">
                      <FiMapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Based in</p>
                      <p className="font-medium text-gray-900">Gurugram, India</p>
                    </div>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Tip:</span> For faster response, please include relevant details 
                    like order ID, product name, or screenshots when applicable.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Send us a message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <FiUser className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                            errors.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <FiMail className="w-5 h-5" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="your@email.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        errors.subject ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="What is this regarding?"
                    />
                    {errors.subject && (
                      <p className="mt-2 text-sm text-red-600">{errors.subject}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none ${
                        errors.message ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Please describe your query or request in detail..."
                    />
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-600">{errors.message}</p>
                    )}
                  </div>
                  
                  {errors.submit && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600">{errors.submit}</p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 px-6 rounded-lg font-medium text-white flex items-center justify-center transition ${
                      isSubmitting 
                        ? 'bg-blue-500 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                  
                  <p className="text-sm text-gray-500 text-center">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              </div>

              {/* FAQ Section */}
              <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-medium text-gray-900 mb-1">
                      How long does it take to get a response?
                    </h4>
                    <p className="text-sm text-gray-600">
                      We aim to respond to all inquiries within 24 hours during business days (Monday-Friday).
                    </p>
                  </div>
                  <div className="border-b border-gray-100 pb-4">
                    <h4 className="font-medium text-gray-900 mb-1">
                      What information should I include in my message?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Please include your order ID (if applicable), product details, and any relevant screenshots to help us assist you better.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      How can I become a bulk seller on Just Becho?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Email us at connect@justbecho.com with your business details and product catalog. Our partnership team will review your application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Customer Support Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mon - Fri</span>
                  <span className="font-medium">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-red-600">Closed</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">For Urgent Matters</h3>
              <p className="text-gray-600 mb-3">
                For time-sensitive issues, please call our emergency support line.
              </p>
              <a 
                href="tel:+911234567890"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <FiPhone className="w-4 h-4 mr-2" />
                +91 123 456 7890
              </a>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Business Address</h3>
              <div className="flex items-start">
                <FiMapPin className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-gray-600">
                    Just Becho Pvt. Ltd.<br />
                    Sector 44, Gurugram<br />
                    Haryana - 122003, India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}