"use client"
import { Sidebar,SidebarFooter, SidebarHeader,SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SideBarOptions } from '@/services/Constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function AppSidebar() {
 const  path  = usePathname();

  return (
    <Sidebar>
        <SidebarHeader className='flex items-center justify-center'>
          <Image src="/LOGO.jpg" alt="LOGO" width={200} height={120} className='w-[200px] h-[120px]' />
        </SidebarHeader>
         <SidebarContent>
          <SidebarGroup>
            <SidebarContent>
                <SidebarMenu> 
                    {SideBarOptions.map((option, index) => (
                        <SidebarMenuItem key={index} className='p-2'>
                            <SidebarMenuButton asChild className={`p-2 ${path==option.path&&"bg-secondary/20 rounded-md"}`}>
                                <Link href={option.path}>
                                    <option.icon className={`${path==option.path&&'text-primary'}`} />
                                    <span className={`text-[16px] ${path==option.path&&'text-primary'}`}>{option.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
          </SidebarGroup>
        </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar