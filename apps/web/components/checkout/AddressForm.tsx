'use client'
import { useState } from 'react'
import { useCheckoutStore, ShippingAddress } from '@/store/checkoutStore'
import { useAuthStore } from '@/store/authStore'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh',
]

function Field({
  label, name, value, onChange, type = 'text', required = true,
  placeholder, pattern, maxLength,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void
  type?: string; required?: boolean; placeholder?: string; pattern?: string; maxLength?: number
}) {
  return (
    <div className="relative">
      <input
        id={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder=" "
        pattern={pattern}
        maxLength={maxLength}
        className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm text-neutral-900 placeholder-transparent transition-all bg-white"
      />
      <label
        htmlFor={name}
        className="absolute left-4 top-2 text-xs font-medium text-neutral-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-neutral-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-amber-600 transition-all pointer-events-none"
      >
        {label}{required && ' *'}
      </label>
    </div>
  )
}

export default function AddressForm() {
  const user = useAuthStore((s) => s.user)
  const { address: saved, setAddress, setStep } = useCheckoutStore()

  const [form, setForm] = useState<ShippingAddress>({
    ...saved,
    fullName: saved.fullName || user?.name || '',
  })

  const set = (key: keyof ShippingAddress) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAddress(form)
    setStep('delivery')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-1">Delivery Address</h2>
        <p className="text-sm text-neutral-500">Where should we send your order?</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full Name" name="fullName" value={form.fullName} onChange={set('fullName')} placeholder="Manya Shukla" />
        <Field label="Phone Number" name="phone" value={form.phone} onChange={set('phone')} type="tel" placeholder="10-digit number" pattern="[6-9][0-9]{9}" maxLength={10} />
      </div>

      <Field label="Address Line 1" name="addressLine1" value={form.addressLine1} onChange={set('addressLine1')} placeholder="House no, Street, Area" />
      <Field label="Address Line 2 (optional)" name="addressLine2" value={form.addressLine2} onChange={set('addressLine2')} required={false} placeholder="Landmark, Colony" />

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="City" name="city" value={form.city} onChange={set('city')} placeholder="Mumbai" />
        <div className="relative">
          <select
            value={form.state}
            onChange={(e) => set('state')(e.target.value)}
            required
            className="w-full px-4 pt-6 pb-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm text-neutral-900 bg-white appearance-none"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <label className="absolute left-4 top-2 text-xs font-medium text-amber-600 pointer-events-none">
            State *
          </label>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <Field label="Pincode" name="pincode" value={form.pincode} onChange={set('pincode')} placeholder="400001" pattern="[0-9]{6}" maxLength={6} />
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-2xl transition-all hover:shadow-lg hover:shadow-amber-200 active:scale-95"
      >
        Continue to Delivery →
      </button>
    </form>
  )
}
