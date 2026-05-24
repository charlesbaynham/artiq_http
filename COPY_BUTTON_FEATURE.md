# Copy-to-Clipboard Feature for Plots

## Overview
Added a "Copy Plot as PNG" button to the plots view TopBar that captures the current plot as a PNG image with the run RID included in the footer.

## Visual Layout

### TopBar with Copy Button (between status and fullscreen)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ARTIQ · plots / [Run Switcher]  [LIVE · 50 pts]  📋  ⛶                   │
└─────────────────────────────────────────────────────────────────────────┘
                                                      ↑     ↑
                                              Copy Button  Fullscreen
```

## Button States

### 1. **Idle** (clipboard icon)
- Always visible when plot data is loaded
- Tooltip: "Copy plot as PNG"
- Clicking initiates capture

### 2. **Copying** (dimmed, disabled)
- Shows while canvas is being rendered and clipboard write is in progress
- Button is disabled (no clicks accepted)

### 3. **Copied** (green checkmark, 1.5s)
- Shows checkmark icon in success color (`var(--p-ok)`, green)
- Tooltip: "Copied!"
- Auto-reverts to idle after 1.5 seconds

## Generated PNG Format

Each PNG includes:

```
┌──────────────────────────────────────┐
│                                      │
│   [Plot Content - 1D/2D/0D]          │
│   - 1D: SVG line plot                │
│   - 2D: Canvas heatmap + SVG overlay │
│   - 0D: Channel value tiles          │
│                                      │
├──────────────────────────────────────┤
│ ARTIQ  #1042  2026-05-24 3:45:22 PM │  ← Footer (30px)
└──────────────────────────────────────┘
```

### Footer Details
- **Left**: ARTIQ wordmark (11px bold)
- **Center**: Run RID in accent orange (11px monospace bold)
  - Only shown if RID is available
- **Right**: Timestamp in dim gray (10px monospace)
- **Background**: matches theme panel color
- **Border**: subtle top border in theme border color

## Technical Implementation

### copyPlot.js
Handles all plot capture logic:

#### 1D & 2D Plots (SVG-based)
```javascript
// 1. Serialize the SVG element
const svgStr = new XMLSerializer().serializeToString(svgEl);

// 2. Resolve all CSS custom properties (--p-*)
const resolved = resolveVars(svgStr, computedStyle);

// 3. Load as Image and draw to canvas
const img = await loadSVGImage(resolved);
ctx.drawImage(img, 0, 0, width, height);

// 4. For 2D: composite heatmap canvas first
if (dims === '2D') {
  ctx.drawImage(innerCanvas, offsetX, offsetY, width, height);
  ctx.drawImage(svgImg, 0, 0, width, height);
}
```

**Key challenge**: CSS variables like `var(--p-grid)`, `var(--p-accent)` aren't resolved when SVG is loaded as an image. Solution: resolve them via `getComputedStyle()` before rendering.

#### 0D Plots (HTML-based)
```javascript
// Draw channel tiles directly using canvas API
// - One tile per visible channel
// - Color swatch + name + large value + unit
// - Grid layout sized to fit all tiles
```

#### Clipboard Write
```javascript
// Modern browsers (Chrome 86+, Firefox 116+, Safari 13.1+)
await navigator.clipboard.write([
  new ClipboardItem({ 'image/png': blob })
]);

// Fallback for older browsers: download as file
// Creates <a> with data URL and triggers download
```

### TopBar.jsx
`CopyButton` component with state machine:

```javascript
const [state, setState] = useState('idle');

const handleClick = async () => {
  setState('copying');
  try {
    await onCopy();
    setState('copied');
    setTimeout(() => setState('idle'), 1500);
  } catch (err) {
    setState('idle'); // reset on error
  }
};
```

Button rendering switches icons and colors based on state.

### PlotsApp.jsx
Wires up the handler:

```javascript
const plotPanelRef = useRef(null);

const handleCopy = useCallback(async () => {
  await copyPlotToClipboard({
    containerEl: plotPanelRef.current,
    rid: extractRid(activePrefix),
    dims,
    channelDescriptors,
  });
}, [activePrefix, dims, channelDescriptors]);

// Only show button when plot data exists
<TopBar onCopy={active ? handleCopy : undefined} />
```

## Testing the Feature

### When the button appears:
- ✅ User has loaded a 1D, 2D, or 0D scan
- ✅ `active` data is present in `PlotsApp`
- ✅ Plot container ref is available

### When the button is clicked:
1. UI transitions to "copying" state
2. Plot DOM is captured and rendered to canvas
3. Footer with RID and timestamp is added
4. PNG blob is generated at current theme colors
5. Clipboard API writes the image (or downloads as fallback)
6. UI shows green checkmark for 1.5s
7. Back to idle state

### Error handling:
- If SVG/canvas query fails: error logged, button reverts to idle, user sees nothing
- If clipboard write fails: falls back to file download
- Graceful degradation in older browsers

## Browser Support

| Feature | Chrome | Firefox | Safari | Fallback |
|---------|--------|---------|--------|----------|
| Clipboard API | 86+ | 116+ | 13.1+ | File download |
| SVG to Image | ✅ | ✅ | ✅ | N/A |
| Canvas | ✅ | ✅ | ✅ | N/A |

## Files Changed

1. **frontend/src/plots/copyPlot.js** (new)
   - 216 lines
   - Exports `copyPlotToClipboard()`

2. **frontend/src/plots/TopBar.jsx** (modified)
   - Added `CopyButton` component (49 lines)
   - Updated imports for `useState`
   - Updated PropTypes

3. **frontend/src/plots/PlotsApp.jsx** (modified)
   - Added `useRef` import
   - Added `copyPlotToClipboard` import
   - Added `plotPanelRef` ref on plot container
   - Added `handleCopy` callback
   - Wired `onCopy` to `TopBar`
