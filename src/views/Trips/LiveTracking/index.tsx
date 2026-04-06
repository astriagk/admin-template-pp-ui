'use client'

import React, { useMemo, useState } from 'react'

import { Trip } from '@src/dtos/trip'
import BreadCrumb from '@src/shared/common/BreadCrumb'
import Pagination from '@src/shared/common/Pagination'
import { accessorkeys, headerKeys } from '@src/shared/constants/columns'
import { STORAGE_KEYS } from '@src/shared/constants/enums'
import TableContainer from '@src/shared/custom/table/table'
import { useGetTripListQuery } from '@src/store/services/tripApi'
import LocalStorage from '@src/utils/LocalStorage'
import { formatDate } from '@src/utils/formatters'
import { Search } from 'lucide-react'

import TripDetailsModal from '../TripDetailsModal'

const LiveTracking = () => {
  const { data: tripsData } = useGetTripListQuery({
    status: ['started', 'in_progress'],
  })
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const user = LocalStorage.getItem(STORAGE_KEYS.ADMIN)
    ? JSON.parse(LocalStorage.getItem(STORAGE_KEYS.ADMIN)!)
    : null

  //pagination
  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // only include trips with status started or in_progress for live tracking
  const activeTrips = useMemo(() => {
    return (
      tripsData?.data?.filter(
        (t: Trip) =>
          t.trip_status === 'started' || t.trip_status === 'in_progress'
      ) || []
    )
  }, [tripsData])

  const filteredActiveTrips = activeTrips.filter((item: Trip) => {
    const matchesSearch = (item?.driver?.name ?? '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    // Only filter by school_id if user has a school_id
    if (user?.school_id) {
      return matchesSearch && item?.school?.school_id === user?.school_id
    }

    return matchesSearch
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTrips = filteredActiveTrips.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: accessorkeys.liveTracking.id,
        header: headerKeys.liveTracking.id,
        cell: ({ row }: { row: { index: number } }) => row.index + 1,
      },
      // {
      //   accessorKey: accessorkeys.liveTracking.tripId,
      //   header: headerKeys.liveTracking.tripId,
      // },
      {
        accessorKey: accessorkeys.liveTracking.driverName,
        header: headerKeys.liveTracking.driverName,
        cell: ({ row }: { row: { original: Trip } }) =>
          row.original.driver?.name || '-',
      },
      {
        accessorKey: accessorkeys.liveTracking.vehicleNumber,
        header: headerKeys.liveTracking.vehicleNumber,
        cell: ({ row }: { row: { original: Trip } }) =>
          row.original.driver?.vehicle_number || '-',
      },
      {
        accessorKey: accessorkeys.liveTracking.tripType,
        header: headerKeys.liveTracking.tripType,
        cell: ({ row }: { row: { original: Trip } }) => (
          <span className="capitalize">{row.original.trip_type}</span>
        ),
      },
      {
        accessorKey: accessorkeys.liveTracking.school,
        header: headerKeys.liveTracking.school,
        cell: ({ row }: { row: { original: Trip } }) =>
          row.original.school?.school_name || '-',
      },
      {
        accessorKey: accessorkeys.liveTracking.studentCount,
        header: headerKeys.liveTracking.studentCount,
        cell: ({ row }: { row: { original: Trip } }) =>
          row.original.student_count || '0',
      },
      {
        accessorKey: accessorkeys.liveTracking.startTime,
        header: headerKeys.liveTracking.startTime,
        cell: ({ row }: { row: { original: Trip } }) =>
          row.original.start_time ? formatDate(row.original.start_time) : '-',
      },
      {
        accessorKey: accessorkeys.liveTracking.totalDistance,
        header: headerKeys.liveTracking.totalDistance,
        cell: ({ row }: { row: { original: Trip } }) => {
          const value = row.original.total_distance
          return value != null ? `${value} km` : '-'
        },
      },
      {
        accessorKey: accessorkeys.liveTracking.actions,
        header: headerKeys.liveTracking.actions,
        cell: ({ row }: { row: { original: Trip } }) => (
          <div className="flex justify-end gap-2">
            <button
              className="btn btn-sub-gray btn-icon !size-8 rounded-md"
              onClick={() => setSelectedTrip(row.original)}>
              <i className="ri-map-line"></i>
            </button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <BreadCrumb title="Live Tracking" subTitle="Trips" />
      <div className="grid grid-cols-12 gap-x-space">
        <div className="col-span-12">
          <div className="card mb-4">
            <div className="card-body">
              <div className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">
                  {activeTrips.length} active trips
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 card">
          <div className="card-header">
            <div className="grid items-center gap-3 grid-cols-12">
              <div className="col-span-12 md:col-span-9 lg:col-span-5 xxl:col-span-3">
                <div className="relative group/form grow">
                  <input
                    type="text"
                    className="ltr:pl-9 rtl:pr-9 form-input ltr:group-[&.right]/form:pr-9 rtl:group-[&.right]/form:pl-9 ltr:group-[&.right]/form:pl-4 rtl:group-[&.right]/form:pr-4"
                    placeholder="Search by Driver"
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
                data={paginatedTrips}
                thClass="!font-medium cursor-pointer"
                divClass="overflow-x-auto table-box whitespace-nowrap"
                lastTrClass="text-end"
                tableClass="table flush"
                thtrClass="text-gray-500 bg-gray-100 dark:bg-dark-850 dark:text-dark-500"
              />
              <Pagination
                totalItems={filteredActiveTrips.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
      <TripDetailsModal
        trip={selectedTrip}
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
      />
    </React.Fragment>
  )
}

export default LiveTracking
