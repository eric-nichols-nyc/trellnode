import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trellnode App",
};

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex h-full min-h-0">
        <main className="relative overflow-y-auto overflow-x-hidden flex flex-col flex-1 w-full min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
