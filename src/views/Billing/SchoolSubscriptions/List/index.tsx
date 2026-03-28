'use client'

import React, { useMemo, useState } from 'react'

import { SchoolSubscription } from '@src/dtos/subscription'
import BreadCrumb from '@src/shared/common/BreadCrumb'
import Pagination from '@src/shared/common/Pagination'
import {
  accessorkeys,
  badgeMaps,
  headerKeys,
} from '@src/shared/constants/columns'
import { STORAGE_KEYS } from '@src/shared/constants/enums'
import TableContainer from '@src/shared/custom/table/table'
import { useGetSchoolsListQuery } from '@src/store/services/schoolApi'
import { useGetSchoolSubscriptionsQuery } from '@src/store/services/subscriptionApi'
import { formatDate } from '@src/utils/formatters'
import LocalStorage from '@src/utils/LocalStorage'
import { CirclePlus, Search } from 'lucide-react'
import Select from 'react-select'

import CreateSubscriptionModal from '../CreateSubscriptionModal'

const SchoolSubscriptionsList = () => {
  const { data: schoolsData } = useGetSchoolsListQuery()
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('')
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const adminData = LocalStorage.getItem(STORAGE_KEYS.ADMIN)
  const user = adminData ? JSON.parse(adminData) : null
  const schoolId = user?.school_id

  const firstSchoolId = schoolId || selectedSchoolId || schoolsData?.data?.[0]?._id || ''

  const { data: subscriptionsData } = useGetSchoolSubscriptionsQuery(
    firstSchoolId,
    {
      skip: !firstSchoolId,
    }
  )

  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)

  const schoolSubscriptionData: SchoolSubscription[] =
    subscriptionsData?.data ?? []

  const filteredRecords = schoolSubscriptionData.filter(
    (item: SchoolSubscription) => {
      return (item.plan?.plan_name ?? '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    }
  )

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredRecords.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: accessorkeys.schoolSubscriptionPlans.id,
        header: headerKeys.schoolSubscriptionPlans.id,
        cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },
      {
        accessorKey: accessorkeys.schoolSubscriptionPlans.schoolName,
        header: headerKeys.schoolSubscriptionPlans.schoolName,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.school_name || '—',
      },
      {
        accessorKey: accessorkeys.schoolSubscriptionPlans.planName,
        header: headerKeys.schoolSubscriptionPlans.planName,
        cell: ({ row }: { row: { original: SchoolSubscription } }) =>
          row.original.plan?.plan_name || '—',
      },
      {
        accessorKey: accessorkeys.schoolSubscriptionPlans.planType,
        header: headerKeys.schoolSubscriptionPlans.planType,
        cell: ({ row }: { row: { original: any } }) => {
          const type = row.original.plan?.plan_type as keyof typeof badgeMaps
          if (!type) return <span className="text-gray-400">—</span>
          const badge = badgeMaps[type] ?? badgeMaps['undefined']
          return (
            <span
              className={`badge inline-flex items-center gap-1 ${badge.className}`}>
              {badge.label}
            </span>
          )
        },
      },
      {
        accessorKey: accessorkeys.schoolSubscriptionPlans.subscriptionStatus,
        header: headerKeys.schoolSubscriptionPlans.subscriptionStatus,
        cell: ({ row }: { row: { original: SchoolSubscription } }) => {
          const status = row.original
            .subscription_status as keyof typeof badgeMaps
          const badge = badgeMaps[status] ?? badgeMaps['undefined']
          return (
            <span
              className={`badge inline-flex items-center gap-1 ${badge.className}`}>
              {badge.label}
            </span>
          )
        },
      },
      {
        accessorKey: accessorkeys.schoolSubscriptionPlans.startDate,
        header: headerKeys.schoolSubscriptionPlans.startDate,
        cell: ({ row }: { row: { original: SchoolSubscription } }) =>
          row.original.start_date ? formatDate(row.original.start_date) : '—',
      },
      {
        accessorKey: accessorkeys.schoolSubscriptionPlans.endDate,
        header: headerKeys.schoolSubscriptionPlans.endDate,
        cell: ({ row }: { row: { original: SchoolSubscription } }) =>
          row.original.end_date ? formatDate(row.original.end_date) : '—',
      },
      {
        accessorKey: accessorkeys.schoolSubscriptionPlans.maxDrivers,
        header: headerKeys.schoolSubscriptionPlans.maxDrivers,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.max_drivers ?? '—',
      },
      {
        accessorKey: accessorkeys.schoolSubscriptionPlans.maxStudents,
        header: headerKeys.schoolSubscriptionPlans.maxStudents,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.max_students ?? '—',
      },
      {
        accessorKey: accessorkeys.schoolSubscriptionPlans.billingContact,
        header: headerKeys.schoolSubscriptionPlans.billingContact,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.billing_contact || '—',
      },
      {
        accessorKey: accessorkeys.schoolSubscriptionPlans.autoRenew,
        header: headerKeys.schoolSubscriptionPlans.autoRenew,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.auto_renew ? 'Yes' : 'No',
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <BreadCrumb title="School Subscriptions" subTitle="Billing" />
      <div className="grid grid-cols-12 gap-x-space">
        <div className="col-span-12 card">
          <div className="card-header">
            <div className="grid items-center gap-3 grid-cols-12">
              {!schoolId && (
                <div className="col-span-12 md:col-span-4 lg:col-span-5 xxl:col-span-3">
                  <div className="relative group/form grow">
                    <Select<{ value: string; label: string }>
                      classNamePrefix="select"
                      options={schoolsData?.data?.map((school) => ({
                        value: school._id,
                        label: school.school_name,
                      }))}
                      value={
                        schoolsData?.data
                          ?.map((s) => ({
                            value: s._id,
                            label: s.school_name,
                          }))
                          .find((o) => o.value === selectedSchoolId) || null
                      }
                      onChange={(option) =>
                        setSelectedSchoolId(option?.value || '')
                      }
                      placeholder="Filter by school"
                      isClearable={true}
                    />
                  </div>
                </div>
              )}
              <div className="col-span-12 md:col-span-4 lg:col-span-4 xxl:col-span-3">
                <div className="relative group/form grow">
                  <input
                    type="text"
                    className="ltr:pl-9 rtl:pr-9 form-input ltr:group-[&.right]/form:pr-9 rtl:group-[&.right]/form:pl-9 ltr:group-[&.right]/form:pl-4 rtl:group-[&.right]/form:pr-4"
                    placeholder="Search Plan"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button className="absolute inset-y-0 flex items-center ltr:left-3 rtl:right-3 ltr:group-[&.right]/form:right-3 rtl:group-[&.right]/form:left-3 ltr:group-[&.right]/form:left-auto rtl:group-[&.right]/form:right-auto focus:outline-hidden">
                    <Search className="text-gray-500 dark:text-dark-500 size-4 fill-gray-100 dark:fill-dark-850" />
                  </button>
                </div>
              </div>
              <div className="col-span-12 md:col-span-4 lg:col-span-4 lg:col-start-10 xxl:col-span-2 xxl:col-start-11 ltr:md:text-right rtl:md:text-left">
                <button
                  className="btn btn-primary shrink-0"
                  onClick={() => setCreateModalOpen(true)}>
                  <CirclePlus className="inline-block ltr:mr-1 rtl:ml-1 size-4" />{' '}
                  Create Subscription
                </button>
              </div>
            </div>
          </div>

          <div className="pt-0 card-body">
            <div>
              <TableContainer
                columns={columns}
                data={paginatedData}
                thClass="!font-medium cursor-pointer"
                divClass="overflow-x-auto table-box whitespace-nowrap"
                tableClass="table flush"
                thtrClass="text-gray-500 bg-gray-100 dark:bg-dark-850 dark:text-dark-500"
              />
              <Pagination
                totalItems={filteredRecords.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
      <CreateSubscriptionModal
        open={createModalOpen}
        schoolId={firstSchoolId}
        onClose={() => setCreateModalOpen(false)}
      />
    </React.Fragment>
  )
}

export default SchoolSubscriptionsList
