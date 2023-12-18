"use client"
import { signOut } from 'next-auth/react'
import React from 'react'

export const Navbar = () => {
  return (
    <div className="w-full flex">
        <div>Dashbaord Navbar</div>
        <button 
        onClick={() => {
          signOut(),
          { callbackUrl: '/boards' }
        }}>Log out</button>
    </div>
  )
}