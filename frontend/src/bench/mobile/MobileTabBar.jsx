/**
 * Mobile bottom tab bar (IMPL-SPEC §2b-1).
 *
 * Four equal items routed with real `react-router-dom` links (not internal
 * screen state) so Plots/Data/Logs leave `MobileApp` for the shared bench
 * chrome routes, per IMPL-SPEC §10: Home→`/`, Plots→`/plots`,
 * Data→`/datasets`, Logs→`/logs`. `NavLink` derives the active item from the
 * current location, so no extra wiring is needed here.
 */

import React from "react";
import { NavLink } from "react-router-dom";

import { IconPlay, IconChart, IconData, IconLogs } from "../ui/icons";

const TABS = [
  { to: "/", label: "Home", Icon: IconPlay, end: true },
  { to: "/plots", label: "Plots", Icon: IconChart },
  { to: "/datasets", label: "Data", Icon: IconData },
  { to: "/logs", label: "Logs", Icon: IconLogs },
];

function MobileTabBar() {
  return (
    <nav className="bm-tabbar" aria-label="Primary">
      {TABS.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `bm-tabbar__item${isActive ? " is-active" : ""}`
          }
        >
          <Icon size={20} />
          <span className="bm-tabbar__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default MobileTabBar;
