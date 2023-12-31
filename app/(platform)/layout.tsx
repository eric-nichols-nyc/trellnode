import React from 'react'
import { Navbar } from './(dashbaord)/_components/navbar'

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="h-full border">
        <Navbar />
        <main>{children}</main>
      </div>
    )
  }