'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useForgotPassword } from '@/hooks/useAuth'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const { mutate, isPending, isSuccess } = useForgotPassword()

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="text-5xl">📬</div>
        <h3 className="text-lg font-semibold text-neutral-900">Check your inbox</h3>
        <p className="text-sm text-neutral-500">
          If an account with <strong>{email}</strong> exists, we&apos;ve sent a reset link.
          It expires in 10 minutes.
        </p>
        <Link href="/login" className="inline-block text-sm text-amber-600 hover:underline mt-4">
          ← Back to login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutate(email) }} className="space-y-4">
      <p className="text-sm text-neutral-500">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <div className="space-y-1">
        <label className="text-sm font-medium text-neutral-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="shuklamanya99@gmail.com"
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-60"
      >
        {isPending ? 'Sending…' : 'Send Reset Link'}
      </button>

      <p className="text-center text-sm text-neutral-500">
        <Link href="/login" className="text-amber-600 hover:underline">
          ← Back to login
        </Link>
      </p>
    </form>
  )
}
