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
        <div className="w-full">
          <main className="pt-20 md:pt-12 px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
