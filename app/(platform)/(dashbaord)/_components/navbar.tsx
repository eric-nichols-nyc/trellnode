"use client"
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'

export const Navbar = () => {
  const session = useSession();

  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
    <div className="flex w-full justify-between">
      <Logo />
      <Button
        onClick={() => {
          signOut(),
          { callbackUrl: '/boards' }
          }}
      >Sign out</Button>
    </div>

  </div>
  )
}