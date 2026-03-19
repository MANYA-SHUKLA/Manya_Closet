'use client'
import { useState } from 'react'
import api from '@/lib/axios'

const FAQS = [
  {
    q: 'How do I track my order?',
    a: 'Go to My Account → My Orders to see real-time status updates for all your orders.',
  },
  {
    q: 'What is your return policy?',
    a: 'We accept returns within 7 days of delivery for unused items with original tags. Visit our Returns page for details.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery takes 5–7 business days. Express (2–3 days) and Same Day options are also available at checkout.',
  },
  {
    q: 'Is Cash on Delivery available?',
    a: 'Yes! COD is available across India. You can select it at checkout.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'Orders can be cancelled from My Orders page as long as they haven\'t been shipped yet.',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/contact', form)
      setSent(true)
    } catch {
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      {/* Header */}
      <div className="bg-[#0f0e1e] py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Support</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
            Get in Touch
          </h1>
          <p className="text-gray-400 mt-4">We&apos;re here to help. Reach out and we&apos;ll get back to you within 24 hours.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* Left — info + form */}
          <div className="lg:col-span-3 space-y-6">

            {/* Contact channels */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  label: 'Email',
                  value: 'shuklamanya99@gmail.com',
                  sub: 'Reply within 24 hours',
                  href: 'mailto:shuklamanya99@gmail.com',
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  ),
                  label: 'Phone',
                  value: '+91 8005586558',
                  sub: 'Mon–Sat, 10am–7pm',
                  href: 'tel:+918005586558',
                },
                {
                  icon: (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  ),
                  label: 'WhatsApp',
                  value: '+91 8005586558',
                  sub: 'Usually instant',
                  href: 'https://wa.me/918005586558',
                },
              ].map(({ icon, label, value, sub, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:border-indigo-200 hover:shadow-sm transition-all block">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 mx-auto mb-3">
                    {icon}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{label}</p>
                  <p className="text-indigo-500 text-xs mt-0.5">{value}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
                </a>
              ))}
            </div>

            {/* Contact form */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h2>

              {sent ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 text-sm">We&apos;ll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                    className="mt-5 text-indigo-500 hover:text-indigo-600 text-sm font-medium"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Manya Shukla"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="shuklamanya99@gmail.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Subject</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-gray-700"
                    >
                      <option value="">Select a topic</option>
                      <option>Order Issue</option>
                      <option>Return / Refund</option>
                      <option>Product Query</option>
                      <option>Payment Problem</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your issue or question in detail..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 resize-none"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors active:scale-95"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right — FAQs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 p-8 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked</h2>
              <div className="space-y-3">
                {FAQS.map(({ q, a }, i) => (
                  <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpen(open === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      {q}
                      <svg
                        className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-3 transition-transform ${open === i ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {open === i && (
                      <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
                        <p className="pt-3">{a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
