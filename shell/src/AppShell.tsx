import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";

import React from "react";
import wrapFederationModule from "./moduleFederationWrapper";

const RemoteService = wrapFederationModule(
  React.lazy(() => import("remote/RemoteService"))
);

const AppShell = () => (
  <BrowserRouter>
    <nav>
      <ul>
        <li>
          <Link to="/remote">Remote</Link>
        </li>
      </ul>
    </nav>

    <main>
      <React.Suspense fallback={"Loading"}>
        <Routes>
          <Route path="remote/*" element={<RemoteService />} />
          <Route path="*" element={<Navigate to="/remote" replace />} />
        </Routes>
      </React.Suspense>
    </main>
  </BrowserRouter>
);

export default AppShell;
