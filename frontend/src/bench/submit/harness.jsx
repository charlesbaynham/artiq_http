// TEMPORARY standalone harness for driving the submit pane against the mock
// backend while the bench shell is built in parallel. Deleted before handoff.
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { get_explist } from "../../api/client";
import { SessionProvider } from "../state/SessionContext";
import "../bench.css";
import SubmitPane from "./SubmitPane";

function Harness() {
  const [explist, setExplist] = useState(null);
  useEffect(() => {
    get_explist().then(setExplist);
  }, []);
  return (
    <div className="bench" style={{ width: 640, height: 700, display: "flex" }}>
      <SessionProvider>
        <SubmitPane
          explist={explist}
          onSubmitted={(rid) => {
            window.__lastRid = rid;
          }}
        />
      </SessionProvider>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<Harness />);
