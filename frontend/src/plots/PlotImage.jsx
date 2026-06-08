import React, { useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";

// Render a 2D array of monochrome pixel values onto a canvas that fills its
// parent. Auto-normalizes contrast (min→0, max→255). The parent controls the
// size and aspect ratio; the canvas scales to fit with crisp pixelation.
function PlotImage({ pixels, name }) {
  const canvasRef = useRef(null);

  const { rows, cols, vMin, vMax } = useMemo(() => {
    if (!pixels || !pixels.length || !pixels[0]?.length) {
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

  if (!pixels || rows === 0) {
    return <div className="p-img-empty">no data</div>;
  }

  return (
    <canvas
      ref={canvasRef}
      className="p-img-canvas"
      aria-label={name ? `${name} image` : "image"}
    />
  );
}

PlotImage.propTypes = {
  pixels: PropTypes.array,
  name: PropTypes.string,
};

export default PlotImage;
