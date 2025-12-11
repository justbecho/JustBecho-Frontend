// app/contact-us/page.jsx
'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
      alert('Please fill all fields')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      setIsSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
      
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Simple Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Contact Us</h1>
            <p className="text-gray-600">Get in touch with our team</p>
          </div>

          {/* Simple Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Left - Contact Info */}
            <div className="space-y-6">
              
              {/* Support Email */}
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-medium text-gray-900 mb-2">Customer Support</h3>
                <p className="text-sm text-gray-500 mb-3">For order queries and assistance</p>
                <a 
                  href="mailto:support@justbecho.com"
                  className="text-blue-600 hover:text-blue-800"
                >
                  support@justbecho.com
                </a>
              </div>
              
              {/* Business Email */}
              <div className="border border-gray-200 rounded-lg p-5">
                <h3 className="font-medium text-gray-900 mb-2">Business & Bulk Selling</h3>
                <p className="text-sm text-gray-500 mb-3">For partnerships and bulk selling</p>
                <a 
                  href="mailto:connect@justbecho.com"
                  className="text-green-600 hover:text-green-800"
                >
                  connect@justbecho.com
                </a>
              </div>
              
              {/* Simple Info */}
              <div className="border border-gray-200 rounded-lg p-5">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">+91 98765 43210</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">Gurugram, India</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Response Time</p>
                    <p className="font-medium">Within 24 hours</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right - Contact Form */}
            <div className="border border-gray-200 rounded-lg p-6">
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Message Sent</h3>
                  <p className="text-gray-600">We'll get back to you soon.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Send us a message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 rounded-lg font-medium text-white ${
                        isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
              
            </div>

          </div>

          {/* Simple Info at Bottom */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Need immediate help? Call us at <a href="tel:+911234567890" className="text-blue-600 font-medium">+91 123 456 7890</a>
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </>
  )
}