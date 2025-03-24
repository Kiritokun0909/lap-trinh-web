import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useDarkMode } from '../../context/DarkModeContext';

import './DarkModeButton.css';

export default function DarkModeButton() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      className={
        darkMode ? 'dark-mode btn-dark-mode-toggle' : 'btn-dark-mode-toggle'
      }
    >
      <button onClick={toggleDarkMode}>
        <div className='dark-mode-icon'>
          {darkMode ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
        </div>
      </button>
    </div>
  );
}
