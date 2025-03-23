import { Outlet } from 'react-router-dom';

import Header from '../components/site/Header/Header';
import Footer from '../components/site/Footer/Footer';
import { useDarkMode } from '../context/DarkModeContext';

import '../styles/App.css';
import ScrollToTop from '../components/ScrollToTopButton/ScrollToTopButton';

export default function SiteLayout() {
  const { darkMode } = useDarkMode();

  return (
    <>
      <Header />
      <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
        <div className='sidebar sidebar__container'></div>
        <div className='main__container main-content'>
          <Outlet />
        </div>
        <div className='sidebar sidebar__container'></div>
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
}
