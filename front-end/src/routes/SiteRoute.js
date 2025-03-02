import { Route, Routes } from "react-router-dom";

import SiteLayout from "../layout/SiteLayout";
import HomePage from "../pages/site/HomePage.tsx";
import NotFoundPage from "../pages/site/NotFoundPage";
import PrivacyPage from "../pages/site/PrivacyPage";
import AboutPage from "../pages/site/AboutPage";

export default function SiteRoute() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
