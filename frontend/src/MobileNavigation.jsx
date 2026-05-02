import React from "react";
import {
  PlayFill,
  Database,
  GraphUp,
  ListUl,
  Sliders,
  JournalText,
} from "react-bootstrap-icons";

/**
 * Mobile bottom navigation bar.
 * BEM classes: mobile-nav, mobile-nav__item (is-active),
 * mobile-nav__indicator, mobile-nav__icon, mobile-nav__label.
 */
function MobileNavigation({ currentPage, onPageChange }) {
  const navItems = [
    { id: "running", label: "Running", Icon: PlayFill },
    { id: "datasets", label: "Datasets", Icon: Database },
    { id: "plots", label: "Plots", Icon: GraphUp },
    { id: "schedule", label: "Schedule", Icon: ListUl },
    { id: "configure", label: "Configure", Icon: Sliders },
    { id: "logs", label: "Logs", Icon: JournalText },
  ];

  return (
    <nav className="mobile-nav" aria-label="Primary">
      {navItems.map(({ id, label, Icon }) => {
        const active = currentPage === id;
        return (
          <button
            key={id}
            type="button"
            className={`mobile-nav__item ${active ? "is-active" : ""}`}
            onClick={() => onPageChange(id)}
            aria-label={label}
            aria-current={active ? "page" : undefined}
          >
            <span className="mobile-nav__indicator" aria-hidden="true" />
            <span className="mobile-nav__icon" aria-hidden="true">
              <Icon size={20} />
            </span>
            <span className="mobile-nav__label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default MobileNavigation;
