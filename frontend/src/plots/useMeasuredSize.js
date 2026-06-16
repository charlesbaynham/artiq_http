import { useCallback, useRef, useState } from "react";

// Track the rendered size of a DOM node via ResizeObserver, returning a callback
// ref and the latest { w, h } (clamped to sensible minimums).
//
// A callback ref — rather than a one-shot useEffect + useRef — is essential
// here because the plot components attach the same ref to two different nodes
// depending on their data state: a full-panel-height placeholder while waiting
// for points, and a smaller inner container once the chart renders. React can
// reuse the underlying DOM node across that transition, so an observer bound
// once on mount keeps reporting the placeholder's (taller) height, drawing the
// SVG larger than its clipped container and cutting off the x-axis labels. The
// callback ref disconnects the old observer and observes whichever node is
// currently mounted, keeping the measured size in sync with what's on screen.
export function useMeasuredSize(minW = 360, minH = 220) {
  const [size, setSize] = useState({ w: 800, h: 460 });
  const roRef = useRef(null);

  const setRef = useCallback(
    (node) => {
      if (roRef.current) {
        roRef.current.disconnect();
        roRef.current = null;
      }
      if (node) {
        const ro = new ResizeObserver(([e]) => {
          const cr = e.contentRect;
          setSize({
            w: Math.max(minW, cr.width),
            h: Math.max(minH, cr.height),
          });
        });
        ro.observe(node);
        roRef.current = ro;
      }
    },
    [minW, minH],
  );

  return [setRef, size];
}
