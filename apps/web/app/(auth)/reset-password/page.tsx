import { Suspense } from 'react'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export const metadata = { title: "Reset Password — Manya's Closet" }

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams

  return (
    <Suspense>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Set new password</h1>
          <p className="text-sm text-neutral-500 mt-1">Must be at least 8 characters</p>
        </div>
        <ResetPasswordForm token={params.token ?? ''} />
      </div>
    </Suspense>
  )
}
