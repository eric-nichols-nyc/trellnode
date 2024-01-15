import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const Logo = () => {
  return (
    <div>
        <Link href="/">
            <Image src="/images/logo.svg" alt="logo" width={32} height={32} />
        </Link>
    </div>
  )
}
