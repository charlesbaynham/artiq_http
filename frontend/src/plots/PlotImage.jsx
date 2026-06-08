import React, { useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";

// Render a 2D array of monochrome pixel values onto a canvas that fills its
// parent. Auto-normalizes contrast (min→0, max→255). The parent controls the
// size and aspect ratio; the canvas scales to fit with crisp pixelation.
//
// ARTIQ stores image datasets in pyqtgraph's col-major convention (see
// artiq/applets/image.py, which feeds the array straight into
// pyqtgraph.ImageView): the FIRST array axis is the horizontal (x) axis and
// the SECOND axis is vertical (y). We honour that here by treating
// `pixels[x][y]`, which transposes the array back to the orientation ARTIQ's
// own dashboard shows.
function PlotImage({ pixels, name }) {
  const canvasRef = useRef(null);

  const { nx, ny, vMin, vMax } = useMemo(() => {
    if (!pixels || !pixels.length || !pixels[0]?.length) {
      return { nx: 0, ny: 0, vMin: 0, vMax: 1 };
    }
    let mn = Infinity,
      mx = -Infinity;
    for (const col of pixels) {
      for (const v of col) {
        if (v < mn) mn = v;
        if (v > mx) mx = v;
      }
    }
    if (mn === mx) mx = mn + 1;
    // First axis → x (width), second axis → y (height).
    return { nx: pixels.length, ny: pixels[0].length, vMin: mn, vMax: mx };
  }, [pixels]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pixels || nx === 0 || ny === 0) return;

    canvas.width = nx;
    canvas.height = ny;

    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(nx, ny);
    const d = imageData.data;
    const range = vMax - vMin;

    for (let x = 0; x < nx; x++) {
      const col = pixels[x];
      for (let y = 0; y < ny; y++) {
        const g = Math.round(((col[y] - vMin) / range) * 255);
        const idx = (y * nx + x) * 4;
        d[idx] = g;
        d[idx + 1] = g;
        d[idx + 2] = g;
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [pixels, nx, ny, vMin, vMax]);

  if (!pixels || nx === 0) {
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
