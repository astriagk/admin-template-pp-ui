'use client'

import React from 'react'

import Image from 'next/image'

import profile from '@assets/images/avatar/profile.png'
import { DriverDetails } from '@src/dtos/driver'
import { ApprovalStatusType, UserRolesType } from '@src/shared/constants/enums'
import { formatAddress } from '@src/utils/formatAddress'
import { formatDate } from '@src/utils/formatters'
import { Mail, MapPin, MessagesSquare, Phone } from 'lucide-react'

const approvalBadgeClass: Record<string, string> = {
  approved: 'badge-green',
  pending: 'badge-yellow',
  rejected: 'badge-red',
}

const StatCard = ({
  label,
  value,
}: {
  label: string
  value?: string | number | null
}) => (
  <div className="p-4 text-center border border-gray-200 border-dashed rounded-md dark:border-dark-800 min-w-32 shrink-0">
    <h5 className="mb-1 font-semibold">{value ?? '—'}</h5>
    <p className="text-xs text-gray-500 dark:text-dark-500">{label}</p>
  </div>
)

const InfoField = ({
  label,
  value,
}: {
  label: string
  value?: string | number | null
}) => (
  <div>
    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-dark-500">
      {label}
    </p>
    <p className="font-medium text-gray-800 dark:text-dark-100">
      {value ?? '—'}
    </p>
  </div>
)

const Overview = ({
  driverDetails,
  isLoading,
  error,
}: {
  driverDetails: DriverDetails | undefined
  isLoading: boolean
  error: any
}) => {
  const approvalStatus = driverDetails?.approval_status

  return (
    <React.Fragment>
      <div className="col-span-12 card">
        <div className="card-body">
          {/* ── Profile Header ── */}
          <div className="flex flex-wrap gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="relative">
                <Image
                  src={driverDetails?.photo_url ?? profile}
                  alt={driverDetails?.name || 'Driver'}
                  width={112}
                  height={112}
                  className="object-cover rounded-full size-28 ring-4 ring-gray-100 dark:ring-dark-800"
                />
                <span
                  className={`absolute bottom-1 right-1 size-3.5 rounded-full border-2 border-white dark:border-dark-900 ${driverDetails?.is_available ? 'bg-green-500' : 'bg-gray-400'}`}
                  title={driverDetails?.is_available ? 'Available' : 'Unavailable'}
                />
              </div>
            </div>

            {/* Name + meta */}
            <div className="grow min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  {/* Name + ID badge */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h5 className="font-semibold text-17">
                      {driverDetails?.name || '—'}
                    </h5>
                    {driverDetails?.driver_unique_id && (
                      <span className="badge badge-blue text-xs">
                        {driverDetails.driver_unique_id}
                      </span>
                    )}
                    {approvalStatus && (
                      <span
                        className={`badge text-xs ${approvalBadgeClass[approvalStatus] ?? 'badge-gray'}`}>
                        {ApprovalStatusType[
                          approvalStatus as keyof typeof ApprovalStatusType
                        ]}
                      </span>
                    )}
                  </div>

                  {/* Contact meta row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-dark-500">
                    {driverDetails?.user?.user_type && (
                      <span className="flex items-center gap-1">
                        <i className="ri-briefcase-line" />
                        {UserRolesType[
                          driverDetails.user
                            .user_type as keyof typeof UserRolesType
                        ] ?? driverDetails.user.user_type}
                      </span>
                    )}
                    {driverDetails?.user?.phone_number && (
                      <span className="flex items-center gap-1">
                        <Phone className="size-3.5" />
                        {driverDetails.user.phone_number}
                      </span>
                    )}
                    {driverDetails?.email && (
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="size-3.5 shrink-0" />
                        {driverDetails.email}
                      </span>
                    )}
                    {(driverDetails?.addresses?.city ||
                      driverDetails?.addresses?.state) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5 shrink-0" />
                        {[
                          driverDetails.addresses.city,
                          driverDetails.addresses.state,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    className="btn btn-sub-green btn-icon"
                    title="Call driver">
                    <Phone className="size-4" />
                  </button>
                  <button
                    className="btn btn-sub-purple btn-icon"
                    title="Message driver">
                    <MessagesSquare className="size-4" />
                  </button>
                </div>
              </div>

              {/* Stat cards */}
              <div className="flex flex-wrap gap-3 mt-5">
                <StatCard
                  label="Joined"
                  value={
                    driverDetails?.created_at
                      ? formatDate(driverDetails.created_at)
                      : null
                  }
                />
                <StatCard
                  label="Vehicle Type"
                  value={driverDetails?.vehicle_type}
                />
                <StatCard
                  label="Vehicle No."
                  value={driverDetails?.vehicle_number}
                />
                <StatCard
                  label="Capacity"
                  value={driverDetails?.vehicle_capacity}
                />
                <StatCard
                  label="Total Trips"
                  value={driverDetails?.total_trips}
                />
                <StatCard
                  label="Rating"
                  value={
                    driverDetails?.rating != null
                      ? `⭐ ${Number(driverDetails.rating).toFixed(1)}`
                      : null
                  }
                />
              </div>
            </div>
          </div>

          <hr className="my-5 border-dashed border-gray-200 dark:border-dark-800" />

          {/* ── Detail Fields ── */}
          <div className="grid grid-cols-12 gap-x-6 gap-y-5">
            <div className="col-span-12 sm:col-span-6 xl:col-span-3">
              <InfoField
                label="Availability"
                value={
                  driverDetails?.is_available != null
                    ? driverDetails.is_available
                      ? 'Available'
                      : 'Unavailable'
                    : null
                }
              />
            </div>
            <div className="col-span-12 sm:col-span-6 xl:col-span-3">
              <InfoField
                label="Students (Current / Capacity)"
                value={
                  driverDetails?.current_student_count != null
                    ? `${driverDetails.current_student_count} / ${driverDetails.vehicle_capacity ?? '?'}`
                    : null
                }
              />
            </div>
            <div className="col-span-12 sm:col-span-6 xl:col-span-3">
              <InfoField
                label="Driving License"
                value={driverDetails?.documents?.driving_license_number}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 xl:col-span-3">
              <InfoField
                label="Active"
                value={
                  driverDetails?.user?.is_active != null
                    ? driverDetails.user.is_active
                      ? 'Yes'
                      : 'No'
                    : null
                }
              />
            </div>
            <div className="col-span-12 xl:col-span-6">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-dark-500">
                Full Address
              </p>
              <p className="font-medium text-gray-800 dark:text-dark-100">
                {formatAddress(driverDetails?.addresses) || '—'}
              </p>
              {(driverDetails?.addresses?.latitude ||
                driverDetails?.addresses?.longitude) && (
                <p className="mt-1 text-xs text-gray-400 dark:text-dark-600">
                  {driverDetails.addresses.latitude},{' '}
                  {driverDetails.addresses.longitude}
                </p>
              )}
            </div>

            {driverDetails?.rejection_reason && (
              <div className="col-span-12">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-dark-500">
                  Rejection Reason
                </p>
                <p className="text-red-500 dark:text-red-400">
                  {driverDetails.rejection_reason}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Overview
