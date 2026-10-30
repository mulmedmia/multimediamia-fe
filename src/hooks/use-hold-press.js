import { useRef, useCallback, useEffect } from "react";

/**
 * Custom hook to enable hold-to-repeat (continuous click/hold press) on buttons.
 * Works seamlessly across mouse, touch, and pointer events.
 * Even if the pointer is dragged/moved outside the button area, repeating continues
 * until the pointer is released (similar to native range inputs / pointer capture).
 *
 * @param {Function} action - Callback to run on initial click and repeatedly while held.
 * @param {Object} [options]
 * @param {number} [options.delay=350] - Initial delay in ms before repeating starts.
 * @param {number} [options.interval=75] - Frequency in ms between repeated actions.
 * @param {boolean} [options.disabled=false] - Whether the action/button is disabled.
 */
export function useHoldPress(
  action,
  { delay = 350, interval = 75, disabled = false } = {}
) {
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const isPressingRef = useRef(false);
  const didPointerHandleRef = useRef(false);
  const targetElementRef = useRef(null);
  const activePointerIdRef = useRef(null);

  const actionRef = useRef(action);
  actionRef.current = action;

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const stop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isPressingRef.current = false;

    if (
      targetElementRef.current &&
      activePointerIdRef.current !== null &&
      typeof targetElementRef.current.releasePointerCapture === "function"
    ) {
      try {
        if (
          targetElementRef.current.hasPointerCapture &&
          targetElementRef.current.hasPointerCapture(activePointerIdRef.current)
        ) {
          targetElementRef.current.releasePointerCapture(
            activePointerIdRef.current
          );
        }
      } catch {
        // Ignore errors if pointer capture was already released or invalid
      }
    }
    activePointerIdRef.current = null;
    targetElementRef.current = null;

    // Reset pointer handle flag slightly after release so any trailing click event is suppressed
    setTimeout(() => {
      didPointerHandleRef.current = false;
    }, 100);
  }, []);

  const start = useCallback(
    (e) => {
      if (disabledRef.current) return;
      // Only trigger on primary button (0 = left mouse click, undefined = touch/pen)
      if (e.button !== undefined && e.button !== 0) return;

      // Prevent text selection while dragging outside
      if (e.cancelable) {
        e.preventDefault();
      }

      stop();
      isPressingRef.current = true;
      didPointerHandleRef.current = true;

      const target = e.currentTarget;
      if (
        target &&
        typeof target.setPointerCapture === "function" &&
        e.pointerId !== undefined
      ) {
        try {
          target.setPointerCapture(e.pointerId);
          targetElementRef.current = target;
          activePointerIdRef.current = e.pointerId;
        } catch {
          // Fallback safely if pointer capture fails
        }
      }

      // Trigger immediate first action
      if (actionRef.current) {
        actionRef.current();
      }

      // Start continuous repeating after initial delay
      timeoutRef.current = setTimeout(() => {
        if (!isPressingRef.current || disabledRef.current) return;
        intervalRef.current = setInterval(() => {
          if (!isPressingRef.current || disabledRef.current) {
            stop();
            return;
          }
          if (actionRef.current) {
            actionRef.current();
          }
        }, interval);
      }, delay);
    },
    [delay, interval, stop]
  );

  const handleClick = useCallback((e) => {
    // If this click originated from a pointer press handled by onPointerDown, suppress it
    if (didPointerHandleRef.current) {
      e.preventDefault();
      return;
    }
    // Keyboard activation (Space or Enter)
    if (disabledRef.current) return;
    if (actionRef.current) {
      actionRef.current();
    }
  }, []);

  // Listen to window pointerup / pointercancel as a global safety net
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isPressingRef.current) {
        stop();
      }
    };

    window.addEventListener("pointerup", handleGlobalPointerUp);
    window.addEventListener("pointercancel", handleGlobalPointerUp);
    return () => {
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      window.removeEventListener("pointercancel", handleGlobalPointerUp);
    };
  }, [stop]);

  useEffect(() => {
    if (disabled) {
      stop();
    }
  }, [disabled, stop]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    onPointerDown: start,
    onPointerUp: stop,
    onPointerCancel: stop,
    onLostPointerCapture: stop,
    onContextMenu: (e) => e.preventDefault(),
    onClick: handleClick,
  };
}
