export default function PrivacyPage() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      {/* Header */}
      <div className="bg-[#0f0e1e] py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Legal</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
            Privacy Policy
          </h1>
          <p className="text-gray-400 mt-4 text-sm">Last updated: March 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 space-y-10 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="mb-3">We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Name, email address, and password when you create an account</li>
              <li>Shipping address and phone number when you place an order</li>
              <li>Payment information (processed securely by Razorpay — we never store card details)</li>
              <li>Communications you send us (support requests, reviews)</li>
            </ul>
            <p className="mt-3 text-sm">We also automatically collect usage data such as IP address, browser type, pages visited, and device information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Process and fulfil your orders</li>
              <li>Send order confirmations, shipping updates, and receipts</li>
              <li>Respond to your comments and questions</li>
              <li>Send promotional communications (you can opt out at any time)</li>
              <li>Improve and personalise your shopping experience</li>
              <li>Detect and prevent fraudulent transactions</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Sharing of Information</h2>
            <p className="text-sm mb-3">We do not sell your personal information. We share data only with:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li><strong className="text-gray-800">Service providers</strong> — delivery partners, payment processors (Razorpay), email services</li>
              <li><strong className="text-gray-800">Legal compliance</strong> — when required by law, court order, or government authority</li>
              <li><strong className="text-gray-800">Business transfers</strong> — in connection with any merger or acquisition</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-sm">
              We implement industry-standard security measures including SSL/TLS encryption, secure password hashing,
              and access controls. However, no method of transmission over the internet is 100% secure.
              We encourage you to use a strong, unique password for your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Cookies</h2>
            <p className="text-sm">
              We use cookies and similar technologies to keep you signed in, remember your cart, and understand
              how you use our site. You can control cookies through your browser settings, though disabling
              them may affect site functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-sm mb-3">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Data portability — receive your data in a structured, common format</li>
            </ul>
            <p className="mt-3 text-sm">To exercise any of these rights, contact us at <a href="mailto:privacy@manyascloset.in" className="text-indigo-500 hover:underline">privacy@manyascloset.in</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Children&apos;s Privacy</h2>
            <p className="text-sm">
              Our services are not directed to children under 13. We do not knowingly collect personal
              information from children. If you believe we have inadvertently collected such information,
              please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
            <p className="text-sm">
              We may update this Privacy Policy from time to time. We will notify you of material changes
              by posting the new policy on this page and updating the &quot;Last updated&quot; date. Continued use of
              our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
            <p className="text-sm">
              If you have any questions about this Privacy Policy, please contact us at:<br />
              <a href="mailto:privacy@manyascloset.in" className="text-indigo-500 hover:underline">privacy@manyascloset.in</a><br />
              Manya&apos;s Closet, India
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
