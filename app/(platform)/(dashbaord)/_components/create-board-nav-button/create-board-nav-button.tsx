"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";

const FormPopover = dynamic(
  () =>
    import("@/components/form/form-popover").then((m) => ({
      default: m.FormPopover,
    })),
  { ssr: false }
);

export function CreateBoardNavButton() {
  const [showPopover, setShowPopover] = useState(false);

  if (!showPopover) {
    return (
      <button
        type="button"
        onClick={() => setShowPopover(true)}
        className="p-2 cursor-pointer hover:bg-slate-200"
        aria-label="Create new board"
      >
        <Plus size={32} />
      </button>
    );
  }

  return (
    <FormPopover defaultOpen>
      <Plus size={32} className="p-2 cursor-pointer hover:bg-slate-200" />
    </FormPopover>
  );
}
