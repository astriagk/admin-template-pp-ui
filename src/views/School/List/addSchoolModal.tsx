import React, { useEffect, useRef, useState } from 'react'

import { SchoolListItem } from '@src/dtos/school'
import { ModelModes } from '@src/shared/constants/enums'
import {
  INDIAN_STATES,
  getCitiesByStateCode,
} from '@src/shared/constants/locations'
import { Modal } from '@src/shared/custom/modal/modal'
import {
  useCreateSchoolMutation,
  useUpdateSchoolMutation,
} from '@src/store/services/schoolApi'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

interface AddSchoolModalProps {
  show: boolean
  handleHide: () => void
  mode?: ModelModes
  schoolData?: SchoolListItem | null
}

interface AddSchoolFormValues {
  school_name: string
  address: string
  city: string
  state: string
  latitude: number
  longitude: number
  contact_number: string
  email?: string
  principal_name: string
}

const AddSchoolModal: React.FC<AddSchoolModalProps> = ({
  show,
  handleHide,
  mode = ModelModes.ADD,
  schoolData = null,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<AddSchoolFormValues>()

  const [createSchool, { isLoading: isCreating }] = useCreateSchoolMutation()
  const [updateSchool, { isLoading: isUpdating }] = useUpdateSchoolMutation()
  const selectedState = watch('state')
  const [availableCities, setAvailableCities] = useState<string[]>([])

  const isViewMode = mode === ModelModes.VIEW
  const isEditMode = mode === ModelModes.EDIT
  const isLoading = isCreating || isUpdating

  // Populate form when editing or viewing
  useEffect(() => {
    if (!show) return
    if (schoolData && (isEditMode || isViewMode)) {
      setValue('school_name', schoolData.school_name)
      setValue('address', schoolData.address)
      setValue('state', schoolData.state)
      setValue('latitude', schoolData.latitude)
      setValue('longitude', schoolData.longitude)
      setValue('contact_number', schoolData.contact_number)
      setValue('email', schoolData.email || '')
      setValue('principal_name', schoolData.principal_name || '')

      // Set available cities for the selected state
      const cities = getCitiesByStateCode(schoolData.state)
      setAvailableCities(cities)

      // Only set city if it exists in the available cities
      if (cities.includes(schoolData.city)) {
        setValue('city', schoolData.city)
      } else {
        setValue('city', '')
      }
    }
  }, [schoolData, isEditMode, isViewMode, setValue, show])

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateCode = e.target.value
    setValue('state', stateCode)
    setValue('city', '')
    setAvailableCities(getCitiesByStateCode(stateCode))
  }

  const onSubmit = async (data: AddSchoolFormValues, onClose: () => void) => {
    try {
      if (isEditMode && schoolData) {
        const response = await updateSchool({
          schoolId: schoolData._id,
          payload: data,
        }).unwrap()
        if (response.success) {
          toast.success(response.message || 'School updated successfully')
          reset()
          setAvailableCities([])
          onClose()
        }
      } else {
        const response = await createSchool(data).unwrap()
        if (response.success) {
          toast.success(response.message || 'School created successfully')
          reset()
          setAvailableCities([])
          onClose()
        }
      }
    } catch (error: any) {
      toast.error(
        error?.data?.error ||
          `Failed to ${isEditMode ? 'update' : 'create'} school. Please try again.`
      )
    }
  }

  const getModalTitle = () => {
    if (isViewMode) return 'View School'
    if (isEditMode) return 'Edit School'
    return 'Add School'
  }

  return (
    <Modal
      isOpen={show}
      id="addSchoolModal"
      onClose={handleHide}
      title={getModalTitle()}
      position="modal-center"
      size="modal-2xl"
      content={(onClose) => {
        return (
          <form onSubmit={handleSubmit((data) => onSubmit(data, onClose))}>
            <div className="grid grid-cols-12 gap-space">
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label htmlFor="schoolNameInput" className="form-label">
                  School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="schoolNameInput"
                  className="form-input"
                  placeholder="Enter school name"
                  disabled={isViewMode}
                  {...register('school_name', {
                    required: 'School Name is required.',
                  })}
                />
                {errors.school_name && (
                  <span className="text-red-500">
                    {errors.school_name.message}
                  </span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label htmlFor="addressInput" className="form-label">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="addressInput"
                  className="form-input"
                  placeholder="Enter address"
                  disabled={isViewMode}
                  {...register('address', { required: 'Address is required.' })}
                />
                {errors.address && (
                  <span className="text-red-500">{errors.address.message}</span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label htmlFor="stateInput" className="form-label">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  id="stateInput"
                  className="form-input"
                  disabled={isViewMode}
                  {...register('state', { required: 'State is required.' })}
                  onChange={handleStateChange}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <span className="text-red-500">{errors.state.message}</span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label htmlFor="cityInput" className="form-label">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  id="cityInput"
                  className="form-input"
                  {...register('city', { required: 'City is required.' })}
                  disabled={isViewMode || !selectedState}>
                  <option value="">
                    {selectedState ? 'Select city' : 'Select state first'}
                  </option>
                  {availableCities.map((city, idx) => (
                    <option key={city + '-' + idx} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <span className="text-red-500">{errors.city.message}</span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label htmlFor="latitudeInput" className="form-label">
                  Latitude <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="latitudeInput"
                  className="form-input"
                  placeholder="Latitude"
                  step="any"
                  disabled={isViewMode}
                  {...register('latitude', {
                    required: 'Latitude is required.',
                    valueAsNumber: true,
                  })}
                />
                {errors.latitude && (
                  <span className="text-red-500">
                    {errors.latitude.message}
                  </span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label htmlFor="longitudeInput" className="form-label">
                  Longitude <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="longitudeInput"
                  className="form-input"
                  placeholder="Longitude"
                  step="any"
                  disabled={isViewMode}
                  {...register('longitude', {
                    required: 'Longitude is required.',
                    valueAsNumber: true,
                  })}
                />
                {errors.longitude && (
                  <span className="text-red-500">
                    {errors.longitude.message}
                  </span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label htmlFor="contactNumberInput" className="form-label">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="contactNumberInput"
                  className="form-input"
                  placeholder="Enter contact number"
                  pattern="^[+]?\d{7,15}$"
                  disabled={isViewMode}
                  {...register('contact_number', {
                    required: 'Contact Number is required.',
                    pattern: {
                      value: /^[+]?\d{7,15}$/,
                      message: 'Enter a valid phone number.',
                    },
                  })}
                />
                {errors.contact_number && (
                  <span className="text-red-500">
                    {errors.contact_number.message}
                  </span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label htmlFor="emailInput" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="emailInput"
                  className="form-input"
                  placeholder="example@example.com"
                  disabled={isViewMode}
                  {...register('email', {
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address.',
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <label htmlFor="principalNameInput" className="form-label">
                  Principal Name
                </label>
                <input
                  type="text"
                  id="principalNameInput"
                  className="form-input"
                  placeholder="Enter principal name"
                  disabled={isViewMode}
                  {...register('principal_name')}
                />
                {errors.principal_name && (
                  <span className="text-red-500">
                    {errors.principal_name.message}
                  </span>
                )}
              </div>
              <div className="col-span-12 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-light"
                  disabled={isLoading}
                  onClick={() => {
                    reset()
                    onClose()
                  }}>
                  {isViewMode ? 'Close' : 'Cancel'}
                </button>
                {!isViewMode && (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}>
                    {isLoading
                      ? isEditMode
                        ? 'Updating...'
                        : 'Creating...'
                      : isEditMode
                        ? 'Update School'
                        : 'Add School'}
                  </button>
                )}
              </div>
            </div>
          </form>
        )
      }}
    />
  )
}

export default AddSchoolModal
