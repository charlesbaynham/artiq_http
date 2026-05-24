// Capture the current plot as a PNG and write it to the clipboard.
// The image includes a footer with the ARTIQ wordmark and the run RID.

function resolveVars(str, cs) {
  return str.replace(/var\((--[^,)]+)(?:,[^)]*)?\)/g, (_, name) => {
    const val = cs.getPropertyValue(name).trim();
    return val || "currentColor";
  });
}

function loadSVGImage(svgString) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("SVG image load failed"));
    };
    img.src = url;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export async function copyPlotToClipboard({
  containerEl,
  rid,
  dims,
  channelDescriptors = [],
}) {
  const root = containerEl.closest(".plots-app") || containerEl;
  const cs = getComputedStyle(root);

  const bg = cs.getPropertyValue("--p-bg").trim() || "#0e0f10";
  const panel = cs.getPropertyValue("--p-panel").trim() || "#16191c";
  const border = cs.getPropertyValue("--p-border").trim() || "#2a2f35";
  const accent = cs.getPropertyValue("--p-accent").trim() || "#f08a4d";
  const ink = cs.getPropertyValue("--p-ink").trim() || "#e8e6df";
  const ink50 =
    cs.getPropertyValue("--p-ink50").trim() || "rgba(232,230,223,0.52)";

  const FOOTER = 30;
  let plotW, plotH, drawPlot;

  if (dims === "1D" || dims === "2D") {
    const svgEl = containerEl.querySelector("svg");
    if (!svgEl) throw new Error("No SVG element found in plot container");

    plotW =
      parseInt(svgEl.getAttribute("width"), 10) || svgEl.clientWidth || 800;
    plotH =
      parseInt(svgEl.getAttribute("height"), 10) || svgEl.clientHeight || 460;

    const svgStr = new XMLSerializer().serializeToString(svgEl);
    const resolved = resolveVars(svgStr, cs);
    const svgImg = await loadSVGImage(resolved);

    let heatmap = null;
    if (dims === "2D") {
      const innerCanvas = containerEl.querySelector("canvas");
      if (innerCanvas) {
        const contRect = containerEl.getBoundingClientRect();
        const cvRect = innerCanvas.getBoundingClientRect();
        heatmap = {
          el: innerCanvas,
          x: Math.round(cvRect.left - contRect.left),
          y: Math.round(cvRect.top - contRect.top),
          w: cvRect.width,
          h: cvRect.height,
        };
      }
    }

    drawPlot = (ctx) => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, plotW, plotH);
      if (heatmap) {
        ctx.drawImage(heatmap.el, heatmap.x, heatmap.y, heatmap.w, heatmap.h);
      }
      ctx.drawImage(svgImg, 0, 0, plotW, plotH);
    };
  } else {
    // 0D — draw channel tiles directly onto canvas
    const on = channelDescriptors.filter((c) => c.on);
    const COLS = Math.max(1, Math.ceil(Math.sqrt(on.length || 1)));
    const ROWS = Math.ceil((on.length || 1) / COLS);
    const TILE_W = 200,
      TILE_H = 110,
      GAP = 12,
      PAD = 12;
    plotW = Math.max(300, COLS * (TILE_W + GAP) - GAP + PAD * 2);
    plotH = Math.max(140, ROWS * (TILE_H + GAP) - GAP + PAD * 2);

    drawPlot = (ctx) => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, plotW, plotH);
      on.forEach((ch, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const x = PAD + col * (TILE_W + GAP);
        const y = PAD + row * (TILE_H + GAP);

        ctx.fillStyle = panel;
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        roundRect(ctx, x, y, TILE_W, TILE_H, 6);
        ctx.fill();
        ctx.stroke();

        // Colour swatch
        ctx.fillStyle = ch.color || accent;
        ctx.fillRect(x + 12, y + 16, 14, 3);

        // Channel key
        ctx.fillStyle = ink;
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        const key = ch.key.length > 22 ? ch.key.slice(0, 20) + "…" : ch.key;
        ctx.fillText(key, x + 30, y + 12);

        // Value
        const v = ch.point;
        const label =
          v == null || !isFinite(v) ? "—" : Number(v).toPrecision(5);
        ctx.fillStyle = ch.color || accent;
        ctx.font = "bold 30px monospace";
        ctx.textBaseline = "middle";
        ctx.fillText(label, x + 12, y + 68, TILE_W - 24);

        // Unit
        if (ch.unit) {
          ctx.fillStyle = ink50;
          ctx.font = "10px monospace";
          ctx.textBaseline = "bottom";
          ctx.fillText(ch.unit, x + 12, y + TILE_H - 8);
        }
      });
    };
  }

  // Compose final canvas
  const canvas = document.createElement("canvas");
  canvas.width = plotW;
  canvas.height = plotH + FOOTER;
  const ctx = canvas.getContext("2d");

  drawPlot(ctx);

  // Footer bar with RID
  ctx.fillStyle = panel;
  ctx.fillRect(0, plotH, plotW, FOOTER);
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, plotH + 0.5);
  ctx.lineTo(plotW, plotH + 0.5);
  ctx.stroke();

  const cy = plotH + FOOTER / 2;
  ctx.textBaseline = "middle";

  ctx.fillStyle = ink;
  ctx.font = 'bold 11px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.textAlign = "left";
  ctx.fillText("ARTIQ", 10, cy);

  if (rid != null) {
    ctx.fillStyle = accent;
    ctx.font = "bold 11px monospace";
    ctx.fillText(`#${rid}`, 54, cy);
  }

  ctx.fillStyle = ink50;
  ctx.font = "10px monospace";
  ctx.textAlign = "right";
  ctx.fillText(new Date().toLocaleString(), plotW - 10, cy);

  const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
  if (!blob) throw new Error("Failed to generate PNG blob");

  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    window.ClipboardItem
  ) {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
  } else {
    // Fallback: trigger a file download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `artiq-plot${rid != null ? `-rid${rid}` : ""}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
