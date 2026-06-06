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

// Per-image child that owns the SSE hook so hook count is unconditional.
function ImageStream({ name, selected, thumbPixels }) {
  const { data } = useSSEDataset(name, { enabled: selected });
  const livePixels = data?.[name]?.[1] ?? null;
  const pixels = selected ? livePixels : thumbPixels;

  if (!selected) return null;

  return (
    <div
      style={{
        flexShrink: 0,
        width: 280,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <span
        className="p-mono"
        style={{
          fontSize: 11,
          color: "var(--p-ink70)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={name}
      >
        {name}
      </span>
      <div
        className="p-panel"
        style={{ width: 280, height: 280, padding: 0, overflow: "hidden" }}
      >
        <PlotImage name={name} pixels={pixels} />
      </div>
    </div>
  );
}

function ImageSection() {
  const [imageNames, setImageNames] = useState([]);
  const [selected, setSelected] = useState(loadSelected);
  const [thumbData, setThumbData] = useState({});
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

  // Initial fetch and 60 s polling for all image thumbnails.
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

  if (!imageNames.length) return null;

  return (
    <div
      className="p-panel"
      style={{
        flexShrink: 0,
        padding: "8px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        borderTop: "1px solid var(--p-border)",
      }}
    >
      {/* Selector row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="p-lbl" style={{ flexShrink: 0 }}>
          images
        </span>
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            alignItems: "flex-end",
          }}
        >
          {imageNames.map((name) => {
            const isSelected = selected.has(name);
            return (
              <button
                key={name}
                className="p-btn ghost"
                onClick={() => toggleSelected(name)}
                title={isSelected ? `Deselect ${name}` : `Select ${name}`}
                style={{
                  padding: 4,
                  border: `1px solid ${
                    isSelected ? "var(--p-accent)" : "var(--p-border)"
                  }`,
                  borderRadius: "var(--p-radius)",
                  background: isSelected
                    ? "rgba(240,138,77,0.08)"
                    : "transparent",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <PlotImage
                  name={name}
                  pixels={thumbData[name] ?? null}
                  compact
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Live image strip for selected images */}
      {anySelected && (
        <div
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {imageNames.map((name) => (
            <ImageStream
              key={name}
              name={name}
              selected={selected.has(name)}
              thumbPixels={thumbData[name] ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageSection;
