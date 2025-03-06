import { Outlet } from "react-router-dom";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import "../styles/App.css";

export default function SiteLayout() {
  return (
    <>
      <Header />
      <div className="column-item">
        <div className="column-item__sidebar-one sidebar"></div>
        <div className="column-item__main-column main-container">
          <Outlet />
        </div>
        <div className="column-item__sidebar-two sidebar"></div>
      </div>
      <Footer />
    </>
  );
}
