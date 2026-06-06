import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";

// Render a 2D array of monochrome pixel values onto a canvas.
// `compact` mode produces a fixed thumbnail; normal mode fills its container.
function PlotImage({ name, pixels, compact = false }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [size, setSize] = useState({ w: 200, h: 200 });

  useEffect(() => {
    if (compact || !containerRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      const cr = e.contentRect;
      setSize({ w: Math.max(64, cr.width), h: Math.max(64, cr.height) });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [compact]);

  const { rows, cols, vMin, vMax } = useMemo(() => {
    if (!pixels || !pixels.length || !pixels[0].length) {
      return { rows: 0, cols: 0, vMin: 0, vMax: 1 };
    }
    let mn = Infinity,
      mx = -Infinity;
    for (const row of pixels) {
      for (const v of row) {
        if (v < mn) mn = v;
        if (v > mx) mx = v;
      }
    }
    if (mn === mx) mx = mn + 1;
    return { rows: pixels.length, cols: pixels[0].length, vMin: mn, vMax: mx };
  }, [pixels]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pixels || rows === 0 || cols === 0) return;

    canvas.width = cols;
    canvas.height = rows;

    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(cols, rows);
    const d = imageData.data;
    const range = vMax - vMin;

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      const row = pixels[r];
      for (let c = 0; c < cols; c++) {
        const g = Math.round(((row[c] - vMin) / range) * 255);
        d[idx] = g;
        d[idx + 1] = g;
        d[idx + 2] = g;
        d[idx + 3] = 255;
        idx += 4;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [pixels, rows, cols, vMin, vMax]);

  if (compact) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          width: 96,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            background: "var(--p-inset)",
            border: "1px solid var(--p-border)",
            borderRadius: "var(--p-radius-sm)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {pixels && rows > 0 ? (
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                imageRendering: "pixelated",
              }}
            />
          ) : (
            <span style={{ color: "var(--p-ink30)", fontSize: 10 }}>
              no data
            </span>
          )}
        </div>
        <span
          className="p-mono"
          style={{
            fontSize: 10,
            color: "var(--p-ink50)",
            maxWidth: 92,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
          title={name}
        >
          {name}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {pixels && rows > 0 ? (
        <canvas
          ref={canvasRef}
          style={{
            width: size.w,
            height: size.h,
            objectFit: "contain",
            imageRendering: "pixelated",
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--p-ink30)",
            fontSize: 12,
          }}
        >
          no data
        </div>
      )}
    </div>
  );
}

PlotImage.propTypes = {
  name: PropTypes.string.isRequired,
  pixels: PropTypes.array,
  compact: PropTypes.bool,
};

export default PlotImage;
