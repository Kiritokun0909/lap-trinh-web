import { useState } from 'react';
import { FaPen } from 'react-icons/fa';

import './MangaDescription.css';

const MAX_DESCRIPTION_LENGTH = 100;
export default function MangaDescription({ manga }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className='manga-description'>
      <h3>
        <div className='info-icon-h3'>
          <FaPen />
        </div>
        <span>Nội dung</span>
      </h3>
      <div>
        {!manga?.description ? (
          'Đang cập nhật'
        ) : (
          <span>
            {isExpanded
              ? manga.description
              : `${manga.description.slice(0, MAX_DESCRIPTION_LENGTH)}...`}
            {manga.description.length > MAX_DESCRIPTION_LENGTH && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className='expanded-button'
              >
                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
              </button>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
