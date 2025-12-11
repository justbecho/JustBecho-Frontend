// app/contact-us/page.jsx
'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiClock } from 'react-icons/fi'

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
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Here you would make actual API call
      // const response = await fetch('/api/contact', {...})
      
      setIsSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset success message after 4 seconds
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
      
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch with Just Becho
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Have questions or need assistance? We're here to help. Reach out to us through the appropriate channel below.
            </p>
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <div className="max-w-2xl mx-auto mb-8 animate-fadeIn">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center">
                <FiCheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">Message sent successfully!</p>
                  <p className="text-green-600 text-sm mt-1">
                    Thank you for contacting us. Our team will respond within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column - Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Customer Support Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg mr-4">
                    <FiMail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Customer Support</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      For order inquiries, product issues, returns, and general customer assistance.
                    </p>
                  </div>
                </div>
                <a 
                  href="mailto:support@justbecho.com"
                  className="text-blue-600 hover:text-blue-700 font-medium inline-block mt-2"
                >
                  support@justbecho.com
                </a>
              </div>

              {/* Business Partnerships Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="p-3 bg-green-50 rounded-lg mr-4">
                    <FiMail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Business & Partnerships</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Interested in bulk selling or becoming a verified seller? Contact our business team.
                    </p>
                  </div>
                </div>
                <a 
                  href="mailto:connect@justbecho.com"
                  className="text-green-600 hover:text-green-700 font-medium inline-block mt-2"
                >
                  connect@justbecho.com
                </a>
              </div>

              {/* Contact Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Contact Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FiPhone className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-900">+91 98765 43210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FiClock className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Business Hours</p>
                      <p className="font-medium text-gray-900">Mon-Sat: 9AM - 8PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FiMapPin className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Office Address</p>
                      <p className="font-medium text-gray-900">Gurugram, Haryana, India</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Tip */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <h4 className="font-medium text-blue-800 mb-2">Quick Tip</h4>
                <p className="text-blue-700 text-sm">
                  Include your order ID or product details for faster resolution of customer support queries.
                </p>
              </div>

            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Send us a Message</h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you as soon as possible. All fields are required.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="your@email.com"
                        required
                      />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="What is this regarding?"
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
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                      placeholder="Please describe your query or request in detail..."
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 px-6 rounded-lg font-medium text-white flex items-center justify-center transition ${
                      isSubmitting 
                        ? 'bg-blue-400 cursor-not-allowed' 
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
                    We typically respond within 24 hours on business days.
                  </p>
                </form>
              </div>

              {/* FAQ Section */}
              <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Questions</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">How long does it take to get a response?</h4>
                    <p className="text-gray-600 text-sm">
                      Our customer support team responds within 24 hours on business days (Monday to Saturday).
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">What information should I include for order-related queries?</h4>
                    <p className="text-gray-600 text-sm">
                      Please include your order ID, product details, and any relevant screenshots to help us assist you faster.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">How do I become a bulk seller on Just Becho?</h4>
                    <p className="text-gray-600 text-sm">
                      Send an email to connect@justbecho.com with your business details and product catalog. Our partnership team will review your application.
                    </p>
                  </div>
                </div>
              </div>

              {/* Urgent Support */}
              <div className="mt-8 bg-red-50 border border-red-100 rounded-xl p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FiPhone className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Need Immediate Assistance?</h3>
                    <p className="text-gray-600 mb-3">
                      For urgent matters that require immediate attention, please call our emergency support line.
                    </p>
                    <a 
                      href="tel:+911234567890"
                      className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
                    >
                      <FiPhone className="w-4 h-4 mr-2" />
                      Emergency: +91 123 456 7890
                    </a>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Additional Info */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">About Just Becho Support</h3>
                <p className="text-gray-600">
                  Our support team is dedicated to providing timely and effective solutions to all customer inquiries. 
                  We value your feedback and are committed to improving your experience on our platform.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Business Partnerships</h3>
                <p className="text-gray-600">
                  Join our network of verified sellers and expand your business reach. We offer competitive rates, 
                  secure transactions, and dedicated support for our business partners.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}