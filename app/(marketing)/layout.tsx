import type { Metadata } from 'next'
import { Navbar } from './_components/navbar'
export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full bg-slate-100">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
