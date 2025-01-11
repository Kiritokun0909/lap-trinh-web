import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/site/HomePage";
import SiteLayout from "../layout/SiteLayout";

export default function SiteRoute() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
       
      </Route>
    </Routes>
  );
}