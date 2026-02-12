import type { Metadata } from "next";
import TProvider from "@/components/providers/theme-provider";
import { BottomNav } from "./_components/bottomnav/bottom-nav";

export const metadata: Metadata = {
  title: "Trellnode App",
};

export default function BoardsIdLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-full min-h-0">
      <div className="flex w-full h-full min-h-0">
        <main className="relative overflow-hidden flex flex-col flex-1 w-full min-h-0">
          <TProvider>
            {children}
            {modal}
            <BottomNav />

          </TProvider>
        </main>
      </div>
    </div>
  );
}
