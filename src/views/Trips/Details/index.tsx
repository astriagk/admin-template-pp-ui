'use client'

import React, { useMemo } from 'react'

import { useParams } from 'next/navigation'

import BreadCrumb from '@src/shared/common/BreadCrumb'
import {
  accessorkeys,
  badgeMaps,
  headerKeys,
} from '@src/shared/constants/columns'
import { TripStatus } from '@src/shared/constants/enums'
import TableContainer from '@src/shared/custom/table/table'
import { useGetTripDetailsQuery } from '@src/store/services/tripApi'
import {
  safeLocaleDateString,
  safeLocaleString,
  safeLocaleTimeString,
} from '@src/utils/formatters'

const DetailRow = ({
  label,
  value,
  mono = false,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
}) => (
  <div>
    <p className="text-gray-500 text-sm mb-1">{label}</p>
    <p
      className={`text-gray-900 text-sm ${mono ? 'font-mono break-all' : 'font-medium'}`}>
      {value ?? '—'}
    </p>
  </div>
)

const TripDetails = () => {
  const params = useParams()
  const tripId = params?.id as string

  const { data: tripResponse, error } = useGetTripDetailsQuery(tripId, {
    skip: !tripId,
  })

  const trip = tripResponse?.data

  const flattenedStudents = useMemo(() => {
    if (!trip?.students_by_parent) return []
    return trip.students_by_parent.flatMap((parent) => parent.students)
  }, [trip?.students_by_parent])

  const studentColumns = useMemo(
    () => [
      {
        accessorKey: accessorkeys.tripDetails.id,
        header: headerKeys.tripDetails.id,
        cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },
      {
        accessorKey: accessorkeys.tripDetails.name,
        header: headerKeys.tripDetails.name,
      },
      {
        accessorKey: accessorkeys.tripDetails.pickupStatus,
        header: headerKeys.tripDetails.pickupStatus,
        cell: ({ row }: { row: { original: any } }) => {
          const status = row.original.pickup_status
          const badgeClass =
            badgeMaps[status as keyof typeof badgeMaps]?.className
          return (
            <span className={`badge ${badgeClass}`}>
              {badgeMaps[status as keyof typeof badgeMaps]?.label || '—'}
            </span>
          )
        },
      },
      {
        accessorKey: accessorkeys.tripDetails.dropStatus,
        header: headerKeys.tripDetails.dropStatus,
        cell: ({ row }: { row: { original: any } }) => {
          const status = row.original.drop_status
          const badgeClass =
            badgeMaps[status as keyof typeof badgeMaps]?.className
          return (
            <span className={`badge ${badgeClass}`}>
              {badgeMaps[status as keyof typeof badgeMaps]?.label || '—'}
            </span>
          )
        },
      },
    ],
    []
  )

  const trackingColumns = useMemo(
    () => [
      {
        accessorKey: accessorkeys.tripDetails.id,
        header: headerKeys.tripDetails.id,
        cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },
      {
        accessorKey: accessorkeys.tripDetails.lat,
        header: headerKeys.tripDetails.lat,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.lat?.toFixed(6) ?? '—',
      },
      {
        accessorKey: accessorkeys.tripDetails.lng,
        header: headerKeys.tripDetails.lng,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.lng?.toFixed(6) ?? '—',
      },
      {
        accessorKey: accessorkeys.tripDetails.timestamp,
        header: headerKeys.tripDetails.timestamp,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.timestamp
            ? safeLocaleString(row.original.timestamp)
            : '—',
      },
    ],
    []
  )

  if (error || !trip) {
    return (
      <React.Fragment>
        <BreadCrumb
          title="Trip Details"
          subTitle={error ? 'Error' : 'Loading'}
        />
        <div className="grid grid-cols-12 gap-x-space">
          <div
            className={`col-span-12 card ${error ? 'bg-red-50 border border-red-200' : ''}`}>
            <div className="card-body">
              <p className={error ? 'text-red-700' : 'text-gray-500'}>
                {error ? 'Failed to fetch trip details.' : 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  const status = trip.trip_status as TripStatus
  const badge = badgeMaps[status as keyof typeof badgeMaps]

  return (
    <React.Fragment>
      <BreadCrumb title="Trip Details" subTitle={trip._id} />
      <div className="grid grid-cols-12 gap-x-space">
        {/* Trip Info Card */}
        <div className="col-span-12 card">
          <div className="card-body">
            <div className="flex justify-between items-start mb-6 pb-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Trip #{trip._id.slice(-8)}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {trip.driver?.name || 'N/A'}
                </p>
              </div>
              <span
                className={`badge inline-flex items-center gap-1 ${badge.className}`}>
                {badge.label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 pb-6 border-b">
              <DetailRow label="Trip ID" value={trip._id} mono />
              <DetailRow label="Driver" value={trip.driver?.name} />
              <DetailRow
                label="Type"
                value={<span className="capitalize">{trip.trip_type}</span>}
              />
              <DetailRow
                label="Date"
                value={
                  trip.trip_date
                    ? safeLocaleDateString(trip.trip_date, 'en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : undefined
                }
              />
              <DetailRow
                label="Distance"
                value={
                  trip.total_distance != null
                    ? `${trip.total_distance} KM`
                    : undefined
                }
              />
              <DetailRow label="Students" value={trip.student_count} />
              <DetailRow
                label="Start Time"
                value={
                  trip.start_time
                    ? safeLocaleTimeString(trip.start_time, 'en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : undefined
                }
              />
              <DetailRow
                label="End Time"
                value={
                  trip.end_time
                    ? safeLocaleTimeString(trip.end_time, 'en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : undefined
                }
              />
            </div>

            <div className="flex gap-4">
              <button
                className="btn btn-light btn-sm"
                onClick={() => window.history.back()}>
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Students */}
        <div className="col-span-12 card">
          <div className="card-header">
            <h6 className="card-title">
              Students ({flattenedStudents.length || 0})
            </h6>
          </div>
          <div className="card-body">
            <TableContainer
              columns={studentColumns}
              data={flattenedStudents}
              thClass="!font-medium cursor-pointer"
              divClass="overflow-x-auto table-box whitespace-nowrap"
              lastTrClass="text-end"
              tableClass="table flush"
              thtrClass="text-gray-500 bg-gray-100 dark:bg-dark-850 dark:text-dark-500"
            />
          </div>
        </div>

        {/* Tracking History */}
        {trip.tracking_history && trip.tracking_history.length > 0 && (
          <div className="col-span-12 card">
            <div className="card-header">
              <h6 className="card-title">
                Tracking History ({trip.tracking_history.length} points)
              </h6>
            </div>
            <div className="card-body">
              <TableContainer
                columns={trackingColumns}
                data={trip.tracking_history}
                thClass="!font-medium cursor-pointer"
                divClass="overflow-x-auto table-box whitespace-nowrap"
                lastTrClass="text-end"
                tableClass="table flush"
                thtrClass="text-gray-500 bg-gray-100 dark:bg-dark-850 dark:text-dark-500"
              />
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

export default TripDetails
