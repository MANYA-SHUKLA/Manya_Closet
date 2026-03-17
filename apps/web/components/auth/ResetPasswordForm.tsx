'use client'
import { useState } from 'react'
import { useResetPassword } from '@/hooks/useAuth'

export default function ResetPasswordForm({ token }: { token: string }) {
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [validationError, setValidationError] = useState('')
  const { mutate, isPending, error } = useResetPassword()

  if (!token) {
    return (
      <div className="text-center text-sm text-rose-500">
        Invalid or missing reset token. Please request a new link.
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setValidationError('Passwords do not match')
      return
    }
    setValidationError('')
    mutate({ token, password: form.password })
  }

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

      <div className="space-y-1">
        <label className="text-sm font-medium text-neutral-700">New Password</label>
        <input
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          placeholder="8+ characters"
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-neutral-700">Confirm Password</label>
        <input
          type="password"
          required
          minLength={8}
          value={form.confirm}
          onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-60"
      >
        {isPending ? 'Resetting…' : 'Reset Password'}
      </button>
    </form>
  )
}
