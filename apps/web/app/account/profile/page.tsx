'use client'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useUpdateProfile, useChangePassword } from '@/hooks/useAuth'

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const [name, setName] = useState(user?.name ?? '')
  const [profileMsg, setProfileMsg] = useState('')

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState('')
  const [pwError, setPwError] = useState('')

  useEffect(() => { if (user) setName(user.name) }, [user])

  const { mutate: updateProfile, isPending: savingProfile } = useUpdateProfile()
  const { mutate: changePassword, isPending: savingPw } = useChangePassword()

  const handleProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setProfileMsg('')
    updateProfile({ name }, {
      onSuccess: () => setProfileMsg('Profile updated successfully!'),
    })
  }

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPwMsg('')
    setPwError('')
    if (pwForm.next !== pwForm.confirm) {
      setPwError('New passwords do not match')
      return
    }
    if (pwForm.next.length < 8) {
      setPwError('Password must be at least 8 characters')
      return
    }
    changePassword(
      { currentPassword: pwForm.current, newPassword: pwForm.next },
      {
        onSuccess: () => {
          setPwMsg('Password changed successfully!')
          setPwForm({ current: '', next: '', confirm: '' })
        },
        onError: (e: { response?: { data?: { message?: string } } }) => {
          setPwError(e.response?.data?.message ?? 'Failed to change password')
        },
      },
    )
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your personal information</p>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-3xl border border-gray-100 p-7">
        <h2 className="font-bold text-gray-900 mb-5">Personal Information</h2>
        <form onSubmit={handleProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-shadow"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1.5">Email is linked to your account and cannot be changed.</p>
          </div>
          {profileMsg && (
            <p className="text-sm text-emerald-600 font-medium">{profileMsg}</p>
          )}
          <button
            type="submit"
            disabled={savingProfile || name === user.name}
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-40"
          >
            {savingProfile ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-3xl border border-gray-100 p-7">
        <h2 className="font-bold text-gray-900 mb-1">Change Password</h2>

        {user.googleId ? (
          <div className="mt-4 flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl">
            <span className="text-2xl">🔐</span>
            <p className="text-sm text-gray-600">
              Your account is linked with Google. Password is managed by Google.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePassword} className="space-y-4 mt-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Current Password</label>
              <input
                type="password"
                value={pwForm.current}
                onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">New Password</label>
                <input
                  type="password"
                  value={pwForm.next}
                  onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
            {pwError && <p className="text-sm text-rose-600">{pwError}</p>}
            {pwMsg   && <p className="text-sm text-emerald-600 font-medium">{pwMsg}</p>}
            <button
              type="submit"
              disabled={savingPw}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-60"
            >
              {savingPw ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        )}
      </div>

      {/* Account info */}
      <div className="bg-white rounded-3xl border border-gray-100 p-7">
        <h2 className="font-bold text-gray-900 mb-4">Account Details</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Role</span>
            <span className="font-semibold text-gray-900 capitalize">{user.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Member since</span>
            <span className="font-semibold text-gray-900">
              {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Account verified</span>
            <span className={`font-semibold ${user.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
              {user.isVerified ? '✓ Verified' : 'Not verified'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
