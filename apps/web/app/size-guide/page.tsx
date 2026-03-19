const TOPS = [
  { size: 'XS', chest: '32–33"', waist: '26–27"', hips: '35–36"', ind: '6–8' },
  { size: 'S',  chest: '34–35"', waist: '28–29"', hips: '37–38"', ind: '8–10' },
  { size: 'M',  chest: '36–37"', waist: '30–31"', hips: '39–40"', ind: '10–12' },
  { size: 'L',  chest: '38–40"', waist: '32–34"', hips: '41–43"', ind: '12–14' },
  { size: 'XL', chest: '41–43"', waist: '35–37"', hips: '44–46"', ind: '14–16' },
  { size: 'XXL',chest: '44–46"', waist: '38–40"', hips: '47–49"', ind: '16–18' },
]

const BOTTOMS = [
  { size: '26', waist: '26"', hips: '36"', ind: '6' },
  { size: '28', waist: '28"', hips: '38"', ind: '8' },
  { size: '30', waist: '30"', hips: '40"', ind: '10' },
  { size: '32', waist: '32"', hips: '42"', ind: '12' },
  { size: '34', waist: '34"', hips: '44"', ind: '14' },
  { size: '36', waist: '36"', hips: '46"', ind: '16' },
]

const FOOTWEAR = [
  { uk: '3', eu: '36', us: '5', cm: '22.5' },
  { uk: '4', eu: '37', us: '6', cm: '23.5' },
  { uk: '5', eu: '38', us: '7', cm: '24.5' },
  { uk: '6', eu: '39', us: '8', cm: '25.5' },
  { uk: '7', eu: '40', us: '9', cm: '26' },
  { uk: '8', eu: '41', us: '10', cm: '27' },
]

const TIPS = [
  { icon: '📏', tip: 'Measure over your undergarments, not over clothing.' },
  { icon: '🧘', tip: 'Stand naturally — don\'t suck in or puff out.' },
  { icon: '📐', tip: 'Keep the measuring tape parallel to the floor for chest and hips.' },
  { icon: '✅', tip: 'When between sizes, size up for comfort.' },
]

export default function SizeGuidePage() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <div className="bg-[#0f0e1e] py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Fit Guide</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
            Size Guide
          </h1>
          <p className="text-gray-400 mt-4 max-w-lg mx-auto">
            Find your perfect fit. All measurements are in inches unless noted.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16 space-y-10">

        <div className="bg-white rounded-3xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
            How to Measure
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {TIPS.map(({ icon, tip }) => (
              <div key={tip} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                <span className="text-xl flex-shrink-0">{icon}</span>
                <p className="text-sm text-gray-600">{tip}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
            {[
              { label: 'Chest', desc: 'Measure around the fullest part of your chest, keeping the tape level.' },
              { label: 'Waist', desc: 'Measure around your natural waistline, the narrowest part of your torso.' },
              { label: 'Hips', desc: 'Measure around the fullest part of your hips and seat, 8" below your waist.' },
            ].map(({ label, desc }) => (
              <div key={label} className="p-4 border border-indigo-100 bg-indigo-50/50 rounded-2xl">
                <p className="font-semibold text-indigo-700 mb-1">{label}</p>
                <p className="text-gray-600 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
            Tops & Dresses
          </h2>
          <p className="text-sm text-gray-400 mb-6">Measurements in inches</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 rounded-xl">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 rounded-l-xl">Size</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Chest</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Waist</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Hips</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 rounded-r-xl">Indian Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {TOPS.map((row) => (
                  <tr key={row.size} className="hover:bg-indigo-50/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-indigo-600">{row.size}</td>
                    <td className="px-4 py-3 text-gray-600">{row.chest}</td>
                    <td className="px-4 py-3 text-gray-600">{row.waist}</td>
                    <td className="px-4 py-3 text-gray-600">{row.hips}</td>
                    <td className="px-4 py-3 text-gray-600">{row.ind}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
            Bottoms & Jeans
          </h2>
          <p className="text-sm text-gray-400 mb-6">Measurements in inches</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 rounded-l-xl">Waist Size</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Waist</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Hips</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 rounded-r-xl">Indian Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {BOTTOMS.map((row) => (
                  <tr key={row.size} className="hover:bg-indigo-50/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-indigo-600">{row.size}</td>
                    <td className="px-4 py-3 text-gray-600">{row.waist}</td>
                    <td className="px-4 py-3 text-gray-600">{row.hips}</td>
                    <td className="px-4 py-3 text-gray-600">{row.ind}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
            Footwear
          </h2>
          <p className="text-sm text-gray-400 mb-6">Women&apos;s shoe sizing</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 rounded-l-xl">UK</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">EU</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">US</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 rounded-r-xl">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {FOOTWEAR.map((row) => (
                  <tr key={row.uk} className="hover:bg-indigo-50/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-indigo-600">{row.uk}</td>
                    <td className="px-4 py-3 text-gray-600">{row.eu}</td>
                    <td className="px-4 py-3 text-gray-600">{row.us}</td>
                    <td className="px-4 py-3 text-gray-600">{row.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 text-center">
          <p className="text-indigo-700 font-semibold mb-2">Still unsure about your size?</p>
          <p className="text-gray-500 text-sm mb-5">Our team is happy to help you find the perfect fit.</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-full transition-colors text-sm"
          >
            Chat with us
          </a>
        </div>

      </div>
    </div>
  )
}
