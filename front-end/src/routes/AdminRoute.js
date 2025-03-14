import { Route, Routes } from "react-router-dom";
import ManageMangaPage from "../pages/admin/ManageMangasPage";
import GenrePage from "../pages/admin/ManageGenre/GenrePage";
import AdminLayout from "../layouts/AdminLayout.jsx";

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
