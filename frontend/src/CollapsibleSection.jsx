import React, { useState, useEffect } from "react";
import Collapse from "react-bootstrap/Collapse";
import { ChevronRight } from "react-bootstrap-icons";

const SECTION_EYEBROWS = {
  Running: "Live queue",
  Datasets: "Storage",
  Plots: "Live data",
  "Schedule new": "Browse",
  "Configure Submission": "Submit",
};

function CollapsibleSection({
  title,
  children,
  defaultExpanded = true,
  className = "",
  eyebrow,
}) {
  const [open, setOpen] = useState(defaultExpanded);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isOpen = isMobile ? true : open;
  const showToggle = !isMobile;
  const eyebrowText = eyebrow || SECTION_EYEBROWS[title] || "Section";

  return (
    <div className={`collapsible-section ${className}`}>
      <div
        className={`section-header ${showToggle ? "is-clickable" : ""}`}
        onClick={showToggle ? () => setOpen(!open) : undefined}
      >
        {showToggle && (
          <span
            className={`section-toggle ${open ? "is-open" : ""}`}
            aria-hidden="true"
          >
            <ChevronRight size={14} />
          </span>
        )}
        <div className="section-header__text">
          <span className="section-header__eyebrow">{eyebrowText}</span>
          <h2>{title}</h2>
        </div>
      </div>
      <Collapse in={isOpen}>
        <div>{children}</div>
      </Collapse>
    </div>
  );
}

export default CollapsibleSection;
