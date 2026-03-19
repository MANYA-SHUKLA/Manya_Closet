'use client'
import { useState, useEffect } from 'react'
import { ISavedAddress } from '@manya-closet/types'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh',
]

type FormData = Omit<ISavedAddress, '_id'>

const blank: FormData = {
  label: 'Home', fullName: '', phone: '', addressLine1: '', addressLine2: '',
  city: '', state: '', pincode: '', country: 'India', isDefault: false,
}

interface Props {
  open: boolean
  initial?: ISavedAddress | null
  onClose: () => void
  onSave: (data: FormData) => void
  saving?: boolean
}

export default function AddressModal({ open, initial, onClose, onSave, saving }: Props) {
  const [form, setForm] = useState<FormData>(blank)

  useEffect(() => {
    if (open) {
      if (initial) {
        const { _id, ...rest } = initial
        void _id
        setForm(rest)
      } else {
        setForm(blank)
      }
    }
  }, [open, initial])

  if (!open) return null

  const set = (k: keyof FormData, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {initial ? 'Edit Address' : 'New Address'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
          <div className="flex gap-2">
            {['Home', 'Work', 'Other'].map((l) => (
              <button
                key={l} type="button"
                onClick={() => set('label', l)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  form.label === l
                    ? 'bg-amber-500 border-amber-500 text-black'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" value={form.fullName} onChange={(v) => set('fullName', v)} required />
            <Field label="Phone" value={form.phone} onChange={(v) => set('phone', v)} type="tel" pattern="[0-9]{10}" required />
          </div>

          <Field label="Address Line 1" value={form.addressLine1} onChange={(v) => set('addressLine1', v)} required />
          <Field label="Address Line 2 (optional)" value={form.addressLine2 ?? ''} onChange={(v) => set('addressLine2', v)} />

          <div className="grid grid-cols-2 gap-4">
            <Field label="City" value={form.city} onChange={(v) => set('city', v)} required />
            <div className="relative">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">State</label>
              <select
                required
                value={form.state}
                onChange={(e) => set('state', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white appearance-none"
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Pincode" value={form.pincode} onChange={(v) => set('pincode', v)} pattern="[0-9]{6}" required />
            <Field label="Country" value={form.country} onChange={(v) => set('country', v)} required />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => set('isDefault', e.target.checked)}
              className="w-4 h-4 rounded accent-amber-500"
            />
            <span className="text-sm text-gray-700">Set as default address</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-60 text-sm"
          >
            {saving ? 'Saving…' : 'Save Address'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required, pattern }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; required?: boolean; pattern?: string
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        pattern={pattern}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-shadow"
      />
    </div>
  )
}
