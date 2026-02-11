import { RefObject, useEffect, useRef } from "react";

/**
 * Calls `onClickOutside` when a mousedown happens outside the element attached to `ref`.
 * Only active when `enabled` is true.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onClickOutside: () => void,
  enabled = true
) {
  const callbackRef = useRef(onClickOutside);
  callbackRef.current = onClickOutside;

  useEffect(() => {
    if (!enabled) return;

    function handleMouseDown(e: MouseEvent) {
      if (ref.current?.contains(e.target as Node)) return;
      callbackRef.current();
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [ref, enabled]);
}
