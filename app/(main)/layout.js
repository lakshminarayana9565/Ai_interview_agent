import React from 'react'
import DashboardProvider  from './provider';

function DashboardLayout({children}) {
  return (
    <DashboardProvider>
      <div className='pt-0 p-8'>{children}</div>
    </DashboardProvider>
  )
}

export default DashboardLayout;