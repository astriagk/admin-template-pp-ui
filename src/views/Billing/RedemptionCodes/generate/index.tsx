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
import { useGetSchoolsListQuery } from '@src/store/services/schoolApi'
import { useGetStudentsBySchoolQuery } from '@src/store/services/studentApi'
import {
  useGenerateRedemptionCodesMutation,
  useGetSchoolSubscriptionsQuery,
} from '@src/store/services/subscriptionApi'
import LocalStorage from '@src/utils/LocalStorage'
import { formatDate } from '@src/utils/formatters'
import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Search,
  Ticket,
  Trash2,
} from 'lucide-react'
import Select from 'react-select'
import { toast } from 'react-toastify'

const RedemptionCodesGenerate = () => {
  const router = useRouter()
  const user = LocalStorage.getItem(STORAGE_KEYS.ADMIN)
    ? JSON.parse(LocalStorage.getItem(STORAGE_KEYS.ADMIN)!)
    : null

  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(
    user?.school_id || ''
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([])

  const { data: schoolsData } = useGetSchoolsListQuery()
  const { data: studentListData } = useGetStudentsBySchoolQuery(
    selectedSchoolId,
    { skip: !selectedSchoolId }
  )
  const { data: subscriptionsData, isLoading: isSubLoading } =
    useGetSchoolSubscriptionsQuery(selectedSchoolId, {
      skip: !selectedSchoolId,
    })
  const [generateCodes, { isLoading: isGenerating }] =
    useGenerateRedemptionCodesMutation()

  const activeSubscription = subscriptionsData?.data?.find(
    (sub) => sub.subscription_status === 'active'
  )
  const hasActiveSubscription = !!activeSubscription

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
    if (student.redemption_code?.is_redeemed) return false
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

  const handleGenerateCodes = async () => {
    if (!activeSubscription?._id || selectedStudents.length === 0) return

    try {
      await generateCodes({
        subscriptionId: activeSubscription._id,
        studentIds: selectedStudents.map((s) => s._id),
      }).unwrap()
      toast.success(
        `Successfully generated ${selectedStudents.length} redemption code(s).`
      )
      setSelectedStudents([])
      setSearchQuery('')
      router.push('/billing/redemption-codes/list')
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          'Failed to generate redemption codes.'
      )
    }
  }

  const selectedColumns = useMemo(
    () => [
      {
        accessorKey: accessorkeys.generateCodesList.id,
        header: headerKeys.generateCodesList.id,
        cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },
      {
        accessorKey: accessorkeys.generateCodesList.name,
        header: headerKeys.generateCodesList.name,
        cell: ({ row }: { row: { original: Student } }) =>
          getStudentName(row.original) || '—',
      },
      {
        accessorKey: accessorkeys.generateCodesList.classSection,
        header: headerKeys.generateCodesList.classSection,
        cell: ({ row }: { row: { original: Student } }) =>
          getStudentClass(row.original) || '—',
      },
      {
        accessorKey: accessorkeys.generateCodesList.rollNumber,
        header: headerKeys.generateCodesList.rollNumber,
        cell: ({ row }: { row: { original: Student } }) =>
          row.original.roll_number || '—',
      },
      {
        accessorKey: accessorkeys.generateCodesList.isActive,
        header: headerKeys.generateCodesList.isActive,
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
        accessorKey: accessorkeys.generateCodesList.actions,
        header: headerKeys.generateCodesList.actions,
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
      <BreadCrumb title="Generate Redemption Codes" subTitle="Billing" />
      <div className="grid grid-cols-12 gap-x-space">
        {/* Card 1: School & Subscription */}
        <div className="col-span-12 card">
          {!user?.school_id && (
            <div className="card-body pb-0">
              <div className="max-w-md">
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
                    setSelectedStudents([])
                    setSearchQuery('')
                  }}
                  placeholder="Select a school"
                  isClearable={true}
                />
              </div>
            </div>
          )}

          {selectedSchoolId && !isSubLoading && hasActiveSubscription && (
            <>
              <div className="card-header">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                    <CreditCard className="size-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h6 className="card-title">
                        {activeSubscription?.plan?.plan_name || '—'}
                      </h6>
                      {activeSubscription?.plan?.plan_type && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 capitalize">
                          <CalendarDays className="size-3" />
                          {activeSubscription.plan.plan_type}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activeSubscription?.subscription_status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
                            : activeSubscription?.subscription_status ===
                                'expired'
                              ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-dark-700 dark:text-dark-300'
                        }`}>
                        <BadgeCheck className="size-3" />
                        {badgeMaps[
                          activeSubscription?.subscription_status as keyof typeof badgeMaps
                        ]?.label ?? activeSubscription?.subscription_status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-dark-400 mt-0.5">
                      {activeSubscription?.school_name || '—'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-body grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-gray-400 dark:text-dark-500 uppercase tracking-wide">
                    Validity
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-dark-200">
                    <CalendarDays className="size-4 text-gray-400 dark:text-dark-500 shrink-0" />
                    <span className="text-gray-400 dark:text-dark-500 text-xs">
                      From
                    </span>
                    <span className="font-medium">
                      {formatDate(activeSubscription?.start_date || '')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-dark-200">
                    <CalendarDays className="size-4 text-gray-400 dark:text-dark-500 shrink-0" />
                    <span className="text-gray-400 dark:text-dark-500 text-xs">
                      To
                    </span>
                    <span className="font-medium">
                      {formatDate(activeSubscription?.end_date || '')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-gray-400 dark:text-dark-500 uppercase tracking-wide">
                    Features
                  </span>
                  {activeSubscription?.plan?.features?.map((f) => (
                    <div
                      key={f.key}
                      className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-dark-200">
                      <CheckCircle2 className="size-3.5 text-green-500 shrink-0" />
                      {f.label}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedSchoolId && !isSubLoading && !hasActiveSubscription && (
            <div className="card-body">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  No active subscription found for this school. Please create or
                  activate a subscription first.
                </p>
              </div>
            </div>
          )}

          {selectedSchoolId && isSubLoading && (
            <div className="card-body">
              <p className="text-gray-500 dark:text-dark-500 text-sm">
                Loading subscription info...
              </p>
            </div>
          )}
        </div>

        {/* Card 2: Search Students */}
        {hasActiveSubscription && (
          <div className="col-span-12 card">
            <div className="card-header">
              <div className="relative group/form max-w-xs w-full">
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
            </div>
            <div className="card-body">
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
        )}

        {/* Card 3: Selected Students Table */}
        {selectedStudents.length > 0 && (
          <div className="col-span-12 card">
            <div className="card-header flex items-center justify-between">
              <div>
                <h6 className="card-title">
                  Selected Students ({selectedStudents.length})
                </h6>
                <p className="text-gray-500 dark:text-dark-500 text-sm">
                  Review and generate redemption codes for selected students
                </p>
              </div>
              <button
                className="btn btn-primary shrink-0"
                disabled={isGenerating}
                onClick={handleGenerateCodes}>
                <Ticket className="inline-block ltr:mr-1 rtl:ml-1 size-4" />
                {isGenerating
                  ? 'Generating...'
                  : `Generate ${selectedStudents.length} Code${selectedStudents.length > 1 ? 's' : ''}`}
              </button>
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

export default RedemptionCodesGenerate
