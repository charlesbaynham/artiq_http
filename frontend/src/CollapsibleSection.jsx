import React, { useState } from "react";
import Collapse from "react-bootstrap/Collapse";

function CollapsibleSection({
  title,
  children,
  defaultExpanded = true,
  className = "",
}) {
  const [open, setOpen] = useState(defaultExpanded);

  return (
    <div className={`collapsible-section ${className}`}>
      <div
        className="d-flex align-items-center py-2 mb-2 border-bottom"
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        <span
          className="me-2"
          style={{
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            display: "inline-block",
            fontSize: "0.8em",
          }}
        >
          ▶
        </span>
        <h2 className="m-0 h4" style={{ flexGrow: 1 }}>
          {title}
        </h2>
      </div>
      <Collapse in={open}>
        <div>{children}</div>
      </Collapse>
    </div>
  );
}

export default CollapsibleSection;
