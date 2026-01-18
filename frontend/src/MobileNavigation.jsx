import React from "react";

/**
 * Mobile navigation bar component
 * Displays at bottom of screen on mobile devices (<768px)
 * Hidden on desktop
 */
function MobileNavigation({ currentPage, onPageChange }) {
  const navItems = [
    {
      id: "running",
      label: "Running",
      icon: "▶️", // Play/running icon
    },
    {
      id: "datasets",
      label: "Datasets",
      icon: "📊", // Data/chart icon
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: "📋", // List/schedule icon
    },
    {
      id: "configure",
      label: "Configure",
      icon: "⚙️", // Settings/configure icon
    },
  ];

  return (
    <nav className="mobile-nav">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`mobile-nav-item ${
            currentPage === item.id ? "active" : ""
          }`}
          onClick={() => onPageChange(item.id)}
          aria-label={item.label}
          aria-current={currentPage === item.id ? "page" : undefined}
        >
          <span className="mobile-nav-icon">{item.icon}</span>
          <span className="mobile-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default MobileNavigation;
