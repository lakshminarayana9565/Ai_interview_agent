"use client"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import WelcomeContainer from './dashboard/_components/WelcomeContainer'
import React from 'react'
import AppSidebar from './_components/AppSidebar'
import Provider from '../provider'

function DashboardProvider({ children }) {
  return (
    <Provider>
      <SidebarProvider>
        <AppSidebar />
        <div className='w-full'>
          {/* <SidebarTrigger /> */}
          <WelcomeContainer /> 
          {children}
      </div>
    </SidebarProvider>
    </Provider>
  )
}

export default DashboardProvider