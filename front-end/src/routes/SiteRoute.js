import { Route, Routes } from "react-router-dom";

import SiteLayout from "../layout/SiteLayout";
import HomePage from "../pages/site/HomePage";
import NotFoundPage from "../pages/site/NotFoundPage";

export default function SiteRoute() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}