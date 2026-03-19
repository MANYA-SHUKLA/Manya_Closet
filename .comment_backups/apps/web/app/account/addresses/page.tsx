'use client'
import { useState } from 'react'
import { ISavedAddress } from '@manya-closet/types'
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from '@/hooks/useAddresses'
import AddressModal from '@/components/account/AddressModal'

export default function AddressesPage() {
  const { data: addresses = [], isLoading } = useAddresses()
  const { mutate: create, isPending: creating } = useCreateAddress()
  const { mutate: update, isPending: updating } = useUpdateAddress()
  const { mutate: remove } = useDeleteAddress()

  const [modal, setModal] = useState<{ open: boolean; editing: ISavedAddress | null }>({ open: false, editing: null })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const openAdd = () => setModal({ open: true, editing: null })
  const openEdit = (addr: ISavedAddress) => setModal({ open: true, editing: addr })
  const closeModal = () => setModal({ open: false, editing: null })

  const handleSave = (data: Omit<ISavedAddress, '_id'>) => {
    if (modal.editing) {
      update({ id: modal.editing._id, payload: data }, { onSuccess: closeModal })
    } else {
      create(data, { onSuccess: closeModal })
    }
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
    remove(id, { onSettled: () => setDeletingId(null) })
  }

  const handleSetDefault = (addr: ISavedAddress) => {
    const { _id, ...rest } = addr
    update({ id: _id, payload: { ...rest, isDefault: true } })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Saved Addresses</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your delivery addresses</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-2xl hover:bg-amber-500 hover:text-black transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 p-6 h-40 animate-pulse" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="font-bold text-gray-900 mb-2">No addresses saved</p>
          <p className="text-sm text-gray-400 mb-6">Add an address for faster checkout</p>
          <button
            onClick={openAdd}
            className="px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-2xl hover:bg-amber-500 hover:text-black transition-all"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`bg-white rounded-3xl border-2 p-6 relative transition-all ${
                addr.isDefault ? 'border-amber-400' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {addr.label}
                </span>
                {addr.isDefault && (
                  <span className="text-xs font-bold px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                    Default
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-700 space-y-0.5">
                <p className="font-semibold text-gray-900">{addr.fullName}</p>
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>{addr.city}, {addr.state} – {addr.pincode}</p>
                <p className="text-gray-400">📞 {addr.phone}</p>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-50">
                <button
                  onClick={() => openEdit(addr)}
                  className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Edit
                </button>
                <span className="text-neutral-200">|</span>
                <button
                  onClick={() => handleDelete(addr._id)}
                  disabled={deletingId === addr._id}
                  className="text-xs font-medium text-rose-400 hover:text-rose-600 transition-colors disabled:opacity-40"
                >
                  {deletingId === addr._id ? 'Removing…' : 'Delete'}
                </button>
                {!addr.isDefault && (
                  <>
                    <span className="text-neutral-200">|</span>
                    <button
                      onClick={() => handleSetDefault(addr)}
                      disabled={updating}
                      className="text-xs font-medium text-amber-600 hover:text-amber-800 transition-colors disabled:opacity-40"
                    >
                      Set as default
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressModal
        open={modal.open}
        initial={modal.editing}
        onClose={closeModal}
        onSave={handleSave}
        saving={creating || updating}
      />
    </div>
  )
}
