import React from "react";
import wrapFederationModule from "./moduleFederationWrapper";

const Shell = wrapFederationModule(React.lazy(() => import("shell/Shell")));

function App() {
  return <Shell />;
}

export default App;
