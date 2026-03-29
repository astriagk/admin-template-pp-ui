'use client'

import React, { useMemo, useState } from 'react'

import { SchoolDriverItem } from '@src/dtos/schoolAdmin'
import BreadCrumb from '@src/shared/common/BreadCrumb'
import Pagination from '@src/shared/common/Pagination'
import {
  accessorkeys,
  badgeMaps,
  headerKeys,
} from '@src/shared/constants/columns'
import { STORAGE_KEYS } from '@src/shared/constants/enums'
import UnassignDriverModal from './UnassignDriverModal'
import TableContainer from '@src/shared/custom/table/table'
import {
  useGetSchoolDriversQuery,
  useRemoveDriverFromSchoolMutation,
} from '@src/store/services/schoolAdminApi'
import { useGetSchoolsListQuery } from '@src/store/services/schoolApi'
import LocalStorage from '@src/utils/LocalStorage'
import { Search } from 'lucide-react'
import Select from 'react-select'

const ApprovalBadge = ({ status }: { status: string }) => {
  const { label, className } = badgeMaps[status as keyof typeof badgeMaps]
  return (
    <span className={`badge inline-flex items-center gap-1 ${className}`}>
      {label}
    </span>
  )
}

const SchoolDriversList = () => {
  const { data: schoolsData } = useGetSchoolsListQuery()
  const [selectedSchoolId, setSelectedSchoolId] = React.useState<string>(() => {
    const first = schoolsData?.data?.[0]?._id
    return first || ''
  })
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [driverToUnassign, setDriverToUnassign] =
    useState<SchoolDriverItem | null>(null)
  const [isUnassigning, setIsUnassigning] = useState(false)
  const [removeDriver] = useRemoveDriverFromSchoolMutation()
  const adminData = LocalStorage.getItem(STORAGE_KEYS.ADMIN)
  const user = adminData ? JSON.parse(adminData) : null
  const schoolId = user?.school_id

  //pagination
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)

  const firstSchoolId =
    schoolId || selectedSchoolId || schoolsData?.data?.[0]?._id || ''

  const { data: schoolDriversData } = useGetSchoolDriversQuery(firstSchoolId, {
    skip: !firstSchoolId,
  })

  const handleConfirmUnassign = async () => {
    if (!driverToUnassign) return
    setIsUnassigning(true)
    try {
      await removeDriver(driverToUnassign.user_id).unwrap()
    } catch {
      // error handled by mutation
    } finally {
      setIsUnassigning(false)
      setDriverToUnassign(null)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const driversArr: SchoolDriverItem[] = schoolDriversData?.data ?? []

  const filteredRecords = driversArr.filter((item: SchoolDriverItem) =>
    (item.username ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredRecords.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: accessorkeys.schoolDriversList.id,
        header: headerKeys.schoolDriversList.id,
        cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },
      {
        accessorKey: accessorkeys.schoolDriversList.username,
        header: headerKeys.schoolDriversList.username,
      },
      {
        accessorKey: accessorkeys.schoolDriversList.vehicleNumber,
        header: headerKeys.schoolDriversList.vehicleNumber,
      },
      {
        accessorKey: accessorkeys.schoolDriversList.vehicleType,
        header: headerKeys.schoolDriversList.vehicleType,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.vehicle_type.toUpperCase(),
      },
      {
        accessorKey: accessorkeys.schoolDriversList.capacity,
        header: headerKeys.schoolDriversList.capacity,
      },
      {
        accessorKey: accessorkeys.schoolDriversList.approvalStatus,
        header: headerKeys.schoolDriversList.approvalStatus,
        cell: ({ row }: { row: { original: SchoolDriverItem } }) => (
          <ApprovalBadge status={row.original.approval_status} />
        ),
      },

      {
        accessorKey: accessorkeys.schoolDriversList.actions,
        header: headerKeys.schoolDriversList.actions,
        cell: ({ row }: { row: { original: SchoolDriverItem } }) => {
          return (
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-sub-red btn-icon !size-8 rounded-md"
                title="Unassign from school"
                onClick={() => setDriverToUnassign(row.original)}>
                <i className="ri-user-unfollow-line"></i>
              </button>
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <BreadCrumb title="School Drivers" subTitle="Schools" />
      <div className="grid grid-cols-12 gap-x-space">
        <div className="col-span-12 card">
          <div className="card-header">
            <div className="grid items-center gap-3 grid-cols-12">
              {!schoolId && (
                <div className="col-span-12 lg:col-span-4 xxl:col-span-3">
                  {(() => {
                    const schoolOptions = (schoolsData?.data || []).map(
                      (school: any) => ({
                        value: school._id,
                        label: school.school_name,
                      })
                    )
                    const selectedOption =
                      schoolOptions.find(
                        (opt) => opt.value === selectedSchoolId
                      ) || null
                    return (
                      <Select
                        classNamePrefix="select"
                        options={schoolOptions}
                        value={selectedOption}
                        onChange={(option: any) =>
                          setSelectedSchoolId(option ? option.value : '')
                        }
                        placeholder="Select school"
                        isClearable={true}
                      />
                    )
                  })()}
                </div>
              )}
              <div className="col-span-12 md:col-span-9 lg:col-span-4 xxl:col-span-3">
                <div className="relative group/form grow">
                  <input
                    type="text"
                    className="ltr:pl-9 rtl:pr-9 form-input ltr:group-[&.right]/form:pr-9 rtl:group-[&.right]/form:pl-9 ltr:group-[&.right]/form:pl-4 rtl:group-[&.right]/form:pr-4"
                    placeholder="Search Driver"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button className="absolute inset-y-0 flex items-center ltr:left-3 rtl:right-3 focus:outline-hidden">
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
      <UnassignDriverModal
        driver={driverToUnassign}
        isUnassigning={isUnassigning}
        onConfirm={handleConfirmUnassign}
        onClose={() => setDriverToUnassign(null)}
      />
    </React.Fragment>
  )
}

export default SchoolDriversList
