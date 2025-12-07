// app/terms/seller-terms/page.js
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function SellerTermsPage() {
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
        <section className="w-full bg-gradient-to-r from-gray-900 to-black text-white">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-widest uppercase mb-4">
                SELLER TERMS & CONDITIONS
              </h1>
              <div className="bg-gray-800 inline-block px-6 py-2 rounded-lg mt-4">
                <p className="text-gray-300 text-lg">Last Updated: {currentDate}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section - Full Width */}
        <section className="w-full py-16">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Introduction Box */}
              <div className="mb-12 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <p className="text-blue-800 font-bold text-lg mb-2">
                  SELLER TERMS & CONDITIONS
                </p>
                <p className="text-blue-700">
                  These Seller Terms & Conditions ("Terms") govern your ("Seller") use of the Company's online e-commerce platform ("Platform") <span className="font-semibold">justbecho.com</span>, operated by House of DK ("Company"). By creating a Seller Account, listing Products, or using any services on the Platform, you agree to be bound by these Terms.
                </p>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar - Navigation */}
                <div className="lg:col-span-1">
                  <div className="sticky top-32 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Quick Navigation</h3>
                    <div className="space-y-2">
                      {[
                        { id: 'section1', title: '1. DEFINITIONS' },
                        { id: 'section2', title: '2. ACCOUNT CREATION' },
                        { id: 'section3', title: '3. WHAT YOU MAY LIST' },
                        { id: 'section4', title: '4. LISTING REQUIREMENTS' },
                        { id: 'section5', title: '5. PRICING POLICY' },
                        { id: 'section6', title: '6. SHIPPING & PACKAGING' },
                        { id: 'section7', title: '7. BECHO PROTECT' },
                        { id: 'section8', title: '8. PAYMENTS' },
                        { id: 'section9', title: '9. FEEDBACK SYSTEM' },
                        { id: 'section10', title: '10. CODE OF CONDUCT' },
                        { id: 'section11', title: '11. INTELLECTUAL PROPERTY' },
                        { id: 'section12', title: '12. PROHIBITED ACTIVITIES' },
                        { id: 'section13', title: '13. LIABILITY & INDEMNITY' },
                        { id: 'section14', title: '14. VIOLATIONS & PENALTIES' },
                        { id: 'section15', title: '15. DISPUTES & COOPERATION' },
                        { id: 'section16', title: '16. GRIEVANCE REDRESSAL' },
                        { id: 'section17', title: '17. GOVERNING LAW' },
                        { id: 'section18', title: '18. MODIFICATIONS' },
                        { id: 'section19', title: '19. ACCEPTANCE' }
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
                    {/* Section 1: DEFINITIONS */}
                    <div id="section1" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          1
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">DEFINITIONS</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { term: 'Seller', desc: 'Any individual or entity that lists, markets, or sells Products on the Platform after creating a Seller Account.' },
                            { term: 'Buyer', desc: 'Any individual or entity purchasing Products listed on the Platform.' },
                            { term: 'Manufacturer', desc: 'The original producer or brand owner of a Product.' },
                            { term: 'Product', desc: 'Any item listed by the Seller on the Platform.' },
                            { term: 'Minimum Price', desc: 'The base price fixed and uploaded by the Seller for a Product.' },
                            { term: 'Listing Fee', desc: 'The additional price added by the Company to the Minimum Price to arrive at the final selling price.' },
                            { term: 'Final Price', desc: 'Minimum Price + Company\'s Listing Fee.' },
                            { term: 'Becho Protect', desc: 'The Company\'s buyer-selected authenticity and inspection service.' },
                            { term: 'Company Warehouse', desc: 'The location where Products are inspected and processed.' }
                          ].map((item, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <p className="font-bold text-gray-800 mb-1">{item.term}</p>
                              <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Section 2: SELLER ACCOUNT CREATION */}
                    <div id="section2" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          2
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">SELLER ACCOUNT CREATION</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-blue-600 text-xl">✅</span>
                            </div>
                            <p className="font-bold text-gray-800">Admin Verification</p>
                            <p className="text-gray-600 text-sm mt-1">Mandatory Admin verification required</p>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-blue-600 text-xl">🔒</span>
                            </div>
                            <p className="font-bold text-gray-800">Data Protection</p>
                            <p className="text-gray-600 text-sm mt-1">All data governed by Privacy Policy</p>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-blue-600 text-xl">📝</span>
                            </div>
                            <p className="font-bold text-gray-800">Accurate Information</p>
                            <p className="text-gray-600 text-sm mt-1">Account information must be accurate and updated</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: WHAT YOU MAY LIST */}
                    <div id="section3" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          3
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">WHAT YOU MAY LIST</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Allowed Items */}
                        <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-bold">✓</span>
                            </div>
                            <h3 className="text-xl font-bold text-green-800">Allowed</h3>
                          </div>
                          <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>100% brand-new, original Products</li>
                            <li>Pre-owned Products with accurate grading</li>
                            <li>Products with original manufacturer marks intact</li>
                          </ul>
                          <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <p className="text-green-700 text-sm">
                              Grading: New / Like New / Excellent / Good / Fair
                            </p>
                          </div>
                        </div>

                        {/* Not Allowed Items */}
                        <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-red-600 font-bold">✗</span>
                            </div>
                            <h3 className="text-xl font-bold text-red-800">Not Allowed</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <ul className="list-disc pl-6 text-red-700 space-y-2">
                              <li>Counterfeit items</li>
                              <li>Stolen goods</li>
                              <li>Adult content</li>
                            </ul>
                            <ul className="list-disc pl-6 text-red-700 space-y-2">
                              <li>Weapons</li>
                              <li>Cars/bikes</li>
                              <li>Illegal items</li>
                            </ul>
                          </div>
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-red-700 font-bold">
                              ⚠️ Listing prohibited items may result in immediate account termination and legal action.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: LISTING REQUIREMENTS */}
                    <div id="section4" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          4
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">LISTING REQUIREMENTS</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-bold text-gray-800 mb-4">Seller Must:</h3>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Upload real, clear, unedited photos</li>
                              <li>Provide honest and complete descriptions</li>
                              <li>Ensure Product condition is accurate</li>
                              <li>Ensure full legal ownership</li>
                              <li>Match listing and description exactly</li>
                              <li>Keep stock updated</li>
                              <li>Not misrepresent or conceal information</li>
                            </ul>
                          </div>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800 font-bold mb-2">⚠️ Consequences:</p>
                            <ul className="list-disc pl-6 text-yellow-700 space-y-1">
                              <li>Account suspension</li>
                              <li>Penalties</li>
                              <li>Blacklisting</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 5: PRICING POLICY */}
                    <div id="section5" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          5
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">PRICING POLICY</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="font-bold text-gray-800 mb-1">Minimum Price</p>
                            <p className="text-gray-600 text-sm">Set by Seller</p>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="font-bold text-gray-800 mb-1">+ Listing Fee</p>
                            <p className="text-gray-600 text-sm">Added by Company</p>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="font-bold text-gray-800 mb-1">= Final Price</p>
                            <p className="text-gray-600 text-sm">Visible to buyers</p>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-yellow-800 font-semibold">
                            Seller has no rights or claims over the Company's Listing Fee.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Section 6: SHIPPING & PACKAGING */}
                    <div id="section6" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          6
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">SHIPPING & PACKAGING OBLIGATIONS</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-green-50 rounded-lg">
                              <h4 className="font-bold text-green-800 mb-2">✅ Must Do</h4>
                              <ul className="list-disc pl-6 text-green-700 space-y-1">
                                <li>Pack as per guidelines</li>
                                <li>Record packaging video</li>
                                <li>Use Company-provided label</li>
                                <li>Hand over to authorized partner</li>
                              </ul>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg">
                              <h4 className="font-bold text-red-800 mb-2">❌ Must Not</h4>
                              <ul className="list-disc pl-6 text-red-700 space-y-1">
                                <li>Include Seller logos</li>
                                <li>Add business cards</li>
                                <li>Include branding</li>
                                <li>Contact Buyer directly</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700 font-bold">
                              ⚠️ Late, incorrect, or unsafe packaging may result in penalties or order cancellation.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 7: BECHO PROTECT */}
                    <div id="section7" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          7
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">BECHO PROTECT – INSPECTION RULES</h2>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-bold text-green-800 mb-4">✅ If Product Passes Inspection</h3>
                            <ul className="list-disc pl-6 text-green-700 space-y-2">
                              <li>Product moves forward for delivery</li>
                              <li>Payment processed after buyer receipt</li>
                            </ul>
                          </div>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-xl font-bold text-red-800 mb-4">❌ If Product Fails Inspection</h3>
                            <ul className="list-disc pl-6 text-red-700 space-y-2">
                              <li>Buyer gets full refund</li>
                              <li>Seller receives no payment</li>
                              <li>Item returned to Seller at Seller's cost</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow-sm">
                          <p className="text-yellow-800 font-semibold mb-4">
                            ⚠️ If Buyer does NOT choose Becho Protect, Seller is still responsible for truthful and legal listings.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-white p-3 rounded text-center">
                              <p className="text-red-700 font-semibold">Blacklisting</p>
                            </div>
                            <div className="bg-white p-3 rounded text-center">
                              <p className="text-red-700 font-semibold">Penalties</p>
                            </div>
                            <div className="bg-white p-3 rounded text-center">
                              <p className="text-red-700 font-semibold">Account termination</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 8: PAYMENTS */}
                    <div id="section8" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          8
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">PAYMENTS</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="text-center mb-6">
                          <p className="text-gray-700 text-lg font-semibold">
                            Payments released within <span className="text-green-600 font-bold">7-14 days</span> of:
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="bg-green-50 p-6 rounded-lg text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-green-600 text-xl">✓</span>
                            </div>
                            <p className="font-bold text-green-800">Product passes inspection, or</p>
                          </div>
                          <div className="bg-green-50 p-6 rounded-lg text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-green-600 text-xl">📦</span>
                            </div>
                            <p className="font-bold text-green-800">Buyer receiving the Product,</p>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-yellow-800 font-semibold text-center">
                            Whichever is later, provided there are no disputes. If disputes arise, payments may be delayed or cancelled.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Section 9: FEEDBACK SYSTEM */}
                    <div id="section9" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          9
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">BUYER FEEDBACK SYSTEM</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-bold text-gray-800 mb-4">Seller Agreement</h3>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Not manipulate, influence, or misuse feedback</li>
                              <li>Accept legitimate buyer ratings</li>
                              <li>Cooperate with feedback resolution</li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 mb-4">Company Rights</h3>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>May remove abusive/fraudulent feedback</li>
                              <li>May reduce visibility for poor ratings</li>
                              <li>May suspend accounts for feedback manipulation</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 10: CODE OF CONDUCT */}
                    <div id="section10" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          10
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">SELLER CODE OF CONDUCT</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600">✓</span>
                              </div>
                              <h3 className="font-bold text-gray-800">Must Do</h3>
                            </div>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Act honestly and responsibly</li>
                              <li>Fulfill orders promptly and accurately</li>
                              <li>Comply with all Indian laws</li>
                            </ul>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600">✗</span>
                              </div>
                              <h3 className="font-bold text-gray-800">Must Not</h3>
                            </div>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Contact or solicit Buyers</li>
                              <li>Engage in fraud or misrepresentation</li>
                              <li>Use misleading advertising</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 11: INTELLECTUAL PROPERTY */}
                    <div id="section11" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          11
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">INTELLECTUAL PROPERTY (IP)</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                          <h3 className="text-xl font-bold text-green-800 mb-4">Seller's IP</h3>
                          <p className="text-gray-700">
                            Seller grants the Company a non-exclusive, royalty-free, worldwide license to use Seller's Product photos, descriptions, and content for Platform operations.
                          </p>
                        </div>
                        <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
                          <h3 className="text-xl font-bold text-red-800 mb-4">Company's IP</h3>
                          <p className="text-gray-700 mb-4">
                            Seller must NOT use the Company's:
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-red-50 p-2 rounded text-center">
                              <p className="text-red-700 font-semibold text-sm">Logos</p>
                            </div>
                            <div className="bg-red-50 p-2 rounded text-center">
                              <p className="text-red-700 font-semibold text-sm">Trademarks</p>
                            </div>
                            <div className="bg-red-50 p-2 rounded text-center">
                              <p className="text-red-700 font-semibold text-sm">Branding</p>
                            </div>
                            <div className="bg-red-50 p-2 rounded text-center">
                              <p className="text-red-700 font-semibold text-sm">Copyrights</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 12: PROHIBITED ACTIVITIES */}
                    <div id="section12" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          12
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">PROHIBITED ACTIVITIES</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <ul className="list-disc pl-6 text-red-700 space-y-2">
                              <li>Sell illegal or restricted items</li>
                              <li>Operate multiple accounts without permission</li>
                              <li>Manipulate prices or feedback</li>
                              <li>Attempt to divert Buyers off the Platform</li>
                            </ul>
                          </div>
                          <div>
                            <ul className="list-disc pl-6 text-red-700 space-y-2">
                              <li>Share personal details with Buyers</li>
                              <li>Abuse, threaten, or harass any Buyer or staff</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 13: LIABILITY & INDEMNITY */}
                    <div id="section13" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          13
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">LIABILITY & INDEMNITY</h2>
                      </div>
                      
                      <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
                        <div className="mb-6">
                          <h3 className="font-bold text-gray-800 mb-4">Seller is fully responsible for:</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="list-disc pl-6 text-red-700 space-y-2">
                              <li>Authenticity</li>
                              <li>Description accuracy</li>
                              <li>Legal ownership and title</li>
                            </ul>
                            <ul className="list-disc pl-6 text-red-700 space-y-2">
                              <li>Compliance with law</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800">
                              • The Company is not liable for any action of Seller or Buyer.
                            </p>
                          </div>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800">
                              • Company's liability does not exceed Listing Fee received for that Product.
                            </p>
                          </div>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 font-bold mb-2">
                              • Seller shall indemnify the Company against:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <ul className="list-disc pl-6 text-red-700 space-y-1">
                                <li>Misrepresentation</li>
                                <li>Fake/illegal goods</li>
                                <li>IP violations</li>
                              </ul>
                              <ul className="list-disc pl-6 text-red-700 space-y-1">
                                <li>Consumer complaints</li>
                                <li>Breach of Terms</li>
                                <li>Unauthorized sales</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 14: VIOLATIONS & PENALTIES */}
                    <div id="section14" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          14
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">VIOLATIONS, PENALTIES & BLACKLISTING</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="mb-6">
                          <h3 className="font-bold text-gray-800 mb-4">Account suspension/termination if:</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="list-disc pl-6 text-red-700 space-y-2">
                              <li>Repeated inspection failures</li>
                              <li>Fraud or misrepresentation</li>
                              <li>Illegal Products listed</li>
                            </ul>
                            <ul className="list-disc pl-6 text-red-700 space-y-2">
                              <li>Refusal to cooperate in disputes</li>
                              <li>Breach of packaging/pricing rules</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-red-700 font-bold">
                            ⚠️ Company may impose monetary fines for serious violations and Seller agrees to pay the same.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Section 15: DISPUTES & COOPERATION */}
                    <div id="section15" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          15
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">DISPUTES & COOPERATION</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-xl">🤝</span>
                            </div>
                          </div>
                          <div>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Seller must cooperate in resolving disputes raised by Buyers</li>
                              <li>Providing false information or refusing cooperation may result in immediate termination</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 16: GRIEVANCE REDRESSAL */}
                    <div id="section16" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          16
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">GRIEVANCE REDRESSAL</h2>
                      </div>
                      
                      <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-blue-600 text-2xl">📧</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Support</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="font-bold text-blue-800 mb-1">Email</p>
                              <p className="text-blue-600">support@justbecho.com</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <p className="font-bold text-blue-800 mb-1">Response Time</p>
                              <p className="text-blue-600">Within 2-3 business days</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 17: GOVERNING LAW */}
                    <div id="section17" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          17
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">GOVERNING LAW & JURISDICTION</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="font-bold text-gray-800 mb-3">Governing Law</h3>
                            <p className="text-gray-700">These Terms shall be governed by the laws of India.</p>
                          </div>
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="font-bold text-gray-800 mb-3">Jurisdiction</h3>
                            <p className="text-gray-700">
                              Courts at Indore, Madhya Pradesh, shall have exclusive jurisdiction.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 18: MODIFICATIONS */}
                    <div id="section18" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          18
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">MODIFICATIONS</h2>
                      </div>
                      
                      <div className="bg-white border border-yellow-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-yellow-600 text-xl">📝</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-700 mb-3">
                              The Company may update these Terms from time to time.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <p className="text-yellow-800 font-semibold">
                                Continued use of the Platform constitutes acceptance of revised Terms.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 19: ACCEPTANCE */}
                    <div id="section19" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          19
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">ACCEPTANCE</h2>
                      </div>
                      
                      <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-gradient-to-r from-gray-900 to-black rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-white text-2xl">✓</span>
                          </div>
                          
                          <div className="bg-gradient-to-r from-gray-900 to-black text-white p-8 rounded-lg">
                            <p className="text-xl font-bold mb-4">By accepting these Terms, you shall:</p>
                            <div className="space-y-3">
                              <p>1. Agree to be legally bound by them</p>
                              <p>2. Form a legally binding contract with the Company</p>
                            </div>
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
                    href="/privacy-policy" 
                    className="text-blue-600 hover:text-blue-800 font-semibold px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Privacy Policy
                  </Link>
                  <Link 
                    href="/contact" 
                    className="text-blue-600 hover:text-blue-800 font-semibold px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Contact Support
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