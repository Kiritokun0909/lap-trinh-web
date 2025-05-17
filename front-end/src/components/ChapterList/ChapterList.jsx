import { FaList } from 'react-icons/fa';

import '../MangaDescription/MangaDescription.css';
import './ChapterList.css';
import { Link } from 'react-router-dom';
import { formatFullDate } from '../../utils/utils';

export default function ChapterList({ chapters, isAdmin = false }) {
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
      <div className='list-chapter'>
        {chapters &&
          chapters.map((chapter) => (
            <div key={chapter.chapterId} className='chapter-row'>
              <div className='chapter-name'>
                <Link
                  to={
                    isAdmin
                      ? `/admin/chapter/${chapter.chapterId}`
                      : `/chapter/${chapter.chapterId}`
                  }
                >
                  Chapter {chapter.chapterNumber}
                </Link>
              </div>
              <div className='chapter-name'>
                <i>{formatFullDate(chapter.updateAt)}</i>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
