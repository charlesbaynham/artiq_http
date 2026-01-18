import React, { useState, useEffect } from "react";
import Collapse from "react-bootstrap/Collapse";

function CollapsibleSection({
  title,
  children,
  defaultExpanded = true,
  className = "",
}) {
  const [open, setOpen] = useState(defaultExpanded);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // On mobile, always show content (ignore collapse state)
  const isOpen = isMobile ? true : open;
  const showToggle = !isMobile;

  return (
    <div className={`collapsible-section ${className}`}>
      <div
        className={`d-flex align-items-center py-2 mb-2 border-bottom section-header ${
          showToggle ? "" : "pe-none"
        }`}
        onClick={showToggle ? () => setOpen(!open) : undefined}
        style={{
          cursor: showToggle ? "pointer" : "default",
          userSelect: "none",
        }}
      >
        {showToggle && (
          <span
            className="me-2 section-toggle"
            style={{
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
              display: "inline-block",
              fontSize: "0.8em",
            }}
          >
            ▶
          </span>
        )}
        <h2 className="m-0 h4" style={{ flexGrow: 1 }}>
          {title}
        </h2>
      </div>
      <Collapse in={isOpen}>
        <div>{children}</div>
      </Collapse>
    </div>
  );
}

export default CollapsibleSection;
