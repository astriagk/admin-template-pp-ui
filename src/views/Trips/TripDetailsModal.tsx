'use client'

import React from 'react'

import { Trip } from '@src/dtos/trip'
import { Modal } from '@src/shared/custom/modal/modal'
import { formatDate } from '@src/utils/formatters'
import {
  Bus,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  School,
  User,
  XCircle,
} from 'lucide-react'

interface TripDetailsModalProps {
  trip: Trip | null
  isOpen: boolean
  onClose: () => void
}

const TripDetailsModal: React.FC<TripDetailsModalProps> = ({
  trip,
  isOpen,
  onClose,
}) => {
  if (!trip) return null

  const isDropTrip = trip.trip_type === 'drop'

  const allStudents =
    trip.students_by_parent
      ?.flatMap((pg) =>
        pg.students.map((s) => ({
          ...s,
          parent_name: pg.parent_name,
          parent_phone: pg.parent_phone,
        }))
      )
      .sort((a, b) => a.sequence_order - b.sequence_order) || []

  const getStudentStatus = (s: (typeof allStudents)[0]) => s.pickup_status

  const completedCount = allStudents.filter((s) => {
    const st = getStudentStatus(s)
    return st === 'completed' || st === 'picked_up'
  }).length

  const pendingCount = allStudents.filter(
    (s) => getStudentStatus(s) === 'pending' && s.attendance_status !== 'absent'
  ).length

  const getPickupStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
      case 'picked_up':
        return {
          cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
          icon: <CheckCircle2 className="size-3.5" />,
          label: isDropTrip ? 'Dropped' : 'Picked Up',
        }
      case 'pending':
        return {
          cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
          icon: <Clock className="size-3.5" />,
          label: 'Pending',
        }
      default:
        return {
          cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
          icon: <MapPin className="size-3.5" />,
          label: status,
        }
    }
  }

  const getAttendanceStyle = (status: string) => {
    switch (status) {
      case 'present':
        return {
          cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
          icon: <CheckCircle2 className="size-3.5" />,
          label: 'Present',
        }
      case 'absent':
        return {
          cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
          icon: <XCircle className="size-3.5" />,
          label: 'Absent',
        }
      default:
        return {
          cls: 'bg-gray-100 text-gray-600 dark:bg-dark-700 dark:text-dark-400',
          icon: <Clock className="size-3.5" />,
          label: 'Pending',
        }
    }
  }

  const tripStatusStyle =
    trip.trip_status === 'started' || trip.trip_status === 'in_progress'
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-gray-100 text-gray-600 dark:bg-dark-700 dark:text-dark-400'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Trip Details — ${trip.driver?.name || 'Trip'}`}
      size="modal-lg"
      position="modal-center"
      content={
        <div className="space-y-4 -mt-2">
          {/* Trip Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100 dark:border-dark-700">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${isDropTrip ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                  <Bus className="size-3" />
                  {trip.trip_type}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${tripStatusStyle}`}>
                  <span className="size-1.5 rounded-full bg-current animate-pulse" />
                  {trip.trip_status.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {trip.driver?.name || 'Unknown Driver'}
              </h3>
              {trip.start_time && (
                <p className="text-xs text-gray-500 dark:text-dark-400 mt-0.5">
                  Started: {formatDate(trip.start_time)}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-500 dark:text-dark-400">
                Total Distance
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {trip.total_distance != null
                  ? `${trip.total_distance} km`
                  : '-'}
              </p>
            </div>
          </div>

          {/* Driver & School Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 p-3 bg-gray-50 dark:bg-dark-850 rounded-lg">
              <div className="flex items-center justify-center size-9 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                <Bus className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-dark-400">
                  Vehicle
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {trip.driver?.vehicle_number || '-'}
                </p>
                <p className="text-xs text-gray-500 dark:text-dark-400 capitalize">
                  {trip.driver?.vehicle_type || ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-gray-50 dark:bg-dark-850 rounded-lg">
              <div className="flex items-center justify-center size-9 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg shrink-0">
                <School className="size-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-dark-400">
                  School
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {trip.school?.school_name || '-'}
                </p>
                <p className="text-xs text-gray-500 dark:text-dark-400">
                  {trip.school?.city || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Driver Phone */}
          {trip.driver?.phone_number && (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-dark-850 rounded-lg">
              <Phone className="size-3.5 text-gray-500 dark:text-dark-400" />
              <span className="text-xs text-gray-500 dark:text-dark-400">
                Driver Phone:
              </span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {trip.driver.phone_number}
              </span>
              <span className="ml-auto text-xs text-gray-400 dark:text-dark-500">
                {trip.driver.driver_unique_id}
              </span>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-50 dark:bg-dark-850 rounded-lg">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {trip.student_count}
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-400">Total</p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {completedCount}
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-400">
                {isDropTrip ? 'Dropped' : 'Picked Up'}
              </p>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
              <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                {pendingCount}
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-400">
                Pending
              </p>
            </div>
          </div>

          {/* Students List - sorted by sequence */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-dark-400 uppercase tracking-wider mb-2">
              Students ({allStudents.length})
            </p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-hide">
              <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
              `}</style>
              {allStudents.map((student) => {
                const pickupStyle = getPickupStatusStyle(
                  getStudentStatus(student) || 'pending'
                )
                const attendanceStyle = getAttendanceStyle(
                  student.attendance_status
                )
                const isAbsent = student.attendance_status === 'absent'

                return (
                  <div
                    key={student.trip_student_id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      isAbsent
                        ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50 opacity-70'
                        : 'bg-white dark:bg-dark-900 border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-850'
                    }`}>
                    {/* Stop number */}
                    <div className="flex items-center justify-center size-7 rounded-full bg-gray-100 dark:bg-dark-700 text-xs font-bold text-gray-600 dark:text-dark-300 shrink-0">
                      {student.sequence_order}
                    </div>

                    {/* Student icon */}
                    <div className="flex items-center justify-center size-8 bg-blue-50 dark:bg-blue-900/20 rounded-full shrink-0">
                      <User className="size-4 text-blue-500" />
                    </div>

                    {/* Student info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {student.student_name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-dark-400 mt-0.5">
                        <Phone className="size-3" />
                        <span>{student.parent_phone}</span>
                        {student.parent_name && (
                          <span className="ml-1 truncate">
                            · {student.parent_name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status badges */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {student.attendance_status !== 'pending' && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${attendanceStyle.cls}`}>
                          {attendanceStyle.icon}
                          {attendanceStyle.label}
                        </span>
                      )}
                      {!isAbsent && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${pickupStyle.cls}`}>
                          {pickupStyle.icon}
                          {pickupStyle.label}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {allStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-dark-500">
              No student data available
            </div>
          )}
        </div>
      }
    />
  )
}

export default TripDetailsModal
