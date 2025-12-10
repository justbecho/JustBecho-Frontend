// app/contact-us/page.jsx
'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiMessageSquare, 
  FiSend, 
  FiCheckCircle, 
  FiUser, 
  FiBriefcase, 
  FiGlobe,
  FiClock,
  FiChevronRight,
  FiInstagram,
  FiLinkedin,
  FiTwitter,
  FiPhoneCall,
  FiMessageCircle
} from 'react-icons/fi'
import { AiOutlineWhatsApp } from 'react-icons/ai'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [activeFAQ, setActiveFAQ] = useState(null)

  const contactInfo = [
    {
      icon: <FiMail className="w-7 h-7" />,
      title: "Customer Support",
      description: "For queries, complaints, or assistance with orders",
      email: "support@justbecho.com",
      phone: "+91 98765 43210",
      responseTime: "Within 24 hours",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-100"
    },
    {
      icon: <FiBriefcase className="w-7 h-7" />,
      title: "Business Partnerships",
      description: "To connect or become a bulk seller with us",
      email: "connect@justbecho.com",
      phone: "+91 98765 43211",
      responseTime: "Within 48 hours",
      gradient: "from-emerald-500 to-teal-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
      borderColor: "border-emerald-100"
    },
    {
      icon: <FiGlobe className="w-7 h-7" />,
      title: "General Inquiries",
      description: "For all other business-related communications",
      email: "info@justbecho.com",
      phone: "+91 98765 43212",
      responseTime: "Within 24 hours",
      gradient: "from-purple-500 to-indigo-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50",
      borderColor: "border-purple-100"
    }
  ]

  const faqs = [
    {
      question: "How long does it take to get a response?",
      answer: "We typically respond within 24 hours on business days. For urgent matters, please call our support number or use the WhatsApp button below."
    },
    {
      question: "What information should I include in my message?",
      answer: "Please include your order ID (if applicable), a clear description of your query, and any relevant screenshots or documents to help us assist you better."
    },
    {
      question: "How do I become a bulk seller on Just Becho?",
      answer: "Email us at connect@justbecho.com with your business details, product catalog, and expected volume. Our partnership team will contact you within 2 business days."
    },
    {
      question: "What are your business hours?",
      answer: "Our customer support is available Monday to Saturday from 9 AM to 8 PM. For urgent issues, we have 24/7 emergency support."
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
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 20) {
      newErrors.message = 'Message should be at least 20 characters'
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
      
      // In production, call your API here
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      })
      
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

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index)
  }

  return (
    <>
      <Header />
      
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-200 to-transparent rounded-full filter blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-cyan-200 to-transparent rounded-full filter blur-3xl opacity-30" />
        
        <main className="relative min-h-screen pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Hero Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200 mb-6">
                <span className="text-sm font-medium text-blue-700 uppercase tracking-wider">
                  Contact Us
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Connect</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Get in touch with our team. We're here to help you with any questions, 
                support needs, or partnership opportunities.
              </p>
            </div>

            {/* Success Message */}
            {isSubmitted && (
              <div className="max-w-2xl mx-auto mb-8 animate-fade-in">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 flex items-start shadow-lg">
                  <FiCheckCircle className="w-7 h-7 text-green-500 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-green-800 font-semibold text-lg">Message Sent Successfully!</p>
                    <p className="text-green-600 mt-1">Our team will get back to you within 24 hours. We've sent a confirmation email to {formData.email}.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Cards Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mb-16">
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className={`${info.bgColor} border ${info.borderColor} rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group relative overflow-hidden`}
                >
                  {/* Gradient Accent */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${info.gradient}`} />
                  
                  <div className="relative">
                    {/* Icon with Gradient Background */}
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${info.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {info.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{info.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{info.description}</p>
                    
                    <div className="space-y-4">
                      {/* Email */}
                      <div className="flex items-start group/email cursor-pointer" 
                           onClick={() => navigator.clipboard.writeText(info.email)}>
                        <div className="p-2 bg-white rounded-lg shadow-sm mr-4">
                          <FiMail className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                          <p className="text-gray-900 font-semibold group-hover/email:text-blue-600 transition-colors">
                            {info.email}
                          </p>
                        </div>
                      </div>
                      
                      {/* Phone */}
                      <div className="flex items-start">
                        <div className="p-2 bg-white rounded-lg shadow-sm mr-4">
                          <FiPhone className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                          <p className="text-gray-900 font-semibold">{info.phone}</p>
                        </div>
                      </div>
                      
                      {/* Response Time */}
                      <div className="flex items-start">
                        <div className="p-2 bg-white rounded-lg shadow-sm mr-4">
                          <FiClock className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-500 mb-1">Response Time</p>
                          <p className="text-gray-900 font-semibold">{info.responseTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white mr-4">
                      <FiMessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Send a Message</h2>
                      <p className="text-gray-600 mt-1">Fill out the form below and we'll get back to you soon</p>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <span className="flex items-center">
                          <FiUser className="w-4 h-4 mr-2" />
                          Full Name *
                        </span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 animate-shake">{errors.name}</p>
                      )}
                    </div>
                    
                    {/* Email Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
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
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${
                          errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 animate-shake">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <span className="flex items-center">
                        <FiPhone className="w-4 h-4 mr-2" />
                        Phone Number *
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                      }`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 animate-shake">{errors.phone}</p>
                    )}
                  </div>
                  
                  {/* Category Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 appearance-none hover:border-blue-400 bg-white"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="support">Customer Support</option>
                        <option value="seller">Seller Inquiry</option>
                        <option value="business">Business Partnership</option>
                        <option value="technical">Technical Issue</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                      <FiChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  {/* Subject Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 ${
                        errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                      }`}
                      placeholder="What is this regarding?"
                    />
                    {errors.subject && (
                      <p className="text-sm text-red-600 animate-shake">{errors.subject}</p>
                    )}
                  </div>
                  
                  {/* Message Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 resize-none ${
                        errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                      }`}
                      placeholder="Please describe your query in detail..."
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600 animate-shake">{errors.message}</p>
                    )}
                  </div>
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] ${
                      isSubmitting 
                        ? 'bg-gradient-to-r from-blue-400 to-cyan-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 hover:shadow-xl active:scale-[0.98]'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5 mr-3" />
                        Send Message
                      </>
                    )}
                  </button>
                  
                  {errors.submit && (
                    <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-center">{errors.submit}</p>
                    </div>
                  )}
                </form>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Office Info */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="p-8 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white mr-4">
                        <FiMapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Our Office</h2>
                        <p className="text-gray-600 mt-1">Visit us or send mail</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Registered Office</h3>
                        <div className="flex items-start">
                          <FiMapPin className="w-5 h-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-gray-700 leading-relaxed">
                              123 Business District, Sector 45<br />
                              Gurugram, Haryana - 122001<br />
                              India
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">Monday - Friday</span>
                            <span className="font-semibold text-gray-900">9:00 AM - 6:00 PM</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">Saturday</span>
                            <span className="font-semibold text-gray-900">10:00 AM - 4:00 PM</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">Sunday</span>
                            <span className="font-semibold text-gray-900 text-red-500">Closed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Support */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Support</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <a 
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-200 group"
                    >
                      <div className="p-3 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 mb-4 group-hover:scale-110 transition-transform">
                        <AiOutlineWhatsApp className="w-8 h-8 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-900">WhatsApp</span>
                      <span className="text-sm text-gray-500 mt-1">Instant Chat</span>
                    </a>
                    
                    <a 
                      href="tel:+919876543210"
                      className="bg-white rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-200 group"
                    >
                      <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 mb-4 group-hover:scale-110 transition-transform">
                        <FiPhoneCall className="w-8 h-8 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-900">Call Now</span>
                      <span className="text-sm text-gray-500 mt-1">24/7 Support</span>
                    </a>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="p-8 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {faqs.map((faq, index) => (
                      <div 
                        key={index}
                        className={`p-6 transition-all duration-300 cursor-pointer hover:bg-gray-50 ${
                          activeFAQ === index ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => toggleFAQ(index)}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 pr-8">{faq.question}</h3>
                          <FiChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                            activeFAQ === index ? 'transform rotate-90' : ''
                          }`} />
                        </div>
                        <div className={`mt-3 overflow-hidden transition-all duration-300 ${
                          activeFAQ === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Connect With Us</h2>
                  
                  <div className="flex space-x-4">
                    {[
                      { icon: <FiInstagram className="w-6 h-6" />, color: 'from-pink-500 to-rose-500', label: 'Instagram' },
                      { icon: <FiTwitter className="w-6 h-6" />, color: 'from-sky-500 to-blue-500', label: 'Twitter' },
                      { icon: <FiLinkedin className="w-6 h-6" />, color: 'from-blue-600 to-blue-700', label: 'LinkedIn' },
                    ].map((social, index) => (
                      <a
                        key={index}
                        href="#"
                        className={`flex-1 bg-gradient-to-r ${social.color} text-white rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:opacity-90`}
                      >
                        {social.icon}
                        <span className="text-sm font-medium mt-2">{social.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Banner */}
            <div className="mt-16 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 rounded-2xl border border-red-200 p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex-1 mb-6 md:mb-0 md:mr-8">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white mr-4">
                      <FiMessageCircle className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Urgent Support Needed?
                    </h2>
                  </div>
                  <p className="text-gray-600 text-lg max-w-2xl">
                    For immediate assistance with critical issues, use our emergency contact channels.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="tel:+911122334455" 
                    className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center"
                  >
                    <FiPhone className="w-5 h-5 mr-3" />
                    Emergency Call
                  </a>
                  <a 
                    href="mailto:emergency@justbecho.com" 
                    className="bg-white text-gray-900 border-2 border-red-200 font-semibold py-3 px-8 rounded-xl hover:bg-red-50 transition-all duration-300 flex items-center justify-center"
                  >
                    <FiMail className="w-5 h-5 mr-3" />
                    Emergency Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-40 group"
      >
        <AiOutlineWhatsApp className="w-7 h-7" />
        <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat on WhatsApp
        </span>
      </a>

      {/* Add to global.css or tailwind.config.js */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  )
}