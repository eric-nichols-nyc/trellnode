import React from 'react'
import { Navbar } from './(dashbaord)/_components/navbar'

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex flex-col grow">
        <Navbar />
        <main className="h-full">
          {children}</main>
        </div>
      </div>
    )
  }