// app/terms/buyer-terms/page.js
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function BuyerTermsPage() {
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
                BUYER TERMS & CONDITIONS
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
                  JUSTBECHO.COM – BUYER TERMS & CONDITIONS
                </p>
                <p className="text-blue-700">
                  Welcome to JustBecho.com ("JustBecho", "we", "our", "platform"). JustBecho provides a secure online marketplace connecting buyers with verified independent sellers. These Buyer Terms & Conditions ("Terms") govern your ("Buyer/ you/ your") use of the Company's online e-commerce platform ("Platform") <span className="font-semibold">justbecho.com</span>, operated by House of DK ("Company"). By creating a Buyer Account or using any services on the Platform, you agree to be bound by these Terms.
                </p>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800 font-medium">⚠️ Please read these Terms carefully before placing any order.</p>
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
                        { id: 'section1', title: '1. INTRODUCTION' },
                        { id: 'section2', title: '2. TYPES OF PRODUCTS' },
                        { id: 'section3', title: '3. BUYER RESPONSIBILITY' },
                        { id: 'section4', title: '4. BECHO PROTECT' },
                        { id: 'section5', title: '5. REFUND & RETURN' },
                        { id: 'section6', title: '6. PAYMENT SAFETY' },
                        { id: 'section7', title: '7. SHIPPING & DELIVERY' },
                        { id: 'section8', title: '8. DISPUTE RESOLUTION' },
                        { id: 'section9', title: '9. LIABILITY' },
                        { id: 'section10', title: '10. VERIFICATION & SAFETY' },
                        { id: 'section11', title: '11. PROHIBITED ACTIVITIES' },
                        { id: 'section12', title: '12. FEEDBACK & REVIEWS' },
                        { id: 'section13', title: '13. INTELLECTUAL PROPERTY' },
                        { id: 'section14', title: '14. PRIVACY' },
                        { id: 'section15', title: '15. GOVERNING LAW' },
                        { id: 'section16', title: '16. MODIFICATIONS' },
                        { id: 'section17', title: '17. ACCEPTANCE' }
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
                    {/* Section 1: INTRODUCTION */}
                    <div id="section1" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          1
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">INTRODUCTION</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="text-gray-900 font-bold min-w-[30px]">1.1</span>
                            <p className="text-gray-700">
                              These Terms govern your use of the JustBecho platform and all purchases made through it.
                            </p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-gray-900 font-bold min-w-[30px]">1.2</span>
                            <p className="text-gray-700">
                              JustBecho acts solely as a marketplace facilitating transactions between Buyers and independent Sellers.
                            </p>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="text-gray-900 font-bold min-w-[30px]">1.3</span>
                            <p className="text-gray-700">
                              By creating an account or placing an order, you accept these Terms and the Privacy Policy.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: TYPES OF PRODUCTS */}
                    <div id="section2" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          2
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">TYPES OF PRODUCTS SOLD ON JUSTBECHO</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Brand New Products */}
                        <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                          <h3 className="text-xl font-bold text-green-800 mb-4">Brand-New Products</h3>
                          <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Labeled as "Brand New"</li>
                            <li>Completely unused</li>
                            <li>In original or equivalent packaging</li>
                            <li>Sold by independent businesses or verified sellers</li>
                          </ul>
                        </div>

                        {/* Pre-Owned Products */}
                        <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
                          <h3 className="text-xl font-bold text-blue-800 mb-4">Pre-Owned / Second-Hand Products</h3>
                          <p className="text-gray-700 mb-4">
                            Labeled as "Pre-Owned" or "Brand New Without Tags". Condition is seller-declared and categorized as:
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 p-3 rounded-lg text-center">
                              <p className="font-semibold text-gray-800">Brand New Without Tags</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg text-center">
                              <p className="font-semibold text-green-800">Excellent</p>
                            </div>
                            <div className="bg-yellow-50 p-3 rounded-lg text-center">
                              <p className="font-semibold text-yellow-800">Good</p>
                            </div>
                            <div className="bg-orange-50 p-3 rounded-lg text-center">
                              <p className="font-semibold text-orange-800">Fair</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-yellow-800 font-medium">
                          ⚠️ Buyers must carefully review all condition information before purchase.
                        </p>
                      </div>
                    </div>

                    {/* Section 3: PRODUCT INFORMATION */}
                    <div id="section3" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          3
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">PRODUCT INFORMATION & BUYER RESPONSIBILITY</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <p className="text-gray-700 mb-4 font-medium">Buyers are responsible for thoroughly reviewing:</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Product photos</li>
                            <li>Product videos (if provided)</li>
                            <li>Full descriptions</li>
                            <li>Defect disclosures</li>
                          </ul>
                          <ul className="list-disc pl-6 text-gray-700 space-y-2">
                            <li>Condition notes</li>
                            <li>Seller details</li>
                            <li>Manufacturer markings, serial numbers, or authenticity identifiers (if applicable)</li>
                          </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600">ℹ️</span>
                            </div>
                            <div>
                              <p className="text-blue-800 font-semibold">We care for our Buyers</p>
                              <p className="text-blue-700">
                                We verify all our Sellers. JustBecho is NOT responsible for misunderstandings arising from the Buyer's failure to read product details carefully.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: AUTHENTICATION & BECHO PROTECT */}
                    <div id="section4" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          4
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">AUTHENTICATION & BECHO PROTECT</h2>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                          <p className="text-gray-700 mb-4">
                            Becho Protect is an optional product authentication and inspection service.
                          </p>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700 font-semibold">
                              ⚠️ If you skip Becho Protect, you accept the product as-is (except watches, which include free checking).
                            </p>
                          </div>
                        </div>

                        {/* Pricing Table */}
                        <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                          <h3 className="text-xl font-bold text-green-800 mb-4">Becho Protect Pricing</h3>
                          <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-300">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">Product Category</th>
                                  <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">Price</th>
                                  <th className="py-3 px-4 border-b text-left text-gray-700 font-semibold">Details</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="py-3 px-4 border-b">Products below/equal to ₹15,000</td>
                                  <td className="py-3 px-4 border-b font-bold">₹499</td>
                                  <td className="py-3 px-4 border-b">Standard authentication</td>
                                </tr>
                                <tr>
                                  <td className="py-3 px-4 border-b">Products above ₹15,000</td>
                                  <td className="py-3 px-4 border-b font-bold">₹999</td>
                                  <td className="py-3 px-4 border-b">Premium authentication</td>
                                </tr>
                                <tr>
                                  <td className="py-3 px-4 border-b">Watches</td>
                                  <td className="py-3 px-4 border-b font-bold text-green-600">FREE</td>
                                  <td className="py-3 px-4 border-b">Always authenticated at no charge</td>
                                </tr>
                                <tr>
                                  <td className="py-3 px-4 border-b">Influencer collections</td>
                                  <td className="py-3 px-4 border-b font-bold">As mentioned</td>
                                  <td className="py-3 px-4 border-b">Charges as mentioned on listing page</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* What's Included */}
                        <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
                          <h3 className="text-xl font-bold text-blue-800 mb-4">What Becho Protect Includes</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Professional authentication by experts</li>
                              <li>Structural condition verification</li>
                              <li>Accuracy against listing check</li>
                            </ul>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Defects, replacements, or repairs inspection</li>
                              <li>Tampering detection</li>
                              <li>Completeness of accessories, tags, and packaging verification</li>
                            </ul>
                          </div>
                        </div>

                        {/* Outcomes */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm">
                            <h4 className="font-bold text-green-800 mb-3">✅ If Item Passes Inspection</h4>
                            <ul className="list-disc pl-6 text-green-700 space-y-1">
                              <li>It is shipped to the Buyer immediately</li>
                              <li>Authenticity certificate provided</li>
                              <li>Full buyer protection activated</li>
                            </ul>
                          </div>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
                            <h4 className="font-bold text-red-800 mb-3">❌ If Item Fails Inspection</h4>
                            <ul className="list-disc pl-6 text-red-700 space-y-1">
                              <li>Buyer gets 100% refund</li>
                              <li>Seller receives no payment</li>
                              <li>Product is returned to Seller</li>
                              <li>Order is automatically cancelled</li>
                            </ul>
                          </div>
                        </div>

                        {/* Without Becho Protect */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
                          <h3 className="text-xl font-bold text-red-800 mb-4">Purchases WITHOUT Becho Protect</h3>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <p className="text-gray-700 mb-3">If Buyer does NOT choose Becho Protect:</p>
                              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>No verification of authenticity</li>
                                <li>No condition check</li>
                                <li>Buyer accepts product as received</li>
                              </ul>
                            </div>
                            <div>
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-800 font-bold mb-2">JustBecho is NOT responsible for:</p>
                                <ul className="list-disc pl-6 text-yellow-700 space-y-1">
                                  <li>Counterfeits/Fake items</li>
                                  <li>Undisclosed damages</li>
                                  <li>Wrong items/Missing accessories</li>
                                  <li>Misrepresentation by Seller</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
                            <p className="text-red-700 font-bold">
                              ⚠️ Buyer assumes full responsibility for skipping Becho Protect (except watches).
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 5: REFUND & RETURN POLICY */}
                    <div id="section5" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          5
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">REFUND & RETURN POLICY</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-red-800 mb-4">All Sales Are Final</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-red-50 p-4 rounded-lg text-center">
                            <p className="font-bold text-red-700 text-lg">Non-refundable</p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg text-center">
                            <p className="font-bold text-red-700 text-lg">Non-returnable</p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg text-center">
                            <p className="font-bold text-red-700 text-lg">Non-exchangeable</p>
                          </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
                          <h3 className="text-xl font-bold text-green-800 mb-4">Exceptions (ONLY Under Becho Protect)</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-lg">
                              <p className="font-semibold text-gray-800 text-center">Item fails authentication</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                              <p className="font-semibold text-gray-800 text-center">Item is significantly misrepresented</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                              <p className="font-semibold text-gray-800 text-center">Item does not match seller's description</p>
                            </div>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-800 font-semibold">In such cases:</p>
                            <p className="text-blue-700">
                              Buyer receives a full refund provided it has provided an unpacking video of the Product upto the satisfaction of the Company.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 6: PAYMENT SAFETY */}
                    <div id="section6" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          6
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">PAYMENT SAFETY</h2>
                      </div>
                      
                      <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-bold text-gray-800 mb-4">Secure Payments</h3>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>PCI-compliant payment gateways</li>
                              <li>Buyer funds protected during disputes</li>
                              <li>Fraud detection and prevention</li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 mb-4">Third-Party Gateways</h3>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>May charge transaction fees</li>
                              <li>Have their own terms and privacy policy</li>
                              <li>Responsible for refunds in case of payment issues</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 7: SHIPPING & DELIVERY */}
                    <div id="section7" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          7
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">SHIPPING & DELIVERY</h2>
                      </div>
                      
                      <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-bold text-gray-800 mb-4">Delivery Information</h3>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Accurate shipping details required</li>
                              <li>Timelines depend on courier partners</li>
                              <li>Becho Protect orders: Additional inspection time</li>
                              <li>Tracking details shared when available</li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 mb-4">Important Notes</h3>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <p className="text-yellow-800 font-semibold">
                                Delays arising from courier partners or sellers are not the responsibility of JustBecho.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 8: DISPUTE RESOLUTION */}
                    <div id="section8" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          8
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">DISPUTE RESOLUTION</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-bold text-gray-800 mb-4">Process</h3>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Report issues within 24–48 hours of delivery</li>
                              <li>Support response within 72 hours</li>
                              <li>Becho Protect items: Inspection outcomes</li>
                              <li>Full cooperation required from Buyer</li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 mb-4">Consequences</h3>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <p className="text-red-800 font-bold mb-2">Failure to cooperate may result in:</p>
                              <ul className="list-disc pl-6 text-red-700 space-y-1">
                                <li>Claim rejection</li>
                                <li>Account suspension</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 9: LIABILITY */}
                    <div id="section9" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          9
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">LIABILITY</h2>
                      </div>
                      
                      <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
                        <p className="text-gray-700 mb-4 font-semibold text-center">
                          JustBecho acts solely as a marketplace.
                        </p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 font-bold mb-3">JustBecho is NOT responsible for:</p>
                            <ul className="list-disc pl-6 text-red-700 space-y-2">
                              <li>Authenticity of non-Becho Protect items</li>
                              <li>Condition discrepancies</li>
                              <li>Counterfeit goods</li>
                              <li>Functional defects</li>
                              <li>Missing accessories</li>
                            </ul>
                          </div>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 font-bold mb-3">Additional Exclusions:</p>
                            <ul className="list-disc pl-6 text-red-700 space-y-2">
                              <li>Misrepresentation by Sellers</li>
                              <li>Delayed shipping due to courier issues</li>
                              <li>Buyer's incorrect address</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <p className="text-yellow-800 font-semibold mb-2">
                            JustBecho is not the manufacturer, unless explicitly stated on listing.
                          </p>
                          <p className="text-yellow-700">
                            Under NO circumstance shall JustBecho's liability exceed the cost of the Product collected by the Company for such transaction.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Section 10: VERIFICATION & SAFETY */}
                    <div id="section10" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          10
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">VERIFICATION & SAFETY</h2>
                      </div>
                      
                      <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl mb-2">✅</div>
                            <p className="font-bold text-gray-800 mb-1">Aadhaar-Verified Sellers</p>
                            <p className="text-gray-600 text-sm">Better visibility and trust ratings</p>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl mb-2">🔒</div>
                            <p className="font-bold text-gray-800 mb-1">Buyer Verification</p>
                            <p className="text-gray-600 text-sm">May be required for high-value orders</p>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl mb-2">⚠️</div>
                            <p className="font-bold text-gray-800 mb-1">Security Checks</p>
                            <p className="text-gray-600 text-sm">Suspicious activity may lead to order cancellation</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 11: PROHIBITED ACTIVITIES */}
                    <div id="section11" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          11
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">PROHIBITED ACTIVITIES</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-bold text-gray-800 mb-4">Buyers agree NOT to:</h3>
                            <ul className="list-disc pl-6 text-red-700 space-y-2">
                              <li>Harass or threaten Sellers or staff</li>
                              <li>Manipulate ratings or feedback</li>
                              <li>Open false disputes</li>
                              <li>Engage in fraud or chargebacks</li>
                              <li>Contact Sellers directly</li>
                              <li>Encourage off-platform transactions</li>
                              <li>Abuse coupons, refund systems, or policies</li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 mb-4">Violations may result in:</h3>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-red-50 p-3 rounded text-center">
                                <p className="text-red-700 font-semibold">Order cancellations</p>
                              </div>
                              <div className="bg-red-50 p-3 rounded text-center">
                                <p className="text-red-700 font-semibold">Account suspension</p>
                              </div>
                              <div className="bg-red-50 p-3 rounded text-center">
                                <p className="text-red-700 font-semibold">Permanent bans</p>
                              </div>
                              <div className="bg-red-50 p-3 rounded text-center">
                                <p className="text-red-700 font-semibold">Legal action</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 12: FEEDBACK & REVIEWS */}
                    <div id="section12" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          12
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">FEEDBACK & REVIEWS</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center p-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-green-600 text-xl">✓</span>
                            </div>
                            <p className="font-bold text-gray-800">Honest Reviews</p>
                            <p className="text-gray-600 text-sm mt-1">Leave honest reviews after receiving products</p>
                          </div>
                          <div className="text-center p-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-red-600 text-xl">✗</span>
                            </div>
                            <p className="font-bold text-gray-800">Prohibited Reviews</p>
                            <p className="text-gray-600 text-sm mt-1">Fake, abusive, or manipulative reviews may be removed</p>
                          </div>
                          <div className="text-center p-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-yellow-600 text-xl">⚠️</span>
                            </div>
                            <p className="font-bold text-gray-800">No Extortion</p>
                            <p className="text-gray-600 text-sm mt-1">Extortion-style reviews are prohibited</p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-blue-700">
                            Buyer provides consent to the Company to use their feedbacks, reviews, names and photographs for purpose of advertising and marketing of the Platform.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Section 13: INTELLECTUAL PROPERTY */}
                    <div id="section13" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          13
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">INTELLECTUAL PROPERTY</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-bold text-gray-800 mb-3">Company IP Rights</h3>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>All logos, trademarks, images, and content belong to Company</li>
                              <li>Unauthorized use may result in legal action</li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-800 mb-3">Buyer Restrictions</h3>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                              <li>Must not copy, reuse, distribute, or modify Company content</li>
                              <li>Written consent required for any use</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 14: PRIVACY */}
                    <div id="section14" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          14
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">PRIVACY</h2>
                      </div>
                      
                      <div className="bg-white border border-blue-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-xl">🔒</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-700">
                              All Buyer information is processed according to the Privacy Policy. Data may be used for verification, fraud prevention, and order processing.
                            </p>
                            <div className="mt-3">
                              <Link 
                                href="/privacy-policy" 
                                className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-2"
                              >
                                View Privacy Policy
                                <span>→</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 15: GOVERNING LAW */}
                    <div id="section15" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          15
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">GOVERNING LAW & JURISDICTION</h2>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-800 mb-2">Governing Law</h3>
                            <p className="text-gray-700">These Terms are governed by the laws of India.</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold text-gray-800 mb-2">Jurisdiction</h3>
                            <p className="text-gray-700">
                              All disputes shall be subject to the exclusive jurisdiction of the courts in Indore, Madhya Pradesh.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 16: MODIFICATIONS */}
                    <div id="section16" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          16
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
                              JustBecho may update these Terms at any time.
                            </p>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <p className="text-yellow-800 font-semibold">
                                Continued use of the platform after updates constitutes acceptance of the revised Terms.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 17: ACCEPTANCE */}
                    <div id="section17" className="scroll-mt-32">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold">
                          17
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">ACCEPTANCE</h2>
                      </div>
                      
                      <div className="bg-white border border-green-200 rounded-lg p-6 shadow-sm">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-green-600 text-2xl">✓</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">By placing an order on JustBecho.com, you acknowledge that:</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-green-50 p-4 rounded-lg">
                              <p className="font-semibold text-green-800">Read & Understood</p>
                              <p className="text-green-700 text-sm mt-1">You have read and understood these Terms</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <p className="font-semibold text-green-800">Accepted Conditions</p>
                              <p className="text-green-700 text-sm mt-1">You accept all conditions and responsibilities</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                              <p className="font-semibold text-green-800">Legally Bound</p>
                              <p className="text-green-700 text-sm mt-1">You agree to be legally bound by this agreement</p>
                            </div>
                          </div>
                          
                          <div className="mt-6 p-6 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg">
                            <p className="text-center font-bold text-lg">
                              By using JustBecho, you confirm your acceptance of these Terms & Conditions.
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
                  href="/terms/seller-terms" 
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <span>←</span> Seller Terms & Conditions
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