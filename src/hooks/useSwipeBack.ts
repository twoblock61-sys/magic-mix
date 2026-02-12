import { useRef, useCallback } from "react";

interface UseSwipeBackOptions {
  onSwipeBack: () => void;
  threshold?: number;
  enabled?: boolean;
}

export function useSwipeBack({ onSwipeBack, threshold = 80, enabled = true }: UseSwipeBackOptions) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, [enabled]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!enabled) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    // Swipe right, mostly horizontal
    if (deltaX > threshold && deltaY < deltaX * 0.5) {
      onSwipeBack();
    }
  }, [enabled, threshold, onSwipeBack]);

  return { onTouchStart, onTouchEnd };
}
