'use client'

import React from 'react'

import BreadCrumb from '@src/shared/common/BreadCrumb'

const Settings = () => {
  return (
    <React.Fragment>
      <BreadCrumb title="Settings" subTitle="Settings" />
      <div className="grid grid-cols-12 gap-x-space">
        <div className="col-span-12 lg:col-span-6 card">
          <div className="card-header">
            <h5 className="card-title">General Settings</h5>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  className="form-input w-full"
                  defaultValue="Skolo"
                  placeholder="Site Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  className="form-input w-full"
                  placeholder="admin@skolo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Support Phone
                </label>
                <input
                  type="text"
                  className="form-input w-full"
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
              <div className="flex justify-end">
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 card">
          <div className="card-header">
            <h5 className="card-title">Security Settings</h5>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="form-input w-full"
                  placeholder="Current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="form-input w-full"
                  placeholder="New password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-input w-full"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex justify-end">
                <button className="btn btn-primary">Update Password</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Settings
