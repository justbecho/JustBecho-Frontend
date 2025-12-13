// app/shipping-policy/page.js
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function ShippingPolicyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-40">
        {/* Hero Section - Full Width */}
        <section className="w-full bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-widest uppercase mb-4">
                SHIPPING & DELIVERY POLICY
              </h1>
              <div className="bg-blue-800 inline-block px-6 py-2 rounded-lg mt-4">
                <p className="text-blue-100 text-lg">Last Updated: {currentDate}</p>
              </div>
              <p className="text-blue-200 mt-6 max-w-3xl mx-auto text-lg">
                Transparent and reliable shipping process for your peace of mind. This policy outlines our delivery timelines and procedures.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section - Full Width */}
        <section className="w-full py-16">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Important Notice Box */}
              <div className="mb-12 bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xl">🚚</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-green-800 font-bold text-lg mb-2">
                      SHIPPING NOTICE
                    </p>
                    <p className="text-green-700">
                      This Shipping & Delivery Policy describes how <span className="font-semibold">Just Becho</span> ("Company", "our", or "us") manages the shipping and delivery process for all orders placed through our platform. We ensure secure, step-by-step shipping to guarantee authenticity, safety, and a seamless buying experience.
                    </p>
                    <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded">
                      <p className="text-green-800 font-semibold">
                        ⚡ Estimated delivery timelines are provided for your convenience. Actual delivery may vary based on location and unforeseen circumstances.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar - Navigation */}
                <div className="lg:col-span-1">
                  <div className="sticky top-32 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Quick Navigation</h3>
                    <div className="space-y-2">
                      {[
                        { id: 'section1', title: '1. Shipping Process Overview' },
                        { id: 'section2', title: '2. Seller Dispatch (2-3 Days)' },
                        { id: 'section3', title: '3. Transit to Warehouse (3-4 Days)' },
                        { id: 'section4', title: '4. Authentication (Becho Protect)' },
                        { id: 'section5', title: '5. Final Dispatch (1-2 Days)' },
                        { id: 'section6', title: '6. Order Tracking' },
                        { id: 'section7', title: '7. Estimated Delivery Time' },
                        { id: 'section8', title: '8. Delivery Areas' },
                        { id: 'section9', title: '9. Shipping Charges' },
                        { id: 'section10', title: '10. Failed Deliveries' },
                        { id: 'section11', title: '11. International Shipping' },
                        { id: 'section12', title: '12. Contact Information' }
                      ].map((section) => (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          className="block text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 p-2 rounded transition-colors"
                        >
                          {section.title}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                  <div className="space-y-12">
                    {/* Section 1: Shipping Process Overview */}
                    <div id="section1" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          1
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Shipping Process Overview</h2>
                      </div>
                      
                      <div className="space-y-8">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold">📦</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Our Step-by-Step Shipping Process</h3>
                          </div>
                          <p className="text-gray-700 mb-6">
                            At JustBecho, we follow a secure, step-by-step shipping process to ensure authenticity, safety, and a seamless buying experience. Each order goes through multiple checkpoints to maintain our quality standards.
                          </p>
                          
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                            <p className="text-blue-800 font-semibold mb-2">Key Principles:</p>
                            <ul className="list-disc pl-6 text-blue-700 space-y-2">
                              <li>Secure handling at every stage</li>
                              <li>Verification of product authenticity (with Becho Protect)</li>
                              <li>Real-time tracking updates</li>
                              <li>Quality assurance checks</li>
                              <li>Professional packaging</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Seller Dispatch */}
                    <div id="section2" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          2
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">1. Seller Dispatch</h2>
                      </div>
                      
                      <div className="space-y-8">
                        <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-bold">🎁</span>
                            </div>
                            <h3 className="text-xl font-bold text-green-800">Initial Processing by Seller</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-gray-700 mb-4">
                                Once an order is placed, the seller is notified immediately. The seller is responsible for preparing the product for shipping.
                              </p>
                              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Order confirmation and verification</li>
                                <li>Product preparation and packaging</li>
                                <li>Quality check by seller</li>
                                <li>Labeling and documentation</li>
                              </ul>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center">
                                  <span className="text-green-600">⏱️</span>
                                </div>
                                <h4 className="font-bold text-green-800">Dispatch Timeline</h4>
                              </div>
                              <div className="text-center p-3 bg-white rounded border border-green-200">
                                <p className="text-2xl font-bold text-green-600">2-3</p>
                                <p className="text-green-700">Working Days</p>
                              </div>
                              <p className="text-green-700 text-sm mt-3">
                                Seller must dispatch within this timeframe
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-yellow-600">⚠️</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-yellow-800 font-semibold mb-2">Important:</p>
                              <p className="text-yellow-700">
                                If the seller fails to dispatch within 3 working days, you will receive a notification and the option to cancel the order for a full refund.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Transit to Warehouse */}
                    <div id="section3" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          3
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">2. Transit to JustBecho Warehouse</h2>
                      </div>
                      
                      <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold">🏭</span>
                          </div>
                          <h3 className="text-xl font-bold text-blue-800">Secure Transportation</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-gray-700 mb-4">
                              The product travels from the seller's location to our authorized warehouse facilities for further processing.
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Secure transportation via partnered logistics</li>
                              <li>Real-time tracking during transit</li>
                              <li>Handling by trained personnel</li>
                              <li>Insurance coverage for high-value items</li>
                            </ul>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center">
                                <span className="text-blue-600">⏳</span>
                              </div>
                              <h4 className="font-bold text-blue-800">Transit Timeline</h4>
                            </div>
                            <div className="text-center p-3 bg-white rounded border border-blue-200">
                              <p className="text-2xl font-bold text-blue-600">3-4</p>
                              <p className="text-blue-700">Working Days</p>
                            </div>
                            <div className="mt-3 text-sm">
                              <p className="text-blue-700 mb-1">Dependent on:</p>
                              <ul className="list-disc pl-5 text-blue-700 space-y-1">
                                <li>Seller's location</li>
                                <li>Shipping method</li>
                                <li>Weather conditions</li>
                                <li>Logistics partner efficiency</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="text-xl mb-2">📍</div>
                            <p className="font-bold text-gray-800">Distance Based</p>
                            <p className="text-gray-600 text-sm">Timeline varies by location</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="text-xl mb-2">🛡️</div>
                            <p className="font-bold text-gray-800">Secure Handling</p>
                            <p className="text-gray-600 text-sm">Professional logistics partners</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded">
                            <div className="text-xl mb-2">📊</div>
                            <p className="font-bold text-gray-800">Real-time Updates</p>
                            <p className="text-gray-600 text-sm">Track transit status</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Authentication & Quality Check */}
                    <div id="section4" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          4
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">3. Authentication & Quality Check (Becho Protect)</h2>
                      </div>
                      
                      <div className="bg-white border border-purple-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-bold">✅</span>
                          </div>
                          <h3 className="text-xl font-bold text-purple-800">Verification Process</h3>
                        </div>
                        
                        <div className="mb-6">
                          <p className="text-gray-700 mb-4">
                            If you have opted for Becho Protect, our expert team performs a thorough authenticity and condition verification upon receipt at our warehouse.
                          </p>
                          
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
                            <p className="font-bold text-purple-800 mb-3">Verification Checklist:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-green-600 text-sm">✓</span>
                                </div>
                                <span className="text-purple-700">Authenticity verification</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-green-600 text-sm">✓</span>
                                </div>
                                <span className="text-purple-700">Condition assessment</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-green-600 text-sm">✓</span>
                                </div>
                                <span className="text-purple-700">Functionality testing</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-green-600 text-sm">✓</span>
                                </div>
                                <span className="text-purple-700">Documentation review</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center">
                                <span className="text-green-600">🎯</span>
                              </div>
                              <h4 className="font-bold text-green-800">With Becho Protect</h4>
                            </div>
                            <ul className="list-disc pl-6 text-green-700 space-y-2">
                              <li>Comprehensive authenticity check</li>
                              <li>Quality assurance certification</li>
                              <li>Condition verification report</li>
                              <li>Full refund if verification fails</li>
                            </ul>
                          </div>
                          
                          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-600">⚡</span>
                              </div>
                              <h4 className="font-bold text-gray-800">Without Becho Protect</h4>
                            </div>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Basic visual inspection only</li>
                              <li>No authenticity guarantee</li>
                              <li>Faster processing time</li>
                              <li>Direct dispatch to buyer</li>
                            </ul>
                          </div>
                        </div>

                        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600">⚠️</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-red-800 font-semibold mb-2">Important Notice:</p>
                              <p className="text-red-700">
                                Without Becho Protect, we cannot guarantee product authenticity. All risks related to product authenticity and condition are borne by the buyer when this service is not selected.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 5: Final Dispatch to Buyer */}
                    <div id="section5" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          5
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">4. Final Dispatch to Buyer</h2>
                      </div>
                      
                      <div className="bg-white border border-indigo-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-bold">🚀</span>
                          </div>
                          <h3 className="text-xl font-bold text-indigo-800">Last Mile Delivery</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-gray-700 mb-4">
                              After successful verification (or directly if Becho Protect is not opted), the product is professionally packaged and dispatched to you.
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Professional packaging for protection</li>
                              <li>Final quality check before dispatch</li>
                              <li>Secure sealing and labeling</li>
                              <li>Handover to logistics partner</li>
                            </ul>
                          </div>
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 bg-indigo-200 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600">⚡</span>
                              </div>
                              <h4 className="font-bold text-indigo-800">Dispatch Timeline</h4>
                            </div>
                            <div className="text-center p-3 bg-white rounded border border-indigo-200">
                              <p className="text-2xl font-bold text-indigo-600">1-2</p>
                              <p className="text-indigo-700">Working Days</p>
                            </div>
                            <p className="text-indigo-700 text-sm mt-3 text-center">
                              After verification completion
                            </p>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-bold text-gray-800 mb-3">Packaging Standards:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-gray-50 rounded">
                              <div className="text-xl mb-2">📦</div>
                              <p className="font-bold text-gray-800">Secure Packaging</p>
                              <p className="text-gray-600 text-sm">Multiple protection layers</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded">
                              <div className="text-xl mb-2">🏷️</div>
                              <p className="font-bold text-gray-800">Proper Labeling</p>
                              <p className="text-gray-600 text-sm">Clear shipping labels</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded">
                              <div className="text-xl mb-2">🔒</div>
                              <p className="font-bold text-gray-800">Tamper-evident</p>
                              <p className="text-gray-600 text-sm">Sealed for security</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 6: Order Tracking */}
                    <div id="section6" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          6
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">5. Order Tracking</h2>
                      </div>
                      
                      <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-bold">📱</span>
                          </div>
                          <h3 className="text-xl font-bold text-green-800">Real-time Tracking Updates</h3>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <p className="text-gray-700 mb-4">
                              Tracking details are shared with you as soon as your order is shipped from our warehouse. You can monitor your order at every stage.
                            </p>
                            
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                              <p className="font-bold text-green-800 mb-3">Tracking Information Includes:</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 text-sm">📊</span>
                                  </div>
                                  <span className="text-green-700">Real-time location updates</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 text-sm">📅</span>
                                  </div>
                                  <span className="text-green-700">Estimated delivery date</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 text-sm">👤</span>
                                  </div>
                                  <span className="text-green-700">Delivery agent details</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 text-sm">📞</span>
                                  </div>
                                  <span className="text-green-700">Contact information</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600">📧</span>
                                </div>
                                <h4 className="font-bold text-blue-800">Notification Methods</h4>
                              </div>
                              <ul className="list-disc pl-6 text-blue-700 space-y-2">
                                <li>Email updates at each stage</li>
                                <li>SMS notifications for key updates</li>
                                <li>In-app notifications</li>
                                <li>WhatsApp updates (if opted)</li>
                              </ul>
                            </div>
                            
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center">
                                  <span className="text-purple-600">🔍</span>
                                </div>
                                <h4 className="font-bold text-purple-800">Track Your Order</h4>
                              </div>
                              <ul className="list-disc pl-6 text-purple-700 space-y-2">
                                <li>Website tracking portal</li>
                                <li>Mobile app tracking</li>
                                <li>Direct carrier links</li>
                                <li>Customer support assistance</li>
                              </ul>
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                  <span className="text-yellow-600">💡</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-yellow-800 font-semibold mb-2">Pro Tip:</p>
                                <p className="text-yellow-700">
                                  Download our mobile app for the best tracking experience with push notifications and real-time updates on the go.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 7: Estimated Delivery Time */}
                    <div id="section7" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          7
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Estimated Delivery Time</h2>
                      </div>
                      
                      <div className="space-y-8">
                        {/* With Becho Protect */}
                        <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-bold">✅</span>
                            </div>
                            <h3 className="text-xl font-bold text-green-800">With Becho Protect</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-gray-700 mb-4">
                                Orders with Becho Protect undergo thorough verification ensuring authenticity and quality. This adds a safety layer to your purchase.
                              </p>
                              <div className="bg-green-50 p-3 rounded">
                                <p className="text-green-800 font-semibold">Includes:</p>
                                <ul className="list-disc pl-6 text-green-700 space-y-1 mt-2">
                                  <li>Full authenticity verification</li>
                                  <li>Quality condition check</li>
                                  <li>Functionality testing</li>
                                  <li>Certification of authenticity</li>
                                </ul>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-6">
                                <div className="text-4xl font-bold text-green-600 mb-2">7-10</div>
                                <div className="text-green-700 font-semibold">Working Days</div>
                                <p className="text-green-600 text-sm mt-2">Approximate delivery timeline</p>
                              </div>
                              <div className="mt-4 text-sm text-gray-600">
                                <p>From order confirmation to delivery</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Without Becho Protect */}
                        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-bold">⚡</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Without Becho Protect</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-gray-700 mb-4">
                                Orders without Becho Protect skip the verification process, resulting in faster delivery but without authenticity guarantee.
                              </p>
                              <div className="bg-red-50 p-3 rounded">
                                <p className="text-red-800 font-semibold">Important Notice:</p>
                                <p className="text-red-700 text-sm mt-1">
                                  No guarantee of authenticity or condition verification. All risks related to product authenticity are borne by the buyer.
                                </p>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="bg-gradient-to-r from-gray-100 to-slate-100 rounded-lg p-6">
                                <div className="text-4xl font-bold text-gray-600 mb-2">5-7</div>
                                <div className="text-gray-700 font-semibold">Working Days</div>
                                <p className="text-gray-600 text-sm mt-2">Approximate delivery timeline</p>
                              </div>
                              <div className="mt-4 text-sm text-gray-600">
                                <p>Shorter timeline due to skipped verification</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Factors Affecting Delivery */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600">📊</span>
                            </div>
                            <h3 className="text-xl font-bold text-blue-800">Factors Affecting Delivery Timeline</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="list-disc pl-6 text-blue-700 space-y-2">
                              <li>Seller's location and dispatch time</li>
                              <li>Shipping destination</li>
                              <li>Weather conditions and natural events</li>
                              <li>Logistics partner efficiency</li>
                            </ul>
                            <ul className="list-disc pl-6 text-blue-700 space-y-2">
                              <li>Customs clearance (if applicable)</li>
                              <li>Public holidays and weekends</li>
                              <li>Product category and size</li>
                              <li>Verification complexity (with Becho Protect)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 8: Delivery Areas */}
                    <div id="section8" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          8
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Delivery Areas</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold">📍</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">Service Coverage</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="text-center mb-3">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-green-600 text-xl">🏙️</span>
                              </div>
                            </div>
                            <h4 className="font-bold text-green-800 text-center mb-2">Metro Cities</h4>
                            <p className="text-green-700 text-sm text-center">
                              Delivery within 5-7 days (with Becho Protect: 7-10 days)
                            </p>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-center mb-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-blue-600 text-xl">🏘️</span>
                              </div>
                            </div>
                            <h4 className="font-bold text-blue-800 text-center mb-2">Tier 2 & 3 Cities</h4>
                            <p className="text-blue-700 text-sm text-center">
                              Delivery within 7-12 days (with Becho Protect: 10-15 days)
                            </p>
                          </div>
                          
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="text-center mb-3">
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-purple-600 text-xl">🏕️</span>
                              </div>
                            </div>
                            <h4 className="font-bold text-purple-800 text-center mb-2">Remote Areas</h4>
                            <p className="text-purple-700 text-sm text-center">
                              Delivery within 10-15 days (with Becho Protect: 15-20 days)
                            </p>
                          </div>
                        </div>

                        <div className="mt-6">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                  <span className="text-yellow-600">💡</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-yellow-800 font-semibold mb-2">Delivery Check:</p>
                                <p className="text-yellow-700">
                                  Enter your PIN code during checkout to see exact delivery timelines for your location. Delivery estimates may vary based on your specific address.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 9: Shipping Charges */}
                    <div id="section9" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          9
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Shipping Charges</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-green-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center">
                                  <span className="text-green-600">🎁</span>
                                </div>
                                <h4 className="font-bold text-green-800">Free Shipping</h4>
                              </div>
                              <ul className="list-disc pl-6 text-green-700 space-y-2">
                                <li>Orders above ₹999</li>
                                <li>Applicable on select products</li>
                                <li>Standard delivery only</li>
                                <li>Exclusions may apply</li>
                              </ul>
                            </div>
                            
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600">💰</span>
                                </div>
                                <h4 className="font-bold text-blue-800">Shipping Charges</h4>
                              </div>
                              <ul className="list-disc pl-6 text-blue-700 space-y-2">
                                <li>Based on product weight & size</li>
                                <li>Location dependent</li>
                                <li>Displayed at checkout</li>
                                <li>Transparent pricing</li>
                              </ul>
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                  <span className="text-yellow-600">⚡</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-yellow-800 font-semibold mb-2">Express Delivery:</p>
                                <p className="text-yellow-700">
                                  Available at additional charges for faster delivery. Express delivery options and charges are displayed during checkout based on your location.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                  <span className="text-red-600">⚠️</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-red-800 font-semibold mb-2">Important:</p>
                                <p className="text-red-700">
                                  Shipping charges are non-refundable except in cases where the order is cancelled by JustBecho due to unavailability or other issues on our end.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 10: Failed Deliveries */}
                    <div id="section10" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          10
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Failed Deliveries & Return to Origin</h2>
                      </div>
                      
                      <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-bold">🚫</span>
                          </div>
                          <h3 className="text-xl font-bold text-red-800">Delivery Attempts & Procedures</h3>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-bold text-gray-800 mb-3">Delivery Attempts:</h4>
                              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Three delivery attempts will be made</li>
                                <li>Attempts on consecutive working days</li>
                                <li>Advance notification before each attempt</li>
                                <li>Flexible rescheduling options</li>
                              </ul>
                            </div>
                            
                            <div className="bg-red-50 p-4 rounded-lg">
                              <h4 className="font-bold text-red-800 mb-3">Reasons for Failed Delivery:</h4>
                              <ul className="list-disc pl-6 text-red-700 space-y-2">
                                <li>Incorrect address</li>
                                <li>Recipient unavailable</li>
                                <li>Refusal to accept delivery</li>
                                <li>Incomplete documentation</li>
                              </ul>
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-yellow-600 font-bold">1</span>
                                </div>
                                <div>
                                  <p className="font-bold text-yellow-800 mb-1">After Failed Attempts</p>
                                  <p className="text-yellow-700">Package returns to nearest hub for 5 days</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-yellow-600 font-bold">2</span>
                                </div>
                                <div>
                                  <p className="font-bold text-yellow-800 mb-1">Customer Contact</p>
                                  <p className="text-yellow-700">Our team contacts you for alternative arrangements</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-yellow-600 font-bold">3</span>
                                </div>
                                <div>
                                  <p className="font-bold text-yellow-800 mb-1">Return to Origin</p>
                                  <p className="text-yellow-700">If unresolved, item returns to seller after 7 days</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                  <span className="text-red-600">💸</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-red-800 font-semibold mb-2">Return to Origin Charges:</p>
                                <p className="text-red-700">
                                  If the order returns to the seller due to failed delivery attempts, the shipping charges will not be refunded. Any additional return shipping charges may be deducted from your refund amount.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 11: International Shipping */}
                    <div id="section11" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          11
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">International Shipping</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold">🌍</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">Global Delivery Options</h3>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-blue-800 font-semibold mb-2">Currently Available For:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="bg-white p-2 rounded text-center">
                                <p className="font-bold text-blue-800">USA</p>
                              </div>
                              <div className="bg-white p-2 rounded text-center">
                                <p className="font-bold text-blue-800">UK</p>
                              </div>
                              <div className="bg-white p-2 rounded text-center">
                                <p className="font-bold text-blue-800">UAE</p>
                              </div>
                              <div className="bg-white p-2 rounded text-center">
                                <p className="font-bold text-blue-800">Canada</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-bold text-gray-800 mb-3">International Delivery Timeline:</h4>
                              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>10-15 working days for standard shipping</li>
                                <li>5-7 working days for express shipping</li>
                                <li>Customs clearance additional 2-3 days</li>
                                <li>Weekends and holidays excluded</li>
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-bold text-gray-800 mb-3">Additional Considerations:</h4>
                              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Customs duties and taxes extra</li>
                                <li>Import restrictions may apply</li>
                                <li>Documentation requirements vary</li>
                                <li>Shipping charges calculated at checkout</li>
                              </ul>
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                  <span className="text-yellow-600">⚠️</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-yellow-800 font-semibold mb-2">Important for International Orders:</p>
                                <p className="text-yellow-700">
                                  International shipping is currently available only for select products. Check product page for international shipping availability. Customers are responsible for all customs duties, taxes, and import fees in their country.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 12: Contact Information */}
                    <div id="section12" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          12
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                      </div>
                      
                      <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-blue-600 text-2xl">📞</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-6">For shipping inquiries, delivery updates, or complaints:</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-blue-600">📧</span>
                              </div>
                              <p className="font-bold text-blue-800 mb-1">Email</p>
                              <p className="text-blue-600 text-lg">shipping@justbecho.com</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-blue-600">📱</span>
                              </div>
                              <p className="font-bold text-blue-800 mb-1">Support Number</p>
                              <p className="text-blue-600 text-lg">+91-93018-47748</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="text-center p-3 bg-gray-50 rounded">
                              <div className="text-xl mb-2">⏰</div>
                              <p className="font-bold text-gray-800">Support Hours</p>
                              <p className="text-gray-600 text-sm">9 AM - 7 PM, Monday-Saturday</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded">
                              <div className="text-xl mb-2">📝</div>
                              <p className="font-bold text-gray-800">Live Chat</p>
                              <p className="text-gray-600 text-sm">Available on website & app</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded">
                              <div className="text-xl mb-2">✉️</div>
                              <p className="font-bold text-gray-800">Response Time</p>
                              <p className="text-gray-600 text-sm">Within 24 hours</p>
                            </div>
                          </div>
                          
                          <div className="mt-8 p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-lg">
                            <p className="font-bold text-lg mb-2">Thank you for choosing Just Becho</p>
                            <p className="text-blue-100">
                              We are committed to providing you with reliable shipping and delivery services for a seamless shopping experience.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-gray-200 gap-4">
                <Link 
                  href="/privacy-policy" 
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <span>←</span> Privacy Policy
                </Link>
                <div className="flex items-center gap-4">
                  <Link 
                    href="/terms/seller-terms" 
                    className="text-blue-600 hover:text-blue-800 font-semibold px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Seller Terms
                  </Link>
                  <Link 
                    href="/contact" 
                    className="text-blue-600 hover:text-blue-800 font-semibold px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}