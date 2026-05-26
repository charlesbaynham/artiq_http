// Capture the current plot as a PNG and write it to the clipboard.
// The image includes a header with the run RID and experiment name,
// the plot itself, an inline legend for 1D plots, and a footer
// with the ARTIQ wordmark.

function resolveVars(str, cs) {
  return str.replace(/var\((--[^,)]+)(?:,[^)]*)?\)/g, (_, name) => {
    const val = cs.getPropertyValue(name).trim();
    // Swap double quotes for single quotes so the resolved value doesn't
    // break XML double-quoted attributes (e.g. font-family="...").
    return (val || "currentColor").replace(/"/g, "'");
  });
}

function resolveColor(colorStr, cs) {
  if (!colorStr) return null;
  const m = colorStr.match(/var\((--[^,)]+)\)/);
  if (m) {
    const val = cs.getPropertyValue(m[1]).trim();
    return val || colorStr;
  }
  return colorStr;
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

function drawLegend(
  ctx,
  channels,
  ghosts,
  plotW,
  headerH,
  panel,
  border,
  accent,
  ink,
  ink50,
  cs,
) {
  const LEGEND_W = Math.min(220, Math.max(160, Math.round(plotW * 0.3)));
  const LEGEND_X = plotW - LEGEND_W - 12;
  const LEGEND_Y = headerH + 12;
  const PAD_X = 8;
  const PAD_Y = 6;
  const LINE_H = 18;
  const SWATCH_W = 18;
  const GAP = 6;

  const nLines = channels.length + ghosts.length;
  if (nLines === 0) return;

  const LEGEND_H = PAD_Y * 2 + nLines * LINE_H;

  // Background with slight opacity
  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = panel;
  roundRect(ctx, LEGEND_X, LEGEND_Y, LEGEND_W, LEGEND_H, 6);
  ctx.fill();
  ctx.restore();

  // Border
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  roundRect(ctx, LEGEND_X, LEGEND_Y, LEGEND_W, LEGEND_H, 6);
  ctx.stroke();

  let y = LEGEND_Y + PAD_Y + LINE_H / 2;
  ctx.textBaseline = "middle";
  ctx.font = "11px monospace";
  ctx.textAlign = "left";

  for (const c of channels) {
    // Color swatch
    const color = resolveColor(c.color, cs) || accent;
    ctx.fillStyle = color;
    ctx.fillRect(LEGEND_X + PAD_X, y - 1, SWATCH_W, 2);

    // Channel name
    ctx.fillStyle = ink;
    const maxTextW = LEGEND_W - PAD_X * 2 - SWATCH_W - GAP;
    const key = c.key.length > 26 ? c.key.slice(0, 24) + "…" : c.key;
    ctx.fillText(key, LEGEND_X + PAD_X + SWATCH_W + GAP, y, maxTextW);

    y += LINE_H;
  }

  for (const g of ghosts) {
    // Dashed line
    ctx.strokeStyle = ink50;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(LEGEND_X + PAD_X, y);
    ctx.lineTo(LEGEND_X + PAD_X + SWATCH_W, y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Text
    ctx.fillStyle = ink50;
    ctx.fillText("ghost", LEGEND_X + PAD_X + SWATCH_W + GAP, y);

    // RID
    ctx.textAlign = "right";
    ctx.fillText(`#${g.rid}`, LEGEND_X + LEGEND_W - PAD_X, y);
    ctx.textAlign = "left";

    y += LINE_H;
  }
}

function drawMetricBadge(
  ctx,
  metric,
  plotW,
  headerH,
  panel,
  border,
  accent,
  ink,
) {
  const PAD_X = 8;
  const PAD_Y = 4;
  const LABEL_W = 38;
  const GAP = 6;

  ctx.font = "bold 11px monospace";
  const metricW = ctx.measureText(metric).width;
  const BADGE_W = PAD_X * 2 + LABEL_W + GAP + metricW + 4;
  const BADGE_X = plotW - BADGE_W - 100; // right: 100 to avoid colorbar
  const BADGE_Y = headerH + 12;
  const BADGE_H = PAD_Y * 2 + 16;

  // Background
  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = panel;
  roundRect(ctx, BADGE_X, BADGE_Y, BADGE_W, BADGE_H, 6);
  ctx.fill();
  ctx.restore();

  // Border
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  roundRect(ctx, BADGE_X, BADGE_Y, BADGE_W, BADGE_H, 6);
  ctx.stroke();

  const my = BADGE_Y + BADGE_H / 2;
  ctx.textBaseline = "middle";

  // "metric" label
  ctx.fillStyle = ink;
  ctx.font = "9px monospace";
  ctx.textAlign = "left";
  ctx.globalAlpha = 0.6;
  ctx.fillText("metric", BADGE_X + PAD_X, my);
  ctx.globalAlpha = 1.0;

  // Metric name
  ctx.fillStyle = accent;
  ctx.font = "bold 11px monospace";
  ctx.fillText(metric, BADGE_X + PAD_X + LABEL_W + GAP, my);
}

export async function copyPlotToClipboard({
  containerEl,
  rid,
  dims,
  channelDescriptors = [],
  fragmentFqn = "",
  metric2D = null,
  ghosts = [],
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

  const HEADER = 30;
  const FOOTER = 30;
  let plotW, plotH, drawPlot;

  let svgEl = containerEl.querySelector("svg");

  // A 0D repeat scan with accumulated local history renders as a 1D plot.
  // If an SVG is present, capture it using the vector path regardless of dims.
  if (dims === "1D" || dims === "2D" || svgEl) {
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

    drawPlot = (ctx, yOff = 0) => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, yOff, plotW, plotH);
      if (heatmap) {
        ctx.drawImage(
          heatmap.el,
          heatmap.x,
          heatmap.y + yOff,
          heatmap.w,
          heatmap.h,
        );
      }
      ctx.drawImage(svgImg, 0, yOff, plotW, plotH);
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

    drawPlot = (ctx, yOff = 0) => {
      ctx.fillStyle = bg;
      ctx.fillRect(0, yOff, plotW, plotH);
      on.forEach((ch, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const x = PAD + col * (TILE_W + GAP);
        const y = PAD + row * (TILE_H + GAP) + yOff;

        ctx.fillStyle = panel;
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        roundRect(ctx, x, y, TILE_W, TILE_H, 6);
        ctx.fill();
        ctx.stroke();

        // Colour swatch
        ctx.fillStyle = resolveColor(ch.color, cs) || accent;
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
        ctx.fillStyle = resolveColor(ch.color, cs) || accent;
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
  canvas.height = HEADER + plotH + FOOTER;
  const ctx = canvas.getContext("2d");

  // ── Header bar ──
  ctx.fillStyle = panel;
  ctx.fillRect(0, 0, plotW, HEADER);
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, HEADER - 0.5);
  ctx.lineTo(plotW, HEADER - 0.5);
  ctx.stroke();

  const hy = HEADER / 2;
  ctx.textBaseline = "middle";

  // Dim badge
  let labelX = 10;
  if (dims) {
    ctx.fillStyle = accent;
    roundRect(ctx, 10, hy - 8, 30, 16, 4);
    ctx.fill();
    ctx.fillStyle = bg;
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText(dims, 25, hy);
    labelX = 48;
  }

  // RID
  if (rid != null) {
    ctx.fillStyle = accent;
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`#${rid}`, labelX, hy);
    labelX += ctx.measureText(`#${rid}`).width + 10;
  }

  // Experiment name
  if (fragmentFqn) {
    ctx.fillStyle = ink;
    ctx.font = "11px monospace";
    ctx.textAlign = "left";
    const maxWidth = plotW - labelX - 10;
    const text =
      fragmentFqn.length > 60 ? fragmentFqn.slice(0, 58) + "…" : fragmentFqn;
    ctx.fillText(text, labelX, hy, maxWidth);
  }

  // ── Plot ──
  drawPlot(ctx, HEADER);

  // ── Legend / metric badge overlay ──
  // 0D repeat scans with accumulated history render as a 1D plot (SVG).
  // Draw a legend in both the true 1D case and the 0D-with-SVG case.
  if (dims === "1D" || (dims === "0D" && svgEl)) {
    const onCh = channelDescriptors.filter((c) => c.on);
    if (onCh.length > 0 || ghosts.length > 0) {
      drawLegend(
        ctx,
        onCh,
        ghosts,
        plotW,
        HEADER,
        panel,
        border,
        accent,
        ink,
        ink50,
        cs,
      );
    }
  } else if (dims === "2D" && metric2D) {
    drawMetricBadge(ctx, metric2D, plotW, HEADER, panel, border, accent, ink);
  }

  // ── Footer bar ──
  ctx.fillStyle = panel;
  ctx.fillRect(0, HEADER + plotH, plotW, FOOTER);
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, HEADER + plotH + 0.5);
  ctx.lineTo(plotW, HEADER + plotH + 0.5);
  ctx.stroke();

  const fy = HEADER + plotH + FOOTER / 2;
  ctx.textBaseline = "middle";

  ctx.fillStyle = ink;
  ctx.font = 'bold 11px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.textAlign = "left";
  ctx.fillText("ARTIQ", 10, fy);

  if (rid != null) {
    ctx.fillStyle = accent;
    ctx.font = "bold 11px monospace";
    ctx.fillText(`#${rid}`, 54, fy);
  }

  ctx.fillStyle = ink50;
  ctx.font = "10px monospace";
  ctx.textAlign = "right";
  ctx.fillText(new Date().toLocaleString(), plotW - 10, fy);

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
