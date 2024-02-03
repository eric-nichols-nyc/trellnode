import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type LogoProps = {
  size?: number
}

export const Logo = ({size = 32}:LogoProps) => {
  return (
    <div>
        <Link href="/">
            <Image src="/images/logo.svg" alt="logo" width={size} height={size} />
        </Link>
    </div>
  )
}
