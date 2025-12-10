// app/contact-us/page.jsx
'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { FiMail, FiPhone, FiMapPin, FiMessageSquare, FiSend, FiCheckCircle, FiUser, FiMail as FiEmailIcon, FiBriefcase, FiGlobe } from 'react-icons/fi'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const contactInfo = [
    {
      icon: <FiMail className="w-6 h-6" />,
      title: "Customer Support",
      description: "For queries, complaints, or assistance with orders",
      email: "support@justbecho.com",
      phone: "+91-XXXXXXXXXX",
      color: "bg-blue-50 border-blue-200 text-blue-700"
    },
    {
      icon: <FiBriefcase className="w-6 h-6" />,
      title: "Business & Partnerships",
      description: "To connect or become a bulk seller with us",
      email: "connect@justbecho.com",
      phone: "+91-XXXXXXXXXX",
      color: "bg-green-50 border-green-200 text-green-700"
    },
    {
      icon: <FiGlobe className="w-6 h-6" />,
      title: "General Inquiries",
      description: "For all other business-related communications",
      email: "info@justbecho.com",
      phone: "+91-XXXXXXXXXX",
      color: "bg-purple-50 border-purple-200 text-purple-700"
    }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
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
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message should be at least 10 characters'
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In real implementation, you would call your backend API here
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
        message: '',
        category: 'general'
      })
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
      
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ submit: 'Failed to send message. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email)
      .then(() => {
        alert('Email copied to clipboard!')
      })
      .catch(err => {
        console.error('Failed to copy:', err)
      })
  }

  return (
    <>
      <Header />
      
      <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get in <span className="text-gold">Touch</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're here to help! Whether you have questions about our platform, need support, 
              or want to explore partnership opportunities, reach out to us.
            </p>
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <FiCheckCircle className="w-6 h-6 text-green-500 mr-3" />
                <div>
                  <p className="text-green-800 font-medium">Message Sent Successfully!</p>
                  <p className="text-green-600 text-sm">We'll get back to you within 24 hours.</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className={`border-2 rounded-xl p-6 ${info.color} transition-transform duration-300 hover:scale-[1.02]`}
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-white shadow-sm mr-4">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{info.title}</h3>
                    <p className="text-sm opacity-75">{info.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center group cursor-pointer" onClick={() => handleCopyEmail(info.email)}>
                    <FiEmailIcon className="w-5 h-5 mr-3" />
                    <div>
                      <p className="text-sm opacity-75">Email</p>
                      <p className="font-medium group-hover:text-blue-600 transition-colors">{info.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FiPhone className="w-5 h-5 mr-3" />
                    <div>
                      <p className="text-sm opacity-75">Phone</p>
                      <p className="font-medium">{info.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="p-2 rounded-lg bg-blue-100 mr-4">
                  <FiMessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiUser className="inline w-4 h-4 mr-1" />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiEmailIcon className="inline w-4 h-4 mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Customer Support</option>
                    <option value="seller">Seller Inquiry</option>
                    <option value="business">Business Partnership</option>
                    <option value="technical">Technical Issue</option>
                    <option value="other">Other</option>
                  </select>
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
                    <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
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
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none ${
                      errors.message ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Please describe your query in detail..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
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
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white flex items-center justify-center transition-all duration-300 ${
                    isSubmitting 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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

            {/* Additional Information */}
            <div className="space-y-8">
              {/* Office Address */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-green-100 mr-4">
                    <FiMapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Our Office</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FiMapPin className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Registered Office</h3>
                      <p className="text-gray-600">
                        123 Business District, Sector 45<br />
                        Gurugram, Haryana - 122001<br />
                        India
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span className="font-medium">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span className="font-medium">10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span className="font-medium">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-4">
                  <details className="group border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                      <span>How long does it take to get a response?</span>
                      <span className="transition group-open:rotate-180">▼</span>
                    </summary>
                    <p className="mt-3 text-gray-600">
                      We typically respond within 24 hours on business days. For urgent matters, please call our support number.
                    </p>
                  </details>
                  
                  <details className="group border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                      <span>What information should I include in my message?</span>
                      <span className="transition group-open:rotate-180">▼</span>
                    </summary>
                    <p className="mt-3 text-gray-600">
                      Please include your order ID (if applicable), a clear description of your query, and any relevant screenshots or documents.
                    </p>
                  </details>
                  
                  <details className="group border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                      <span>How do I become a bulk seller on Just Becho?</span>
                      <span className="transition group-open:rotate-180">▼</span>
                    </summary>
                    <p className="mt-3 text-gray-600">
                      Email us at connect@justbecho.com with your business details, product catalog, and expected volume. Our partnership team will contact you within 2 business days.
                    </p>
                  </details>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect With Us</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Facebook', icon: '📘', color: 'bg-blue-100 hover:bg-blue-200' },
                    { name: 'Instagram', icon: '📷', color: 'bg-pink-100 hover:bg-pink-200' },
                    { name: 'Twitter', icon: '🐦', color: 'bg-sky-100 hover:bg-sky-200' },
                    { name: 'LinkedIn', icon: '💼', color: 'bg-blue-100 hover:bg-blue-200' }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`${social.color} border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-md hover:-translate-y-1`}
                    >
                      <span className="text-2xl mb-2">{social.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-gold to-yellow-500 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Need Immediate Assistance?
              </h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Call our dedicated support team for urgent queries. We're available 24/7 for critical issues.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="tel:+911234567890" 
                  className="bg-white text-gray-900 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                >
                  <FiPhone className="w-5 h-5 mr-2" />
                  Call Now: +91-123-456-7890
                </a>
                <a 
                  href="mailto:emergency@justbecho.com" 
                  className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors flex items-center"
                >
                  <FiMail className="w-5 h-5 mr-2" />
                  Emergency Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Add this CSS in your global.css or in a style tag */}
      <style jsx>{`
        .text-gold {
          color: #D4AF37;
        }
        
        details summary::-webkit-details-marker {
          display: none;
        }
        
        details[open] summary {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </>
  )
}