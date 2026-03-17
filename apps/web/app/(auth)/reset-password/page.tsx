import { Suspense } from 'react'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export const metadata = { title: "Reset Password — Manya's Closet" }

function ResetContent({ searchParams }: { searchParams: { token?: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Set new password</h1>
        <p className="text-sm text-neutral-500 mt-1">Must be at least 8 characters</p>
      </div>
      <ResetPasswordForm token={searchParams.token ?? ''} />
    </div>
  )
}

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  return (
    <Suspense>
      <ResetContent searchParams={searchParams} />
    </Suspense>
  )
}
