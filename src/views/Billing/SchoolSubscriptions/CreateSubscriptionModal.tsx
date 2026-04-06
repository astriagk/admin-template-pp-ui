'use client'

import React, { useEffect, useState } from 'react'

import { SchoolSubscription } from '@src/dtos/subscription'
import { ModelModes, PlanType } from '@src/shared/constants/enums'
import { useGetSchoolsListQuery } from '@src/store/services/schoolApi'
import {
  useCreateSchoolSubscriptionMutation,
  useGetSubscriptionPlansQuery,
  useUpdateSchoolSubscriptionMutation,
} from '@src/store/services/subscriptionApi'
import { toast } from 'react-toastify'

export interface SubscriptionModalState {
  open: boolean
  mode: ModelModes
  data: SchoolSubscription | null
}

const computeEndDate = (startDate: string, planType: string): string => {
  if (!startDate) return ''
  const date = new Date(startDate)
  if (planType === PlanType.MONTHLY) date.setMonth(date.getMonth() + 1)
  else if (planType === PlanType.QUARTERLY) date.setMonth(date.getMonth() + 3)
  else if (planType === PlanType.YEARLY)
    date.setFullYear(date.getFullYear() + 1)
  else return ''
  date.setDate(date.getDate() - 1)
  return date.toISOString().split('T')[0]
}

interface CreateSubscriptionModalProps {
  state: SubscriptionModalState
  schoolId: string
  onClose: () => void
}

const CreateSubscriptionModal: React.FC<CreateSubscriptionModalProps> = ({
  state,
  schoolId,
  onClose,
}) => {
  const { data: plansData } = useGetSubscriptionPlansQuery()
  const { data: schoolsData } = useGetSchoolsListQuery()
  const [createSubscription, { isLoading: creating }] =
    useCreateSchoolSubscriptionMutation()
  const [updateSubscription, { isLoading: updating }] =
    useUpdateSchoolSubscriptionMutation()

  const [form, setForm] = useState({
    school_id: '',
    plan_id: '',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    if (state.data) {
      setForm({
        school_id: state.data.school_id,
        plan_id: state.data.plan?._id ?? state.data.plan_id,
        startDate: state.data.start_date
          ? state.data.start_date.split('T')[0]
          : '',
        endDate: state.data.end_date ? state.data.end_date.split('T')[0] : '',
      })
    } else {
      setForm({ school_id: schoolId, plan_id: '', startDate: '', endDate: '' })
    }
  }, [state.data, schoolId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (state.mode === ModelModes.CREATE) {
        await createSubscription({
          school_id: form.school_id,
          plan_id: form.plan_id,
          start_date: form.startDate,
          end_date: form.endDate,
        }).unwrap()
        toast.success('Subscription created successfully')
      } else if (state.mode === ModelModes.EDIT && state.data) {
        await updateSubscription({
          subscriptionId: state.data._id,
          school_id: form.school_id,
          plan_id: form.plan_id,
          start_date: form.startDate,
          end_date: form.endDate,
        }).unwrap()
        toast.success('Subscription updated successfully')
      }
      onClose()
    } catch (error: any) {
      toast.error(error?.data?.message || 'An error occurred')
    }
  }

  if (!state.open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-dark-900 rounded-lg shadow-xl w-full max-w-md p-6">
        <h5 className="text-lg font-semibold mb-4">
          {state.mode === ModelModes.CREATE
            ? 'Create Subscription'
            : 'Edit Subscription'}
        </h5>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">School</label>
            <select
              className="form-select"
              value={form.school_id}
              onChange={(e) => setForm({ ...form, school_id: e.target.value })}
              required>
              <option value="">-- Select School --</option>
              {schoolsData?.data?.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.school_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Plan</label>
            <select
              className="form-select"
              value={form.plan_id}
              onChange={(e) => {
                const plan_id = e.target.value
                const plan = plansData?.data?.find((p) => p._id === plan_id)
                const endDate = plan
                  ? computeEndDate(form.startDate, plan.plan_type)
                  : form.endDate
                setForm({ ...form, plan_id, endDate })
              }}
              required>
              <option value="">-- Select Plan --</option>
              {plansData?.data
                ?.filter((p) => p.is_active)
                .map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.plan_name} — {p.plan_type} (₹{p.price})
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              min={
                state.mode === ModelModes.CREATE
                  ? new Date().toISOString().split('T')[0]
                  : undefined
              }
              className="form-input"
              value={form.startDate}
              onChange={(e) => {
                const startDate = e.target.value
                const plan = plansData?.data?.find(
                  (p) => p._id === form.plan_id
                )
                const endDate = plan
                  ? computeEndDate(startDate, plan.plan_type)
                  : form.endDate
                setForm({ ...form, startDate, endDate })
              }}
              required
            />
          </div>
          <div>
            <label className="form-label">End Date</label>
            <input
              type="date"
              min={form.startDate}
              className="form-input"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={creating || updating}>
              {state.mode === ModelModes.CREATE ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateSubscriptionModal
