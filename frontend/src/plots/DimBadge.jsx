import React from "react";
import PropTypes from "prop-types";

// Tiny pictogram representing scan dimensionality (1D line, 2D grid, 0D dot).
function DimBadge({ dims, size = 14, accent = false }) {
  const c = accent ? "var(--p-accent)" : "var(--p-ink70)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      style={{ flex: "0 0 auto" }}
      aria-label={`${dims} scan`}
    >
      {dims === "1D" && (
        <polyline
          points="1,11 4,7 7,9 10,4 13,6"
          fill="none"
          stroke={c}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {dims === "2D" && (
        <g>
          <rect
            x="2"
            y="2"
            width="10"
            height="10"
            fill="none"
            stroke={c}
            strokeWidth="1.2"
          />
          {[2, 4, 6, 8, 10].map((i) => (
            <line
              key={i}
              x1={i}
              y1="2"
              x2={i}
              y2="12"
              stroke={c}
              strokeWidth="0.6"
              opacity="0.5"
            />
          ))}
        </g>
      )}
      {dims === "0D" && <circle cx="7" cy="7" r="2.6" fill={c} />}
    </svg>
  );
}

DimBadge.propTypes = {
  dims: PropTypes.oneOf(["0D", "1D", "2D"]),
  size: PropTypes.number,
  accent: PropTypes.bool,
};

export default DimBadge;
