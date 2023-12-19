import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import React from 'react'

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="flex w-full justify-between">
        <Logo />
        <Button>Sign in</Button>
      </div>

    </div>
  )
}