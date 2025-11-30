"use client"
import { useUser } from '@/app/provider'
import React from 'react'
import Image from 'next/image';

export default function WelcomeContainer() {
  const { user } = useUser();

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border px-2 py-2 mr-4 ml-4 my-2 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold truncate">Welcome {user?.name ?? 'Guest'}</h2>
          <p className="text-sm text-gray-500 truncate">Here's a summary of your interviews</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user?.picture ? (
          <Image src={user.picture} alt="User avatar" width={40} height={40} className="rounded-full object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <span className="text-sm font-medium">{user?.name ? user.name.charAt(0) : 'G'}</span>
          </div>
        )}
      </div>
    </div>
  )
}