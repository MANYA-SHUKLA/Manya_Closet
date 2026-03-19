import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = { title: "Sign In — Manya's Closet" }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; reset?: string }>
}) {
  const params = await searchParams

  return (
    <Suspense>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Welcome back</h1>
          <p className="text-sm text-neutral-500 mt-1">Sign in to your account to continue</p>
        </div>

        {params.reset === 'success' && (
          <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
            ✓ Password reset successfully. You can now sign in.
          </div>
        )}

        <LoginForm redirect={params.redirect} />
      </div>
    </Suspense>
  )
}
