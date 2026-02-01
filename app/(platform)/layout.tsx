import React from 'react'
import { Navbar } from './(dashbaord)/_components/navbar'
import { Toaster } from '@/components/ui/sonner'

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="w-full h-full min-h-screen flex flex-col overflow-hidden">
        <div className="w-full h-full flex flex-col grow overflow-hidden min-h-0">
        <Navbar />
        <Toaster />
          {children}
        </div>
      </div>
    )
  }