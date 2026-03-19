'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLogin } from '@/hooks/useAuth'
import GoogleButton from './GoogleButton'

export default function LoginForm({ redirect }: { redirect?: string }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const { mutate, isPending, error } = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
          {(error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed'}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-neutral-700">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="shuklamanya99@gmail.com"
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
        />
      </div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <label className="text-sm font-medium text-neutral-700">Password</label>
          <Link href="/forgot-password" className="text-xs text-amber-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-neutral-900 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-60"
      >
        {isPending ? 'Signing in…' : 'Sign In'}
      </button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-xs text-neutral-400">or</span>
        </div>
      </div>

      <GoogleButton />

      <p className="text-center text-sm text-neutral-500">
        Don&apos;t have an account?{' '}
        <Link
          href={redirect ? `/signup?redirect=${redirect}` : '/signup'}
          className="text-amber-600 font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  )
}
