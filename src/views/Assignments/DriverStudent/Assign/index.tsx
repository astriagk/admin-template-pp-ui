'use client'

import React, { useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Student } from '@src/dtos/student'
import BreadCrumb from '@src/shared/common/BreadCrumb'
import StudentSearchCard from '@src/shared/common/StudentSearchCard'
import {
  accessorkeys,
  badgeMaps,
  headerKeys,
} from '@src/shared/constants/columns'
import { STORAGE_KEYS } from '@src/shared/constants/enums'
import TableContainer from '@src/shared/custom/table/table'
import { useCreateSchoolAssignmentMutation } from '@src/store/services/assignmentApi'
import { useGetSchoolDriversQuery } from '@src/store/services/schoolAdminApi'
import { useGetStudentsBySchoolQuery } from '@src/store/services/studentApi'
import LocalStorage from '@src/utils/LocalStorage'
import { Search, Trash2, UserPlus } from 'lucide-react'
import Select from 'react-select'
import { toast } from 'react-toastify'

const AssignToStudents = () => {
  const router = useRouter()
  const user = LocalStorage.getItem(STORAGE_KEYS.ADMIN)
    ? JSON.parse(LocalStorage.getItem(STORAGE_KEYS.ADMIN)!)
    : null

  const schoolId = user?.school_id || ''

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([])
  const [selectedDriverId, setSelectedDriverId] = useState('')

  const { data: studentListData } = useGetStudentsBySchoolQuery(schoolId, {
    skip: !schoolId,
  })
  const { data: driversData } = useGetSchoolDriversQuery(schoolId, {
    skip: !schoolId,
  })
  const [createAssignment, { isLoading: isAssigning }] =
    useCreateSchoolAssignmentMutation()

  const allStudents: Student[] = studentListData?.data ?? []
  const selectedIds = new Set(selectedStudents.map((s) => s._id))

  const getStudentName = (student: Student) =>
    student.student_name || student.name || ''

  const getStudentClass = (student: Student) => {
    const cls = student.class || student.grade || ''
    const section = student.section || ''
    return section ? `${cls} - ${section}` : cls
  }

  const filteredStudents = allStudents.filter((student) => {
    if (selectedIds.has(student._id)) return false
    if (student.driver_assignment?.assignment_status === 'active') return false
    if (!searchQuery.trim()) return false
    return getStudentName(student)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  })

  const handleAddStudent = (student: Student) => {
    setSelectedStudents((prev) => [...prev, student])
  }

  const handleRemoveStudent = (studentId: string) => {
    setSelectedStudents((prev) => prev.filter((s) => s._id !== studentId))
  }

  const driverOptions = (driversData?.data || []).map((d) => ({
    value: d.driver_id || d._id,
    label: d.name || d.username,
  }))

  const handleAssign = async () => {
    if (!selectedDriverId) {
      toast.warning('Please select a driver before assigning.')
      return
    }
    if (selectedStudents.length === 0) return

    try {
      await createAssignment({
        schoolId,
        driver_id: selectedDriverId,
        student_ids: selectedStudents.map((s) => s._id),
      }).unwrap()
      toast.success(
        `Successfully assigned ${selectedStudents.length} student${selectedStudents.length > 1 ? 's' : ''} to driver.`
      )
      setSelectedStudents([])
      setSelectedDriverId('')
      setSearchQuery('')
      router.push('/assignments/driver-student/list')
    } catch (error: any) {
      toast.error(
        error?.data?.error ||
          error?.data?.message ||
          error?.message ||
          'Failed to create assignment.'
      )
    }
  }

  const selectedColumns = useMemo(
    () => [
      {
        accessorKey: accessorkeys.assignStudentsList.id,
        header: headerKeys.assignStudentsList.id,
        cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },
      {
        accessorKey: accessorkeys.assignStudentsList.name,
        header: headerKeys.assignStudentsList.name,
        cell: ({ row }: { row: { original: Student } }) =>
          getStudentName(row.original) || '—',
      },
      {
        accessorKey: accessorkeys.assignStudentsList.classSection,
        header: headerKeys.assignStudentsList.classSection,
        cell: ({ row }: { row: { original: Student } }) =>
          getStudentClass(row.original) || '—',
      },
      {
        accessorKey: accessorkeys.assignStudentsList.rollNumber,
        header: headerKeys.assignStudentsList.rollNumber,
        cell: ({ row }: { row: { original: Student } }) =>
          row.original.roll_number || '—',
      },
      {
        accessorKey: accessorkeys.assignStudentsList.gender,
        header: headerKeys.assignStudentsList.gender,
        cell: ({ row }: { row: { original: Student } }) =>
          row.original.gender || '—',
      },
      {
        accessorKey: accessorkeys.assignStudentsList.isActive,
        header: headerKeys.assignStudentsList.isActive,
        cell: ({ row }: { row: { original: Student } }) => {
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
        accessorKey: accessorkeys.assignStudentsList.actions,
        header: headerKeys.assignStudentsList.actions,
        cell: ({ row }: { row: { original: Student } }) => (
          <div className="flex justify-end gap-2">
            <button
              className="btn btn-sub-red btn-icon !size-8 rounded-md"
              title="Remove"
              onClick={() => handleRemoveStudent(row.original._id)}>
              <Trash2 className="size-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <BreadCrumb title="Assign Students to Driver" subTitle="Assignments" />
      <div className="grid grid-cols-12 gap-x-space">
        {/* Card 1: Search Students */}
        <div className="col-span-12 card">
          <div className="card-body">
            <div className="relative group/form mb-4 max-w-md">
              <input
                type="text"
                className="ltr:pl-9 rtl:pr-9 form-input ltr:group-[&.right]/form:pr-9 rtl:group-[&.right]/form:pl-9 ltr:group-[&.right]/form:pl-4 rtl:group-[&.right]/form:pr-4"
                placeholder="Search by student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute inset-y-0 flex items-center ltr:left-3 rtl:right-3 focus:outline-hidden">
                <Search className="text-gray-500 dark:text-dark-500 size-4 fill-gray-100 dark:fill-dark-850" />
              </button>
            </div>

            {searchQuery.trim() && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredStudents.length === 0 ? (
                  <p className="text-gray-500 dark:text-dark-500 col-span-full text-center py-4">
                    No students found matching &quot;{searchQuery}&quot;
                  </p>
                ) : (
                  filteredStudents.map((student) => (
                    <StudentSearchCard
                      key={student._id}
                      student={student}
                      onAdd={handleAddStudent}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Selected Students + Driver Selection + Assign */}
        {selectedStudents.length > 0 && (
          <div className="col-span-12 card">
            <div className="card-header flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <h6 className="card-title">
                  Selected Students ({selectedStudents.length})
                </h6>
                <p className="text-gray-500 dark:text-dark-500 text-sm">
                  Select a driver and assign these students
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="min-w-[220px]">
                  <Select<{ value: string; label: string }>
                    classNamePrefix="select"
                    options={driverOptions}
                    value={
                      driverOptions.find((o) => o.value === selectedDriverId) ||
                      null
                    }
                    onChange={(option) =>
                      setSelectedDriverId(option?.value || '')
                    }
                    placeholder="Select a driver"
                    isClearable={true}
                  />
                </div>
                <button
                  className="btn btn-primary shrink-0"
                  disabled={isAssigning}
                  onClick={handleAssign}>
                  <UserPlus className="inline-block ltr:mr-1 rtl:ml-1 size-4" />
                  {isAssigning
                    ? 'Assigning...'
                    : `Assign ${selectedStudents.length} Student${selectedStudents.length > 1 ? 's' : ''}`}
                </button>
              </div>
            </div>
            <div className="pt-0 card-body">
              <TableContainer
                columns={selectedColumns}
                data={selectedStudents}
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

export default AssignToStudents
