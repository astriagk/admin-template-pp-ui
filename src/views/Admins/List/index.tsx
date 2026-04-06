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
import { ModelModes, UserRoles, UserRolesType } from '@src/shared/constants/enums'
import { MESSAGES } from '@src/shared/constants/messages'
import TableContainer from '@src/shared/custom/table/table'
import {
  useActivateAdminMutation,
  useDeactivateAdminMutation,
  useGetAdminListQuery,
} from '@src/store/services/adminApi'
import { formatDate } from '@src/utils/formatters'
import { CirclePlus, Search } from 'lucide-react'
import Select from 'react-select'
import { toast } from 'react-toastify'

import AdminModal, { AdminModalState } from './components/adminModal'

const roleOptions = Object.entries(UserRolesType).map(([value, label]) => ({
  value,
  label,
}))

const AdminsList = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<string>('')
  const { data: adminListData } = useGetAdminListQuery()
  const [activateAdmin] = useActivateAdminMutation()
  const [deactivateAdmin] = useDeactivateAdminMutation()
  const [modal, setModal] = useState<AdminModalState>({
    open: false,
    mode: ModelModes.CREATE,
    data: null,
  })

  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const adminData: AdminListItem[] = adminListData?.data ?? []

  const filteredRecords = adminData.filter((item: AdminListItem) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      item.username.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.phone_number.includes(searchQuery)
    const matchesRole = selectedRole === '' || item.admin_role === selectedRole
    return matchesSearch && matchesRole
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredRecords.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const openCreate = () =>
    setModal({ open: true, mode: ModelModes.CREATE, data: null })
  const openEdit = (row: any) =>
    setModal({ open: true, mode: ModelModes.EDIT, data: row })
  const closeModal = () =>
    setModal({ open: false, mode: ModelModes.CREATE, data: null })

  const handleActivate = async (_id: string) => {
    try {
      const result = await activateAdmin(_id).unwrap()
      toast.success(result?.message || MESSAGES.ADMIN.SUCCESS.ADMIN_UPDATED)
    } catch (error: any) {
      toast.error(
        error?.data?.error ||
          error?.message ||
          MESSAGES.ADMIN.ERROR.UPDATE_FAILED
      )
    }
  }

  const handleDeactivate = async (_id: string) => {
    try {
      const result = await deactivateAdmin(_id).unwrap()
      toast.success(result?.message || MESSAGES.ADMIN.SUCCESS.ADMIN_UPDATED)
    } catch (error: any) {
      toast.error(
        error?.data?.error ||
          error?.message ||
          MESSAGES.ADMIN.ERROR.UPDATE_FAILED
      )
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: accessorkeys.adminList.id,
        header: headerKeys.adminList.id,
        cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },
      {
        accessorKey: accessorkeys.adminList.username,
        header: headerKeys.adminList.username,
      },
      {
        accessorKey: accessorkeys.adminList.email,
        header: headerKeys.adminList.email,
      },
      {
        accessorKey: accessorkeys.adminList.phoneNumber,
        header: headerKeys.adminList.phoneNumber,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.phone_number || '—',
      },
      {
        accessorKey: accessorkeys.adminList.adminRole,
        header: headerKeys.adminList.adminRole,
        cell: ({ row }: { row: { original: any } }) => {
          const role = row.original.admin_role as keyof typeof badgeMaps
          const badge = badgeMaps[role] ?? badgeMaps['undefined']
          return (
            <span
              className={`badge inline-flex items-center gap-1 ${badge.className}`}>
              {badge.label}
            </span>
          )
        },
      },
      {
        accessorKey: accessorkeys.adminList.isActive,
        header: headerKeys.adminList.isActive,
        cell: (value: { row: { original: AdminListItem } }) => {
          const { is_active, _id } = value.row.original
          return (
            <label className="switch-group switch-soft">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={is_active}
                  onChange={() => {
                    if (!is_active) {
                      handleActivate(_id)
                    } else {
                      handleDeactivate(_id)
                    }
                  }}
                />
                <div className="switch-wrapper peer-checked:!bg-green-500/15"></div>
                <div className="switch-dot peer-checked:translate-x-full rtl:peer-checked:-translate-x-full peer-checked:!bg-green-500"></div>
              </div>
            </label>
          )
        },
      },
      {
        accessorKey: accessorkeys.adminList.lastLogin,
        header: headerKeys.adminList.lastLogin,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.last_login ? formatDate(row.original.last_login) : '—',
      },
      {
        accessorKey: accessorkeys.adminList.createdAt,
        header: headerKeys.adminList.createdAt,
        cell: ({ row }: { row: { original: any } }) =>
          row.original.created_at ? formatDate(row.original.created_at) : '—',
      },
      {
        accessorKey: accessorkeys.adminList.actions,
        header: headerKeys.adminList.actions,
        cell: ({ row }: { row: { original: any } }) => {
          return (
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-sub-gray btn-icon !size-8 rounded-md"
                onClick={(e) => {
                  e.preventDefault()
                  openEdit(row.original)
                }}>
                <i className="ri-pencil-line"></i>
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
      <BreadCrumb title="Admins List" subTitle="Admins" />
      <div className="grid grid-cols-12 gap-x-space">
        <div className="col-span-12 card">
          <div className="card-header">
            <div className="grid items-center gap-3 grid-cols-12">
              <div className="col-span-12 md:col-span-9 lg:col-span-5 xxl:col-span-3">
                <div className="relative group/form grow">
                  <input
                    type="text"
                    className="ltr:pl-9 rtl:pr-9 form-input ltr:group-[&.right]/form:pr-9 rtl:group-[&.right]/form:pl-9 ltr:group-[&.right]/form:pl-4 rtl:group-[&.right]/form:pr-4"
                    placeholder="Search by Username, Email or Phone"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button className="absolute inset-y-0 flex items-center ltr:left-3 rtl:right-3 ltr:group-[&.right]/form:right-3 rtl:group-[&.right]/form:left-3 ltr:group-[&.right]/form:left-auto rtl:group-[&.right]/form:right-auto focus:outline-hidden">
                    <Search className="text-gray-500 dark:text-dark-500 size-4 fill-gray-100 dark:fill-dark-850" />
                  </button>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4 xxl:col-span-3">
                <Select
                  classNamePrefix="select"
                  options={roleOptions}
                  value={roleOptions.find((o) => o.value === selectedRole) || null}
                  onChange={(option: any) =>
                    setSelectedRole(option ? option.value : '')
                  }
                  placeholder="Filter by Role"
                  isClearable={true}
                />
              </div>
              <div className="col-span-12 md:col-span-3 lg:col-span-3 lg:col-start-10 xxl:col-span-2 xxl:col-start-11 ltr:md:text-right rtl:md:text-left">
                <button
                  className="btn btn-primary shrink-0"
                  onClick={() => openCreate()}>
                  <CirclePlus className="inline-block ltr:mr-1 rtl:ml-1 size-4" />{' '}
                  Add Admin
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
      <AdminModal state={modal} onClose={closeModal} />
    </React.Fragment>
  )
}

export default AdminsList
