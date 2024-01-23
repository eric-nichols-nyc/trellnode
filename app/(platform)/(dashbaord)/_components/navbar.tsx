"use client"
import { Logo } from '@/components/shared/logo'
import UserMenu from './user-menu'

export const Navbar = () => {

  return (
    <div className="w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
    <div className="flex w-full justify-between">
      <Logo />
      <UserMenu />
    </div>

  </div>
  )
}