'use client'

import React, { useMemo, useState } from 'react'

import { RedemptionCode } from '@src/dtos/subscription'
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
import {
  useGenerateRedemptionCodesMutation,
  useGetRedemptionCodesQuery,
  useGetSchoolSubscriptionsQuery,
} from '@src/store/services/subscriptionApi'
import LocalStorage from '@src/utils/LocalStorage'
import { formatDate } from '@src/utils/formatters'
import { Search } from 'lucide-react'
import Select from 'react-select'

const RedemptionCodesList = () => {
  const { data: schoolsData } = useGetSchoolsListQuery()
  const user = LocalStorage.getItem(STORAGE_KEYS.ADMIN)
    ? JSON.parse(LocalStorage.getItem(STORAGE_KEYS.ADMIN)!)
    : null
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(
    user?.school_id || ''
  )
  const [selectedSubscriptionId, setSelectedSubscriptionId] =
    useState<string>('')
  const [generateCount, setGenerateCount] = useState<number>(1)
  const [generating, setGenerating] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)

  const [generateCodes, { isLoading: isGenerating }] =
    useGenerateRedemptionCodesMutation()

  const firstSchoolId = selectedSchoolId || schoolsData?.data?.[0]?._id || ''

  const { data: subscriptionsData } = useGetSchoolSubscriptionsQuery(
    firstSchoolId,
    { skip: !firstSchoolId }
  )

  const firstSubscriptionId =
    selectedSubscriptionId || subscriptionsData?.data?.[0]?._id || ''

  const { data: codesData } = useGetRedemptionCodesQuery(firstSubscriptionId, {
    skip: !firstSubscriptionId,
  })

  const handleGenerate = async () => {
    if (!firstSubscriptionId) return
    if (window.confirm(`Generate ${generateCount} redemption code(s)?`)) {
      setGenerating(true)
      try {
        await generateCodes({
          subscriptionId: firstSubscriptionId,
          studentIds: [],
        }).unwrap()
      } finally {
        setGenerating(false)
      }
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const codesArr: RedemptionCode[] = codesData?.data ?? []

  const filteredRecords = codesArr.filter((item: RedemptionCode) => {
    const q = searchQuery.toLowerCase()
    if (!q) return true
    return (
      item.code.toLowerCase().includes(q) ||
      (item.student_name ?? '').toLowerCase().includes(q) ||
      (item.student_class ?? '').toLowerCase().includes(q) ||
      (item.student_section ?? '').toLowerCase().includes(q) ||
      (item.parent_name ?? '').toLowerCase().includes(q) ||
      (item.parent_phone ?? '').toLowerCase().includes(q)
    )
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredRecords.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: accessorkeys.redemptionCodesList.id,
        header: headerKeys.redemptionCodesList.id,
        cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },
      {
        accessorKey: accessorkeys.redemptionCodesList.code,
        header: headerKeys.redemptionCodesList.code,
        cell: ({ row }: { row: { original: RedemptionCode } }) => (
          <code className="font-mono text-sm bg-gray-100 dark:bg-dark-850 px-2 py-0.5 rounded">
            {row.original.code}
          </code>
        ),
      },
      {
        accessorKey: accessorkeys.redemptionCodesList.studentName,
        header: headerKeys.redemptionCodesList.studentName,
        cell: ({ row }: { row: { original: RedemptionCode } }) => {
          const name = row.original.student_name
          const cls = row.original.student_class
          const section = row.original.student_section
          const classLabel = cls
            ? section
              ? `Class ${cls} – ${section}`
              : `Class ${cls}`
            : null
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-sm">{name || '—'}</span>
              {classLabel && (
                <span className="text-xs text-gray-400 dark:text-dark-500">
                  {classLabel}
                </span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: accessorkeys.redemptionCodesList.parentInfo,
        header: headerKeys.redemptionCodesList.parentInfo,
        cell: ({ row }: { row: { original: RedemptionCode } }) => {
          const name = row.original.parent_name
          const phone = row.original.parent_phone
          if (!name && !phone) return '—'
          return (
            <div className="flex flex-col gap-0.5">
              {name && <span className="text-sm font-medium">{name}</span>}
              {phone && (
                <span className="text-xs text-gray-400 dark:text-dark-500">
                  {phone}
                </span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: accessorkeys.redemptionCodesList.codeStatus,
        header: headerKeys.redemptionCodesList.codeStatus,
        cell: ({ row }: { row: { original: RedemptionCode } }) => {
          const isRedeemed = row.original.is_redeemed ?? row.original.status === 'redeemed'
          const badge = isRedeemed ? badgeMaps['redeemed'] : badgeMaps['pending']
          return (
            <span className={`badge inline-flex items-center gap-1 ${badge.className}`}>
              {badge.label}
            </span>
          )
        },
      },
      {
        accessorKey: accessorkeys.redemptionCodesList.redeemedAt,
        header: headerKeys.redemptionCodesList.redeemedAt,
        cell: ({ row }: { row: { original: RedemptionCode } }) =>
          row.original.redeemed_at ? formatDate(row.original.redeemed_at) : '—',
      },
      {
        accessorKey: accessorkeys.redemptionCodesList.validUntil,
        header: headerKeys.redemptionCodesList.validUntil,
        cell: ({ row }: { row: { original: RedemptionCode } }) => {
          const endDate = row.original.end_date
          if (!endDate) return '—'
          const isExpired = new Date(endDate) < new Date()
          return (
            <span className={isExpired ? 'text-red-500' : ''}>
              {formatDate(endDate)}
            </span>
          )
        },
      },
      // {
      //   accessorKey: accessorkeys.redemptionCodesList.createdAt,
      //   header: headerKeys.redemptionCodesList.createdAt,
      //   cell: ({ row }: { row: { original: any } }) =>
      //     row.original.created_at ? formatDate(row.original.created_at) : '—',
      // },
    ],
    []
  )

  return (
    <React.Fragment>
      <BreadCrumb title="Redemption Codes" subTitle="Billing" />
      <div className="grid grid-cols-12 gap-x-space">
        <div className="col-span-12 card">
          <div className="card-header">
            <div className="grid items-center gap-3 grid-cols-12">
              {!user?.school_id && (
                <div className="col-span-12 md:col-span-12 lg:col-span-4 xxl:col-span-4">
                  <div className="flex flex-wrap items-center gap-3">
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
                        onChange={(option) => {
                          setSelectedSchoolId(option?.value || '')
                          setSelectedSubscriptionId('')
                        }}
                        placeholder="Filter by School"
                        isClearable={true}
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* {user?.school_id && (
                <div className="col-span-12 md:col-span-12 lg:col-span-4 xxl:col-span-4">
                  <div className="form-group">
                    <div className="form-control bg-gray-100 dark:bg-dark-850 px-3 py-2 rounded-md">
                      {schoolsData?.data?.find(
                        (s) => s._id === selectedSchoolId
                      )?.school_name || '—'}
                    </div>
                  </div>
                </div>
              )} */}
              <div
                className={
                  user?.school_id
                    ? 'col-span-12 md:col-span-9 lg:col-span-4 xxl:col-span-4'
                    : 'col-span-12 md:col-span-9 lg:col-span-6 xxl:col-span-6'
                }>
                <div className="relative group/form grow">
                  <input
                    type="text"
                    className="ltr:pl-9 rtl:pr-9 form-input ltr:group-[&.right]/form:pr-9 rtl:group-[&.right]/form:pl-9 ltr:group-[&.right]/form:pl-4 rtl:group-[&.right]/form:pr-4"
                    placeholder="Search by code, student name or class..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button className="absolute inset-y-0 flex items-center ltr:left-3 rtl:right-3 ltr:group-[&.right]/form:right-3 rtl:group-[&.right]/form:left-3 ltr:group-[&.right]/form:left-auto rtl:group-[&.right]/form:right-auto focus:outline-hidden">
                    <Search className="text-gray-500 dark:text-dark-500 size-4 fill-gray-100 dark:fill-dark-850" />
                  </button>
                </div>
              </div>
              {/* <div
                className={
                  user?.school_id
                    ? 'col-span-12 md:col-span-3 lg:col-span-4 xxl:col-span-4 ltr:text-right rtl:text-left'
                    : 'col-span-12 md:col-span-3 lg:col-span-2 xxl:col-span-2 ltr:md:text-right rtl:md:text-left'
                }>
                <div className="flex items-center justify-end gap-2">
                  <button
                    className="btn btn-primary shrink-0"
                    disabled={
                      !firstSubscriptionId || isGenerating || generating
                    }
                    onClick={handleGenerate}>
                    <Key className="inline-block ltr:mr-1 rtl:ml-1 size-4" />
                    Generate
                  </button>
                </div>
              </div> */}
            </div>
          </div>

          <div className="pt-0 card-body">
            <div>
              <TableContainer
                columns={columns}
                data={paginatedData}
                thClass="!font-medium cursor-pointer"
                divClass="overflow-x-auto table-box whitespace-nowrap"
                lastTrClass="text-end"
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
    </React.Fragment>
  )
}

export default RedemptionCodesList
