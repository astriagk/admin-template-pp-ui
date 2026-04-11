'use client'

import React from 'react'

import BreadCrumb from '@src/shared/common/BreadCrumb'
import { UserRoles } from '@src/shared/constants/enums'
import { useGetDriverListQuery } from '@src/store/services/driverApi'
import { useGetParentListQuery } from '@src/store/services/parentApi'
import { useGetPaymentListQuery } from '@src/store/services/paymentApi'
import { useGetStudentListQuery } from '@src/store/services/studentApi'
import { useGetTripListQuery } from '@src/store/services/tripApi'
import {
  Bus,
  Car,
  Clock,
  CreditCard,
  GraduationCap,
  Users,
} from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  colorClass: string
  subtitle?: string
}

const StatCard = ({ title, value, icon, colorClass, subtitle }: StatCardProps) => (
  <div className="col-span-12 sm:col-span-6 xl:col-span-4 card">
    <div className="card-body">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-dark-500">{title}</p>
          <h4 className="mt-1 text-2xl font-semibold">{value}</h4>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
        <div className={`flex items-center justify-center size-12 rounded-xl ${colorClass}`}>
          {icon}
        </div>
      </div>
    </div>
  </div>
)

const Dashboard = () => {
  const { data: parentsData } = useGetParentListQuery({ user_type: UserRoles.PARENT })
  const { data: driversData } = useGetDriverListQuery({ user_type: UserRoles.DRIVER })
  const { data: studentsData } = useGetStudentListQuery()
  const { data: activeTripsData } = useGetTripListQuery({ status: ['ongoing'] })
  const { data: paymentsData } = useGetPaymentListQuery()

  const totalParents = parentsData?.data?.length ?? 0
  const totalDrivers = driversData?.data?.length ?? 0
  const pendingDrivers =
    driversData?.data?.filter((d: any) => d.approval_status === 'pending').length ?? 0
  const totalStudents = studentsData?.data?.length ?? 0
  const activeTrips = activeTripsData?.data?.length ?? 0
  const revenue =
    paymentsData?.data?.reduce((sum: number, p: any) => sum + (p.amount ?? 0), 0) ?? 0

  return (
    <React.Fragment>
      <BreadCrumb title="Dashboard" subTitle="Overview" />
      <div className="grid grid-cols-12 gap-x-space">
        <StatCard
          title="Total Parents"
          value={totalParents}
          icon={<Users className="size-6 text-blue-600" />}
          colorClass="bg-blue-100 dark:bg-blue-900/20"
        />
        <StatCard
          title="Total Drivers"
          value={totalDrivers}
          icon={<Car className="size-6 text-green-600" />}
          colorClass="bg-green-100 dark:bg-green-900/20"
          subtitle={`Pending approvals: ${pendingDrivers}`}
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={<GraduationCap className="size-6 text-purple-600" />}
          colorClass="bg-purple-100 dark:bg-purple-900/20"
        />
        <StatCard
          title="Active Trips"
          value={activeTrips}
          icon={<Bus className="size-6 text-orange-600" />}
          colorClass="bg-orange-100 dark:bg-orange-900/20"
        />
        <StatCard
          title="Revenue (This Month)"
          value={`₹${revenue.toLocaleString()}`}
          icon={<CreditCard className="size-6 text-emerald-600" />}
          colorClass="bg-emerald-100 dark:bg-emerald-900/20"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingDrivers}
          icon={<Clock className="size-6 text-red-600" />}
          colorClass="bg-red-100 dark:bg-red-900/20"
        />

        <div className="col-span-12 card">
          <div className="card-header">
            <h5 className="card-title">Recent Activity</h5>
          </div>
          <div className="card-body">
            <p className="text-gray-500 dark:text-dark-500 text-sm">
              Charts and recent trip activity will appear here.
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Dashboard
