import type { Metadata } from "next";
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
    <div className="flex flex-col h-full">
      <div className="flex h-full">
        <main className="relative overflow-y-auto flex flex-col flex-grow-1">
          {children}
        </main>
      </div>
    </div>
  );
}
