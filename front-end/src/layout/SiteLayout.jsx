import { Outlet } from "react-router-dom";
import Header from "../components/site/Header";
import Footer from "../components/site/Footer";
import { FaArrowUp } from "react-icons/fa6";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { useState } from "react";
import { useDarkMode } from "../context/DarkModeContext.tsx";
import "../styles/App.css";

function ScrollToTop() {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  window.onscroll = () => {
    if (window.scrollY > 100) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };

  return (
    <>
      {showScrollToTop && (
        <div className="up-button">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <FaArrowUp />
          </button>
        </div>
      )}
    </>
  );
}

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button onClick={toggleDarkMode} className="dark-mode-toggle">
      {darkMode ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
    </button>
  );
};

export default function SiteLayout() {
  const { darkMode } = useDarkMode();

  return (
    <>
      <Header />
      <div className={`column-item ${darkMode ? "dark-mode" : ""}`}>
        <div className="column-item__sidebar-one sidebar"></div>
        <div className="column-item__main-column main-container">
          <div className="function-bar">
            <DarkModeToggle />
          </div>
          <Outlet />
          <ScrollToTop />
        </div>
        <div className="column-item__sidebar-two sidebar"></div>
      </div>
      <Footer />
    </>
  );
}
