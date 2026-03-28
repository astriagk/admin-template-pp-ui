'use client'

import React, { useMemo, useState } from 'react'

import { AdminListItem } from '@src/dtos/admin'
import BreadCrumb from '@src/shared/common/BreadCrumb'
import Pagination from '@src/shared/common/Pagination'
import {
  accessorkeys,
  badgeMaps,
  headerKeys,
} from '@src/shared/constants/columns'
import { STORAGE_KEYS, UserRoles } from '@src/shared/constants/enums'
import { MESSAGES } from '@src/shared/constants/messages'
import TableContainer from '@src/shared/custom/table/table'
import {
  useCreateAdminMutation,
  useDeactivateAdminMutation,
  useGetAdminListQuery,
} from '@src/store/services/adminApi'
import { useGetSchoolsListQuery } from '@src/store/services/schoolApi'
import { formatDate } from '@src/utils/formatters'
import LocalStorage from '@src/utils/LocalStorage'
import { CirclePlus, Search } from 'lucide-react'
import Select from 'react-select'
import { toast } from 'react-toastify'

const RegisterSchoolAdminModal = ({
  open,
  schoolId,
  onClose,
}: {
  open: boolean
  schoolId: string
  onClose: () => void
}) => {
  const [registerAdmin, { isLoading }] = useCreateAdminMutation()
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    admin_role: UserRoles.SCHOOL_ADMIN,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await registerAdmin({ school_id: schoolId, ...form }).unwrap()
      setForm({
        username: '',
        email: '',
        phone_number: '',
        password: '',
        admin_role: UserRoles.SCHOOL_ADMIN,
      })
      onClose()
      toast.success('Admin registered successfully')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to register admin')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-dark-900 rounded-lg shadow-xl w-full max-w-md p-6">
        <h5 className="text-lg font-semibold mb-4">Register School Admin</h5>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Name</label>
            <input
              className="form-input"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="form-label">Phone</label>
            <input
              className="form-input"
              value={form.phone_number}
              onChange={(e) =>
                setForm({ ...form, phone_number: e.target.value })
              }
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
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
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const SchoolAdminsList = () => {
  const { data: schoolsData } = useGetSchoolsListQuery()
  const [selectedSchoolId, setSelectedSchoolId] = React.useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deactivateAdmin] = useDeactivateAdminMutation()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const adminData = LocalStorage.getItem(STORAGE_KEYS.ADMIN)
  const user = adminData ? JSON.parse(adminData) : null
  const schoolId = user?.school_id

  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)

  const firstSchoolId = schoolId || selectedSchoolId || schoolsData?.data?.[0]?._id || ''

  const { data: schoolAdminsData } = useGetAdminListQuery()

  const schoolAdmins = useMemo(() => {
    return (
      schoolAdminsData?.data?.filter(
        (sa: AdminListItem) =>
          sa.is_active === true &&
          sa.admin_role === UserRoles.SCHOOL_ADMIN &&
          (schoolId ? (sa as any).school_id === schoolId : selectedSchoolId === '' || (sa as any).school_id === selectedSchoolId)
      ) || []
    )
  }, [schoolAdminsData, selectedSchoolId])

  const handleDeactivate = async (adminId: string) => {
    try {
      const result = await deactivateAdmin(adminId).unwrap()
      toast.success(result?.message || MESSAGES.ADMIN.SUCCESS.ADMIN_UPDATED)
    } catch (error: any) {
      const errorMsg =
        error?.data?.error ||
        error?.message ||
        MESSAGES.ADMIN.ERROR.UPDATE_FAILED
      toast.error(errorMsg)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const filteredRecords = schoolAdmins.filter((item: AdminListItem) =>
    (item.username ?? item.email ?? '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredRecords.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: accessorkeys.schoolAdminsList.id,
        header: headerKeys.schoolAdminsList.id,
        cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },
      {
        accessorKey: accessorkeys.schoolAdminsList.username,
        header: headerKeys.schoolAdminsList.username,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.username || '—',
      },
      {
        accessorKey: accessorkeys.schoolAdminsList.email,
        header: headerKeys.schoolAdminsList.email,
      },
      {
        accessorKey: accessorkeys.schoolAdminsList.phoneNumber,
        header: headerKeys.schoolAdminsList.phoneNumber,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.phone_number || '—',
      },
      {
        accessorKey: accessorkeys.schoolAdminsList.isActive,
        header: headerKeys.schoolAdminsList.isActive,
        cell: ({ row }: { row: { original: AdminListItem } }) => {
          const mapKey = String(
            row.original.is_active
          ) as keyof typeof badgeMaps
          const badge = badgeMaps[mapKey] ?? badgeMaps['undefined']
          return (
            <span
              className={`badge inline-flex items-center gap-1 ${badge.className}`}>
              {badge.label}
            </span>
          )
        },
      },
      {
        accessorKey: accessorkeys.schoolAdminsList.lastLogin,
        header: headerKeys.schoolAdminsList.lastLogin,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.last_login ? formatDate(row.original.last_login) : '—',
      },
      {
        accessorKey: accessorkeys.schoolAdminsList.createdAt,
        header: headerKeys.schoolAdminsList.createdAt,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.created_at ? formatDate(row.original.created_at) : '—',
      },
      {
        accessorKey: accessorkeys.schoolAdminsList.actions,
        header: headerKeys.schoolAdminsList.actions,
        cell: ({ row }: { row: { original: AdminListItem } }) => (
          <label className="switch-group switch-soft">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={row.original.is_active}
                onChange={() => {
                  handleDeactivate(row.original._id)
                }}
              />
              <div className="switch-wrapper peer-checked:!bg-green-500/15"></div>
              <div className="switch-dot peer-checked:translate-x-full rtl:peer-checked:-translate-x-full peer-checked:!bg-green-500"></div>
            </div>
          </label>
          // <div className="flex justify-end gap-2">
          //   <button
          //     className="btn btn-sub-red btn-icon !size-8 rounded-md"
          //     onClick={() => handleDeactivate(row.original._id)}>
          //     <i className="ri-user-unfollow-line"></i>
          //   </button>
          // </div>
        ),
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <BreadCrumb title="School Admins" subTitle="Schools" />
      <div className="grid grid-cols-12 gap-x-space">
        <div className="col-span-12 card">
          <div className="card-header">
            <div className="grid items-center gap-3 grid-cols-12">
              {!schoolId && (
                <div className="col-span-12 lg:col-span-4 xxl:col-span-3">
                  <div id="sortingByClass">
                    <Select
                      classNamePrefix="select"
                      options={(schoolsData?.data || []).map((school: any) => ({
                        value: school._id,
                        label: school.school_name,
                      }))}
                      value={
                        (schoolsData?.data || [])
                          .map((school: any) => ({
                            value: school._id,
                            label: school.school_name,
                          }))
                          .find((opt) => opt.value === selectedSchoolId) || null
                      }
                      onChange={(option: any) =>
                        setSelectedSchoolId(option ? option.value : '')
                      }
                      placeholder="Select school"
                      isClearable={true}
                    />
                  </div>
                </div>
              )}
              <div className="col-span-12 md:col-span-9 lg:col-span-4 xxl:col-span-3">
                <div className="relative group/form grow">
                  <input
                    type="text"
                    className="ltr:pl-9 rtl:pr-9 form-input ltr:group-[&.right]/form:pr-9 rtl:group-[&.right]/form:pl-9 ltr:group-[&.right]/form:pl-4 rtl:group-[&.right]/form:pr-4"
                    placeholder="Search by Username or Email"
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
                  Register Admin
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
      <RegisterSchoolAdminModal
        open={modalOpen}
        schoolId={firstSchoolId}
        onClose={() => setModalOpen(false)}
      />
    </React.Fragment>
  )
}

export default SchoolAdminsList
