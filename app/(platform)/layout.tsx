import React from 'react'
import { Navbar } from './(dashbaord)/_components/navbar'
import { Toaster } from '@/components/ui/sonner'

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex flex-col grow">
        <Navbar />
        <Toaster />
          {children}
        </div>
      </div>
    )
  }