import React from "react";
import { Route, Routes } from "react-router-dom";

import "./styles/App.css";
import SiteRoute from "./routes/SiteRoute";
import AccountRoute from "./routes/AccountRoute";
import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* public routes */}
        <Route path="/*" element={<SiteRoute />} />

        {/* account routes */}
        {/* <Route
            element={<ProtectedRoute allowedRoles={[HandleCode.ROLE_USER]} />}
          >
            <Route path="/account/*" element={<AccountRoute />} />
          </Route> */}
        <Route path="/account/*" element={<AccountRoute />} />

        {/* admin routes */}
        {/* <Route
            element={<ProtectedRoute allowedRoles={[HandleCode.ROLE_ADMIN]} />}
          >
            <Route path="/admin/*" element={<AdminRoute />} />
            </Route> */}
        <Route path="/admin/*" element={<AdminRoute />} />
      </Routes>
    </div>
  );
}

export default App;
