import React from 'react';
import { MoreHorizontal } from 'lucide-react';

export const BoardOptions = () => {
  return (
    <button
      type="button"
      className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
      aria-label="Board options"
    >
      <MoreHorizontal size={22} />
    </button>
  );
};