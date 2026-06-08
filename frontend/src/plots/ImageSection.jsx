import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { get_dataset_names, get_dataset_values } from "../api/client";
import { useSSEDataset } from "../hooks/useSSEDataset";
import PlotImage from "./PlotImage";

const DISCOVER_MS = 5000;
const THUMB_POLL_MS = 60000;

const LS_KEY = "artiq_http.selected_images";

function loadSelected() {
  try {
    return new Set(JSON.parse(localStorage.getItem(LS_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveSelected(set) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

// Aspect ratio (width/height) of a 2D pixel array, or null if not yet known.
// Matches PlotImage's ARTIQ col-major convention: first axis is x (width),
// second axis is y (height).
function pixelAspect(pixels) {
  if (!pixels || !pixels.length || !pixels[0]?.length) return null;
  return pixels.length / pixels[0].length;
}

// A live image tile in the responsive grid. Owns its own SSE subscription so
// the hook count stays unconditional regardless of selection state. When this
// image is the expanded one it also renders the lightbox, reusing its own live
// pixels rather than opening a second SSE connection (browsers cap concurrent
// connections per host, so a separate stream can stall).
function ImageTile({
  name,
  selected,
  thumbPixels,
  expanded,
  onExpand,
  onClose,
}) {
  const { data } = useSSEDataset(name, { enabled: selected });
  const livePixels = data?.[name]?.[1] ?? null;
  const pixels = livePixels ?? thumbPixels;

  if (!selected) return null;

  const aspect = pixelAspect(pixels) ?? 1;

  return (
    <div className="p-img-cell">
      <div className="p-img-cell__head">
        <span className="p-img-cell__name p-mono" title={name}>
          {name}
        </span>
      </div>
      <button
        type="button"
        className="p-img-cell__frame"
        style={{ aspectRatio: String(aspect) }}
        onClick={() => onExpand(name)}
        title={`Expand ${name}`}
        aria-label={`Expand ${name}`}
      >
        <PlotImage name={name} pixels={pixels} />
      </button>
      {expanded && (
        <ImageLightbox name={name} pixels={pixels} onClose={onClose} />
      )}
    </div>
  );
}

// Fullscreen overlay showing one image large. Presentational: the pixels are
// passed in from the owning tile so no extra SSE connection is needed.
function ImageLightbox({ name, pixels, onClose }) {
  const aspect = pixelAspect(pixels) ?? 1;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="p-img-lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} image`}
    >
      <div className="p-img-lightbox__bar" onClick={(e) => e.stopPropagation()}>
        <span className="p-img-lightbox__name p-mono" title={name}>
          {name}
        </span>
        <button
          type="button"
          className="p-btn ghost icon"
          onClick={onClose}
          aria-label="Close"
          title="Close"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="p-img-lightbox__body">
        <div
          className="p-img-lightbox__frame"
          style={{ aspectRatio: String(aspect) }}
          onClick={(e) => e.stopPropagation()}
        >
          <PlotImage name={name} pixels={pixels} />
        </div>
      </div>
    </div>
  );
}

function ImageSection() {
  const [imageNames, setImageNames] = useState([]);
  const [selected, setSelected] = useState(loadSelected);
  const [thumbData, setThumbData] = useState({});
  const [expanded, setExpanded] = useState(null);
  const thumbTimerRef = useRef(null);

  const discoverImages = useCallback(async () => {
    try {
      const { names = [] } = await get_dataset_names();
      const imgs = names.filter(
        (n) => /image/i.test(n) && !n.startsWith("ndscan."),
      );
      setImageNames((prev) =>
        JSON.stringify(prev) === JSON.stringify(imgs) ? prev : imgs,
      );
    } catch {
      /* silently ignore */
    }
  }, []);

  useEffect(() => {
    discoverImages();
    const id = setInterval(discoverImages, DISCOVER_MS);
    return () => clearInterval(id);
  }, [discoverImages]);

  const fetchThumbs = useCallback(async (names) => {
    if (!names.length) return;
    try {
      const values = await get_dataset_values(names.join(","));
      setThumbData((prev) => {
        const next = { ...prev };
        for (const n of names) {
          if (values[n]) next[n] = values[n][1];
        }
        return next;
      });
    } catch {
      /* silently ignore */
    }
  }, []);

  // Initial fetch and periodic polling for all image thumbnails.
  useEffect(() => {
    if (!imageNames.length) return;
    fetchThumbs(imageNames);
    thumbTimerRef.current = setInterval(
      () => fetchThumbs(imageNames),
      THUMB_POLL_MS,
    );
    return () => clearInterval(thumbTimerRef.current);
  }, [imageNames, fetchThumbs]);

  const toggleSelected = useCallback((name) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      saveSelected(next);
      return next;
    });
  }, []);

  const anySelected = useMemo(
    () => imageNames.some((n) => selected.has(n)),
    [imageNames, selected],
  );

  // Close the lightbox if its image disappears from the store.
  useEffect(() => {
    if (expanded && !imageNames.includes(expanded)) setExpanded(null);
  }, [expanded, imageNames]);

  if (!imageNames.length) return null;

  return (
    <div className="p-panel p-img-section">
      <div className="p-img-section__head">
        <span className="p-lbl">images</span>
        <span className="p-img-section__hint p-dim">
          {anySelected ? "tap an image to expand" : "select images to view"}
        </span>
      </div>

      {/* Selector — wrapping chips, one per discovered image. */}
      <div className="p-img-selector">
        {imageNames.map((name) => {
          const isSelected = selected.has(name);
          return (
            <button
              key={name}
              type="button"
              className={`p-img-chip ${isSelected ? "is-selected" : ""}`}
              onClick={() => toggleSelected(name)}
              aria-pressed={isSelected}
              title={isSelected ? `Hide ${name}` : `Show ${name}`}
            >
              <span className="p-img-chip__thumb">
                <PlotImage name={name} pixels={thumbData[name] ?? null} />
              </span>
              <span className="p-img-chip__name">{name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected images — responsive grid that fills the available width. */}
      {anySelected && (
        <div className="p-img-grid">
          {imageNames.map((name) => (
            <ImageTile
              key={name}
              name={name}
              selected={selected.has(name)}
              thumbPixels={thumbData[name] ?? null}
              expanded={expanded === name}
              onExpand={setExpanded}
              onClose={() => setExpanded(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageSection;
