import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Trellnode App",
};

export default function BoardsIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full border-2 ">
      <div className="flex h-full">
        <main className="relative overflow-y-auto flex flex-col flex-grow-1 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
