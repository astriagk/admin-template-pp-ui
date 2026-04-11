'use client'

import React, { useEffect } from 'react'

import {
  SubscriptionPlan,
  SubscriptionPlanFeature,
} from '@src/dtos/subscription'
import {
  ModelModes,
  PlanType,
  PlanTypeLabel,
  PricingModel,
  PricingModelLabel,
} from '@src/shared/constants/enums'
import { MESSAGES } from '@src/shared/constants/messages'
import { Modal } from '@src/shared/custom/modal/modal'
import {
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
} from '@src/store/services/subscriptionApi'
import { X } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

interface PlanModalProps {
  show: boolean
  handleHide: () => void
  mode?: ModelModes
  planData?: SubscriptionPlan | null
}

interface PlanFormValues {
  plan_name: string
  plan_type: string
  pricing_model: string
  price: number | undefined
  per_kid_price: number | undefined
  kids_min: number
  kids_max: number
  features: SubscriptionPlanFeature[]
}

const defaultFeature = (): SubscriptionPlanFeature => ({
  key: '',
  label: '',
  enabled: true,
})

const defaultValues: PlanFormValues = {
  plan_name: '',
  plan_type: PlanType.MONTHLY,
  pricing_model: PricingModel.FLAT,
  price: undefined,
  per_kid_price: undefined,
  kids_min: 1,
  kids_max: 1,
  features: [defaultFeature()],
}

const PlanModal: React.FC<PlanModalProps> = ({
  show,
  handleHide,
  mode = ModelModes.ADD,
  planData = null,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<PlanFormValues>({ defaultValues })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  })

  const [createPlan, { isLoading: isCreating }] =
    useCreateSubscriptionPlanMutation()
  const [updatePlan, { isLoading: isUpdating }] =
    useUpdateSubscriptionPlanMutation()

  const isEditMode = mode === ModelModes.EDIT
  const isLoading = isCreating || isUpdating

  useEffect(() => {
    if (!show) return
    if (planData && isEditMode) {
      reset({
        plan_name: planData.plan_name,
        plan_type: planData.plan_type,
        pricing_model: planData.pricing_model,
        price: planData.price,
        per_kid_price: planData.per_kid_price ?? undefined,
        kids_min: planData.kids.min,
        kids_max: planData.kids.max,
        features: planData.features.length
          ? planData.features
          : [defaultFeature()],
      })
    } else if (!planData) {
      reset(defaultValues)
    }
  }, [show, planData, isEditMode, reset])

  const onSubmit = async (data: PlanFormValues, onClose: () => void) => {
    let payload: any = {
      plan_name: data.plan_name,
      plan_type: data.plan_type,
      pricing_model: data.pricing_model,
      price: Number(data.price ?? 0),
      currency: 'INR',
      kids: { min: Number(data.kids_min), max: Number(data.kids_max) },
      features: data.features.filter((f) => f.key || f.label),
      priority: 1,
      is_active: true,
    }

    if (
      data.pricing_model === 'per_kid' ||
      data.pricing_model === 'base_plus_per_kid'
    ) {
      payload.per_kid_price = String(data.per_kid_price ?? 0)
    }

    try {
      if (isEditMode && planData) {
        const response = await updatePlan({
          id: planData._id,
          ...payload,
        }).unwrap()
        if (response.success) {
          toast.success(
            response.message || MESSAGES.SUBSCRIPTION.SUCCESS.PLAN_UPDATED
          )
          reset(defaultValues)
          onClose()
        }
      } else {
        const response = await createPlan(payload).unwrap()
        if (response.success) {
          toast.success(
            response.message || MESSAGES.SUBSCRIPTION.SUCCESS.PLAN_CREATED
          )
          reset(defaultValues)
          onClose()
        }
      }
    } catch (error: any) {
      toast.error(
        error?.data?.error ||
          (isEditMode
            ? MESSAGES.SUBSCRIPTION.ERROR.UPDATE_FAILED
            : MESSAGES.SUBSCRIPTION.ERROR.CREATE_FAILED)
      )
    }
  }

  const getModalTitle = () =>
    isEditMode ? 'Edit Subscriptions' : 'Add Subscriptions'

  return (
    <Modal
      isOpen={show}
      id="planModal"
      onClose={handleHide}
      title={getModalTitle()}
      position="modal-center"
      size="modal-lg"
      content={(onClose) => (
        <form onSubmit={handleSubmit((data) => onSubmit(data, onClose))}>
          <div className="grid grid-cols-12 gap-space">
            {/* Plan Name */}
            <div className="col-span-12 md:col-span-6">
              <label className="form-label">
                Plan Name <span className="text-red-500">*</span>
              </label>
              <input
                className="form-input"
                placeholder="Enter plan name"
                {...register('plan_name', {
                  required: 'Plan name is required.',
                })}
              />
              {errors.plan_name && (
                <span className="text-red-500">{errors.plan_name.message}</span>
              )}
            </div>

            {/* Plan Type */}
            <div className="col-span-12 md:col-span-6">
              <label className="form-label">
                Plan Type <span className="text-red-500">*</span>
              </label>
              <select
                className="form-select"
                {...register('plan_type', { required: true })}>
                {Object.values(PlanType).map((t) => (
                  <option key={t} value={t}>
                    {PlanTypeLabel[t]}
                  </option>
                ))}
              </select>
            </div>

            {/* Pricing Model */}
            <div className="col-span-12 md:col-span-6">
              <label className="form-label">
                Pricing Model <span className="text-red-500">*</span>
              </label>
              <select
                className="form-select"
                {...register('pricing_model', { required: true })}>
                {Object.values(PricingModel).map((m) => (
                  <option key={m} value={m}>
                    {PricingModelLabel[m]}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="col-span-12 md:col-span-6">
              <label className="form-label">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                placeholder="Enter price"
                className="form-input"
                {...register('price', {
                  required: 'Price is required.',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Price must be > 0.' },
                })}
              />
              {errors.price && (
                <span className="text-red-500">{errors.price.message}</span>
              )}
            </div>

            {/* Per-Kid Price */}
            <div className="col-span-12 md:col-span-6">
              <label className="form-label">Per-Kid Price (₹)</label>
              <input
                type="number"
                min={1}
                placeholder="Enter per-kid price"
                className="form-input"
                {...register('per_kid_price', {
                  valueAsNumber: true,
                  min: { value: 1, message: 'Per-Kid Price must be > 0.' },
                })}
              />
            </div>

            {/* Kids Range */}
            <div className="col-span-6 md:col-span-3">
              <label className="form-label">
                Min Kids <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                className="form-input"
                {...register('kids_min', {
                  required: 'Required.',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Min 1.' },
                })}
              />
              {errors.kids_min && (
                <span className="text-red-500">{errors.kids_min.message}</span>
              )}
            </div>
            <div className="col-span-6 md:col-span-3">
              <label className="form-label">
                Max Kids <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                className="form-input"
                {...register('kids_max', {
                  required: 'Required.',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Min 1.' },
                })}
              />
              {errors.kids_max && (
                <span className="text-red-500">{errors.kids_max.message}</span>
              )}
            </div>

            {/* Features */}
            <div className="col-span-12">
              <label className="form-label">Features</label>
              <div className="space-y-2">
                {fields.map((field, idx) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <input
                      className="form-input w-28 shrink-0"
                      placeholder="key"
                      {...register(`features.${idx}.key`)}
                    />
                    <input
                      className="form-input flex-1"
                      placeholder="Label"
                      {...register(`features.${idx}.label`)}
                    />
                    <label className="flex items-center gap-1 text-sm shrink-0">
                      <input
                        type="checkbox"
                        {...register(`features.${idx}.enabled`)}
                      />
                      On
                    </label>
                    <button
                      type="button"
                      className="btn btn-light btn-sm"
                      onClick={() => remove(idx)}>
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-light btn-sm"
                  onClick={() => append(defaultFeature())}>
                  + Add Feature
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-12 flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-light"
                disabled={isLoading}
                onClick={() => {
                  reset(defaultValues)
                  onClose()
                }}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}>
                {isLoading
                  ? isEditMode
                    ? MESSAGES.SUBSCRIPTION.LOADING.UPDATING_PLAN
                    : MESSAGES.SUBSCRIPTION.LOADING.CREATING_PLAN
                  : isEditMode
                    ? 'Update Plan'
                    : 'Add Plan'}
              </button>
            </div>
          </div>
        </form>
      )}
    />
  )
}

export default PlanModal
