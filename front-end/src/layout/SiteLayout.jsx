import { Outlet } from "react-router-dom";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import "../styles/App.css";

export default function SiteLayout() {
  return (
    <>
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
