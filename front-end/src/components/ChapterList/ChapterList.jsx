import { FaList } from 'react-icons/fa';

import '../MangaDescription/MangaDescription.css';
import './ChapterList.css';
import { formatDate } from '../../utils/utils';

export const ChapterList = ({ chapters }) => {
  return (
    <>
      <div className='manga-description chapter-title'>
        <h3>
          <div className='info-icon-h3'>
            <FaList />
          </div>
          <span>Danh sách chương</span>
        </h3>
      </div>
      <div className='chapter-list'>
        {chapters &&
          chapters.map((chapter) => (
            <div key={chapter.chapterId} className='chapter-item'>
              <div className='chapter-number'>
                <span>Chap {chapter.chapterNumber}</span>
              </div>
              <div className='chapter-time'>
                <span>{chapter.updateAt}</span>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
