import type { Metadata } from 'next'
import { Navbar } from './_components/navbar'
export const metadata: Metadata = {
  title: 'Trellnode — Organize anything, together',
  description: 'Trellnode brings all your tasks, teammates, and tools together. Keep work organized and get more done.',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full min-h-screen font-display bg-gradient-to-b from-amber-50/80 via-stone-50 to-white overflow-y-auto overflow-x-hidden">
      <Navbar />
      <main className="pt-14">{children}</main>
    </div>
  )
}
