"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Inbox, Calendar, LayoutList, Layers } from "lucide-react";
import { SwitchBoardsModal } from "../switchboardsmodal/switch-boards-modal";

const navItems = [
  { label: "Inbox", icon: Inbox, disabled: true },
  { label: "Planner", icon: Calendar, disabled: true },
  { label: "Board", icon: LayoutList, disabled: false },
  { label: "Switch boards", icon: Layers, disabled: false },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const [switchBoardsOpen, setSwitchBoardsOpen] = useState(false);
  const isBoardRoute = pathname?.startsWith("/boards");
  const isBoardActive = (label: string) => label === "Board" && isBoardRoute;

  return (
    <>
    <nav
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      aria-label="Dashboard navigation"
    >
      <div className="flex items-center rounded-full bg-stone-800 px-1 py-1 shadow-lg border border-stone-700/80">
        {navItems.map((item, index) => (
          <span key={item.label} className="flex items-center">
            {index === 2 && (
              <div className="mx-0.5 h-5 w-px shrink-0 bg-stone-500" aria-hidden />
            )}
            {index === 3 && (
              <div className="mx-0.5 h-5 w-px shrink-0 bg-stone-500" aria-hidden />
            )}
            {item.disabled ? (
              <span
                className="relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-stone-500 cursor-not-allowed opacity-60"
                aria-disabled="true"
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </span>
            ) : item.label === "Switch boards" ? (
              <button
                type="button"
                onClick={() => setSwitchBoardsOpen(true)}
                className="relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-stone-400 hover:bg-stone-700/80 hover:text-stone-200 transition-colors"
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </button>
            ) : (
              <span
                className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                  isBoardActive(item.label)
                    ? "bg-blue-800/90 text-blue-200"
                    : "text-stone-400"
                }`}
                aria-current={isBoardActive(item.label) ? "page" : undefined}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
                {isBoardActive(item.label) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-blue-400" aria-hidden />
                )}
              </span>
            )}
          </span>
        ))}
      </div>
    </nav>
    <SwitchBoardsModal
      open={switchBoardsOpen}
      onClose={() => setSwitchBoardsOpen(false)}
    />
    </>
  );
}
