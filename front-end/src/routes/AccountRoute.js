import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/site/HomePage.tsx";
import SiteLayout from "../layout/SiteLayout";
import NotFoundPage from "../pages/site/NotFoundPage";

export default function AccountRoute() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
