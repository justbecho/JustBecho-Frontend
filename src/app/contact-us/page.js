// app/contact-us/page.jsx
'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { FiMail, FiPhone, FiSend, FiUser, FiMessageCircle } from 'react-icons/fi'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

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

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header - Centered */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We're here to help. Get in touch with us through the right channel for your needs.
            </p>
          </div>

          {/* Success Message - Centered */}
          {isSubmitted && (
            <div className="max-w-md mx-auto mb-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">We'll get back to you within 24 hours.</p>
              </div>
            </div>
          )}

          {/* Contact Cards - Symmetrical Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            
            {/* Customer Support Card */}
            <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <FiMail className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Customer Support
                </h3>
                <p className="text-gray-600 mb-4">
                  For order queries, product issues, returns, and customer assistance
                </p>
                <a 
                  href="mailto:support@justbecho.com"
                  className="text-blue-600 hover:text-blue-700 font-medium text-lg"
                >
                  support@justbecho.com
                </a>
              </div>
            </div>
            
            {/* Business Card */}
            <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <FiMail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Business & Bulk Sellers
                </h3>
                <p className="text-gray-600 mb-4">
                  For partnership inquiries, bulk selling, and business collaborations
                </p>
                <a 
                  href="mailto:connect@justbecho.com"
                  className="text-green-600 hover:text-green-700 font-medium text-lg"
                >
                  connect@justbecho.com
                </a>
              </div>
            </div>

          </div>

          {/* Contact Form - Centered */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
              
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                  Send a Message
                </h2>
                <p className="text-gray-600">
                  Fill out the form and we'll respond as soon as possible
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name & Email - Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <FiUser className="w-4 h-4 mr-2" />
                        Your Name *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center">
                        <FiMail className="w-4 h-4 mr-2" />
                        Email Address *
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    placeholder="How can we help you? Please provide details..."
                    required
                  />
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 px-6 rounded-lg font-medium text-white flex items-center justify-center transition ${
                    isSubmitting 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
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

          {/* Contact Info - Centered */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gray-50 rounded-lg">
              <FiPhone className="w-5 h-5 text-gray-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Need immediate assistance?</p>
                <a 
                  href="tel:+919876543210"
                  className="text-gray-900 font-medium hover:text-blue-600"
                >
                  Call us at +91 98765 43210
                </a>
              </div>
            </div>
          </div>

          {/* FAQ - Centered */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  How long does it take to get a response?
                </h4>
                <p className="text-gray-600 text-sm">
                  We respond to all inquiries within 24 hours on business days (Monday to Saturday).
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  What should I include in my message?
                </h4>
                <p className="text-gray-600 text-sm">
                  Include your order ID (if applicable), product details, and any relevant information to help us assist you faster.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  How do I become a bulk seller?
                </h4>
                <p className="text-gray-600 text-sm">
                  Email us at connect@justbecho.com with your business details and product catalog for review.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  What are your business hours?
                </h4>
                <p className="text-gray-600 text-sm">
                  Our support is available Monday to Saturday from 9:00 AM to 8:00 PM.
                </p>
              </div>
              
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  )
}