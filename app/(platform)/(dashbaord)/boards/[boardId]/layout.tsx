import type { Metadata } from "next";
import TProvider from "@/components/providers/theme-provider";
export const metadata: Metadata = {
  title: "Trellnode App",
};

export default function BoardsIdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex h-full">
        <main className="relative overflow-y-auto flex flex-col flex-grow-1 w-full">
          <TProvider>{children}</TProvider>
        </main>
      </div>
    </div>
  );
}
