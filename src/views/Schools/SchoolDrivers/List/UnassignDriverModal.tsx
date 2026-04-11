'use client'

import { SchoolDriverItem } from '@src/dtos/schoolAdmin'
import { Modal } from '@src/shared/custom/modal/modal'

interface UnassignDriverModalProps {
  driver: SchoolDriverItem | null
  isUnassigning: boolean
  onConfirm: () => void
  onClose: () => void
}

const UnassignDriverModal = ({
  driver,
  isUnassigning,
  onConfirm,
  onClose,
}: UnassignDriverModalProps) => {
  return (
    <Modal
      isOpen={!!driver}
      onClose={onClose}
      title="Unassign Driver"
      size="modal-sm"
      position="modal-center"
      content={
        <div className="text-center space-y-3">
          <div className="size-14 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto">
            <i className="ri-user-unfollow-line text-2xl text-red-500"></i>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-dark-100">
              Remove {driver?.username || 'this driver'}?
            </p>
            <p className="text-sm text-gray-500 dark:text-dark-500 mt-1">
              This driver will be unassigned from the school. You can reassign
              them later.
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <button
            className="btn btn-sub-gray"
            disabled={isUnassigning}
            onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-red"
            disabled={isUnassigning}
            onClick={onConfirm}>
            {isUnassigning ? 'Removing...' : 'Yes, Unassign'}
          </button>
        </div>
      }
    />
  )
}

export default UnassignDriverModal
