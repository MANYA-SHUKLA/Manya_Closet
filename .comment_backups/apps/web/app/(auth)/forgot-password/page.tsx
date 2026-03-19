import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export const metadata = { title: "Forgot Password — Manya's Closet" }

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Forgot your password?</h1>
        <p className="text-sm text-neutral-500 mt-1">No worries, we&apos;ll send you a reset link</p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
