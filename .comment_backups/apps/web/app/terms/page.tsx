export default function TermsPage() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <div className="bg-[#0f0e1e] py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Legal</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
            Terms of Service
          </h1>
          <p className="text-gray-400 mt-4 text-sm">Last updated: March 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 space-y-10 text-gray-600 leading-relaxed">

          <p className="text-sm bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-indigo-700">
            Please read these Terms of Service carefully before using Manya&apos;s Closet. By accessing or
            using our services, you agree to be bound by these terms.
          </p>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-sm">
              By creating an account or placing an order on Manya&apos;s Closet, you agree to these Terms of
              Service and our Privacy Policy. If you do not agree, please do not use our services.
              We reserve the right to modify these terms at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Account Registration</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>You must be at least 18 years old to create an account</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You agree to provide accurate and complete registration information</li>
              <li>You are responsible for all activity that occurs under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Products and Pricing</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Product descriptions and images are provided for informational purposes; actual products may vary slightly</li>
              <li>We reserve the right to modify prices at any time without notice</li>
              <li>Prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes</li>
              <li>We reserve the right to limit quantities or refuse orders at our discretion</li>
              <li>In case of pricing errors, we will notify you and offer to fulfil the order at the correct price or cancel it</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Orders and Payment</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>All orders are subject to product availability and acceptance</li>
              <li>Payment is processed securely through Razorpay</li>
              <li>We accept UPI, credit/debit cards, net banking, and Cash on Delivery (COD)</li>
              <li>Orders are confirmed only after successful payment verification</li>
              <li>We reserve the right to cancel orders suspected of fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Shipping and Delivery</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>We deliver across India. Delivery times vary by location and chosen delivery option</li>
              <li>Free standard delivery on orders above ₹999</li>
              <li>Delivery timelines are estimates and not guaranteed — delays may occur due to unforeseen circumstances</li>
              <li>Risk of loss passes to you upon delivery</li>
              <li>We are not responsible for incorrect addresses provided at checkout</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Returns and Refunds</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Returns are accepted within 7 days of delivery for unused, unwashed items with original tags</li>
              <li>To initiate a return, contact our support team with your order number</li>
              <li>Refunds are processed within 5–7 business days to the original payment method</li>
              <li>Sale items and intimate wear are not eligible for returns</li>
              <li>We reserve the right to refuse returns that do not meet our policy criteria</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-sm">
              All content on Manya&apos;s Closet — including text, images, logos, and designs — is owned by
              or licensed to us and protected by copyright law. You may not reproduce, distribute, or
              create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Prohibited Activities</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Using our services for any unlawful purpose</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Submitting false or misleading information</li>
              <li>Engaging in any activity that disrupts or interferes with our services</li>
              <li>Scraping or bulk downloading product data without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-sm">
              To the fullest extent permitted by law, Manya&apos;s Closet shall not be liable for any indirect,
              incidental, special, or consequential damages arising from your use of our services. Our total
              liability shall not exceed the amount you paid for the order giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">10. Governing Law</h2>
            <p className="text-sm">
              These terms are governed by the laws of India. Any disputes shall be subject to the exclusive
              jurisdiction of the courts in India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">11. Contact</h2>
            <p className="text-sm">
              For questions about these Terms, please contact us at:<br />
              <a href="mailto:legal@manyascloset.in" className="text-indigo-500 hover:underline">legal@manyascloset.in</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
