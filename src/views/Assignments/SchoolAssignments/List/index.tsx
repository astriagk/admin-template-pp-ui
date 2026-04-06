'use client'

import React, { useMemo, useState } from 'react'

import { SchoolAssignment } from '@src/dtos/assignment'
import BreadCrumb from '@src/shared/common/BreadCrumb'
import Pagination from '@src/shared/common/Pagination'
import {
  accessorkeys,
  badgeMaps,
  headerKeys,
} from '@src/shared/constants/columns'
import { STORAGE_KEYS } from '@src/shared/constants/enums'
import TableContainer from '@src/shared/custom/table/table'
import {
  useApproveSchoolAssignmentMutation,
  useCreateSchoolAssignmentMutation,
  useGetSchoolAssignmentsQuery,
  useRejectSchoolAssignmentMutation,
} from '@src/store/services/assignmentApi'
import { useGetDriverListQuery } from '@src/store/services/driverApi'
import { useGetSchoolsListQuery } from '@src/store/services/schoolApi'
import { formatAmount, formatDate } from '@src/utils/formatters'
import LocalStorage from '@src/utils/LocalStorage'
import { CirclePlus, Search } from 'lucide-react'
import Select from 'react-select'
import { toast } from 'react-toastify'

const CreateSchoolAssignmentModal = ({
  open,
  schoolId,
  onClose,
}: {
  open: boolean
  schoolId: string
  onClose: () => void
}) => {
  const { data: driversData } = useGetDriverListQuery()
  const [createAssignment, { isLoading }] = useCreateSchoolAssignmentMutation()
  const [selectedDriverId, setSelectedDriverId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDriverId) return
    try {
      await createAssignment({
        schoolId,
        driver_id: selectedDriverId,
        student_ids: [],
      }).unwrap()
      setSelectedDriverId('')
      onClose()
      toast.success('Assignment created successfully')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create assignment')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-dark-900 rounded-lg shadow-xl w-full max-w-md p-6">
        <h5 className="text-lg font-semibold mb-4">Create School Assignment</h5>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Select Driver</label>
            <select
              className="form-select"
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              required>
              <option value="">-- Select Driver --</option>
              {driversData?.data?.map((d: any) => (
                <option key={d._id} value={d._id}>
                  {d.name ?? d.username}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="btn btn-light btn-sm"
              onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isLoading}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const SchoolAssignmentsList = () => {
  const { data: schoolsData } = useGetSchoolsListQuery()
  const [selectedSchoolId, setSelectedSchoolId] = React.useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const adminData = LocalStorage.getItem(STORAGE_KEYS.ADMIN)
  const user = adminData ? JSON.parse(adminData) : null
  const schoolId = user?.school_id
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [approveAssignment] = useApproveSchoolAssignmentMutation()
  const [rejectAssignment] = useRejectSchoolAssignmentMutation()

  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)

  const schoolOptions = (schoolsData?.data || []).map((school: any) => ({
    value: school._id,
    label: school.school_name,
  }))
  const selectedSchoolOption =
    schoolOptions.find((opt) => opt.value === selectedSchoolId) || null
  const handleSelectSchool = (option: any) => {
    setSelectedSchoolId(option ? option.value : '')
  }

  const firstSchoolId = schoolId || selectedSchoolId || schoolsData?.data?.[0]?._id || ''

  const { data: assignmentsData } = useGetSchoolAssignmentsQuery(
    firstSchoolId,
    { skip: !firstSchoolId }
  )

  const handleApprove = (assignmentId: string) =>
    approveAssignment(assignmentId)

  const handleReject = (assignmentId: string) => {
    const reason = window.prompt('Rejection reason (optional):') ?? ''
    rejectAssignment({ assignmentId, reason })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const assignmentsArr: SchoolAssignment[] = assignmentsData?.data ?? []

  const filteredRecords = assignmentsArr.filter((item: SchoolAssignment) =>
    (item.driver?.name ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredRecords.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: accessorkeys.schoolAssignmentsList.id,
        header: headerKeys.schoolAssignmentsList.id,
        cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },
      {
        accessorKey: accessorkeys.schoolAssignmentsList.driverName,
        header: headerKeys.schoolAssignmentsList.driverName,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.driver?.name || '—',
      },
      {
        accessorKey: accessorkeys.schoolAssignmentsList.driverUniqueId,
        header: headerKeys.schoolAssignmentsList.driverUniqueId,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.driver_unique_id || '—',
      },
      {
        accessorKey: accessorkeys.schoolAssignmentsList.studentName,
        header: headerKeys.schoolAssignmentsList.studentName,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.student_name || '—',
      },
      {
        accessorKey: accessorkeys.schoolAssignmentsList.parentName,
        header: headerKeys.schoolAssignmentsList.parentName,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.parent_name || '—',
      },
      {
        accessorKey: accessorkeys.schoolAssignmentsList.classSection,
        header: headerKeys.schoolAssignmentsList.classSection,
        cell: ({ row }: { row: { original: any } }) => {
          const cls = row.original.class || ''
          const section = row.original.section || ''
          if (!cls) return '—'
          return section ? `${cls} - ${section}` : cls
        },
      },
      {
        accessorKey: accessorkeys.schoolAssignmentsList.monthlyFee,
        header: headerKeys.schoolAssignmentsList.monthlyFee,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.monthly_fee != null
            ? formatAmount(row.original.monthly_fee)
            : '—',
      },
      {
        accessorKey: accessorkeys.schoolAssignmentsList.assignmentStatus,
        header: headerKeys.schoolAssignmentsList.assignmentStatus,
        cell: ({ row }: { row: { original: any } }) => {
          const status = (row.original.assignment_status ??
            row.original.status) as keyof typeof badgeMaps
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
        accessorKey: accessorkeys.schoolAssignmentsList.source,
        header: headerKeys.schoolAssignmentsList.source,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.assignment_source || row.original.source || '—',
      },
      {
        accessorKey: accessorkeys.schoolAssignmentsList.rejectionReason,
        header: headerKeys.schoolAssignmentsList.rejectionReason,
        cell: ({ row }: { row: { original: any } }) => {
          const status = row.original.assignment_status ?? row.original.status
          const reason = row.original.rejection_reason
          if (status !== 'rejected' || !reason) return '—'
          return <span className="text-red-600 text-sm">{reason}</span>
        },
      },
      {
        accessorKey: accessorkeys.schoolAssignmentsList.assignedDate,
        header: headerKeys.schoolAssignmentsList.assignedDate,
        cell: ({ row }: { row: { original: any } }) => {
          const date = row.original.assigned_date ?? row.original.created_at
          return date ? formatDate(date) : '—'
        },
      },
      {
        accessorKey: accessorkeys.schoolAssignmentsList.startDate,
        header: headerKeys.schoolAssignmentsList.startDate,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.start_date ? formatDate(row.original.start_date) : '—',
      },
      {
        accessorKey: accessorkeys.schoolAssignmentsList.actions,
        header: headerKeys.schoolAssignmentsList.actions,
        cell: ({ row }: { row: { original: SchoolAssignment } }) => {
          const id = row.original._id
          const status = row.original.status ?? (row.original as any).status
          return (
            <div className="flex justify-end gap-2">
              {status === 'pending' && (
                <>
                  <button
                    className="btn btn-green btn-sm"
                    onClick={() => handleApprove(id)}>
                    Approve
                  </button>
                  <button
                    className="btn btn-red btn-sm"
                    onClick={() => handleReject(id)}>
                    Reject
                  </button>
                </>
              )}
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <BreadCrumb title="School Assignments" subTitle="Assignments" />
      <div className="grid grid-cols-12 gap-x-space">
        <div className="col-span-12 card">
          <div className="card-header">
            <div className="grid items-center gap-3 grid-cols-12">
              {!schoolId && (
                <div className="col-span-12 lg:col-span-4 xxl:col-span-3">
                  <Select
                    classNamePrefix="select"
                    options={schoolOptions}
                    value={selectedSchoolOption}
                    onChange={handleSelectSchool}
                    placeholder="Select school"
                    isClearable={true}
                  />
                </div>
              )}
              <div className="col-span-12 md:col-span-9 lg:col-span-4 xxl:col-span-3">
                <div className="relative group/form grow">
                  <input
                    type="text"
                    className="ltr:pl-9 rtl:pr-9 form-input ltr:group-[&.right]/form:pr-9 rtl:group-[&.right]/form:pl-9 ltr:group-[&.right]/form:pl-4 rtl:group-[&.right]/form:pr-4"
                    placeholder="Search by Driver"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button className="absolute inset-y-0 flex items-center ltr:left-3 rtl:right-3 focus:outline-hidden">
                    <Search className="text-gray-500 dark:text-dark-500 size-4 fill-gray-100 dark:fill-dark-850" />
                  </button>
                </div>
              </div>
              <div className="col-span-12 md:col-span-3 lg:col-span-3 lg:col-start-11 xxl:col-span-2 xxl:col-start-11 ltr:md:text-right rtl:md:text-left">
                <button
                  className="btn btn-primary shrink-0"
                  disabled={!firstSchoolId}
                  onClick={() => setModalOpen(true)}>
                  <CirclePlus className="inline-block ltr:mr-1 rtl:ml-1 size-4" />
                  Create Assignment
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
      <CreateSchoolAssignmentModal
        open={modalOpen}
        schoolId={firstSchoolId}
        onClose={() => setModalOpen(false)}
      />
    </React.Fragment>
  )
}

export default SchoolAssignmentsList
