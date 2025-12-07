// app/privacy-policy/page.js
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function PrivacyPolicyPage() {
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
                PRIVACY POLICY
              </h1>
              <div className="bg-blue-800 inline-block px-6 py-2 rounded-lg mt-4">
                <p className="text-blue-100 text-lg">Last Updated: {currentDate}</p>
              </div>
              <p className="text-blue-200 mt-6 max-w-3xl mx-auto text-lg">
                Protecting your privacy is our priority. This policy explains how we collect, use, and protect your data.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section - Full Width */}
        <section className="w-full py-16">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Important Notice Box */}
              <div className="mb-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xl">🔒</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-blue-800 font-bold text-lg mb-2">
                      PRIVACY NOTICE
                    </p>
                    <p className="text-blue-700">
                      This Privacy Notice describes how <span className="font-semibold">Just Becho</span> ("Company", "our", or "us") as an e-commerce intermediary between buyers and sellers, collects, uses, stores, shares, and protects your personal data in compliance with the <span className="font-semibold">Digital Personal Data Protection Act, 2023 (DPDPA)</span> and its Rules.
                    </p>
                    <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded">
                      <p className="text-blue-800 font-semibold">
                        ⚠️ By using our platform, you agree to the practices described in this Privacy Notice.
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
                        { id: 'section1', title: '1. Data We Collect' },
                        { id: 'section2', title: '2. Why We Collect Data' },
                        { id: 'section3', title: '3. Data Retention' },
                        { id: 'section4', title: '4. Third-Party Sharing' },
                        { id: 'section5', title: '5. International Transfer' },
                        { id: 'section6', title: '6. Your Rights (DPDPA)' },
                        { id: 'section7', title: '7. Exercise Your Rights' },
                        { id: 'section8', title: '8. Data Breach Notification' },
                        { id: 'section9', title: '9. Grievance Redressal' },
                        { id: 'section10', title: '10. Governing Law' },
                        { id: 'section11', title: '11. Updates to Policy' },
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
                    {/* Section 1: Data We Collect */}
                    <div id="section1" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          1
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">What Kind of Data We Collect?</h2>
                      </div>
                      
                      <div className="space-y-8">
                        {/* Buyers Data */}
                        <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-bold">A</span>
                            </div>
                            <h3 className="text-xl font-bold text-green-800">Data Collected From Buyers</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Full name</li>
                              <li>Email address</li>
                              <li>Phone number</li>
                              <li>Delivery address and location</li>
                            </ul>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Payment details (handled by Goquik)</li>
                              <li>Device data, IP address</li>
                              <li>Cookies, analytics, browser metadata</li>
                            </ul>
                          </div>
                        </div>

                        {/* Sellers Data */}
                        <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold">B</span>
                            </div>
                            <h3 className="text-xl font-bold text-blue-800">Data Collected From Sellers</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Name</li>
                              <li>Email address</li>
                              <li>Phone number</li>
                            </ul>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Business address/location</li>
                              <li>Device and IP data</li>
                            </ul>
                          </div>
                        </div>

                        {/* Platform Interactions */}
                        <div className="bg-white border border-purple-200 rounded-lg p-6 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-bold">C</span>
                            </div>
                            <h3 className="text-xl font-bold text-purple-800">Data Collected Through Platform Interactions</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-3 bg-purple-50 rounded">
                              <p className="font-semibold text-purple-800">Customer Support</p>
                              <p className="text-purple-700 text-sm">Messages and queries</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded">
                              <p className="font-semibold text-purple-800">Feedback</p>
                              <p className="text-purple-700 text-sm">Reviews and complaints</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded">
                              <p className="font-semibold text-purple-800">Analytics</p>
                              <p className="text-purple-700 text-sm">Cookies and usage data</p>
                            </div>
                          </div>
                        </div>

                        {/* Additional Data */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-gray-600">📊</span>
                            </div>
                            <div>
                              <p className="text-gray-700">
                                <span className="font-semibold">Other data collected:</span> Sales data, transaction history, order details, product images, product specifications, etc., to provide seamless services.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Why We Collect Data */}
                    <div id="section2" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          2
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Why Do We Collect Such Data?</h2>
                      </div>
                      
                      <div className="space-y-8">
                        {/* For Buyers */}
                        <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-bold">A</span>
                            </div>
                            <h3 className="text-xl font-bold text-green-800">For Buyers</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Create and maintain accounts</li>
                              <li>Process, manage, and deliver orders</li>
                              <li>Share delivery details with logistics partners</li>
                              <li>Securely process payments through Goquik</li>
                            </ul>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Provide order confirmations and updates</li>
                              <li>Enhance platform features and user experience</li>
                              <li>Comply with legal, taxation, and regulatory obligations</li>
                              <li>Customer support and service improvements</li>
                            </ul>
                          </div>
                        </div>

                        {/* For Sellers */}
                        <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold">B</span>
                            </div>
                            <h3 className="text-xl font-bold text-blue-800">For Sellers</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Register and verify seller accounts</li>
                              <li>Enable product listings and catalog management</li>
                              <li>Process orders and facilitate deliveries</li>
                              <li>Settle payments for sales</li>
                            </ul>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Ensure policy compliance and prevent fraud</li>
                              <li>Communicate operational updates</li>
                              <li>Meet statutory and regulatory requirements</li>
                              <li>Performance analytics and reporting</li>
                            </ul>
                          </div>
                        </div>

                        {/* For All Users */}
                        <div className="bg-white border border-purple-200 rounded-lg p-6 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-bold">C</span>
                            </div>
                            <h3 className="text-xl font-bold text-purple-800">For All Users</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-purple-50 rounded">
                              <p className="font-semibold text-purple-800 mb-2">Platform Integrity</p>
                              <p className="text-purple-700 text-sm">Prevent misuse and ensure security</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded">
                              <p className="font-semibold text-purple-800 mb-2">Auditing & Records</p>
                              <p className="text-purple-700 text-sm">Maintain records for compliance</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded">
                              <p className="font-semibold text-purple-800 mb-2">Service Improvement</p>
                              <p className="text-purple-700 text-sm">Enhance features and user experience</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Data Retention */}
                    <div id="section3" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          3
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Data Retention & Storage</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="mb-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-xl">⏳</span>
                            </div>
                            <div>
                              <p className="text-gray-700 font-semibold">
                                We retain your personal data <span className="text-blue-600">for as long as your account remains active</span> on Just Becho.
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                            <p className="text-yellow-800 font-bold mb-2">Post-Account Deletion Retention:</p>
                            <p className="text-yellow-700">
                              After account deletion or deactivation, we may continue to retain your data for <span className="font-semibold">one year or more</span>, only for:
                            </p>
                            <ul className="list-disc pl-6 text-yellow-700 space-y-1 mt-2">
                              <li>Legal compliance requirements</li>
                              <li>Tax and regulatory purposes</li>
                              <li>Enforcement of contractual obligations</li>
                              <li>Fraud detection or dispute resolution</li>
                            </ul>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-gray-800 mb-4">Storage Infrastructure</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <div className="text-2xl mb-2">🌐</div>
                              <p className="font-bold text-blue-800">Netlify</p>
                              <p className="text-blue-700 text-sm">Hosting infrastructure</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <div className="text-2xl mb-2">🗄️</div>
                              <p className="font-bold text-green-800">MongoDB</p>
                              <p className="text-green-700 text-sm">Database storage</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                              <div className="text-2xl mb-2">🌍</div>
                              <p className="font-bold text-purple-800">GoDaddy</p>
                              <p className="text-purple-700 text-sm">Domain services</p>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                            <p className="text-green-700">
                              Strict access controls and technical safeguards are applied to all stored data.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Third-Party Sharing */}
                    <div id="section4" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          4
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">When Do We Share Data With Third Parties?</h2>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                          <p className="text-gray-700 mb-6">
                            We only share personal data when necessary for service functioning:
                          </p>
                          
                          {/* Payment Gateway */}
                          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 font-bold">A</span>
                              </div>
                              <h3 className="text-lg font-bold text-green-800">Payment Gateway</h3>
                            </div>
                            <div className="ml-11">
                              <p className="font-semibold text-gray-800 mb-2">Goquik</p>
                              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                                <li>For processing buyer payments and seller settlements</li>
                                <li>Receives transaction-related personal data</li>
                                <li>
                                  <span className="font-semibold">Note:</span> We do not store credit/debit card or bank details. Goquik may directly store the same to facilitate transactions.
                                </li>
                              </ul>
                            </div>
                          </div>

                          {/* Logistics Partners */}
                          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-bold">B</span>
                              </div>
                              <h3 className="text-lg font-bold text-blue-800">Delivery & Logistics Partners</h3>
                            </div>
                            <div className="ml-11">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                <div className="bg-white p-2 rounded text-center">
                                  <p className="font-semibold text-blue-800">Bluedart</p>
                                </div>
                                <div className="bg-white p-2 rounded text-center">
                                  <p className="font-semibold text-blue-800">Delhivery</p>
                                </div>
                                <div className="bg-white p-2 rounded text-center">
                                  <p className="font-semibold text-blue-800">Local Couriers</p>
                                </div>
                              </div>
                              <p className="text-gray-700">
                                Receive name, address, and contact information for shipping purposes.
                              </p>
                            </div>
                          </div>

                          {/* Hosting Partners */}
                          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-purple-600 font-bold">C</span>
                              </div>
                              <h3 className="text-lg font-bold text-purple-800">Hosting & Infrastructure Partners</h3>
                            </div>
                            <div className="ml-11">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                <div className="bg-white p-2 rounded text-center">
                                  <p className="font-semibold text-purple-800">Netlify</p>
                                </div>
                                <div className="bg-white p-2 rounded text-center">
                                  <p className="font-semibold text-purple-800">MongoDB</p>
                                </div>
                                <div className="bg-white p-2 rounded text-center">
                                  <p className="font-semibold text-purple-800">GoDaddy</p>
                                </div>
                              </div>
                              <p className="text-gray-700">
                                May receive limited access to data only for operation, hosting, or storage purposes.
                              </p>
                            </div>
                          </div>

                          {/* Legal Authorities */}
                          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 font-bold">D</span>
                              </div>
                              <h3 className="text-lg font-bold text-red-800">Legal or Governmental Authorities</h3>
                            </div>
                            <div className="ml-11">
                              <ul className="list-disc pl-6 text-red-700 space-y-1">
                                <li>When required under law</li>
                                <li>For fraud investigations</li>
                                <li>Compliance requirements</li>
                                <li>Court orders</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Important Notice */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 text-xl">⚠️</span>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-red-800 mb-4">Important Notice Regarding Third-Party Policies & Liability</h3>
                              <div className="space-y-4">
                                <p className="text-red-700">
                                  All third parties that receive your data operate under <span className="font-semibold">their own independent Terms & Conditions and Privacy Policies</span>.
                                </p>
                                <div className="bg-red-100 border border-red-300 rounded p-4">
                                  <p className="text-red-800 font-bold">
                                    You are strongly advised to review their policies on their respective websites.
                                  </p>
                                </div>
                                <div className="bg-red-100 border border-red-300 rounded p-4">
                                  <p className="text-red-800 font-bold">
                                    Just Becho shall not be liable for:
                                  </p>
                                  <ul className="list-disc pl-6 text-red-700 space-y-1 mt-2">
                                    <li>Any data breach or unauthorized access occurring on part of third-party service providers</li>
                                    <li>Any misuse of data governed by third-party contractual terms</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 5: International Data Transfer */}
                    <div id="section5" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          5
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">International Data Transfer</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-xl">🌍</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-700 mb-4">
                              Data stored or processed on Netlify or MongoDB servers may be located outside India.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <p className="text-blue-800 font-bold mb-2">Such transfers are conducted only in compliance with DPDPA requirements:</p>
                              <ul className="list-disc pl-6 text-blue-700 space-y-1">
                                <li>Adequate security safeguards</li>
                                <li>Contractual commitments ensuring protection</li>
                                <li>Restricted access to authorized personnel</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 6: Your Rights */}
                    <div id="section6" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          6
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Your Rights Under the Digital Personal Data Protection Act, 2023</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="p-4 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-green-600 font-bold">A</span>
                                </div>
                                <h3 className="font-bold text-green-800">Right to Access</h3>
                              </div>
                              <p className="text-green-700">Request details of personal data collected and processed.</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-bold">B</span>
                                </div>
                                <h3 className="font-bold text-blue-800">Right to Correction</h3>
                              </div>
                              <p className="text-blue-700">Request updates or correction of inaccurate or incomplete data.</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                  <span className="text-purple-600 font-bold">C</span>
                                </div>
                                <h3 className="font-bold text-purple-800">Right to Erasure</h3>
                              </div>
                              <p className="text-purple-700">Request deletion of personal data when no longer required.</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="p-4 bg-yellow-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                                  <span className="text-yellow-600 font-bold">D</span>
                                </div>
                                <h3 className="font-bold text-yellow-800">Right to Withdraw Consent</h3>
                              </div>
                              <p className="text-yellow-700">Withdraw consent for processing that relies on your consent.</p>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                  <span className="text-red-600 font-bold">E</span>
                                </div>
                                <h3 className="font-bold text-red-800">Right to Grievance Redressal</h3>
                              </div>
                              <p className="text-red-700">File complaints for concerns regarding data handling.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 7: Exercise Your Rights */}
                    <div id="section7" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          7
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">How to Exercise Your Rights</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-xl">📧</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-700 mb-4">
                              You may contact us with your request using the details below:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="font-bold text-blue-800 mb-1">Email</p>
                                <p className="text-blue-600 text-lg">support@justbecho.com</p>
                              </div>
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="font-bold text-blue-800 mb-1">Phone</p>
                                <p className="text-blue-600 text-lg">+91-93018-47748</p>
                              </div>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <p className="text-yellow-800 font-semibold mb-2">Response Timeline:</p>
                              <p className="text-yellow-700">
                                We will respond within <span className="font-bold">30 days</span> as per DPDPA guidelines.
                              </p>
                            </div>
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                              <p className="text-red-700">
                                <span className="font-semibold">Note:</span> Exercise of certain rights may affect services provided to you and may restrict your access to the platform or result in account deletion.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 8: Data Breach Notification */}
                    <div id="section8" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          8
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Data Breach Notification</h2>
                      </div>
                      
                      <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-red-600 text-xl">🚨</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-700 mb-4">
                              In the event of a personal data breach affecting your data, <span className="font-semibold">Just Becho will notify you within 72 hours</span>, in compliance with the DPDPA.
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <p className="text-red-800 font-bold mb-3">The notification will include:</p>
                              <ul className="list-disc pl-6 text-red-700 space-y-2">
                                <li>Nature of the breach</li>
                                <li>Data affected</li>
                                <li>Possible consequences</li>
                                <li>Steps taken to mitigate risks</li>
                                <li>Measures you may take for protection</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 9: Grievance Redressal */}
                    <div id="section9" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          9
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Grievance Redressal Mechanism</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600 font-bold">1</span>
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 mb-1">Submit Complaint</p>
                              <p className="text-gray-700">Use our support email or contact form to file your complaint.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600 font-bold">2</span>
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 mb-1">Acknowledgement</p>
                              <p className="text-gray-700">Grievance Officer will acknowledge within <span className="font-semibold">5 working days</span>.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600 font-bold">3</span>
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 mb-1">Resolution</p>
                              <p className="text-gray-700">Full resolution provided within <span className="font-semibold">30–45 days</span>.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600 font-bold">4</span>
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 mb-1">Escalation</p>
                              <p className="text-gray-700">If dissatisfied, escalate to the <span className="font-semibold">Data Protection Board of India</span>.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 10: Governing Law */}
                    <div id="section10" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          10
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Governing Law and Jurisdiction</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-blue-600">⚖️</span>
                            </div>
                            <p className="font-bold text-blue-800 text-center">Governing Law</p>
                            <p className="text-blue-700 text-center text-sm mt-1">Laws of India</p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-blue-600">📜</span>
                            </div>
                            <p className="font-bold text-blue-800 text-center">DPDPA 2023</p>
                            <p className="text-blue-700 text-center text-sm mt-1">Digital Personal Data Protection Act</p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-blue-600">🏛️</span>
                            </div>
                            <p className="font-bold text-blue-800 text-center">Jurisdiction</p>
                            <p className="text-blue-700 text-center text-sm mt-1">Courts in Indore, Madhya Pradesh</p>
                          </div>
                        </div>
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-700 text-center">
                            This Privacy Notice and all matters relating to data processing are governed by the laws of India, DPDPA 2023, and applicable Rules and guidelines. Any dispute shall be subject to the exclusive jurisdiction of the courts located in Indore, Madhya Pradesh.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Section 11: Updates */}
                    <div id="section11" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          11
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Updates to This Privacy Notice</h2>
                      </div>
                      
                      <div className="bg-white border border-yellow-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-yellow-600 text-xl">🔄</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-700 mb-4">
                              We may modify or update this Privacy Notice from time to time.
                            </p>
                            <div className="mb-6">
                              <p className="font-bold text-gray-800 mb-3">Changes will be communicated through:</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-yellow-50 p-3 rounded">
                                  <p className="font-semibold text-yellow-800">Website Notifications</p>
                                  <p className="text-yellow-700 text-sm">Prominent website alerts</p>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded">
                                  <p className="font-semibold text-yellow-800">Email Alerts</p>
                                  <p className="text-yellow-700 text-sm">Direct communication to registered users</p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <p className="text-red-700">
                                <span className="font-semibold">Note:</span> If you wish to opt-out after such changes, you may do so. However, it may affect the services we provide to you and your access to our Platform.
                              </p>
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
                          <h3 className="text-xl font-bold text-gray-900 mb-6">For questions, clarifications, or complaints related to data protection:</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-blue-600">📧</span>
                              </div>
                              <p className="font-bold text-blue-800 mb-1">Email</p>
                              <p className="text-blue-600 text-lg">support@justbecho.com</p>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-blue-600">📱</span>
                              </div>
                              <p className="font-bold text-blue-800 mb-1">Support Number</p>
                              <p className="text-blue-600 text-lg">+91-93018-47748</p>
                            </div>
                          </div>
                          
                          <div className="mt-8 p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-lg">
                            <p className="font-bold text-lg mb-2">Thank you for trusting Just Becho</p>
                            <p className="text-blue-100">
                              We are committed to protecting your privacy and ensuring the security of your personal data.
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
                  href="/terms/buyer-terms" 
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <span>←</span> Buyer Terms & Conditions
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