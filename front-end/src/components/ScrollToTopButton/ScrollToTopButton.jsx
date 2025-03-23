import { useState } from 'react';
import { FaArrowUp } from 'react-icons/fa6';

import './ScrollToTopButton.css';

export default function ScrollToTop() {
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
        <div className='btn-scroll-top'>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <FaArrowUp />
          </button>
        </div>
      )}
    </>
  );
}
