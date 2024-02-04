import { Logo } from '@/components/shared/logo'
import { Signin } from '@/components/shared/signin'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import React from 'react'

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="flex w-full justify-between">
        <Logo />
        <Signin />
      </div>

    </div>
  )
}