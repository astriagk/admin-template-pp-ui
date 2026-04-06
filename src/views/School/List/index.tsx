'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import { SchoolListItem } from '@src/dtos/school'
import BreadCrumb from '@src/shared/common/BreadCrumb'
import Pagination from '@src/shared/common/Pagination'
import {
  accessorkeys,
  badgeMaps,
  headerKeys,
} from '@src/shared/constants/columns'
import { ModelModes } from '@src/shared/constants/enums'
import TableContainer from '@src/shared/custom/table/table'
import { useGetSchoolsListQuery } from '@src/store/services/schoolApi'
import { formatDate } from '@src/utils/formatters'
import { CirclePlus, Search } from 'lucide-react'

import AddSchoolModal from './addSchoolModal'

const SchoolsList = () => {
  const router = useRouter()
  const { data: schoolsListData } = useGetSchoolsListQuery()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [addSchoolModalOpen, setAddSchoolModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ModelModes>(ModelModes.ADD)
  const [selectedSchool, setSelectedSchool] = useState<SchoolListItem | null>(
    null
  )

  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleAddSchool = () => {
    setModalMode(ModelModes.ADD)
    setSelectedSchool(null)
    setAddSchoolModalOpen(true)
  }

  const handleEditSchool = (school: SchoolListItem) => {
    setModalMode(ModelModes.EDIT)
    setSelectedSchool(school)
    setAddSchoolModalOpen(true)
  }

  const handleViewSchool = (school: SchoolListItem) => {
    setModalMode(ModelModes.VIEW)
    setSelectedSchool(school)
    setAddSchoolModalOpen(true)
  }

  const schoolData: SchoolListItem[] = schoolsListData?.data ?? []

  const filteredSchoolRecords = schoolData.filter((item: SchoolListItem) =>
    item.school_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSchools = filteredSchoolRecords.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: accessorkeys.schoolsList.id,
        header: headerKeys.schoolsList.id,
        cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },
      {
        accessorKey: accessorkeys.schoolsList.schoolName,
        header: headerKeys.schoolsList.schoolName,
      },
      {
        accessorKey: accessorkeys.schoolsList.cityState,
        header: headerKeys.schoolsList.cityState,
        cell: ({ row }: { row: { original: any } }) => {
          const city = row.original.city || ''
          const state = row.original.state || ''
          if (!city && !state) return '—'
          return [city, state].filter(Boolean).join(', ')
        },
      },
      {
        accessorKey: accessorkeys.schoolsList.contact,
        header: headerKeys.schoolsList.contact,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.contact_number || '—',
      },
      {
        accessorKey: accessorkeys.schoolsList.email,
        header: headerKeys.schoolsList.email,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.email || '—',
      },
      {
        accessorKey: accessorkeys.schoolsList.driverCount,
        header: headerKeys.schoolsList.driverCount,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.driver_count ?? '—',
      },
      {
        accessorKey: accessorkeys.schoolsList.studentCount,
        header: headerKeys.schoolsList.studentCount,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.student_count ?? '—',
      },
      {
        accessorKey: accessorkeys.schoolsList.createdAt,
        header: headerKeys.schoolsList.createdAt,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.created_at ? formatDate(row.original.created_at) : '—',
      },
      {
        accessorKey: accessorkeys.schoolsList.actions,
        header: headerKeys.schoolsList.actions,
        cell: ({ row }: { row: { original: SchoolListItem } }) => {
          return (
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-sub-primary btn-icon !size-8 rounded-md"
                onClick={() => handleViewSchool(row.original)}>
                <i className="ri-eye-line"></i>
              </button>
              <button
                className="btn btn-sub-gray btn-icon !size-8 rounded-md"
                onClick={() => handleEditSchool(row.original)}>
                <i className="ri-pencil-line"></i>
              </button>
            </div>
          )
        },
      },
    ],
    [router]
  )

  return (
    <React.Fragment>
      <BreadCrumb title="Schools List" subTitle="Schools" />
      <div className="grid grid-cols-12 gap-x-space">
        <div className="col-span-12 card">
          <div className="card-header">
            <div className="grid items-center gap-3 grid-cols-12">
              <div className="col-span-12 md:col-span-9 lg:col-span-5 xxl:col-span-3">
                <div className="relative group/form grow">
                  <input
                    type="text"
                    className="ltr:pl-9 rtl:pr-9 form-input ltr:group-[&.right]/form:pr-9 rtl:group-[&.right]/form:pl-9 ltr:group-[&.right]/form:pl-4 rtl:group-[&.right]/form:pr-4"
                    placeholder="Search School"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button className="absolute inset-y-0 flex items-center ltr:left-3 rtl:right-3 ltr:group-[&.right]/form:right-3 rtl:group-[&.right]/form:left-3 ltr:group-[&.right]/form:left-auto rtl:group-[&.right]/form:right-auto focus:outline-hidden">
                    <Search className="text-gray-500 dark:text-dark-500 size-4 fill-gray-100 dark:fill-dark-850" />
                  </button>
                </div>
              </div>
              <div className="col-span-12 md:col-span-3 lg:col-span-3 lg:col-start-10 xxl:col-span-2 xxl:col-start-11 ltr:md:text-right rtl:md:text-left">
                <button
                  className="btn btn-primary shrink-0"
                  onClick={handleAddSchool}>
                  <CirclePlus className="inline-block ltr:mr-1 rtl:ml-1 size-4" />{' '}
                  Add School
                </button>
              </div>
            </div>
          </div>

          <div className="pt-0 card-body">
            <div>
              <TableContainer
                columns={columns}
                data={paginatedSchools}
                thClass="!font-medium cursor-pointer"
                divClass="overflow-x-auto table-box whitespace-nowrap"
                lastTrClass="text-end"
                tableClass="table flush"
                thtrClass="text-gray-500 bg-gray-100 dark:bg-dark-850 dark:text-dark-500"
              />
              <Pagination
                totalItems={filteredSchoolRecords.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
      <AddSchoolModal
        show={addSchoolModalOpen}
        handleHide={() => setAddSchoolModalOpen(false)}
        mode={modalMode}
        schoolData={selectedSchool}
      />
    </React.Fragment>
  )
}

export default SchoolsList
