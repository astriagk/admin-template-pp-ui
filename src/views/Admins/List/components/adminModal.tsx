'use client'

import React from 'react'

import {
  ModelModes,
  UserRoles,
  UserRolesType,
} from '@src/shared/constants/enums'
import {
  useCreateAdminMutation,
  useUpdateAdminMutation,
} from '@src/store/services/adminApi'
import { toast } from 'react-toastify'

export interface AdminModalState {
  open: boolean
  mode: ModelModes
  data: any | null
}

const ROLES = [UserRoles.ADMIN, UserRoles.SUPERADMIN]

const AdminModal = ({
  state,
  onClose,
}: {
  state: AdminModalState
  onClose: () => void
}) => {
  const [createAdmin, { isLoading: creating }] = useCreateAdminMutation()
  const [updateAdmin, { isLoading: updating }] = useUpdateAdminMutation()

  const [form, setForm] = React.useState({
    username: state.data?.username ?? '',
    email: state.data?.email ?? '',
    phone_number: state.data?.phone_number ?? '',
    password: '',
    admin_role: state.data?.admin_role ?? 'admin',
  })

  React.useEffect(() => {
    setForm({
      username: state.data?.username ?? '',
      email: state.data?.email ?? '',
      phone_number: state.data?.phone_number ?? '',
      password: '',
      admin_role: state.data?.admin_role ?? 'admin',
    })
  }, [state.data])

  const isReadOnly = state.mode === ModelModes.VIEW

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let result
      if (state.mode === ModelModes.CREATE) {
        result = await createAdmin(form).unwrap()
      } else if (state.mode === ModelModes.EDIT && state.data) {
        result = await updateAdmin({
          _id: state.data._id,
          username: form.username,
          email: form.email,
          phone_number: form.phone_number,
          admin_role: form.admin_role,
        }).unwrap()
      }
      toast.success(result?.message || 'Success!')
      onClose()
    } catch (error: any) {
      const errorMsg =
        error?.data?.error || error?.message || 'An error occurred.'
      toast.error(errorMsg)
    }
  }

  if (!state.open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-dark-900 rounded-lg shadow-xl w-full max-w-md p-6">
        <h5 className="text-lg font-semibold mb-4 capitalize">
          {state.mode === 'create'
            ? 'Create Admin'
            : state.mode === 'edit'
              ? 'Edit Admin'
              : 'Admin Details'}
        </h5>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Name</label>
            <input
              className="form-input"
              value={form.username}
              readOnly={isReadOnly}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              readOnly={isReadOnly}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="form-label">Phone</label>
            <input
              className="form-input"
              value={form.phone_number}
              readOnly={isReadOnly}
              onChange={(e) =>
                setForm({ ...form, phone_number: e.target.value })
              }
            />
          </div>
          {state.mode === ModelModes.CREATE && (
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          )}
          <div>
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={form.admin_role}
              disabled={isReadOnly}
              onChange={(e) =>
                setForm({ ...form, admin_role: e.target.value })
              }>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {UserRolesType[r as keyof typeof UserRolesType] || r}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn btn-light" onClick={onClose}>
              {isReadOnly ? 'Close' : 'Cancel'}
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={creating || updating}>
                {state.mode === ModelModes.CREATE ? 'Create' : 'Save'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminModal
