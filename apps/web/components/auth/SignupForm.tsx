'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRegister } from '@/hooks/useAuth'
import GoogleButton from './GoogleButton'

export default function SignupForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [validationError, setValidationError] = useState('')
  const { mutate, isPending, error } = useRegister()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setValidationError('Passwords do not match')
      return
    }
    setValidationError('')
    const { confirm: _, ...payload } = form
    mutate(payload)
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const displayError =
    validationError ||
    (error as { response?: { data?: { message?: string } } } | null)?.response?.data?.message

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {displayError && (
        <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
          {displayError}
        </div>
      )}

      {[
        { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Manya Shukla' },
        { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
        { key: 'password', label: 'Password', type: 'password', placeholder: '8+ characters' },
        { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
      ].map(({ key, label, type, placeholder }) => (
        <div key={key} className="space-y-1">
          <label className="text-sm font-medium text-neutral-700">{label}</label>
          <input
            type={type}
            required
            value={form[key as keyof typeof form]}
            onChange={set(key as keyof typeof form)}
            placeholder={placeholder}
            minLength={key === 'password' || key === 'confirm' ? 8 : undefined}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-60"
      >
        {isPending ? 'Creating account…' : 'Create Account'}
      </button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-xs text-neutral-400">or</span>
        </div>
      </div>

      <GoogleButton label="Sign up with Google" />

      <p className="text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <Link href="/login" className="text-amber-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
