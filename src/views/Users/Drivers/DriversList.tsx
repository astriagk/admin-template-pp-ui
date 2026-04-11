'use client'

import React, { useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import BreadCrumb from '@src/shared/common/BreadCrumb'
import { paths } from '@src/shared/common/DynamicTitle'
import Pagination from '@src/shared/common/Pagination'
import {
  accessorkeys,
  badgeMaps,
  headerKeys,
} from '@src/shared/constants/columns'
import { UserRoles } from '@src/shared/constants/enums'
import TableContainer from '@src/shared/custom/table/table'
import { useGetDriverListQuery } from '@src/store/services/driverApi'
import { formatDate } from '@src/utils/formatters'
import { Search } from 'lucide-react'

const DriversList = () => {
  const router = useRouter()
  const { data: driverListData } = useGetDriverListQuery({
    user_type: UserRoles.DRIVER,
  })
  const [searchQuery, setSearchQuery] = useState<string>('')

  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const driverData: any[] = driverListData?.data ?? []

  const filteredDriverRecords = driverData.filter((item: any) =>
    (item.name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedDrivers = filteredDriverRecords.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: accessorkeys.driversList.id,
        header: headerKeys.driversList.id,
        cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },
      {
        accessorKey: accessorkeys.driversList.name,
        header: headerKeys.driversList.name,
        cell: ({ row }: { row: { original: any } }) => (
          <div className="flex items-center gap-2">
            {row.original.photo_url ? (
              <img
                src={row.original.photo_url}
                alt={row.original.name}
                className="size-8 rounded-full object-cover"
              />
            ) : (
              <span className="size-8 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-dark-300">
                {(row.original.name ?? '?')[0].toUpperCase()}
              </span>
            )}
            <span>{row.original.name || '—'}</span>
          </div>
        ),
      },
      {
        accessorKey: accessorkeys.driversList.email,
        header: headerKeys.driversList.email,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.email || '—',
      },
      {
        accessorKey: accessorkeys.driversList.phoneNumber,
        header: headerKeys.driversList.phoneNumber,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.phone_number || '—',
      },
      {
        accessorKey: accessorkeys.driversList.approvalStatus,
        header: headerKeys.driversList.approvalStatus,
        cell: ({ row }: { row: { original: any } }) => {
          const status = row.original.approval_status as keyof typeof badgeMaps
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
        accessorKey: accessorkeys.driversList.isActive,
        header: headerKeys.driversList.isActive,
        cell: ({ row }: { row: { original: any } }) => {
          const key = String(
            row.original.is_active ?? false
          ) as keyof typeof badgeMaps
          const badge = badgeMaps[key] ?? badgeMaps['undefined']
          return (
            <span
              className={`badge inline-flex items-center gap-1 ${badge.className}`}>
              {badge.label}
            </span>
          )
        },
      },
      {
        accessorKey: accessorkeys.driversList.createdAt,
        header: headerKeys.driversList.createdAt,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.created_at ? formatDate(row.original.created_at) : '—',
      },
      {
        accessorKey: accessorkeys.driversList.actions,
        header: headerKeys.driversList.actions,
        cell: ({ row }: { row: { original: any } }) => (
          <div className="flex justify-end gap-2">
            <button
              className="btn btn-sub-primary btn-icon !size-8 rounded-md"
              onClick={() =>
                router.push(`${paths.USERS.DRIVER_DETAILS}/${row.original._id}`)
              }>
              <i className="ri-eye-line"></i>
            </button>
          </div>
        ),
      },
    ],
    [router]
  )

  return (
    <React.Fragment>
      <BreadCrumb title="Drivers List" subTitle="Drivers" />
      <div className="grid grid-cols-12 gap-x-space">
        <div className="col-span-12 card">
          <div className="card-header">
            <div className="grid items-center gap-3 grid-cols-12">
              <div className="col-span-12 md:col-span-9 lg:col-span-5 xxl:col-span-3">
                <div className="relative group/form grow">
                  <input
                    type="text"
                    className="ltr:pl-9 rtl:pr-9 form-input ltr:group-[&.right]/form:pr-9 rtl:group-[&.right]/form:pl-9 ltr:group-[&.right]/form:pl-4 rtl:group-[&.right]/form:pr-4"
                    placeholder="Search Driver"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button className="absolute inset-y-0 flex items-center ltr:left-3 rtl:right-3 ltr:group-[&.right]/form:right-3 rtl:group-[&.right]/form:left-3 ltr:group-[&.right]/form:left-auto rtl:group-[&.right]/form:right-auto focus:outline-hidden">
                    <Search className="text-gray-500 dark:text-dark-500 size-4 fill-gray-100 dark:fill-dark-850" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-0 card-body">
            <div>
              <TableContainer
                columns={columns}
                data={paginatedDrivers}
                thClass="!font-medium cursor-pointer"
                divClass="overflow-x-auto table-box whitespace-nowrap"
                lastTrClass="text-end"
                tableClass="table flush"
                thtrClass="text-gray-500 bg-gray-100 dark:bg-dark-850 dark:text-dark-500"
              />
              <Pagination
                totalItems={filteredDriverRecords.length}
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

export default DriversList
