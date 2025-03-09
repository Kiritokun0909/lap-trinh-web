import { Route, Routes } from "react-router-dom";
import ManageMangaPage from "../pages/admin/ManageMangasPage.tsx";
import GenrePage from "../pages/admin/ManageGenre/GenrePage.tsx";
import AdminLayout from "../layout/AdminLayout.jsx";

export default function AdminRoute() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<ManageMangaPage />} />
        <Route path="/manage-genres" element={<GenrePage />} />
        <Route path="/manage-authors" element={<ManageMangaPage />} />
        <Route path="/manage-mangas" element={<ManageMangaPage />} />
        <Route path="/manage-customer" element={<ManageMangaPage />} />
        <Route path="/statistic" element={<ManageMangaPage />} />
      </Route>
    </Routes>
  );
}
