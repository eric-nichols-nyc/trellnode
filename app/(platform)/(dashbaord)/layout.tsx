import type { Metadata } from "next";
import { Navbar } from "./_components/navbar";
import { Sidenav } from "./_components/sidenav";
export const metadata: Metadata = {
  title: "Trellnode App",
};

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full">
      <Navbar />
      <div className="pt-14 flex h-full">
        <Sidenav />
        <main className="flex-1 h-full overflow-y-auto">
            {children}
          </main>
      </div>
    </div>
  );
}
