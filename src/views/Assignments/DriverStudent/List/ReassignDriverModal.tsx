'use client'

import { useEffect, useState } from 'react'

import { SchoolAssignment } from '@src/dtos/assignment'
import { MESSAGES } from '@src/shared/constants/messages'
import { Modal } from '@src/shared/custom/modal/modal'
import { useReassignSchoolAssignmentMutation } from '@src/store/services/assignmentApi'
import { useGetSchoolDriversQuery } from '@src/store/services/schoolAdminApi'
import Select from 'react-select'
import { toast } from 'react-toastify'

interface Props {
  assignment: SchoolAssignment | null
  schoolId: string
  onClose: () => void
}

const AVATAR_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-green-500',
  'bg-teal-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-pink-500',
]

const getAvatarColor = (name: string) =>
  AVATAR_COLORS[(name.charCodeAt(0) || 0) % AVATAR_COLORS.length]

const ReassignDriverModal = ({ assignment, schoolId, onClose }: Props) => {
  const [newDriverId, setNewDriverId] = useState('')

  const { data: driversData } = useGetSchoolDriversQuery(schoolId, {
    skip: !schoolId,
  })
  const [reassignAssignment, { isLoading }] =
    useReassignSchoolAssignmentMutation()

  const driverOptions = (driversData?.data ?? []).map((d) => ({
    value: d.driver_id || d._id,
    label: d.name || d.username || '—',
    phone: d.phone_number || '',
  }))

  // Pre-select the currently assigned driver when the modal opens
  useEffect(() => {
    if (assignment) {
      setNewDriverId(assignment.driver?.driver_id || assignment.driver_id || '')
    }
  }, [assignment?._id])

  const handleClose = () => {
    setNewDriverId('')
    onClose()
  }

  const handleReassign = async () => {
    if (!newDriverId) {
      toast.warning('Please select a driver.')
      return
    }
    if (!assignment) return

    try {
      await reassignAssignment({
        assignmentId: assignment._id,
        driver_id: newDriverId,
      }).unwrap()
      toast.success('Assignment reassigned successfully.')
      handleClose()
    } catch (error: any) {
      toast.error(
        error?.data?.error ||
          error?.message ||
          MESSAGES.ADMIN.ERROR.UPDATE_FAILED
      )
    }
  }

  return (
    <Modal
      isOpen={!!assignment}
      onClose={handleClose}
      title="Reassign Driver"
      size="modal-sm"
      position="modal-center"
      content={
        <div className="space-y-4">
          {/* Student info with avatar */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-dark-850">
            <div
              className={`size-10 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0 ${getAvatarColor(assignment?.student?.student_name || '?')}`}>
              {(assignment?.student?.student_name || '?')
                .charAt(0)
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">
                {assignment?.student?.student_name || '—'}
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-500">
                {[assignment?.student?.class, assignment?.student?.section]
                  .filter(Boolean)
                  .join(' - ') || 'Student'}
              </p>
            </div>
          </div>

          {/* Current driver */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-dark-500 shrink-0">
              Current Driver:
            </span>
            <span className="font-medium">{assignment?.driver?.name || '—'}</span>
          </div>

          {/* Driver select with search */}
          <div>
            <label className="block mb-1.5 text-sm font-medium">
              Select Driver
            </label>
            <Select
              classNamePrefix="select"
              options={driverOptions}
              value={driverOptions.find((o) => o.value === newDriverId) || null}
              onChange={(option) => setNewDriverId(option?.value || '')}
              placeholder="Search by name..."
              isClearable
              isSearchable
              formatOptionLabel={(option) => (
                <div className="flex items-center gap-2">
                  <div
                    className={`size-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 ${getAvatarColor(option.label)}`}>
                    {option.label.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight">
                      {option.label}
                    </p>
                    {option.phone && (
                      <p className="text-xs text-gray-400 leading-tight">
                        {option.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      }
      footer={
        <div className="flex justify-end gap-2 w-full">
          <button className="btn btn-light" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={isLoading || !newDriverId}
            onClick={handleReassign}>
            {isLoading ? 'Reassigning...' : 'Reassign'}
          </button>
        </div>
      }
    />
  )
}

export default ReassignDriverModal
