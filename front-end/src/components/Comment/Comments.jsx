import { FaComment } from 'react-icons/fa';

import '../MangaDescription/MangaDescription.css';
import '../ChapterList/ChapterList.css';

export default function Comments() {
  return (
    <>
      <div className='manga-description chapter-title'>
        <h3>
          <div className='info-icon-h3'>
            <FaComment />
          </div>
          <span>Bình luận</span>
        </h3>
      </div>
    </>
  );
}
