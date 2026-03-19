import SignupForm from '@/components/auth/SignupForm'

export const metadata = { title: "Create Account — Manya's Closet" }

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Create your account</h1>
        <p className="text-sm text-neutral-500 mt-1">Join 12,000+ shoppers on Manya&apos;s Closet</p>
      </div>
      <SignupForm />
    </div>
  )
}
