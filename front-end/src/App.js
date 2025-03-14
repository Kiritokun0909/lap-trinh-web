import React from "react";
import { Route, Routes } from "react-router-dom";

import "./styles/App.css";
import SiteRoute from "./routes/SiteRoute";
import AccountRoute from "./routes/AccountRoute";
import AdminRoute from "./routes/AdminRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import HandleCode from "./utils/HandleCode";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* public routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<SiteRoute />} />
        </Route>

        {/* account routes */}
        <Route
          element={<ProtectedRoute allowedRoles={[HandleCode.ROLE_USER]} />}
        >
          <Route path="/account/*" element={<AccountRoute />} />
        </Route>

        {/* admin routes */}
        <Route
          element={<ProtectedRoute allowedRoles={[HandleCode.ROLE_ADMIN]} />}
        >
          <Route path="/admin/*" element={<AdminRoute />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
